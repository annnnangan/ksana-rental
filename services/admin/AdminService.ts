import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";

export class AdminService {
  constructor(private knex: Knex) {}

  async approveStudio(studioId: string) {
    try {
      await this.knex("studio").where({ id: studioId }).update({ status: "active", is_approved: true });
      return {
        success: true,
        data: "",
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getStudioList(status: string) {
    try {
      const result = await this.knex
        .select(
          "studio.id AS studio_id",
          "studio.name AS studio_name",
          "studio.status",
          knex.raw("TO_CHAR(studio_onboarding_step.updated_at, 'YYYY-MM-DD') AS request_review_date"),
          knex.raw("TO_CHAR(studio.approved_at, 'YYYY-MM-DD') AS approved_date")
        )
        .from("studio")
        .leftJoin("studio_onboarding_step", "studio_onboarding_step.studio_id", "studio.id")
        .where({ "studio.status": `${status}`, "studio_onboarding_step.step": "confirmation" });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const adminService = new AdminService(knex);
