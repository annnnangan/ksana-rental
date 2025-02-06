import { knex } from "@/services/knex";
import { Knex } from "knex";
import { StudioStatus } from "../model";
import { validateStudioService } from "./ValidateStudio";

export class StudioService {
  constructor(private knex: Knex) {}

  async getStudioBasicInfo(slug: string | null, status: StudioStatus[] | null) {
    if (slug) {
      // Validate if the studio exists by slug
      const validationResponse =
        await validateStudioService.validateIsStudioExistBySlug(slug);

      if (!validationResponse.success) {
        // Return error immediately if the studio doesn't exist
        return {
          success: false,
          error: validationResponse.error,
        };
      }
    }

    const mainQuery = this.knex
      .select("id", "name", "slug", "cover_photo", "logo", "district")
      .from("studio");

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
    const studio_id = (
      await this.knex.select("id").from("studio").where({ slug })
    )[0]?.id;

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
    const studios = await this.knex
      .select("name", "slug")
      .from("studio")
      .orderBy("name");

    return {
      success: true,
      data: studios,
    };
  }

  //Get Studio Door Password
  async getDoorPassword(studioId: string) {
    try {
      //check if studio exist
      const isStudioExist =
        await validateStudioService.validateIsStudioExistById(studioId);

      if (!isStudioExist.success) {
        return isStudioExist;
      }

      if (isStudioExist.success && isStudioExist.data.id) {
        const result = await this.knex
          .select("door_password")
          .from("studio")
          .where("id", studioId)
          .first();

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
