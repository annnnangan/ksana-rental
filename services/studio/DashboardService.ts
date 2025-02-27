import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";
import { bookingStatusService } from "../booking/BookingStatusService";

export class DashboardService {
  constructor(private knex: Knex) {}

  async getStudioTotalBookingsCount(studioId: string) {
    try {
      const totalBookings = await this.knex.count({ total_bookings: "booking.id" }).from("booking").where({ studio_id: studioId });

      return {
        success: true,
        data: totalBookings[0],
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getStudioBookingsWithStatusCount(studioId: string) {
    try {
      const statuses = ["confirmed", "pending-for-payment", "completed", "canceled-and-expired"];

      const counts: Record<string, number> = {};

      // Iterate over all statuses
      for (const status of statuses) {
        // Start a base query to count bookings
        const countQuery = this.knex("booking").count("* as count");

        // Apply the booking status filter (using your applyBookingStatusFilter)
        bookingStatusService.applyBookingStatusFilter(countQuery, status); // Apply the filter here

        // Get the count result
        const result = await countQuery;

        // Access the count value from the first result (since it's an array)
        counts[status] = Number(result[0]?.count) || 0;
      }

      return {
        success: true,
        data: counts,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const dashboardService = new DashboardService(knex);
