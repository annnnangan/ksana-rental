import { GENERAL_ERROR_MESSAGE } from "@/lib/constants/error-message";
import { knex } from "@/services/knex";
import { Knex } from "knex";

export class ValidateBookingService {
  constructor(private knex: Knex) {}

  async validateIsBookingBelongUser(
    booking_reference_no: string,
    user_id: string
  ) {
    try {
      console.log(booking_reference_no);
      console.log(user_id);
      const result = (
        await this.knex
          .select("date", "start_time")
          .from("booking")
          .where("reference_no", booking_reference_no)
          .andWhere("user_id", user_id)
      )[0];

      console.log(result);

      if (!result) {
        return {
          success: false,
          error: { message: "你沒有此預約。" },
          errorCode: 404,
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: { message: GENERAL_ERROR_MESSAGE },
        errorStatus: 500,
      };
    }
  }
}

export const validateBookingService = new ValidateBookingService(knex);
