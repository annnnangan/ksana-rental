import handleError from "@/lib/handlers/error";
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

  async getMonthlyConfirmedBookingAmountBreakdown(timeframe: string, userId: string) {
    try {
      let startDate;
      let monthsBack;

      if (timeframe === "last-12-months") {
        // Include this month and go back 12 months from the current date
        startDate = knex.raw("DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '12 months'");
        monthsBack = 12;
      } else if (timeframe === "last-6-months") {
        // Include this month and go back 6 months from the current date
        startDate = knex.raw("DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'");
        monthsBack = 6;
      } else if (timeframe === "this-month") {
        // Just this month
        startDate = knex.raw("DATE_TRUNC('month', CURRENT_DATE)");
        monthsBack = 1;
      } else {
        throw new Error("Invalid timeframe");
      }

      // Generate a month list
      const monthList = (
        await this.knex.raw(
          `
    SELECT TO_CHAR(generate_series(
    DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '${monthsBack - 1} months', 
    DATE_TRUNC('month', CURRENT_DATE), 
    INTERVAL '1 month'
    ), 'YYYY-MM') AS month_series
  `
        )
      ).rows;

      // Get the booking amount with month
      const monthlyBookingAmount = await this.knex
        .select(this.knex.raw("TO_CHAR(DATE_TRUNC('month', booking.created_at), 'YYYY-MM') AS month, COUNT(*) AS total"))
        .from("booking")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "studio.user_id": userId, "booking.status": "confirmed" })
        .andWhere("booking.created_at", ">=", startDate)
        .groupByRaw("1") // Group by truncated month
        .orderByRaw("1 DESC"); // Order from latest to oldest

      const totalBookingAmount = (
        await this.knex
          .select(this.knex.raw("COUNT(booking.id) AS total_amount"))
          .from("booking")
          .leftJoin("studio", "booking.studio_id", "studio.id")
          .where({ "studio.user_id": userId, "booking.status": "confirmed" })
          .andWhere("booking.created_at", ">=", startDate)
      )[0];

      const bookingMap = new Map(monthlyBookingAmount.map((item) => [item.month, item.total]));

      function getMonthName(monthNumber: string) {
        return new Date(2000, parseInt(monthNumber) - 1).toLocaleString("en-US", {
          month: "short",
        });
      }

      // Combine the month series with the data
      const result = monthList.map((item: { month_series: string }) => {
        const month = item.month_series;
        return {
          month: getMonthName(month.split("-")[1]),
          total: bookingMap.has(month) ? Number(bookingMap.get(month)) : 0, // Default to '0' if no data for that month
        };
      });

      return { success: true, data: { totalAmount: Number(totalBookingAmount.total_amount), monthBreakdown: result } };
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const dashboardService = new DashboardService(knex);
