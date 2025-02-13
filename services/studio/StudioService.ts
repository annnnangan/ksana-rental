import { knex } from "@/services/knex";
import { Knex } from "knex";
import { StudioStatus } from "../model";
import { validateStudioService } from "./ValidateStudio";
import { DateSpecificHoursSchemaFormData } from "@/lib/validations/zod-schema/manage-studio-schema";
import handleError from "@/lib/handlers/error";

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

  //Date Specific Hours
  async saveDateSpecificHours(data: DateSpecificHoursSchemaFormData, studioId: string) {
    const { date, timeslots } = data;
    try {
      let updatedTimeslotsFormat = timeslots;

      if (timeslots.length > 0) {
        // Step 1: Fetch the price_type_id based on price_type and studio_id
        // return [ { id: 3, price_type: 'non-peak' }, { id: 4, price_type: 'peak' } ]
        const priceTypes = await this.knex("studio_price").select("id", "price_type").where({ studio_id: studioId });

        // Step 2: Map the price_type to the corresponding price_type_id
        // return { 'non-peak': 3, peak: 4 }
        const priceTypeMap = priceTypes.reduce((acc, { price_type, id }) => {
          acc[price_type] = id;
          return acc;
        }, {});

        // Step 2: Map timeslots to their price_type_id
        // return [{ from: '19:00', to: '22:00', price_type: 'peak', price_type_id: 4 }]
        updatedTimeslotsFormat = timeslots
          .map((timeslot) => ({
            ...timeslot,
            price_type_id: priceTypeMap[timeslot.price_type], // Replace price_type with price_type_id
          }))
          .sort((a, b) => a.from.localeCompare(b.from));
      }

      const isDateExist = (await this.knex.select("id").from("studio_date_specific_hour").where({ date: date, studio_id: studioId }))[0]?.id;

      if (isDateExist) {
        await this.knex("studio_date_specific_hour")
          .where({ date: date, studio_id: studioId })
          .update({
            timeslots: JSON.stringify(updatedTimeslotsFormat),
          });
      } else {
        await this.knex("studio_date_specific_hour").insert({
          studio_id: parseInt(studioId),
          date: data.date,
          timeslots: JSON.stringify(updatedTimeslotsFormat),
        });
      }

      return { success: true };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }

    //check if the date exist already
    //if yes, then update it
    //if no, then insert a new row
  }

  async getAllDateSpecificHoursByStudioId(studioId: string) {
    try {
      const result = await this.knex.select("date", "timeslots").from("studio_date_specific_hour").where({ studio_id: studioId });

      return {
        success: true,
        data: result,
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
