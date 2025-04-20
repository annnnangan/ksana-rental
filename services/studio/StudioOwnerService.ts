import handleError from "@/lib/handlers/error";
import { knex } from "@/services/knex";
import { Knex } from "knex";

export class StudioOwnerService {
  constructor(private knex: Knex) {}

  async getStudiosByUserId(userId: string, status: "all" | "non-draft") {
    try {
      const mainQuery = this.knex
        .select("id", "cover_photo", "logo", "name", "status", "area", "district")
        .from("studio")
        .where("user_id", userId);

      if (status === "non-draft") {
        mainQuery.whereNotIn("status", ["draft"]);
      }

      const studios = await mainQuery;

      return {
        success: true,
        data: studios,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async countStudioByStatusByUserId(userId: string) {
    try {
      const result = await this.knex
        .select("studio.status")
        .count("studio.id")
        .from("studio")
        .groupBy("studio.status")
        .where({ "studio.user_id": userId });

      return { success: true, data: result };
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getLatestDraftStudioOnboardingStepStatus(userId: string) {
    try {
      const latestDraftStudio = await this.knex
        .select("id", "name")
        .from("studio")
        .where({ user_id: userId, status: "draft" })
        .orderBy("created_at", "desc")
        .first();
      if (latestDraftStudio) {
        const latestDraftStudioId = latestDraftStudio.id;
        const latestDraftStudioName = latestDraftStudio.name;
        const onboardingStepStatus = await this.knex
          .select("step", "is_complete")
          .from("studio_onboarding_step")
          .where({ studio_id: latestDraftStudioId });

        return {
          success: true,
          data: { latestDraftStudioId, latestDraftStudioName, onboardingStepStatus },
        };
      } else {
        return { success: true, data: "" };
      }
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const studioOwnerService = new StudioOwnerService(knex);
