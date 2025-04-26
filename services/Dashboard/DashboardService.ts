import handleError from "@/lib/handlers/error";
import { knex } from "@/services/knex";
import { Knex } from "knex";
import { bookingStatusService } from "../booking/BookingStatusService";
import { paginationService } from "../PaginationService";

export class DashboardService {
  constructor(private knex: Knex) {}

  async generateTimeframeQuery({ timeframe }: { timeframe: string }) {
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

    return { startDate, monthList };
  }

  async getStudioTotalBookingsCount(studioId: string) {
    try {
      const totalBookings = await this.knex
        .count({ total_bookings: "booking.id" })
        .from("booking")
        .where({ studio_id: studioId });

      return {
        success: true,
        data: totalBookings[0],
      };
    } catch (error) {
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
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ---------------------------------- Studio Owner / Studio Dashboard --------------------------------- */

  async getStudioOwnerActiveStudio(userId: string) {
    try {
      const result = await this.knex
        .select(
          "studio.name",
          "studio.slug",
          "studio.cover_photo",
          "studio.logo",
          "studio.district",
          this.knex.raw(`COALESCE(AVG(review.rating), 0) AS rating`)
        )
        .from("studio")
        .leftJoin("booking", "studio.id", "booking.studio_id")
        .leftJoin("review", "booking.reference_no", "review.booking_reference_no")
        .groupBy("studio.id", "studio.name", "studio.slug", "studio.logo", "studio.district")
        .where({ "studio.status": "active", "studio.user_id": userId });

      return { success: true, data: result };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getStudioBookingCount({
    timeframe,
    dateType,
    userId,
    studioId,
  }: {
    timeframe: string;
    dateType: "created_at" | "booking_date";
    userId?: string;
    studioId?: string;
  }) {
    try {
      const dateTypeField = dateType === "booking_date" ? "date" : "created_at";
      const { startDate, monthList } = await this.generateTimeframeQuery({ timeframe });

      // Start building the query
      const monthlyBreakdownQuery = this.knex
        .select(
          this.knex.raw(
            `TO_CHAR(DATE_TRUNC('month', booking.${dateTypeField}), 'YYYY-MM') AS month, COUNT(*) AS total`
          )
        )
        .from("booking")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "booking.status": "confirmed" })
        .andWhere(`booking.${dateTypeField}`, ">=", startDate)
        .groupByRaw("1") // Group by truncated month
        .orderByRaw("1 DESC"); // Order from latest to oldest;

      // Get the total booking count
      const totalQuery = this.knex
        .select(this.knex.raw("COUNT(booking.id) AS total"))
        .from("booking")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "booking.status": "confirmed" })
        .andWhere(`booking.${dateTypeField}`, ">=", startDate)
        .andWhere(
          `booking.${dateTypeField}`,
          "<=",
          this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'")
        );

      if (studioId) {
        monthlyBreakdownQuery.andWhere({ "booking.studio_id": studioId });
        totalQuery.andWhere({ "booking.studio_id": studioId });
      }

      if (userId) {
        monthlyBreakdownQuery.andWhere({ "studio.user_id": userId });
        totalQuery.andWhere({ "studio.user_id": userId });
      }

      // Get the monthly booking count
      const monthlyBookingCount = await monthlyBreakdownQuery;
      const totalBookingCount = await totalQuery;

      const formatMonthlyBreakdownList = new Map(
        monthlyBookingCount.map((item) => [item.month, item.total])
      );

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
          total: formatMonthlyBreakdownList.has(month)
            ? Number(formatMonthlyBreakdownList.get(month))
            : 0, // Default to '0' if no data for that month
        };
      });

      return {
        success: true,
        data: { total: Number(totalBookingCount[0].total), monthBreakdown: result },
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getStudioExpectedRevenue({
    timeframe,
    dateType,
    userId,
    studioId,
  }: {
    timeframe: string;
    dateType: "created_at" | "booking_date";
    userId?: string;
    studioId?: string;
  }) {
    try {
      const dateTypeField = dateType === "booking_date" ? "date" : "created_at";
      const { startDate, monthList } = await this.generateTimeframeQuery({ timeframe });

      // Get the booking revenue with month
      const monthlyBreakdownQuery = this.knex
        .select(
          this.knex.raw(
            `TO_CHAR(DATE_TRUNC('month', booking.${dateTypeField}), 'YYYY-MM') AS month, SUM(booking.price) AS total`
          )
        )
        .from("booking")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "booking.status": "confirmed" })
        .andWhere(`booking.${dateTypeField}`, ">=", startDate)
        .groupByRaw("1") // Group by truncated month
        .orderByRaw("1 DESC"); // Order from latest to oldest

      const totalQuery = this.knex
        .select(this.knex.raw("SUM(booking.price) AS total"))
        .from("booking")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "booking.status": "confirmed" })
        .andWhere(`booking.${dateTypeField}`, ">=", startDate)
        .andWhere(
          `booking.${dateTypeField}`,
          "<=",
          this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'")
        );

      if (studioId) {
        monthlyBreakdownQuery.andWhere({ "booking.studio_id": studioId });
        totalQuery.andWhere({ "booking.studio_id": studioId });
      }

      if (userId) {
        monthlyBreakdownQuery.andWhere({ "studio.user_id": userId });
        totalQuery.andWhere({ "studio.user_id": userId });
      }

      const monthlyBookingRevenue = await monthlyBreakdownQuery;
      const totalBookingRevenue = await totalQuery;

      const formatMonthlyBreakdownList = new Map(
        monthlyBookingRevenue.map((item) => [item.month, item.total])
      );

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
          total: formatMonthlyBreakdownList.has(month)
            ? Number(formatMonthlyBreakdownList.get(month))
            : 0, // Default to '0' if no data for that month
        };
      });

      return {
        success: true,
        data: { total: Number(totalBookingRevenue[0].total), monthBreakdown: result },
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getStudioPayout({
    timeframe,
    userId,
    studioId,
  }: {
    timeframe: string;
    userId?: string;
    studioId?: string;
  }) {
    try {
      const { startDate, monthList } = await this.generateTimeframeQuery({ timeframe });

      // Get the booking revenue with month
      const monthlyBreakdownQuery = this.knex
        .select(
          this.knex.raw(
            `TO_CHAR(DATE_TRUNC('month', payout.payout_at), 'YYYY-MM') AS month, SUM(total_payout_amount) AS total`
          )
        )
        .from("payout")
        .leftJoin("studio", "payout.studio_id", "studio.id")
        .andWhere(`payout.payout_at`, ">=", startDate)
        .groupByRaw("1") // Group by truncated month
        .orderByRaw("1 DESC"); // Order from latest to oldest

      const totalQuery = this.knex
        .select(this.knex.raw("SUM(total_payout_amount) AS total"))
        .from("payout")
        .leftJoin("studio", "payout.studio_id", "studio.id")
        .andWhere(`payout.payout_at`, ">=", startDate)
        .andWhere(
          `payout.payout_at`,
          "<=",
          this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'")
        );

      if (studioId) {
        monthlyBreakdownQuery.andWhere("payout.studio_id", studioId);
        totalQuery.andWhere("payout.studio_id", studioId);
      }

      if (userId) {
        monthlyBreakdownQuery.andWhere("studio.user_id", userId);
        totalQuery.andWhere("studio.user_id", userId);
      }

      const monthlyBreakdownResult = await monthlyBreakdownQuery;

      const totalResult = await totalQuery;

      const formatMonthlyBreakdownList = new Map(
        monthlyBreakdownResult.map((item) => [item.month, item.total])
      );

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
          total: formatMonthlyBreakdownList.has(month)
            ? Number(formatMonthlyBreakdownList.get(month))
            : 0, // Default to '0' if no data for that month
        };
      });

      return {
        success: true,
        data: { total: Number(totalResult[0].total), monthBreakdown: result },
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getUpcoming5Bookings({ studioId }: { studioId?: string }) {
    try {
      const upcomingBookingQuery = this.knex
        .select(
          this.knex.raw(
            `booking.reference_no,users.name, users.image, TO_CHAR(booking.date, 'YYYY-MM-DD') AS booking_date, booking.start_time, booking.end_time`
          )
        )
        .from("booking")
        .leftJoin("users", "booking.user_id", "users.id")
        .where("booking.studio_id", studioId)
        .andWhere("booking.status", "confirmed")
        .andWhereRaw("booking.date::DATE + end_time::INTERVAL > NOW()")
        .orderByRaw("1 DESC"); // Order from latest to oldest

      const bookingList = await paginationService.paginateQuery(upcomingBookingQuery, 1, 5);

      return { success: true, data: { bookingList } };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getCountBreakdownByStudio({
    timeframe,
    dateType,
    userId,
  }: {
    timeframe: string;
    dateType: "created_at" | "booking_date";
    userId: string;
  }) {
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
        .andWhere(
          `booking.${dateTypeField}`,
          "<=",
          this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'")
        )
        .orderByRaw("2 DESC");

      return { success: true, data: bookingCountBreakdownByStudio };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getRevenueBreakdownByStudio({
    timeframe,
    dateType,
    userId,
  }: {
    timeframe: string;
    dateType: "created_at" | "booking_date";
    userId: string;
  }) {
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
        .select(
          this.knex.raw("studio.name AS studio_name, CAST(SUM(booking.price) AS INTEGER) AS total")
        )
        .from("booking")
        .groupBy("studio.name")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "studio.user_id": userId, "booking.status": "confirmed" })
        .andWhere(`booking.${dateTypeField}`, ">=", startDate)
        .andWhere(
          `booking.${dateTypeField}`,
          "<=",
          this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'")
        )
        .orderByRaw("2 DESC");

      return { success: true, data: data };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ---------------------------------- Admin Dashboard --------------------------------- */

  async getUserCount({ timeframe }: { timeframe: string }) {
    try {
      const { startDate, monthList } = await this.generateTimeframeQuery({ timeframe });

      const mainQuery = await this.knex
        .select(
          this.knex.raw(
            `TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month, COUNT(*) AS total`
          )
        )
        .from("users")
        .where({ role: "user" })
        .andWhere("created_at", ">=", startDate)
        .groupByRaw("1") // Group by truncated month
        .orderByRaw("1 DESC"); // Order from latest to oldest;

      const totalQuery = await this.knex
        .select(this.knex.raw("COUNT(users.id) AS total"))
        .from("users")
        .where({ role: "user" })
        .andWhere("created_at", ">=", startDate)
        .andWhere(
          "created_at",
          "<=",
          this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'")
        );

      const monthMap = new Map(mainQuery.map((item) => [item.month, item.total]));

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
          total: monthMap.has(month) ? Number(monthMap.get(month)) : 0, // Default to '0' if no data for that month
        };
      });

      return {
        success: true,
        data: { total: Number(totalQuery[0].total), monthBreakdown: result },
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getBookingCount({ timeframe }: { timeframe: string }) {
    try {
      const { startDate, monthList } = await this.generateTimeframeQuery({ timeframe });

      const mainQuery = await this.knex
        .select(
          this.knex.raw(
            `TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month, COUNT(*) AS total`
          )
        )
        .from("booking")
        .where({ status: "confirmed" })
        .andWhere("created_at", ">=", startDate)
        .groupByRaw("1") // Group by truncated month
        .orderByRaw("1 DESC"); // Order from latest to oldest;

      const totalQuery = await this.knex
        .select(this.knex.raw("COUNT(booking.id) AS total"))
        .from("booking")
        .where({ status: "confirmed" })
        .andWhere("created_at", ">=", startDate)
        .andWhere(
          "created_at",
          "<=",
          this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'")
        );

      const monthMap = new Map(mainQuery.map((item) => [item.month, item.total]));

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
          total: monthMap.has(month) ? Number(monthMap.get(month)) : 0, // Default to '0' if no data for that month
        };
      });

      return {
        success: true,
        data: { total: Number(totalQuery[0].total), monthBreakdown: result },
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getActiveStudioCount({ timeframe }: { timeframe: string }) {
    try {
      const { startDate, monthList } = await this.generateTimeframeQuery({ timeframe });

      const mainQuery = await this.knex
        .select(
          this.knex.raw(
            `TO_CHAR(DATE_TRUNC('month', approved_at), 'YYYY-MM') AS month, COUNT(*) AS total`
          )
        )
        .from("studio")
        .where({ status: "active" })
        .andWhere("approved_at", ">=", startDate)
        .groupByRaw("1") // Group by truncated month
        .orderByRaw("1 DESC"); // Order from latest to oldest;

      const totalQuery = await this.knex
        .select(this.knex.raw("COUNT(studio.id) AS total"))
        .from("studio")
        .where({ status: "active" })
        .andWhere("approved_at", ">=", startDate)
        .andWhere(
          "approved_at",
          "<=",
          this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'")
        );

      const monthMap = new Map(mainQuery.map((item) => [item.month, item.total]));

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
          total: monthMap.has(month) ? Number(monthMap.get(month)) : 0, // Default to '0' if no data for that month
        };
      });

      return {
        success: true,
        data: { total: Number(totalQuery[0].total), monthBreakdown: result },
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getBookingRevenue({ timeframe }: { timeframe: string }) {
    try {
      const { startDate, monthList } = await this.generateTimeframeQuery({ timeframe });

      const mainQuery = await this.knex
        .select(
          this.knex.raw(
            `TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month, SUM(booking.price) AS total`
          )
        )
        .from("booking")
        .where({ status: "confirmed" })
        .andWhere("created_at", ">=", startDate)
        .groupByRaw("1") // Group by truncated month
        .orderByRaw("1 DESC"); // Order from latest to oldest;

      const totalQuery = await this.knex
        .select(this.knex.raw("SUM(booking.price) AS total"))
        .from("booking")
        .where({ status: "confirmed" })
        .andWhere("created_at", ">=", startDate)
        .andWhere(
          "created_at",
          "<=",
          this.knex.raw("DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'")
        );

      const monthMap = new Map(mainQuery.map((item) => [item.month, item.total]));

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
          total: monthMap.has(month) ? Number(monthMap.get(month)) : 0, // Default to '0' if no data for that month
        };
      });

      return {
        success: true,
        data: { total: Number(totalQuery[0].total), monthBreakdown: result },
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getTop5BookingStudios({ timeframe }: { timeframe: string }) {
    try {
      const { startDate } = await this.generateTimeframeQuery({ timeframe });

      const mainQuery = this.knex
        .select(
          "studio.id",
          "studio.name",
          "studio.slug",
          "studio.cover_photo",
          "studio.district",
          this.knex.raw(`COALESCE(AVG(review.rating), 0) AS rating`)
        )
        .count("booking.id AS total")
        .from("booking")
        .leftJoin("review", "booking.reference_no", "review.booking_reference_no")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .groupBy("studio.id", "studio.name", "studio.slug")
        .where({ "booking.status": "confirmed" })
        .andWhere("booking.created_at", ">=", startDate)
        .orderBy("total", "desc");

      const studios = await paginationService.paginateQuery(mainQuery, 1, 5);

      return { success: true, data: studios };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const dashboardService = new DashboardService(knex);
