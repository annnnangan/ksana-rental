import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import { knex } from "@/services/knex";
import { Knex } from "knex";
import { validateStudioService } from "../studio/ValidateStudio";
import { paginationService } from "../PaginationService";

export class UserService {
  constructor(private knex: Knex) {}

  async getUserByEmail(email: string) {
    try {
      const user = (await this.knex.select("*").from("users").where({ email }))[0];

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
      const user = (await this.knex.select("*").from("users").where({ id: userId }))[0];

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
      const studio = await this.knex.select("*").from("studio").where({ user_id: userId });

      return {
        success: true,
        data: { studio_count: studio.length },
      };
    } catch {
      return null;
    }
  }

  async createNewUser(data: { name: string; email: string; hashedPassword: string }) {
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
    await this.knex("users").where({ id: userId }).update({ email_verified: new Date() });
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
          "booking.remarks",
          "booking.has_reviewed"
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

  async getUserCredit(userId: string) {
    try {
      const isUserExist = await this.getUserById(userId);

      if (!isUserExist) {
        throw new NotFoundError("此用戶");
      }

      const userCreditAmount = (
        await this.knex.select("credit_amount").from("users").where({ id: userId })
      )[0];

      return {
        success: true,
        data: userCreditAmount,
      };
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getUserAllStudioBookmark(userId: string, page = 1, limit = 5) {
    try {
      const isUserExist = await this.getUserById(userId);

      if (!isUserExist) {
        throw new NotFoundError("此用戶");
      }

      const mainQuery = this.knex
        .select(
          "studio.name",
          "studio.slug",
          "studio.cover_photo",
          "studio.logo",
          "studio.district",
          this.knex.raw(
            `CASE WHEN bookmark.user_id IS NOT NULL THEN true ELSE false END AS is_bookmarked`
          ),
          this.knex.raw(`COALESCE(AVG(review.rating), 0) AS rating`),
          this.knex.raw(
            `CAST(COUNT(DISTINCT CASE WHEN booking.status = 'confirmed' AND booking.date::DATE + booking.end_time::INTERVAL < NOW() THEN booking.id END) AS INTEGER) AS number_of_completed_booking`
          ),
          this.knex.raw(`CAST(COUNT(DISTINCT review.id) AS INTEGER) AS number_of_review`),
          this.knex.raw(`CAST(MIN(studio_price.price) AS INTEGER) AS min_price`)
        )
        .from("bookmark")
        .leftJoin("studio", "bookmark.studio_id", "studio.id")
        .leftJoin("booking", "studio.id", "booking.studio_id")
        .leftJoin("review", "booking.reference_no", "review.booking_reference_no")
        .leftJoin("studio_price", "studio.id", "studio_price.studio_id")
        .groupBy(
          "studio.id",
          "studio.name",
          "studio.slug",
          "studio.logo",
          "studio.district",
          "bookmark.user_id"
        )
        .where("bookmark.user_id", userId);

      const bookmarkList = await paginationService.paginateQuery(mainQuery, page, limit);

      const totalCount = (
        await this.knex
          .countDistinct("bookmark.studio_id as totalCount")
          .from("bookmark")
          .where("bookmark.user_id", userId)
      )[0];

      return {
        success: true,
        //@ts-expect-error it is a number
        data: { bookmarkList, totalCount: Number(totalCount.totalCount) },
      };
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async getUserIndividualStudioBookmark(userId: string, studioSlug: string) {
    try {
      const isUserExist = await this.getUserById(userId);

      if (!isUserExist) {
        throw new NotFoundError("此用戶");
      }

      const isValidStudio = await validateStudioService.validateIsStudioExistBySlug(studioSlug);

      if (!isValidStudio.success) {
        throw new NotFoundError("場地");
      }

      if (isValidStudio.success) {
        const bookmark = (
          await this.knex("bookmark")
            .select("id")
            .where({ user_id: userId, studio_id: isValidStudio.data?.studio_id })
        )[0];

        const isBookmarked = bookmark?.id ? true : false;

        return {
          success: true,
          data: { isBookmarked },
        };
      }
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async bookmarkStudio(userId: string, studioSlug: string) {
    try {
      const isUserExist = await this.getUserById(userId);

      if (!isUserExist) {
        throw new NotFoundError("此用戶");
      }

      const isValidStudio = await validateStudioService.validateIsStudioExistBySlug(studioSlug);

      if (!isValidStudio.success) {
        throw new NotFoundError("場地");
      }

      if (isValidStudio.success) {
        await this.knex("bookmark").insert({
          user_id: userId,
          studio_id: isValidStudio.data?.studio_id,
        });

        return {
          success: true,
          data: "",
        };
      }
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }

  async removeBookmarkStudio(userId: string, studioSlug: string) {
    try {
      const isUserExist = await this.getUserById(userId);

      if (!isUserExist) {
        throw new NotFoundError("此用戶");
      }

      const isValidStudio = await validateStudioService.validateIsStudioExistBySlug(studioSlug);

      if (!isValidStudio.success) {
        throw new NotFoundError("場地");
      }

      if (isValidStudio.success) {
        await this.knex("bookmark")
          .where({
            user_id: userId,
            studio_id: isValidStudio.data?.studio_id,
          })
          .del();

        return {
          success: true,
          data: "",
        };
      }
    } catch (error) {
      console.log(error);
      return handleError(error, "server") as ActionResponse;
    }
  }
}

export const userService = new UserService(knex);
