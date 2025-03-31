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

  async getStudioOwnerActiveStudio(userId: string) {
    try {
      const result = await this.knex
        .select("studio.name", "studio.slug", "studio.cover_photo", "studio.logo", "studio.district", this.knex.raw(`COALESCE(AVG(review.rating), 0) AS rating`))
        .from("studio")
        .leftJoin("booking", "studio.id", "booking.studio_id")
        .leftJoin("review", "booking.reference_no", "review.booking_reference_no")
        .groupBy("studio.id", "studio.name", "studio.slug", "studio.logo", "studio.district")
        .where({ "studio.status": "active", "studio.user_id": userId });

      return { success: true, data: result };
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getMonthlyCount({ timeframe, dateType, userId, studioId }: { timeframe: string; dateType: "created_at" | "booking_date"; userId: string; studioId?: string }) {
    try {
      let startDate;
      let monthsBack;

      const dateTypeField = dateType === "booking_date" ? "date" : "created_at";

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

      // Start building the query
      const mainQuery = this.knex
        .select(this.knex.raw(`TO_CHAR(DATE_TRUNC('month', booking.${dateTypeField}), 'YYYY-MM') AS month, COUNT(*) AS total`))
        .from("booking")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "studio.user_id": userId, "booking.status": "confirmed" })
        .andWhere(`booking.${dateTypeField}`, ">=", startDate)
        .groupByRaw("1") // Group by truncated month
        .orderByRaw("1 DESC"); // Order from latest to oldest;

      // Conditionally add studio filter if studioId is provided
      if (studioId) {
        mainQuery.andWhere("booking.studio_id", studioId);
      }

      // Get the monthly booking count
      const monthlyBookingCount = await mainQuery;

      // Get the total booking count
      const countQuery = this.knex
        .select(this.knex.raw("COUNT(booking.id) AS total_count"))
        .from("booking")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "studio.user_id": userId, "booking.status": "confirmed" })
        .andWhere(`booking.${dateTypeField}`, ">=", startDate)
        .andWhere(`booking.${dateTypeField}`, "<=", this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'"));

      if (studioId) {
        countQuery.andWhere("booking.studio_id", studioId);
      }
      const totalBookingCount = await countQuery;

      const bookingMap = new Map(monthlyBookingCount.map((item) => [item.month, item.total]));

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

      return { success: true, data: { totalCount: Number(totalBookingCount[0].total_count), monthBreakdown: result } };
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getMonthlyRevenue({ timeframe, dateType, userId, studioId }: { timeframe: string; dateType: "created_at" | "booking_date"; userId: string; studioId?: string }) {
    try {
      let startDate;
      let monthsBack;

      const dateTypeField = dateType === "booking_date" ? "date" : "created_at";

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

      // Get the booking revenue with month
      const mainQuery = this.knex
        .select(this.knex.raw(`TO_CHAR(DATE_TRUNC('month', booking.${dateTypeField}), 'YYYY-MM') AS month, SUM(booking.price) AS total`))
        .from("booking")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "studio.user_id": userId, "booking.status": "confirmed" })
        .andWhere(`booking.${dateTypeField}`, ">=", startDate)
        .groupByRaw("1") // Group by truncated month
        .orderByRaw("1 DESC"); // Order from latest to oldest

      if (studioId) {
        mainQuery.andWhere("booking.studio_id", studioId);
      }

      const monthlyBookingRevenue = await mainQuery;

      const countQuery = this.knex
        .select(this.knex.raw("SUM(booking.price) AS total_revenue"))
        .from("booking")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "studio.user_id": userId, "booking.status": "confirmed" })
        .andWhere(`booking.${dateTypeField}`, ">=", startDate)
        .andWhere(`booking.${dateTypeField}`, "<=", this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'"));

      if (studioId) {
        countQuery.andWhere("booking.studio_id", studioId);
      }

      const totalBookingRevenue = await countQuery;

      const bookingMap = new Map(monthlyBookingRevenue.map((item) => [item.month, item.total]));

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

      return { success: true, data: { totalRevenue: Number(totalBookingRevenue[0].total_revenue), monthBreakdown: result } };
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getCountBreakdownByStudio({ timeframe, dateType, userId }: { timeframe: string; dateType: "created_at" | "booking_date"; userId: string }) {
    try {
      let startDate;
      let monthsBack;

      const dateTypeField = dateType === "booking_date" ? "date" : "created_at";

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

      // Get the booking count with month
      const bookingCountBreakdownByStudio = await this.knex
        .select(this.knex.raw("studio.name AS studio_name, CAST(count(*) AS INTEGER) AS total"))
        .from("booking")
        .groupBy("studio.name")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "studio.user_id": userId, "booking.status": "confirmed" })
        .andWhere(`booking.${dateTypeField}`, ">=", startDate)
        .andWhere(`booking.${dateTypeField}`, "<=", this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'"))
        .orderByRaw("2 DESC");

      return { success: true, data: bookingCountBreakdownByStudio };
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getRevenueBreakdownByStudio({ timeframe, dateType, userId }: { timeframe: string; dateType: "created_at" | "booking_date"; userId: string }) {
    try {
      let startDate;

      const dateTypeField = dateType === "booking_date" ? "date" : "created_at";

      if (timeframe === "last-12-months") {
        // Include this month and go back 12 months from the current date
        startDate = knex.raw("DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '12 months'");
      } else if (timeframe === "last-6-months") {
        // Include this month and go back 6 months from the current date
        startDate = knex.raw("DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'");
      } else if (timeframe === "this-month") {
        // Just this month
        startDate = knex.raw("DATE_TRUNC('month', CURRENT_DATE)");
      } else {
        throw new Error("Invalid timeframe");
      }

      const data = await this.knex
        .select(this.knex.raw("studio.name AS studio_name, CAST(SUM(booking.price) AS INTEGER) AS total"))
        .from("booking")
        .groupBy("studio.name")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "studio.user_id": userId, "booking.status": "confirmed" })
        .andWhere(`booking.${dateTypeField}`, ">=", startDate)
        .andWhere(`booking.${dateTypeField}`, "<=", this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'"))
        .orderByRaw("2 DESC");

      return { success: true, data: data };
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const dashboardService = new DashboardService(knex);
