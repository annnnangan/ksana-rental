import { NotFoundError, RequestError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";
export class StudioService {
  constructor(private knex: Knex) {}

  async validateStudioIdtoUserId(studioId: number, userId: number) {
    try {
      const isStudioExist = (
        await knex
          .select("*")
          .from("studio")
          .where("id", studioId)
          .andWhere("user_id", userId)
      )[0];

      //Throw error when the booking reference doesn't exist for the user
      if (isStudioExist == undefined) {
        throw new NotFoundError("場地");
      }

      return { success: true };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤，請重試。"
        );
      }
    }
  }

  //Save image into Studio table
  //todo - params: studioId, userId, imageType (cover or logo). image S3 URL
  async getStudioBasicInfo(studioId: number, userId: number) {
    try {
      const isStudioExist = await this.validateStudioIdtoUserId(
        studioId,
        userId
      );

      if (isStudioExist.success) {
        // Perform the update query
        const basicInfo = (
          await this.knex
            .select(
              "cover_photo",
              "logo",
              "name",
              "slug",
              "status",
              "district",
              "address",
              "description"
            )
            .from("studio")
            .where("id", studioId)
            .andWhere("user_id", userId)
        )[0];

        if (basicInfo) {
          return {
            success: true,
            data: basicInfo,
          };
        } else {
          throw Error;
        }
      }
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
