import { GENERAL_ERROR_MESSAGE } from "@/lib/constants/error-message";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";

export class ValidateStudioService {
  constructor(private knex: Knex) {}

  async validateIsStudioExistBySlug(slug: string) {
    try {
      const result = (await this.knex.select("id").from("studio").where("slug", slug))[0]?.id;

      if (!result) {
        throw new NotFoundError("場地");
      }

      return {
        success: true,
        data: { studio_id: result },
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async validateIsStudioExistById(id: string) {
    try {
      const result = await this.knex.select("id").from("studio").where("id", id).first();

      if (!result.id) {
        return {
          success: false,
          error: { message: "場地不存在。" },
          errorCode: 404,
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch {
      return {
        success: false,
        error: { message: GENERAL_ERROR_MESSAGE },
        errorStatus: 500,
      };
    }
  }
}

export const validateStudioService = new ValidateStudioService(knex);
