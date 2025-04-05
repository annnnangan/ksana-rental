import { knex } from "@/services/knex";
import { Knex } from "knex";
import { validateStudioService } from "../studio/ValidateStudio";
import { PayoutMethod, PayoutStatus } from "../model";
import { studioService } from "../studio/StudioService";
import handleError from "@/lib/handlers/error";
import { paginationService } from "../PaginationService";

export class PayoutService {
  constructor(private knex: Knex) {}

  /**
   * @returns total_payout_amount = total_completed_booking_amount + total_dispute_amount - total_refund_amount
   */
  async getWeeklyTotalPayout({ payoutStartDate, payoutEndDate }: { payoutStartDate: string; payoutEndDate: string }) {
    try {
      const total_completed_booking_amount = (
        await this.knex
          .select(this.knex.raw(`COALESCE(CAST(SUM(booking.price) AS INTEGER),0) AS total_completed_booking_amount`))
          .from("booking")
          .whereBetween("date", [payoutStartDate, payoutEndDate])
          .andWhere({ status: "confirmed", is_complaint: false })
      )[0];

      const dispute_transaction = (
        await this.knex
          .select(
            this.knex.raw(`COALESCE(CAST(SUM(booking.price) AS INTEGER),0) AS total_dispute_amount`),
            this.knex.raw(`COALESCE(CAST(SUM(booking_complaint.refund_amount) AS INTEGER),0) AS total_refund_amount`)
          )
          .from("booking_complaint")
          .leftJoin("review", "booking_complaint.review_id", "review.id")
          .leftJoin("booking", "review.booking_reference_no", "booking.reference_no")
          .where({ "booking_complaint.status": "resolved" })
          .whereBetween("booking_complaint.resolved_at", [payoutStartDate, payoutEndDate])
      )[0];

      const total_payout_amount = total_completed_booking_amount.total_completed_booking_amount + dispute_transaction.total_dispute_amount - dispute_transaction.total_refund_amount;

      return {
        success: true,
        data: {
          ...total_completed_booking_amount,
          ...dispute_transaction,
          total_payout_amount,
        },
      };
    } catch (error) {
      console.dir(error);
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
  }: {
    payoutStartDate: string;
    payoutEndDate: string;
    slug?: string;
    payoutMethod?: string;
    status?: string;
    orderBy: string;
    orderDirection: string;
    page: number;
    limit: number;
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
      const params = [payoutStartDate, payoutEndDate, payoutStartDate, payoutEndDate, payoutStartDate, payoutEndDate, payoutStartDate, payoutEndDate];

      // Add WHERE condition for slug if it's provided
      if (slug) {
        mainQuery += ` WHERE studio.slug = ?`;
        params.push(slug);
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

      // Apply Pagination
      const result = await paginationService.paginateQuery(queryBuilder, page, limit);

      // Total count of all satisfied result for frontend pagination
      //@ts-ignore
      const totalCount = (await queryBuilder.clone().clearSelect().clearOrder().count("* as totalCount"))[0]?.totalCount || 0;

      return {
        success: true,
        data: { totalCount: Number(totalCount), payoutList: result },
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getStudioCompletedBookingList(payoutStartDate: string, payoutEndDate: string, slug: string) {
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
        "studio.slug": slug,
      })
      .orderBy("booking.date");
    return {
      success: true,
      data: completed_booking_list,
    };
  }

  async getStudioDisputeTransactionList(payoutStartDate: string, payoutEndDate: string, slug: string) {
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
      .leftJoin("booking", "booking_complaint.booking_id", "booking.id")
      .leftJoin("studio", "booking.studio_id", "studio.id")
      .whereBetween("booking_complaint.resolved_at", [payoutStartDate, payoutEndDate])
      .andWhere({
        "studio.slug": slug,
        "booking_complaint.status": "resolved",
      })
      .orderBy("booking.date");
    return {
      success: true,
      data: dispute_booking_list,
    };
  }

  async createPayoutRecord(proofImages: string[], payoutInformation: PayoutCompleteRecordType) {
    const txn = await this.knex.transaction();
    try {
      const { studio_id, method, account_name, account_number, payoutStartDate, payoutEndDate, total_payout_amount, completed_booking_amount, dispute_amount, refund_amount } = payoutInformation;

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
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const payoutService = new PayoutService(knex);
