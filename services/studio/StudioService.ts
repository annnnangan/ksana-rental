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
}

export const studioService = new StudioService(knex);
