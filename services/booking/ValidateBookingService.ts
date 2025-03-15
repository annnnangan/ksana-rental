import { GENERAL_ERROR_MESSAGE } from "@/lib/constants/error-message";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";

export class ValidateBookingService {
  constructor(private knex: Knex) {}

  async validateIsBookingBelongUser(bookingReferenceNumber: string, userId: string) {
    try {
      const result = (await this.knex.select("id").from("booking").where("reference_no", bookingReferenceNumber).andWhere("user_id", userId))[0];

      if (!result) {
        throw new NotFoundError("預約");
      }

      return {
        success: true,
      };
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const validateBookingService = new ValidateBookingService(knex);
