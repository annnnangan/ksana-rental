import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import { DateSpecificHourSchemaFormData } from "@/lib/validations/zod-schema/studio/studio-manage-schema";
import { BasicInfoFormData, BusinessHoursAndPriceFormData, StudioNameFormData } from "@/lib/validations/zod-schema/studio/studio-step-schema";
import { knex } from "@/services/knex";
import { Knex } from "knex";
import { onBoardingRequiredSteps, StudioStatus } from "../model";
import { validateStudioService } from "./ValidateStudio";
import { convertTimeToString, formatDate } from "@/lib/utils/date-time/date-time-utils";
import { findAreaByDistrictValue } from "@/lib/utils/areas-districts-converter";
import { FieldValues } from "react-hook-form";

export class StudioService {
  constructor(private knex: Knex) {}

  async getStudioBasicInfo(slug: string | null, status: StudioStatus[] | null) {
    if (slug) {
      // Validate if the studio exists by slug
      const validationResponse = await validateStudioService.validateIsStudioExistBySlug(slug);

      if (!validationResponse.success) {
        // Return error immediately if the studio doesn't exist
        return {
          success: false,
          error: validationResponse.error,
        };
      }
    }

    const mainQuery = this.knex.select("id", "name", "slug", "cover_photo", "logo", "district").from("studio");

    // Add status filter if provided
    if (status) {
      mainQuery.whereIn("status", status);
    }

    // Add slug filter if provided and valid
    if (slug) {
      mainQuery.where({ slug });
    }

    const studios = await mainQuery;

    return {
      success: true,
      data: studios,
    };
  }

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
      const result = (await this.knex.select("logo", "cover_photo", "name", "slug", "district", "address", "description").from("studio").where({ id: studioId }))[0];
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
    console.log(data);
    const txn = await this.knex.transaction();
    try {
      /* ------------------------------ Check if price data exist  ------------------------------ */
      const isPriceDataExist = await this.knex("studio_price").where({ studio_id: studioId });

      /* ------------------------------ Handle price update/create  ------------------------------ */
      if (isPriceDataExist.length == 0) {
        await txn("studio_price").insert({ studio_id: studioId, price_type: "non-peak", price: nonPeakHourPrice });
        await txn("studio_price").insert({ studio_id: studioId, price_type: "peak", price: peakHourPrice });
      } else {
        await txn("studio_price").where({ studio_id: studioId, price_type: "non-peak" }).update({ price: nonPeakHourPrice });
        await txn("studio_price").where({ studio_id: studioId, price_type: "peak" }).update({ price: peakHourPrice });
      }

      /* ------------------------------ Handle business hours update ------------------------------ */

      // Get all price types from DB and create a map
      // From [{id: 1, price_type: "non-peak"},{id: 2, price_type: "peak"}]  --> { "non-peak": 1, "peak":2 })
      const priceTypes = await this.knex.select("id", "price_type").from("studio_price").where({ studio_id: studioId });

      if (priceTypes.length === 0) {
        throw new NotFoundError("價錢");
      }

      const priceTypeMap: Record<string, number> = Object.fromEntries(priceTypes.map(({ id, price_type }) => [price_type, id]));

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
          acc[day_of_week].timeslots.push({ from: convertTimeToString(from), to: convertTimeToString(to), priceType: price_type });
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

  //Get Studio Door Password
  async getDoorPassword(studioId: string) {
    try {
      //check if studio exist
      const isStudioExist = await validateStudioService.validateIsStudioExistById(studioId);

      if (!isStudioExist.success) {
        return isStudioExist;
      }

      if (isStudioExist.success && isStudioExist.data.id) {
        const result = await this.knex.select("door_password").from("studio").where("id", studioId).first();

        if (!result.door_password) {
          return {
            success: false,
            error: { message: "無法取得大門密碼，請聯絡場地以取得密碼。" },
            errorStatus: 404,
          };
        }

        return {
          success: true,
          data: result,
        };
      }
    } catch (error) {
      console.error("Error fetching door password:", error);

      return {
        success: false,
        error: { message: "無法取得大門密碼，請聯絡場地以取得密碼。" },
        errorStatus: 500,
      };
    }
  }
}

export const studioService = new StudioService(knex);
