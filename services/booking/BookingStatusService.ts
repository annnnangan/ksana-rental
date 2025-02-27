import { knex } from "@/services/knex";
import { Knex } from "knex";

export class BookingStatusService {
  constructor(private knex: Knex) {}

  bookingStatusCondition(query: Knex.QueryBuilder, bookingStatus: string) {
    switch (bookingStatus) {
      case "confirmed":
        return query.andWhere("booking.status", "confirmed").andWhereRaw("booking.date::DATE + end_time::INTERVAL > NOW()");

      case "pending-for-payment":
        return query.andWhere("booking.status", "pending for payment").andWhereRaw("booking.created_at >= NOW() - INTERVAL '15 minutes'");

      case "completed":
        return query.andWhere("booking.status", "confirmed").andWhereRaw("booking.date::DATE + end_time::INTERVAL < NOW()");

      case "canceled-and-expired":
        return query.where(function () {
          this.where("booking.status", "canceled").orWhere(function () {
            this.where("booking.status", "pending for payment").andWhereRaw("booking.created_at < NOW() - INTERVAL '15 minutes'");
          });
        });

      default:
        return query; // If no filter is applied, return the unmodified query
    }
  }

  applyBookingStatusFilter(query: Knex.QueryBuilder, bookingType: string) {
    return bookingStatusService.bookingStatusCondition(query, bookingType);
  }
}

export const bookingStatusService = new BookingStatusService(knex);
