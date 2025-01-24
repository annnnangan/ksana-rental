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
}

export const studioService = new StudioService(knex);
