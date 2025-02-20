import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";

export class StudioOwnerService {
  constructor(private knex: Knex) {}

  async validateIsStudioBelongToUser(userId: string, studioId: string) {
    try {
      const result = await this.knex.select("id").from("studio").where({ user_id: userId, id: studioId }).first();

      if (!result) {
        throw new NotFoundError("場地");
      }

      return {
        success: true,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getStudiosByUserId(userId: string) {
    try {
      const studios = await this.knex
        .select(
          this.knex.raw('CAST("id" AS TEXT) AS id'), // Cast id to string
          "cover_photo",
          "logo",
          "name",
          "status",
          "area",
          "district"
        )
        .from("studio")
        .where("user_id", userId);

      if (studios.length === 0) {
        throw new NotFoundError("場地");
      }

      return {
        success: true,
        data: studios,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const studioOwnerService = new StudioOwnerService(knex);
