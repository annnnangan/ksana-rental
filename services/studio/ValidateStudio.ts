import { GENERAL_ERROR_MESSAGE } from "@/lib/constants/error-message";
import handleError from "@/lib/handlers/error";
import { NotFoundError, UnauthorizedError } from "@/lib/http-errors";
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

  async validateStudioStatus(status: string, userId: string, studioId: string) {
    try {
      const result = await this.knex
        .select("status")
        .from("studio")
        .where({ user_id: userId, id: studioId })
        .first();

      if (result.status !== status) {
        throw new UnauthorizedError("不符合場地狀態");
      }

      return {
        success: true,
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async validateIsStudioBelongToUser(userId: string, studioId: string) {
    try {
      const result = await this.knex
        .select("id")
        .from("studio")
        .where({ user_id: userId, id: studioId })
        .first();

      if (!result) {
        throw new NotFoundError("場地");
      }

      return {
        success: true,
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const validateStudioService = new ValidateStudioService(knex);
