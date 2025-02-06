import handleError from "@/lib/handlers/error";
import { knex } from "@/services/knex";
import { Knex } from "knex";

export class UserService {
  constructor(private knex: Knex) {}

  async getUserByEmail(email: string) {
    try {
      const user = (
        await this.knex.select("*").from("users").where({ email })
      )[0];

      return {
        success: true,
        data: user,
      };
    } catch {
      return null;
    }
  }

  async getUserById(userId: string) {
    try {
      const user = (
        await this.knex.select("*").from("users").where({ id: userId })
      )[0];

      return {
        success: true,
        data: user,
      };
    } catch {
      return null;
    }
  }

  async countStudioByUserId(userId: string) {
    try {
      const studio = await this.knex
        .select("*")
        .from("studio")
        .where({ user_id: userId });

      return {
        success: true,
        data: { studio_count: studio.length },
      };
    } catch {
      return null;
    }
  }

  async createNewUser(data: {
    name: string;
    email: string;
    hashedPassword: string;
  }) {
    const { name, email, hashedPassword } = data;

    const insertedData = await this.knex("users")
      .insert({
        name,
        email,
        password: hashedPassword,
      })
      .returning("id");

    return {
      success: true,
      data: insertedData[0].id,
    };
  }

  async updateEmailVerifiedTimestamp(userId: string) {
    await this.knex("users")
      .where({ id: userId })
      .update({ email_verified: new Date() });
  }

  async getBookingsByUserId(userId: string, bookingType: string) {
    try {
      let query = this.knex
        .select(
          "studio.id as studio_id",
          "studio.logo as studio_logo",
          "studio.slug as studio_slug",
          "studio.name as studio_name",
          "studio.address as studio_address",
          "studio.phone as studio_contact",
          "booking.reference_no as booking_reference_no",
          "booking.price",
          "booking.actual_payment",
          "booking.credit_redeem_payment",
          "booking.date as booking_date",
          "booking.start_time",
          "booking.end_time",
          "booking.remarks"
        )
        .from("booking")
        .leftJoin("studio", "booking.studio_id", "studio.id")
        .where({ "booking.user_id": userId })
        .orderBy("booking.date", "desc");

      switch (bookingType) {
        case "confirmed":
          query = query
            .andWhere("booking.status", "confirmed")
            .andWhereRaw("booking.date::DATE + end_time::INTERVAL > NOW()");
          break;

        case "pending-for-payment":
          query = query
            .andWhere("booking.status", "pending for payment")
            .andWhereRaw("booking.created_at >= NOW() - INTERVAL '15 minutes'");
          break;

        case "completed":
          query = query
            .andWhere("booking.status", "confirmed")
            .andWhereRaw("booking.date::DATE + end_time::INTERVAL < NOW()");
          break;

        case "canceled-and-expired":
          query = query.where(function () {
            this.where("booking.status", "canceled").orWhere(function () {
              this.where("booking.status", "pending for payment").andWhereRaw(
                "booking.created_at < NOW() - INTERVAL '15 minutes'"
              );
            });
          });
          break;
      }

      const bookingRecords = await query;

      const bookingsRecordsWithStatus = bookingRecords.map((booking) => ({
        ...booking,
        status: bookingType, // Add the status based on bookingType
      }));

      return {
        success: true,
        data: bookingsRecordsWithStatus,
      };
    } catch (error) {
      console.dir(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const userService = new UserService(knex);
