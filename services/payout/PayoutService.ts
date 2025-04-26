import handleError from "@/lib/handlers/error";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import { knex } from "@/services/knex";
import { startOfWeek } from "date-fns";
import { Knex } from "knex";
import { paginationService } from "../PaginationService";

export class PayoutService {
  constructor(private knex: Knex) {}

  /* ------------------------------- Share ------------------------------- */

  async getStudioCompletedBookingList(
    payoutStartDate: string,
    payoutEndDate: string,
    studioId: string
  ) {
    try {
      const completed_booking_list = await this.knex
        .select(
          "booking.reference_no AS booking_reference_no",
          knex.raw("TO_CHAR(booking.date, 'YYYY-MM-DD') AS booking_date"),
          "booking.price AS booking_price",
          "booking.status AS booking_status",
          "booking.is_complaint"
        )
        .from("booking")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .whereBetween("booking.date", [payoutStartDate, payoutEndDate])
        .andWhere({
          "booking.status": "confirmed",
          "booking.is_complaint": false,
          "studio.id": studioId,
        })
        .orderBy("booking.date");

      return {
        success: true,
        data: completed_booking_list,
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getStudioDisputeTransactionList(
    payoutStartDate: string,
    payoutEndDate: string,
    studioId: string
  ) {
    try {
      const dispute_booking_list = await this.knex
        .select(
          "booking.reference_no AS booking_reference_no",
          knex.raw("TO_CHAR(booking.date, 'YYYY-MM-DD') AS booking_date"),
          "booking.price AS booking_price",
          "booking.is_complaint",
          "booking_complaint.status AS complaint_status",
          knex.raw("TO_CHAR(booking_complaint.resolved_at, 'YYYY-MM-DD') AS complaint_resolved_at"),
          "booking_complaint.is_refund",
          "booking_complaint.refund_method",
          "booking_complaint.refund_amount"
        )
        .from("booking_complaint")
        .leftJoin("review", "booking_complaint.review_id", "review.id")
        .leftJoin("booking", "review.booking_reference_no", "booking.reference_no")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .whereBetween("booking_complaint.resolved_at", [payoutStartDate, payoutEndDate])
        .andWhere({
          "studio.id": studioId,
          "booking_complaint.status": "resolved",
        })
        .orderBy("booking.date");
      return {
        success: true,
        data: dispute_booking_list,
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ------------------------------- Admin Only ------------------------------- */
  async createPayoutRecord(proofImages: string[], payoutInformation: PayoutCompleteRecordType) {
    const txn = await this.knex.transaction();
    try {
      const {
        studio_id,
        method,
        account_name,
        account_number,
        payoutStartDate,
        payoutEndDate,
        total_payout_amount,
        completed_booking_amount,
        dispute_amount,
        refund_amount,
      } = payoutInformation;

      const insertedPayoutRecord = await txn("payout")
        .insert({
          studio_id,
          method,
          account_name,
          account_number,
          status: "complete",
          start_date: payoutStartDate,
          end_date: payoutEndDate,
          total_payout_amount,
          completed_booking_amount,
          dispute_amount,
          refund_amount,
        })
        .returning("id");

      await txn("payout_proof").insert(
        proofImages.map((imageUrl) => ({
          payout_id: insertedPayoutRecord[0].id,
          proof_image_url: imageUrl,
        }))
      );

      await txn.commit();

      return {
        success: true,
      };
    } catch (error) {
      await txn.rollback();

      return handleError(error, "server") as ActionResponse;
    }
  }

  async getWeeklyTotalPayout({
    payoutStartDate,
    payoutEndDate,
  }: {
    payoutStartDate: string;
    payoutEndDate: string;
  }) {
    try {
      const total_completed_booking_amount = (
        await this.knex
          .select(
            this.knex.raw(
              `COALESCE(CAST(SUM(booking.price) AS INTEGER),0) AS total_completed_booking_amount`
            )
          )
          .from("booking")
          .whereBetween("date", [payoutStartDate, payoutEndDate])
          .andWhere({ status: "confirmed", is_complaint: false })
      )[0];

      const dispute_transaction = (
        await this.knex
          .select(
            this.knex.raw(
              `COALESCE(CAST(SUM(booking.price) AS INTEGER),0) AS total_dispute_amount`
            ),
            this.knex.raw(
              `COALESCE(CAST(SUM(booking_complaint.refund_amount) AS INTEGER),0) AS total_refund_amount`
            )
          )
          .from("booking_complaint")
          .leftJoin("review", "booking_complaint.review_id", "review.id")
          .leftJoin("booking", "review.booking_reference_no", "booking.reference_no")
          .where({ "booking_complaint.status": "resolved" })
          .whereBetween("booking_complaint.resolved_at", [payoutStartDate, payoutEndDate])
      )[0];

      const total_payout_amount =
        total_completed_booking_amount.total_completed_booking_amount +
        dispute_transaction.total_dispute_amount -
        dispute_transaction.total_refund_amount;

      return {
        success: true,
        data: {
          ...total_completed_booking_amount,
          ...dispute_transaction,
          total_payout_amount,
        },
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getWeeklyStudiosPayout({
    payoutStartDate,
    payoutEndDate,
    slug,
    payoutMethod,
    status,
    orderBy,
    orderDirection,
    page = 1,
    limit = 10,
    studioId,
  }: {
    payoutStartDate: string;
    payoutEndDate: string;
    slug?: string;
    payoutMethod?: string;
    status?: string;
    orderBy?: string;
    orderDirection?: string;
    page: number;
    limit: number;
    studioId?: string;
  }) {
    try {
      let mainQuery = `
    WITH completed_booking AS (
      SELECT studio_id,
              SUM(booking.price) AS total_completed_booking_amount
      FROM booking
      WHERE date BETWEEN ? AND ?
          AND status = 'confirmed'
          AND is_complaint = false
      GROUP BY studio_id
    ),

    dispute_transaction AS (
      SELECT booking.studio_id,
              SUM(booking.price) AS total_dispute_amount,
              SUM(booking_complaint.refund_amount) AS total_refund_amount
      FROM booking_complaint
      LEFT JOIN review ON booking_complaint.review_id = review.id
      LEFT JOIN booking ON review.booking_reference_no = booking.reference_no
      WHERE booking_complaint.status = 'resolved'
          AND booking_complaint.resolved_at BETWEEN ? AND ?
      GROUP BY booking.studio_id
    ),

    payout_status AS (
      SELECT 
          id,
          studio_id, 
          status
      FROM payout
      WHERE start_date = ? and end_date = ?
    ),

    payout_proof_images AS (
     SELECT 
          payout.studio_id, 
          array_agg(payout_proof.proof_image_url) as payout_proof_image_urls
      FROM payout_proof
      LEFT JOIN payout
        ON payout_proof.payout_id = payout.id
      WHERE payout.start_date = ? and payout.end_date = ?
      GROUP BY payout.studio_id
    )

    SELECT studio.id AS studio_id,
        studio.name AS studio_name, 
        studio.slug AS studio_slug,
        studio.logo AS studio_logo,
        studio.phone AS studio_contact,
        users.email AS studio_email,
        COALESCE(payout_status.status, 'pending') AS payout_status,
        payout_proof_images.payout_proof_image_urls,
        studio_payout_detail.method AS payout_method,
        studio_payout_detail.account_number AS payout_account_number,
        studio_payout_detail.account_name AS payout_account_name,
        COALESCE(CAST(completed_booking.total_completed_booking_amount AS INTEGER), 0) AS total_completed_booking_amount,
        COALESCE(CAST(dispute_transaction.total_dispute_amount AS INTEGER), 0) AS total_dispute_amount,
        COALESCE(CAST(dispute_transaction.total_refund_amount AS INTEGER), 0) AS total_refund_amount,
        (COALESCE(CAST(completed_booking.total_completed_booking_amount AS INTEGER), 0) + 
         COALESCE(CAST(dispute_transaction.total_dispute_amount AS INTEGER), 0) - 
         COALESCE(CAST(dispute_transaction.total_refund_amount AS INTEGER), 0)
        ) AS total_payout_amount
    FROM completed_booking
        FULL OUTER JOIN dispute_transaction
        ON completed_booking.studio_id = dispute_transaction.studio_id
    LEFT JOIN studio
        ON completed_booking.studio_id = studio.id
        OR dispute_transaction.studio_id = studio.id
    LEFT JOIN studio_payout_detail
        ON completed_booking.studio_id = studio_payout_detail.studio_id
        OR dispute_transaction.studio_id = studio_payout_detail.studio_id
    LEFT JOIN payout_status
        ON completed_booking.studio_id = payout_status.studio_id
        OR dispute_transaction.studio_id = payout_status.studio_id
    LEFT JOIN users
        ON studio.user_id = users.id
    LEFT JOIN payout_proof_images
        ON completed_booking.studio_id = payout_proof_images.studio_id
        OR dispute_transaction.studio_id = payout_proof_images.studio_id
  `;

      // Parameters for SQL query
      const params = [
        payoutStartDate,
        payoutEndDate,
        payoutStartDate,
        payoutEndDate,
        payoutStartDate,
        payoutEndDate,
        payoutStartDate,
        payoutEndDate,
      ];

      // Add WHERE condition for slug if it's provided
      if (slug) {
        mainQuery += ` WHERE studio.slug = ?`;
        params.push(slug);
      }

      if (studioId) {
        mainQuery += ` WHERE studio.id = ?`;
        params.push(studioId);
      }

      // Add WHERE condition for payoutMethod if provided
      if (payoutMethod) {
        mainQuery += slug ? ` AND` : ` WHERE`;
        mainQuery += ` studio_payout_detail.method = ?`;
        params.push(payoutMethod);
      }

      // Add condition for payoutStatus if provided
      if (status) {
        mainQuery += slug || payoutMethod ? ` AND` : ` WHERE`;
        mainQuery += ` COALESCE(payout_status.status, 'pending') = ?`;
        params.push(status);
      }

      // Validate orderDirection
      const direction = orderDirection && orderDirection.toUpperCase() === "DESC" ? "DESC" : "ASC";

      // Completed Raw SQL Query
      const rawMainQuery = this.knex.raw(mainQuery, params).toString();
      const queryBuilder = this.knex.select("*").fromRaw(`(${rawMainQuery}) as subquery`);

      // Order By
      switch (orderBy) {
        case "studioId":
          queryBuilder.orderBy("studio_id", direction);
          break;
        case "studioName":
          queryBuilder.orderBy("studio_name", direction);
          break;
        case "payoutStatus":
          queryBuilder.orderBy("payout_status", direction);
          break;
        case "payoutMethod":
          queryBuilder.orderBy("payout_method", direction);
          break;
        case "payoutAmount":
          queryBuilder.orderBy("total_payout_amount", direction);
          break;
        default:
          queryBuilder.orderBy("studio_id", direction);
      }
      // Total count of all satisfied result for frontend pagination
      const totalCount = (
        await queryBuilder.clone().clearSelect().clearOrder().count("* as total_count")
      )[0];

      // Apply Pagination
      const result = await paginationService.paginateQuery(queryBuilder, page, limit);

      return {
        success: true,
        //@ts-expect-error total_count can get
        data: { totalCount: Number(totalCount?.total_count), payoutList: result },
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getAllPayoutHistory() {
    try {
      const mainQuery = `
        WITH weeks AS (
          SELECT
            generate_series(
              DATE '2024-12-02',
              date_trunc('week', now()) - interval '7 days',
              interval '1 week'
            ) AS payout_start_date
        ),
        week_ranges AS (
          SELECT
            payout_start_date,
            payout_start_date + interval '6 days' AS payout_end_date
          FROM weeks
        ),
        payout_aggregated AS (
          SELECT
            start_date AS payout_start_date,
            end_date AS payout_end_date,
            SUM(completed_booking_amount) AS total_completed_booking_amount,
            SUM(refund_amount) AS total_refund_amount,
            SUM(total_payout_amount) AS total_payout_amount
          FROM payout
          GROUP BY start_date, end_date
        )
        SELECT
          TO_CHAR(week_ranges.payout_start_date, 'YYYY-MM-DD') AS payout_start_date,
          TO_CHAR(week_ranges.payout_end_date, 'YYYY-MM-DD') AS payout_end_date,
          COALESCE(CAST(payout_aggregated.total_completed_booking_amount AS INTEGER), 0) AS total_completed_booking_amount,
          COALESCE(CAST(payout_aggregated.total_refund_amount AS INTEGER), 0) AS total_refund_amount,
          COALESCE(CAST(payout_aggregated.total_payout_amount AS INTEGER), 0) AS total_payout_amount
        FROM week_ranges
        LEFT JOIN payout_aggregated
          ON week_ranges.payout_start_date = payout_aggregated.payout_start_date
          AND week_ranges.payout_end_date = payout_aggregated.payout_end_date
        ORDER BY week_ranges.payout_start_date DESC
      `;

      const rawMainQuery = this.knex.raw(mainQuery).toString();
      const queryBuilder = this.knex.select("*").fromRaw(`(${rawMainQuery}) as subquery`);

      // Count total weeks (before pagination)
      const totalCountResult: { totalCount: string }[] = await queryBuilder
        .clone()
        .clearSelect()
        .count("* as totalCount");

      const totalCount = Number(totalCountResult[0]?.totalCount || 0);

      // Apply pagination for the actual data
      const result = await queryBuilder;

      return { success: true, data: { totalCount: totalCount, payoutList: result } };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  /* ------------------------------- Studio Only ------------------------------- */

  /* ------------------ List out all payout week of a studio ------------------ */
  async getStudioPayoutRecordList({
    studioId,
    page,
    limit,
    payoutStartDate,
  }: {
    studioId: string;
    page: number;
    limit: number;
    payoutStartDate?: string | undefined;
  }) {
    try {
      const studioApprovedDate = (
        await this.knex("studio").select(knex.raw("approved_at")).where("studio.id", studioId)
      )[0].approved_at;

      const studioApprovedWeekMonday = formatDate(
        startOfWeek(new Date(studioApprovedDate), { weekStartsOn: 1 })
      );

      let mainQuery = `
        WITH weeks AS (
          SELECT
            generate_series(
              ?,
              date_trunc('week', now()) - interval '14 days',
              interval '1 week'
            ) AS payout_start_date
        ),
        week_ranges AS (
          SELECT
            payout_start_date,
            payout_start_date + interval '6 days' AS payout_end_date
          FROM weeks
        ),
        payout_aggregated AS (
            SELECT
              start_date AS payout_start_date,
              end_date AS payout_end_date,
              SUM(completed_booking_amount) AS total_completed_booking_amount,
              SUM(refund_amount) AS total_refund_amount,
              SUM(total_payout_amount) AS total_payout_amount,
              payout_at
            FROM payout
            WHERE studio_id = ?
            GROUP BY start_date, end_date, payout_at
          )
        SELECT
          TO_CHAR(week_ranges.payout_start_date, 'YYYY-MM-DD') AS payout_start_date,
          TO_CHAR(week_ranges.payout_end_date, 'YYYY-MM-DD') AS payout_end_date,
          COALESCE(CAST(payout_aggregated.total_completed_booking_amount AS INTEGER), 0) AS total_completed_booking_amount,
          COALESCE(CAST(payout_aggregated.total_refund_amount AS INTEGER), 0) AS total_refund_amount,
          COALESCE(CAST(payout_aggregated.total_payout_amount AS INTEGER), 0) AS total_payout_amount,
          TO_CHAR(payout_aggregated.payout_at, 'YYYY-MM-DD') AS payout_at
        FROM week_ranges
        LEFT JOIN payout_aggregated
          ON week_ranges.payout_start_date = payout_aggregated.payout_start_date
          AND week_ranges.payout_end_date = payout_aggregated.payout_end_date
       `;

      const params = [studioApprovedWeekMonday, studioId];
      let totalCount;

      if (payoutStartDate) {
        mainQuery += ` WHERE week_ranges.payout_start_date = ?`;
        mainQuery += `ORDER BY week_ranges.payout_start_date DESC`;
        params.push(payoutStartDate);
        totalCount = 1;
      } else {
        mainQuery += `ORDER BY week_ranges.payout_start_date DESC`;
        const totalResult = await knex.raw(
          `
          SELECT COUNT(*) AS week_count
          FROM generate_series(
            ?,
            date_trunc('week', now()) - interval '14 days',
            interval '1 week'
          ) AS week
          `,
          [studioApprovedWeekMonday]
        );

        totalCount = totalResult.rows[0].week_count;
      }

      const rawMainQuery = this.knex.raw(mainQuery, params).toString();
      const queryBuilder = this.knex.select("*").fromRaw(`(${rawMainQuery}) as subquery`);

      const result = await paginationService.paginateQuery(queryBuilder, page, limit);

      return {
        success: true,
        data: { totalCount: totalCount, payoutList: result },
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getStudioPayoutOverviewByDate({
    studioId,
    payoutStartDate,
    payoutEndDate,
  }: {
    studioId: string;
    payoutStartDate: string;
    payoutEndDate: string;
  }) {
    try {
      const mainQuery = `
    WITH completed_booking AS (
      SELECT studio_id, SUM(booking.price) AS total_completed_booking_amount
      FROM booking
      WHERE date BETWEEN ? AND ?
          AND status = 'confirmed'
          AND is_complaint = false
          AND studio_id = ?
      GROUP BY studio_id
    ),

    dispute_transaction AS (
      SELECT booking.studio_id, SUM(booking.price) AS total_dispute_amount,
             SUM(booking_complaint.refund_amount) AS total_refund_amount
      FROM booking_complaint
      LEFT JOIN review ON booking_complaint.review_id = review.id
      LEFT JOIN booking ON review.booking_reference_no = booking.reference_no
      WHERE booking_complaint.status = 'resolved'
          AND booking_complaint.resolved_at BETWEEN ? AND ?
          AND booking.studio_id = ?
      GROUP BY booking.studio_id
    ),


     payout_record AS (
      SELECT 
          id,
          studio_id,
          status,
          payout_at,
          method,
          account_name,
          account_number
      FROM payout
      WHERE start_date = ? and end_date = ?
            AND studio_id = ?
    ),

    payout_proof_images AS (
     SELECT payout.studio_id,
          array_agg(payout_proof.proof_image_url) as payout_proof_image_urls
      FROM payout_proof
      LEFT JOIN payout
        ON payout_proof.payout_id = payout.id
      WHERE payout.start_date = ? and payout.end_date = ?
            AND payout.studio_id = ?
      GROUP BY payout.studio_id
    )

    SELECT 
        studio.id,
        TO_CHAR(payout_record.payout_at, 'YYYY-MM-DD') AS payout_at,
        payout_record.status AS payout_status,
        payout_proof_images.payout_proof_image_urls,
        COALESCE(payout_record.method ,studio_payout_detail.method) AS payout_method,
        COALESCE(payout_record.account_number ,studio_payout_detail.account_number) AS payout_account_number,
        COALESCE(payout_record.account_name, studio_payout_detail.account_name) AS payout_account_name,
        COALESCE(CAST(completed_booking.total_completed_booking_amount AS INTEGER), 0) AS total_completed_booking_amount,
        COALESCE(CAST(dispute_transaction.total_dispute_amount AS INTEGER), 0) AS total_dispute_amount,
        COALESCE(CAST(dispute_transaction.total_refund_amount AS INTEGER), 0) AS total_refund_amount,
        (COALESCE(CAST(completed_booking.total_completed_booking_amount AS INTEGER), 0) + 
         COALESCE(CAST(dispute_transaction.total_dispute_amount AS INTEGER), 0) - 
         COALESCE(CAST(dispute_transaction.total_refund_amount AS INTEGER), 0)
        ) AS total_payout_amount   
    FROM studio
    LEFT JOIN completed_booking
        ON studio.id = completed_booking.studio_id
    LEFT JOIN dispute_transaction
        ON studio.id = dispute_transaction.studio_id
    LEFT JOIN studio_payout_detail
        ON studio.id = studio_payout_detail.studio_id
    LEFT JOIN payout_record
        ON studio.id = completed_booking.studio_id
    LEFT JOIN payout_proof_images
        ON studio.id = payout_proof_images.studio_id
    WHERE studio.id = ?
  `;

      // Parameters for SQL query
      const params = [
        payoutStartDate,
        payoutEndDate,
        studioId,
        payoutStartDate,
        payoutEndDate,
        studioId,
        payoutStartDate,
        payoutEndDate,
        studioId,
        payoutStartDate,
        payoutEndDate,
        studioId,
        studioId,
      ];

      // Completed Raw SQL Query
      const rawQuery = knex.raw(mainQuery, params).toString();
      const result = await knex.select("*").fromRaw(`(${rawQuery}) as subquery`);

      return {
        success: true,
        data: result[0],
      };
    } catch (error) {
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const payoutService = new PayoutService(knex);
