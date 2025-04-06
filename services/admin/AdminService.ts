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
}

export const adminService = new AdminService(knex);
