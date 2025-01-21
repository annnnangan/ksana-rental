import { knex } from "@/services/knex";
import { Knex } from "knex";

export class ValidateStudioService {
  constructor(private knex: Knex) {}

  async validateIsStudioExistBySlug(slug: string) {
    const result = (
      await this.knex.select("id").from("studio").where("slug", slug)
    )[0]?.id;

    if (!result) {
      return {
        success: false,
        error: { message: "場地不存在。" },
      };
    }

    return {
      success: true,
      data: result,
    };
  }
}

export const validateStudioService = new ValidateStudioService(knex);
