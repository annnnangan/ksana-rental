import { knex } from "@/services/knex";
import { Knex } from "knex";
import { validateStudioService } from "./ValidateStudio";

export class PayoutService {
  constructor(private knex: Knex) {}

  async getTotalPayoutAmount(payoutStartDate: string, payoutEndDate: string) {
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
        .leftJoin("booking", "booking_complaint.booking_id", "booking.id")
        .where({ "booking_complaint.status": "resolved" })
        .whereBetween("booking_complaint.resolved_at", [
          payoutStartDate,
          payoutEndDate,
        ])
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
  }

  //If slug is provided, it will return data from specific studio
  //else, it will return data from all studios
  async getStudioPayoutOverview(
    payoutStartDate: string,
    payoutEndDate: string,
    slug?: string
  ) {
    if (slug) {
      // Validate if the studio exists by slug
      const validationResponse =
        await validateStudioService.validateIsStudioExistBySlug(slug);

      if (!validationResponse.success) {
        // Return error immediately if the studio doesn't exist
        return {
          success: false,
          error: validationResponse.error,
        };
      }
    }

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
      LEFT JOIN booking ON booking_complaint.booking_id = booking.id
      WHERE booking_complaint.status = 'resolved'
          AND booking_complaint.resolved_at BETWEEN ? AND ?
      GROUP BY booking.studio_id
    ),

    specific_payout AS (
      SELECT 
          studio_id, 
          status
      FROM payout
      WHERE start_date = ? and end_date = ?
    )

    SELECT studio.id AS studio_id ,
        studio.name AS studio_name, 
        studio.slug AS studio_slug,
        COALESCE(specific_payout.status, 'pending') AS payout_status,
        studio_payout_detail.method AS payout_method,
        studio_payout_detail.account_number AS payout_account_number,
        studio_payout_detail.account_name AS payout_account_name,
        COALESCE(CAST(completed_booking.total_completed_booking_amount AS INTEGER), 0) AS total_completed_booking_amount,
        COALESCE(CAST(dispute_transaction.total_dispute_amount AS INTEGER), 0) AS total_dispute_amount,
        COALESCE(CAST(dispute_transaction.total_refund_amount AS INTEGER), 0) AS total_refund_amount
    FROM completed_booking
        FULL OUTER JOIN dispute_transaction
        ON completed_booking.studio_id = dispute_transaction.studio_id
    LEFT JOIN studio
        ON completed_booking.studio_id = studio.id
        OR dispute_transaction.studio_id = studio.id
    LEFT JOIN studio_payout_detail
        ON completed_booking.studio_id = studio_payout_detail.studio_id
        OR dispute_transaction.studio_id = studio_payout_detail.studio_id
    LEFT JOIN specific_payout
        ON completed_booking.studio_id = specific_payout.studio_id
        OR dispute_transaction.studio_id = specific_payout.studio_id
  `;

    // Parameters for SQL query
    const params = [
      payoutStartDate,
      payoutEndDate,
      payoutStartDate,
      payoutEndDate,
      payoutStartDate,
      payoutEndDate,
    ];

    // Add WHERE condition for slug if it's provided
    if (slug) {
      mainQuery += ` WHERE studio.slug = ?`; // Add WHERE condition for slug
      params.push(slug); // Push slug to params
    }

    // Execute the query
    const result = await this.knex.raw(mainQuery, params);

    // Calculate total_payout_amount for each studio
    const payoutData = result.rows.map(
      (studio: {
        total_completed_booking_amount: number;
        total_dispute_amount: number;
        total_refund_amount: number;
      }) => {
        const {
          total_completed_booking_amount,
          total_dispute_amount,
          total_refund_amount,
        } = studio;
        const total_payout_amount =
          total_completed_booking_amount +
          total_dispute_amount -
          total_refund_amount;

        return {
          ...studio,
          total_payout_amount,
        };
      }
    );

    return {
      success: true,
      data: payoutData,
    };
  }
}

export const payoutService = new PayoutService(knex);
