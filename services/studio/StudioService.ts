import { onBoardingRequiredSteps } from "@/lib/constants/studio-details";
import handleError from "@/lib/handlers/error";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/lib/http-errors";
import { findAreaByDistrictValue } from "@/lib/utils/areas-districts-converter";
import { convertTimeToString } from "@/lib/utils/date-time/format-time-utils";
import { DateSpecificHourSchemaFormData } from "@/lib/validations/zod-schema/studio/studio-manage-schema";
import {
  BasicInfoFormData,
  BusinessHoursAndPriceFormData,
  DoorPasswordFormData,
  EquipmentFormData,
  OnboardingTermsFormData,
  PayoutFormData,
  SocialFormData,
  StudioNameFormData,
} from "@/lib/validations/zod-schema/studio/studio-step-schema";
import { knex } from "@/services/knex";
import { Knex } from "knex";
import { StudioStatus } from "../model";
import { validateStudioService } from "./ValidateStudio";
import { paginationService } from "../PaginationService";

export class StudioService {
  constructor(private knex: Knex) {}

  async getStudioIdBySlug(slug: string) {
    const studio_id = (await this.knex.select("id").from("studio").where({ slug }))[0]?.id;

    if (!studio_id) {
      return {
        success: false,
        error: { message: "場地不存在" },
        errorStatus: 404,
      };
    }

    return {
      success: true,
      data: studio_id,
    };
  }

  async getAllStudiosName() {
    const studios = await this.knex.select("name", "slug").from("studio").orderBy("name");

    return {
      success: true,
      data: studios,
    };
  }

  /* ---------------------------------- Get Studio Basic Information ---------------------------------- */
  /**
   * Get either one studio by slug or
   * Get all studio by studio status
   * @returns name, slug, logo, cover_photo, district, address, min_price, number_of_review, number-of_completed_booking, rating
   */
  async getStudioBasicInfo({ slug, status, page = 1, limit = 5 }: { slug?: string; status?: StudioStatus; page: number; limit: number }) {
    try {
      if (slug) {
        // Validate if the studio exists by slug
        const validationResponse = await validateStudioService.validateIsStudioExistBySlug(slug);

        if (!validationResponse.success) {
          return validationResponse;
        }
      }

      const mainQuery = this.knex
        .select(
          "studio.name",
          "studio.slug",
          "studio.cover_photo",
          "studio.logo",
          "studio.district",
          "studio.address",
          this.knex.raw(`CAST(AVG(review.rating) AS DECIMAL) AS rating`),
          this.knex.raw(
            `CAST(COUNT(DISTINCT CASE WHEN booking.status = 'confirmed' AND booking.date::DATE + booking.end_time::INTERVAL < NOW() THEN booking.id END) AS INTEGER) AS number_of_completed_booking`
          ),
          this.knex.raw(`CAST(COUNT(DISTINCT review.id) AS INTEGER) AS number_of_review`),
          this.knex.raw(`CAST(MIN(studio_price.price) AS INTEGER) AS min_price`)
        )
        .leftJoin("booking", "studio.id", "booking.studio_id")
        .leftJoin("review", "booking.reference_no", "review.booking_reference_no")
        .leftJoin("studio_price", "studio.id", "studio_price.studio_id")
        .from("studio")
        .groupBy("studio.id")
        .orderBy("rating", "desc");

      let studios;

      if (status) {
        studios = await paginationService.paginateQuery(mainQuery.where("studio.status", status), page, limit);
      }

      if (slug) {
        studios = await mainQuery.where("studio.slug", slug);
      }

      return {
        success: true,
        data: studios,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ---------------------------------- Get Onboarding Step Status ---------------------------------- */
  async getOnboardingStepStatus(studioId: string) {
    try {
      const result = await this.knex.select("step", "is_complete").from("studio_onboarding_step").where({ studio_id: studioId });

      if (result.length === 0) {
        throw new NotFoundError("場地");
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ---------------------------------- Create new draft studio ---------------------------------- */

  async createNewDraftStudio(data: StudioNameFormData, userId: string) {
    const txn = await this.knex.transaction();
    try {
      const insertedData = await txn("studio")
        .insert({
          user_id: userId,
          name: data.name,
          status: "draft",
          is_approved: false,
        })
        .returning("id");

      const onboardingData = [...onBoardingRequiredSteps, "confirmation"].map((step) => ({
        studio_id: insertedData[0].id,
        step: step,
        is_complete: false,
      }));

      await txn("studio_onboarding_step").insert(onboardingData);
      await txn.commit();
      return {
        success: true,
        data: insertedData[0],
      };
    } catch (error) {
      await txn.rollback();
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ---------------------------------- Handle unique slug check ---------------------------------- */
  async checkIsSlugExist(slug: string) {
    try {
      const studio_id = (await this.knex.select("id").from("studio").where({ slug }))[0]?.id;

      return {
        success: true,
        data: studio_id,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ----------------------------------- Handle Basic Info ----------------------------------- */
  async saveBasicInfo(data: BasicInfoFormData, studioId: string, isOnboardingStep: boolean) {
    const txn = await this.knex.transaction();

    const area = findAreaByDistrictValue(data.district)?.value;

    try {
      //TODO - check if studio slug is unique

      await txn("studio")
        .where({ id: studioId })
        .update({ ...data, area: area });

      if (isOnboardingStep) {
        await txn("studio_onboarding_step").where({ studio_id: studioId, step: "basic-info" }).update({ is_complete: true });
      }

      // Commit the transaction
      await txn.commit();
      return { success: true };
    } catch (error) {
      console.dir(error);
      await txn.rollback(); // Rollback in case of an error
      return handleError(error, "server") as ActionResponse;
    }
    //check if data exist, if yes, delete -> insert new
    //check if type = onboarding -> set onboarding step === true
  }

  async getBasicInfoFormData(studioId: string) {
    try {
      const result = (await this.knex.select("logo", "cover_photo", "name", "slug", "district", "address", "description", "phone").from("studio").where({ id: studioId }))[0];
      // Ensure all fields are non-null by mapping through result
      const sanitizedResult = result && Object.fromEntries(Object.entries(result).map(([key, value]) => [key, value ?? ""]));
      return {
        success: true,
        data: sanitizedResult,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ----------------------------------- Handle Date Specific Hour ----------------------------------- */
  async saveDateSpecificHour(data: DateSpecificHourSchemaFormData, studioId: string) {
    const { date, timeslots } = data.dateSpecificHour;
    const txn = await this.knex.transaction();
    try {
      // Get all price types from DB and create a map
      // From [{id: 1, price_type: "non-peak"},{id: 2, price_type: "peak"}]  --> { "non-peak": 1, "peak":2 })
      const priceTypes = await this.knex.select("id", "price_type").from("studio_price").where({ studio_id: studioId });
      const priceTypeMap: Record<string, number> = Object.fromEntries(priceTypes.map(({ id, price_type }) => [price_type, id]));

      // Formate the timeslot to insert into database
      let formattedTimeslots;
      if (timeslots.length === 0) {
        formattedTimeslots = { studio_id: parseInt(studioId), date: date, is_closed: true };
      } else {
        formattedTimeslots = timeslots.map(({ from, to, priceType }) => ({
          studio_id: parseInt(studioId),
          date,
          is_closed: false,
          from: from,
          to: to,
          price_type_id: priceTypeMap[priceType],
        }));
      }

      // Check if the date exist in the database
      const isDateExist = await this.knex.select("id").from("studio_date_specific_hour").where({ date: date, studio_id: studioId });
      // If date exist in the database - remove all the rows and then insert new rows
      // If date doesn't exist in the database - create a new one
      if (isDateExist.length > 0) {
        await txn("studio_date_specific_hour").where({ date: date, studio_id: studioId }).del();
        await txn("studio_date_specific_hour").insert(formattedTimeslots);
      } else {
        await txn("studio_date_specific_hour").insert(formattedTimeslots);
      }

      // Commit the transaction
      await txn.commit();
      return { success: true };
    } catch (error) {
      console.dir(error);
      await txn.rollback(); // Rollback in case of an error
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getAllDateSpecificHourByStudioId(studioId: string) {
    try {
      const result = await this.knex
        .select("studio_date_specific_hour.date", "studio_date_specific_hour.is_closed", "studio_date_specific_hour.from", "studio_date_specific_hour.to", "studio_price.price_type")
        .from("studio_date_specific_hour")
        .where({ "studio_date_specific_hour.studio_id": studioId })
        .leftJoin("studio_price", "studio_date_specific_hour.price_type_id", "studio_price.id")
        .orderBy([
          { column: "studio_date_specific_hour.date", order: "asc" }, // Sort by date (earliest first)
          { column: "studio_date_specific_hour.from", order: "asc" }, // Then sort by open time
        ]);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async deleteDateSpecificHourByStudioId(date: string, studioId: string) {
    try {
      // Check if the date exist in database
      const isDateExist = await this.knex.select("id").from("studio_date_specific_hour").where({ date: date, studio_id: studioId });

      //if no return not found
      //if yes delete
      if (isDateExist.length > 0) {
        await this.knex("studio_date_specific_hour").where({ date: date, studio_id: studioId }).del();
      } else {
        throw new NotFoundError("時段");
      }

      return { success: true };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ----------------------------------- Handle Business Hours and Price ----------------------------------- */
  async saveBusinessHoursAndPrice(data: BusinessHoursAndPriceFormData, studioId: string, isOnboardingStep: boolean) {
    const { businessHours, peakHourPrice, nonPeakHourPrice } = data;

    const txn = await this.knex.transaction();

    try {
      /* ------------------------------ Check if price data exist  ------------------------------ */
      const isPriceDataExist = await this.knex("studio_price").where({ studio_id: studioId });

      let nonPeakHourPriceId;
      let peakHourPiceId;

      /* ------------------------------ Handle price update/create  ------------------------------ */
      if (isPriceDataExist.length == 0) {
        nonPeakHourPriceId = (await txn("studio_price").insert({ studio_id: studioId, price_type: "non-peak", price: nonPeakHourPrice }).returning("id"))[0].id;
        peakHourPiceId = (await txn("studio_price").insert({ studio_id: studioId, price_type: "peak", price: peakHourPrice }).returning("id"))[0].id;
      } else {
        nonPeakHourPriceId = (await txn("studio_price").where({ studio_id: studioId, price_type: "non-peak" }).update({ price: nonPeakHourPrice }).returning("id"))[0].id;
        peakHourPiceId = (await txn("studio_price").where({ studio_id: studioId, price_type: "peak" }).update({ price: peakHourPrice }).returning("id"))[0].id;
      }

      /* ------------------------------ Handle business hours update ------------------------------ */

      // Get all price types from DB and create a map
      // From [{id: 1, price_type: "non-peak"},{id: 2, price_type: "peak"}]  --> { "non-peak": 1, "peak":2 })
      const priceTypeMap = { "non-peak": nonPeakHourPriceId, peak: peakHourPiceId };

      if (!nonPeakHourPriceId || !peakHourPiceId) {
        throw new NotFoundError("價錢");
      }

      // Formate the data before insert into database
      let formattedData = [];

      for (const [day, businessHourDetail] of Object.entries(businessHours)) {
        const { timeslots } = businessHourDetail || {};

        if (!timeslots || timeslots.length === 0) {
          formattedData.push({
            studio_id: parseInt(studioId),
            day_of_week: day,
            is_closed: true,
          });
        } else {
          const openTimeslots = timeslots.map(({ from, to, priceType }) => ({
            studio_id: parseInt(studioId),
            day_of_week: day,
            is_closed: false,
            from: from,
            to: to,
            price_type_id: priceTypeMap[priceType],
          }));

          formattedData.push(...openTimeslots);
        }
      }

      // Check if the business hour data exist in the database
      const isBusinessHourDataExist = await this.knex.select("id").from("studio_business_hour").where({ studio_id: studioId });
      // If date exist in the database - remove all the rows and then insert new rows
      // If date doesn't exist in the database - create a new one
      if (isBusinessHourDataExist.length > 0) {
        await txn("studio_business_hour").where({ studio_id: studioId }).del();
        await txn("studio_business_hour").insert(formattedData);
      } else {
        await txn("studio_business_hour").insert(formattedData);
      }

      if (isOnboardingStep) {
        await txn("studio_onboarding_step").where({ studio_id: studioId, step: "business-hour-and-price" }).update({ is_complete: true });
      }

      // Commit the transaction
      await txn.commit();
      return { success: true };
    } catch (error) {
      console.dir(error);
      await txn.rollback(); // Rollback in case of an error
      return handleError(error, "server") as ActionResponse;
    }
    //check if data exist, if yes, delete -> insert new
    //check if type = onboarding -> set onboarding step === true
  }

  async getBusinessHoursByStudioId(studioId: string) {
    try {
      const result = await this.knex
        .select("studio_business_hour.day_of_week", "studio_business_hour.is_closed", "studio_business_hour.from", "studio_business_hour.to", "studio_price.price_type")
        .from("studio_business_hour")
        .where({ "studio_business_hour.studio_id": studioId })
        .leftJoin("studio_price", "studio_business_hour.price_type_id", "studio_price.id")
        .orderBy([{ column: "studio_business_hour.from", order: "asc" }]);

      if (result.length == 0 || !result) {
        throw new NotFoundError("營業時間");
      }

      const businessHoursObject = result.reduce((acc, { day_of_week, is_closed, from, to, price_type }) => {
        if (!acc[day_of_week]) {
          acc[day_of_week] = {
            is_enabled: !is_closed, // Reverse is_closed to is_enabled
            timeslots: [],
          };
        }

        if (!is_closed) {
          acc[day_of_week].timeslots.push({ from: convertTimeToString(from), to: convertTimeToString(to) === "00:00" ? "24:00" : convertTimeToString(to), priceType: price_type });
        }

        return acc;
      }, {});

      return {
        success: true,
        data: businessHoursObject,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getPriceByStudioId(studioId: string) {
    try {
      const result = await this.knex.select("price_type", "price").from("studio_price").where({ studio_id: studioId });

      if (result.length == 0 || !result) {
        throw new NotFoundError("價錢");
      }

      const pricesObject = Object.fromEntries(result.map(({ price_type, price }) => [price_type, price]));

      return {
        success: true,
        data: pricesObject,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ----------------------------------- Handle Equipment ----------------------------------- */
  async saveEquipment(data: EquipmentFormData, studioId: string, isOnboardingStep: boolean) {
    const txn = await this.knex.transaction();
    try {
      // Return the equipment list in id
      const newEquipmentIdList = await Promise.all(
        data.equipment.map(async (item) => {
          const result = await this.knex.select("id").from("equipment").where("equipment", item).first();
          if (!result) {
            // Throw an error if the equipment is not found
            throw new NotFoundError(`設備`);
          }
          return result.id;
        })
      );

      const insertList = newEquipmentIdList.map((itemId) => ({ studio_id: studioId, equipment_id: itemId }));

      // Check if there is existing equipment list
      const existingEquipmentIdList = await this.knex.select("id").from("studio_equipment").where({ studio_id: studioId });

      // If doesn't exist, then directly insert
      if (existingEquipmentIdList.length == 0) {
        await txn("studio_equipment").insert(insertList);
      } else {
        await txn("studio_equipment").where({ studio_id: studioId }).del();
        await txn("studio_equipment").insert(insertList);
      }

      if (isOnboardingStep) {
        await txn("studio_onboarding_step").where({ studio_id: studioId, step: "equipment" }).update({ is_complete: true });
      }

      // Commit the transaction
      await txn.commit();
      return { success: true };
    } catch (error) {
      console.dir(error);
      await txn.rollback(); // Rollback in case of an error
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getEquipment(studioId: string) {
    try {
      const result = await this.knex.select("equipment.equipment").from("studio_equipment").leftJoin("equipment", "studio_equipment.equipment_id", "equipment.id").where({ studio_id: studioId });

      let equipmentArray = [];
      if (result.length > 0) {
        equipmentArray = result.map((item) => item.equipment);
      }

      return {
        success: true,
        data: equipmentArray,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
  /* ----------------------------------- Handle Gallery ----------------------------------- */
  async getGallery(studioId: string) {
    try {
      const result = await this.knex.select("photo").from("studio_photo").where({ studio_id: studioId });

      let galleryArray = [];
      if (result.length > 0) {
        galleryArray = result.map((item) => item.photo);
      }

      return {
        success: true,
        data: galleryArray,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async saveGallery(imageUrls: string[], studioId: string, isOnboardingStep: boolean) {
    const txn = await this.knex.transaction();
    try {
      if (imageUrls.length > 0) {
        const photos = imageUrls.map((image) => ({
          studio_id: studioId,
          photo: image,
        }));

        await txn("studio_photo").insert(photos);
      }

      if (isOnboardingStep) {
        await txn("studio_onboarding_step").where({ studio_id: studioId, step: "gallery" }).update({ is_complete: true });
      }

      // Commit the transaction
      await txn.commit();
      return { success: true };
    } catch (error) {
      console.dir(error);
      await txn.rollback(); // Rollback in case of an error
      return handleError(error, "server") as ActionResponse;
    }
  }

  async deleteGalleryImages(imageUrls: string[], studioId: string) {
    try {
      // Check if the date exist in database
      const isImageExist = await this.knex.select("photo").from("studio_photo").where("studio_id", studioId).whereIn("photo", imageUrls);

      //if no return not found
      //if yes delete
      if (isImageExist.length > 0) {
        await this.knex("studio_photo").where("studio_id", studioId).whereIn("photo", imageUrls).del();
      } else {
        throw new NotFoundError("圖片");
      }

      return { success: true };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ----------------------------------- Handle DoorPassword ----------------------------------- */
  async getDoorPassword(studioId: string) {
    try {
      const result = await this.knex.select("door_password").from("studio").where({ id: studioId });

      let door_password;

      if (result[0].door_password == null) {
        door_password = "";
      } else {
        door_password = result[0].door_password;
      }

      return {
        success: true,
        data: door_password,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async saveDoorPassword(data: DoorPasswordFormData, studioId: string, isOnboardingStep: boolean) {
    const txn = await this.knex.transaction();
    try {
      await txn("studio").where({ id: studioId }).update({ door_password: data.doorPassword });

      if (isOnboardingStep) {
        await txn("studio_onboarding_step").where({ studio_id: studioId, step: "door-password" }).update({ is_complete: true });
      }
      // Commit the transaction
      await txn.commit();
      return { success: true };
    } catch (error) {
      console.dir(error);
      await txn.rollback(); // Rollback in case of an error
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ----------------------------------- Handle Social Media ----------------------------------- */
  async getSocial(studioId: string) {
    try {
      const result = await this.knex.select("type", "contact").from("studio_social").where({ studio_id: studioId });

      let socialList;

      if (result.length === 0) {
        socialList = "";
      } else {
        socialList = result.reduce((acc, { type, contact }) => {
          const key = type;
          acc[key] = contact;
          return acc;
        }, {});
      }

      return {
        success: true,
        data: socialList,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async saveSocial(data: SocialFormData, studioId: string, isOnboardingStep: boolean) {
    const txn = await this.knex.transaction();
    try {
      // check if data exist
      const isDataExist = await this.knex("studio_social").where({ studio_id: studioId });

      if (isDataExist.length > 0) {
        await txn("studio_social").where({ studio_id: studioId }).del();
      }

      const transformedData = Object.entries(data.social)
        .filter(([_, value]) => value) // Skip if value is empty (null, undefined, or "")
        .map(([key, value]) => ({
          studio_id: studioId,
          type: key,
          contact: value,
        }));

      await txn("studio_social").insert(transformedData);

      if (isOnboardingStep) {
        await txn("studio_onboarding_step").where({ studio_id: studioId, step: "social" }).update({ is_complete: true });
      }
      // Commit the transaction
      await txn.commit();
      return { success: true };
    } catch (error) {
      console.dir(error);
      await txn.rollback(); // Rollback in case of an error
      return handleError(error, "server") as ActionResponse;
    }
  }
  /* ----------------------------------- Handle Payout Info ----------------------------------- */

  async getPayoutInfo(studioId: string) {
    try {
      const result = await this.knex.select("method", "account_name", "account_number").from("studio_payout_detail").where({ studio_id: studioId });

      return {
        success: true,
        data: result[0] === "null" ? "" : result[0],
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async savePayoutInfo(data: PayoutFormData, studioId: string, isOnboardingStep: boolean) {
    const txn = await this.knex.transaction();
    try {
      const isDataExist = await this.knex("studio_payout_detail").where({ studio_id: studioId });

      if (isDataExist.length > 0) {
        await txn("studio_payout_detail").update({ method: data.payoutMethod, account_name: data.payoutAccountName, account_number: data.payoutAccountNumber }).where({ studio_id: studioId });
      } else {
        await txn("studio_payout_detail").insert({ studio_id: studioId, method: data.payoutMethod, account_name: data.payoutAccountName, account_number: data.payoutAccountNumber });
      }

      if (isOnboardingStep) {
        await txn("studio_onboarding_step").where({ studio_id: studioId, step: "payout-info" }).update({ is_complete: true });
      }
      // Commit the transaction
      await txn.commit();
      return { success: true };
    } catch (error) {
      console.dir(error);
      await txn.rollback(); // Rollback in case of an error
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ----------------------------------- Submit Studio Onboarding Application ----------------------------------- */
  async completeStudioOnboardingApplication(data: OnboardingTermsFormData, studioId: string) {
    const txn = await this.knex.transaction();
    try {
      const hasSubmittedApplication = await this.knex.select("step").from("studio_onboarding_step").where({ studio_id: studioId, is_complete: true, step: "confirmation" });

      if (hasSubmittedApplication.length > 0) {
        throw new ForbiddenError("請勿重複送出申請。");
      }

      if (!data.onboardingTerms) {
        throw new ForbiddenError("請同意條款與細則。");
      }

      //check if all the step is completed, if yes, then change studio status to reviewing

      const completedOnboardingSteps = await this.knex.select("step").from("studio_onboarding_step").where({ studio_id: studioId, is_complete: true });

      const checkHasAllSteps = onBoardingRequiredSteps.every((step) => completedOnboardingSteps.some((obj) => obj.step === step));

      if (checkHasAllSteps) {
        await txn("studio_onboarding_step").insert({ studio_id: studioId, step: "confirmation", is_complete: true });
        await txn("studio").update({ status: "reviewing" }).where({ id: studioId });
      } else {
        throw new ForbiddenError("未完成所有步驟，無法送出申請。");
      }

      await txn.commit();
      return { success: true };
    } catch (error) {
      console.dir(error);
      await txn.rollback();
      return handleError(error, "server") as ActionResponse;
    }
  }

  async checkIfCompletedAllOnboardingSteps(studioId: string) {
    try {
      const completedOnboardingSteps = await this.knex.select("step").from("studio_onboarding_step").where({ studio_id: studioId, is_complete: true });

      const checkHasAllSteps = onBoardingRequiredSteps.every((step) => completedOnboardingSteps.some((obj) => obj.step === step));

      if (!checkHasAllSteps) {
        throw new ForbiddenError("未完成所有步驟，無法送出申請。");
      }

      return { success: true };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const studioService = new StudioService(knex);
