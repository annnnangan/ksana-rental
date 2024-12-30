import { NotFoundError, RequestError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";
import { BasicInfo, districts } from "./model";
import { findAreaByDistrictValue } from "@/lib/utils/areas-districts-converter";
import {
  studioBusinessHourAndPriceFormData,
  studioContactFormData,
  StudioDoorPasswordFormData,
  studioEquipmentFormData,
  StudioPayoutFormData,
} from "@/lib/validations";
export class StudioCreateService {
  constructor(private knex: Knex) {}

  async createNewStudio(userId: number, studioName: string) {
    try {
      const insertedData = await this.knex
        .insert({
          user_id: userId,
          name: studioName,
          status: "draft",
          is_approved: "false",
        })
        .into("studio")
        .returning("id");

      return {
        success: true,
        data: insertedData[0].id,
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }

  //Save image into Studio table
  //todo - params: studioId, userId, imageType (cover or logo). image S3 URL
  async saveImage(
    studioId: number,
    userId: number,
    imageType: "cover_photo" | "logo",
    imageUrl: string
  ) {
    try {
      // Perform the update query
      const updatedData = await knex("studio")
        .where({ id: studioId, user_id: userId })
        .update({ [imageType]: imageUrl }, ["id", "cover_photo", "logo"]);

      if (!updatedData || updatedData.length === 0) {
        throw new NotFoundError("場地");
      }

      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }

  async saveBasicInfo(studioId: number, userId: number, basicInfo: BasicInfo) {
    try {
      const { name, slug, district, description, address } = basicInfo;

      if (!name || !slug || !district || !description || !address) {
        throw new Error("資料有缺少，請填寫。");
      }

      const validDistrictValues = districts.flatMap((region) =>
        region.district.map((district) => district.value)
      );

      if (!validDistrictValues.includes(district)) {
        throw new Error(`你所填寫之地區不正確。`);
      }

      await this.knex("studio")
        .update({
          name,
          slug,
          area: findAreaByDistrictValue(district)?.value,
          district,
          address,
          description,
        })
        .where({ id: studioId, user_id: userId });

      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }

  async saveBusinessHours(
    studioId: number,
    userId: number,
    data: studioBusinessHourAndPriceFormData
  ) {
    try {
      const { businessHours } = data;

      if (!businessHours) {
        throw new Error("資料有缺少，請填寫。");
      }

      for (const [day, businessHourDetail] of Object.entries(businessHours)) {
        const { timeSlots } = businessHourDetail || {};

        if (!timeSlots || timeSlots.length === 0) {
          // If no time slots for the day, mark it as closed and delete existing data
          await this.knex("studio_business_hour")
            .where({
              studio_id: studioId,
              day_of_week: day,
            })
            .del(); // Delete existing rows for the day

          await this.knex("studio_business_hour").insert({
            studio_id: studioId,
            day_of_week: day,
            is_closed: true,
          });

          continue;
        }

        await this.knex.transaction(async (trx) => {
          // Delete existing rows for this day to avoid duplicates
          await trx("studio_business_hour")
            .where({ studio_id: studioId, day_of_week: day })
            .del();

          for (const slot of timeSlots) {
            const { open, close, priceType } = slot;

            // Retrieve the price_type_id based on priceType
            const priceTypeRow = await trx("studio_price")
              .select("id")
              .where({ price_type: priceType, studio_id: studioId })
              .first();

            if (!priceTypeRow) {
              throw new Error(`Invalid priceType: ${priceType}`);
            }

            const priceTypeId = priceTypeRow.id;

            // Insert the time slot
            await trx("studio_business_hour").insert({
              studio_id: studioId,
              day_of_week: day,
              open_time: open,
              end_time: close,
              is_closed: false,
              price_type_id: priceTypeId,
            });
          }
        });
      }

      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }

  async savePrice(
    studioId: number,
    userId: number,
    data: studioBusinessHourAndPriceFormData
  ) {
    try {
      const { nonPeakHourPrice, peakHourPrice } = data;

      if (!nonPeakHourPrice || !peakHourPrice) {
        throw new Error("資料有缺少，請填寫。");
      }

      const priceList = {
        "non-peak": Number(nonPeakHourPrice),
        peak: Number(peakHourPrice),
      };

      //if studio id & price type doesn't exist, we create a new row
      //if exist, we revise the existing data
      for (const [price_type, price] of Object.entries(priceList)) {
        await this.knex.transaction(async (trx) => {
          // Attempt to update the row
          const updatedRows = await trx("studio_price")
            .update({ price })
            .where({ studio_id: studioId, price_type });

          // If no rows were updated, perform an insert
          if (updatedRows === 0) {
            await trx("studio_price").insert({
              studio_id: studioId,
              price_type,
              price,
            });
          }
        });
      }

      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }

  async saveEquipment(
    studioId: number,
    userId: number,
    data: studioEquipmentFormData
  ) {
    try {
      if (!data || data.equipment.length == 0) {
        throw new Error("資料有缺少，請填寫。");
      }
      //todo - map the id in equipment
      //[1,4,6]
      const equipmentIdList = await Promise.all(
        data.equipment.map(async (item) => {
          const result = await this.knex
            .select("id")
            .from("equipment")
            .where("equipment", item)
            .first(); // Use `.first()` to get a single row

          if (!result) {
            // Throw an error if the equipment is not found
            throw new Error(`請選擇列表中之設備。`);
          }

          return result.id; // Return the ID
        })
      );

      //todo - insert back to studio_equipment

      await this.knex.transaction(async (trx) => {
        // Delete existing rows  to avoid duplicates
        await trx("studio_equipment").where({ studio_id: studioId }).del();

        for (const itemId of equipmentIdList) {
          // Insert the item
          await trx("studio_equipment").insert({
            studio_id: studioId,
            equipment_id: itemId,
          });
        }
      });

      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }

  async saveGallery(studioId: number, userId: number, imageUrl: string) {
    try {
      await this.knex
        .insert({
          studio_id: studioId,
          photo: imageUrl,
        })
        .into("studio_photo");
      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }

  async savePhone(
    studioId: number,
    userId: number,
    data: studioContactFormData
  ) {
    try {
      if (!data) {
        throw new Error("資料有缺少，請填寫。");
      }
      //todo - insert data to studio_contact
      await this.knex("studio")
        .update({
          phone: data.phone,
        })
        .where({ id: studioId, user_id: userId });
      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }

  async saveSocial(
    studioId: number,
    userId: number,
    data: studioContactFormData
  ) {
    try {
      if (!data) {
        throw new Error("資料有缺少，請填寫。");
      }

      await this.knex.transaction(async (trx) => {
        // Delete existing rows for this day to avoid duplicates
        await trx("studio_social").where({ studio_id: studioId }).del();

        for (const [type, value] of Object.entries(data.social)) {
          await trx("studio_social").insert({
            studio_id: studioId,
            type: type,
            contact: value === "" ? null : value,
          });
        }
      });

      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }

  async savePayoutDetail(
    studioId: number,
    userId: number,
    data: StudioPayoutFormData
  ) {
    try {
      const { payoutMethod, payoutAccountName, payoutAccountNumber } = data;

      if (!payoutMethod || !payoutAccountName || !payoutAccountNumber) {
        throw new Error("資料有缺少，請填寫。");
      }

      await this.knex.transaction(async (trx) => {
        // Attempt to update the row
        const updatedRows = await trx("studio_payout_detail")
          .update({
            method: payoutMethod,
            account_name: payoutAccountName,
            account_number: payoutAccountNumber,
          })
          .where({ studio_id: studioId });
        // If no rows were updated, perform an insert
        if (updatedRows === 0) {
          await trx("studio_payout_detail").insert({
            studio_id: studioId,
            method: payoutMethod,
            account_name: payoutAccountName,
            account_number: payoutAccountNumber,
          });
        }
      });

      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }

  async saveDoorPassword(
    studioId: number,
    userId: number,
    data: StudioDoorPasswordFormData
  ) {
    try {
      const { isRevealDoorPassword, doorPassword } = data;

      if (!isRevealDoorPassword) {
        throw new Error("資料有缺少，請填寫。");
      }

      if (
        isRevealDoorPassword === "true" &&
        doorPassword?.length === undefined
      ) {
        throw new Error("請填寫大門密碼。");
      }

      if (isRevealDoorPassword === "true" && doorPassword?.length) {
        await knex("studio").where({ id: studioId, user_id: userId }).update({
          is_reveal_door_password: true,
          door_password: doorPassword,
        });
      }

      if (isRevealDoorPassword === "false") {
        await knex("studio").where({ id: studioId, user_id: userId }).update({
          is_reveal_door_password: false,
          door_password: null,
        });
      }

      return {
        success: true,
        data: "",
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }
}

export const studioCreateService = new StudioCreateService(knex);
