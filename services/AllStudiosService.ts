import { NotFoundError, RequestError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";

export class AllStudiosService {
  constructor(private knex: Knex) {}

  async getStudios() {
    try {
      const studios = await this.knex
        .select(
          "studio.name",
          "studio.slug",
          "studio.cover_photo",
          "studio.logo",
          "studio.district",
          this.knex.raw(`CAST(AVG(review.rating) AS DECIMAL) AS rating`),
          this.knex.raw(
            `CAST(COUNT(DISTINCT CASE WHEN booking.status = 'complete' THEN booking.id END) AS INTEGER) AS number_of_completed_booking`
          ),
          this.knex.raw(
            `CAST(COUNT(DISTINCT review.id) AS INTEGER) AS number_of_review`
          ),
          this.knex.raw(`CAST(MIN(studio_price.price) AS INTEGER) AS min_price`)
        )
        .leftJoin("booking", "studio.id", "booking.studio_id")
        .leftJoin("review", "booking.id", "review.booking_id")
        .leftJoin("studio_price", "studio.id", "studio_price.studio_id")
        .from("studio")
        .groupBy("studio.id")
        .where({ "studio.status": "active" });

      return {
        success: true,
        data: studios,
      };
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      } else {
        throw new RequestError(
          500,
          error instanceof Error ? error.message : "系統發生錯誤。"
        );
      }
    }
  }
}

export const allStudiosService = new AllStudiosService(knex);
