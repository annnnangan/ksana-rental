import { knex } from "@/services/knex";
import { Knex } from "knex";
import { StudioStatus } from "../model";
import { validateStudioService } from "./ValidateStudio";
import { DateSpecificHoursSchemaFormData } from "@/lib/validations/zod-schema/date-specific-hours-schema";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";

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

  /* ----------------------------------- Handle Date Specific Hours ----------------------------------- */
  async saveDateSpecificHours(data: DateSpecificHoursSchemaFormData, studioId: string) {
    const { date, timeslots } = data;
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

  async getAllDateSpecificHoursByStudioId(studioId: string) {
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

  async deleteDateSpecificHoursByStudioId(date: string, studioId: string) {
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
