import BookingCalendar from "@/components/custom-components/booking/BookingCalendar";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { auth } from "@/lib/next-auth-config/auth";
import React from "react";

const BookingPage = async () => {
  //TODO check if any credit available
  //TODO get studio name and icon and district
  //TODO Check if studio exist

  const session = await auth();

  if (!session?.user) {
    return <ToastMessageWithRedirect type={"error"} message={"請先登入後才可預約。"} redirectPath={"/auth/login"} />;
  }
  return <BookingCalendar />;
};

export default BookingPage;
