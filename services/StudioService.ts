import { NotFoundError, RequestError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";
export class StudioService {
  constructor(private knex: Knex) {}

  //Save image into Studio table
  //todo - params: studioId, userId, imageType (cover or logo). image S3 URL
  async getStudioCoverNLogoImages(studioId: number, userId: number) {
    try {
      // Perform the update query

      const imagesResponse = await this.knex
        .select("cover_photo", "logo")
        .from("studio")
        .where("id", studioId)
        .andWhere("user_id", userId);

      const images = imagesResponse[0];

      return {
        success: true,
        data: images,
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

export const studioService = new StudioService(knex);
