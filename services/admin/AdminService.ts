import handleError from "@/lib/handlers/error";
import { knex } from "@/services/knex";
import { Knex } from "knex";

export class AdminService {
  constructor(private knex: Knex) {}

  async approveStudio(studioId: string) {
    try {
      await this.knex("studio")
        .where({ id: studioId })
        .update({ status: "active", is_approved: true });
      return {
        success: true,
        data: "",
      };
    } catch (error) {
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
          knex.raw(
            "TO_CHAR(studio_onboarding_step.updated_at, 'YYYY-MM-DD') AS request_review_date"
          ),
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
      return handleError(error, "server") as ActionResponse;
    }
  }

  async setRecommendStudios(studioList: Record<number, string>) {
    const txn = await this.knex.transaction();
    try {
      // Remove existing data
      await txn("recommend_studio").del();

      // Build insert promises
      const insertPromises = Array.from({ length: 6 }, (_, index) =>
        txn("recommend_studio").insert({
          studio_id: studioList[index + 1],
          rank: index + 1,
        })
      );

      // Await all insertions
      await Promise.all(insertPromises);

      await txn.commit();
      return { success: true };
    } catch (error) {
      await txn.rollback();

      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const adminService = new AdminService(knex);
