"use server";

import { bookingService } from "@/services/BookingService";
import { bookingDateTime } from "./validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBooking(bookingInfo: any, userId: number) {
  try {
    const result = await bookingService.createBooking(bookingInfo, userId);
    return result;
  } catch (e) {
    return {
      success: false,
      msg: "Internal Error",
    };
  }
}
