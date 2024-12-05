import { NotFoundError, RequestError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";
export class StudioCreateService {
  constructor(private knex: Knex) {}

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
}

export const studioCreateService = new StudioCreateService(knex);
