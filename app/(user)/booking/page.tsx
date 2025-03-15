import BookingCalendar from "@/components/custom-components/booking/BookingCalendar";
import SectionTitle from "@/components/custom-components/studio-details/SectionTitle";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { auth } from "@/lib/next-auth-config/auth";
import { studioService } from "@/services/studio/StudioService";

import React from "react";

const BookingPage = async ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  const session = await auth();

  if (!session?.user) {
    return <ToastMessageWithRedirect type={"error"} message={"請先登入後才可預約。"} redirectPath={"/auth/login"} />;
  }

  const studioSlug = (await searchParams)?.slug;

  if (!studioSlug) {
    return <ToastMessageWithRedirect type={"error"} message={"請先選擇場地後才可預約。"} redirectPath={"/explore-studios"} />;
  }

  let bookingStudioBasicInfo;
  // @ts-ignore
  const bookingStudioBasicInfoResult = await studioService.getStudioBasicInfo({ slug: studioSlug });
  console.log("hello", bookingStudioBasicInfoResult);
  if (bookingStudioBasicInfoResult.success) {
    bookingStudioBasicInfo = bookingStudioBasicInfoResult.data[0];
  } else {
    // @ts-ignore
    return <ToastMessageWithRedirect type={"error"} message={bookingStudioBasicInfoResult?.error.message} redirectPath={"/"} />;
  }

  return (
    <>
      <SectionTitle>選擇預約日期及時間</SectionTitle>
      <BookingCalendar bookingStudioBasicInfo={bookingStudioBasicInfo} />
    </>
  );
};

export default BookingPage;
