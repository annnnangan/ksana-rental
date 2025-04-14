import BookingCalendar from "@/components/custom-components/booking/BookingCalendar";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import { auth } from "@/lib/next-auth-config/auth";
import { studioService } from "@/services/studio/StudioService";
import { userService } from "@/services/user/UserService";

import React from "react";

const BookingPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const session = await auth();

  if (!session?.user) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={"請先登入後才可預約。"}
        redirectPath={"/auth/login"}
      />
    );
  }

  const studioSlug = (await searchParams)?.slug;

  if (!studioSlug) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={"請先選擇場地後才可預約。"}
        redirectPath={"/explore-studios"}
      />
    );
  }

  let bookingStudioBasicInfo;
  // @ts-ignore
  const bookingStudioBasicInfoResult = await studioService.getStudioBasicInfo({ slug: studioSlug });

  if (bookingStudioBasicInfoResult.success) {
    bookingStudioBasicInfo = bookingStudioBasicInfoResult.data?.studios[0];
  } else {
    // @ts-ignore
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={bookingStudioBasicInfoResult?.error.message}
        redirectPath={"/"}
      />
    );
  }

  const userAvailableCredit =
    (await userService.getUserCredit(session?.user?.id)).data.credit_amount || 0;

  return (
    <>
      <SectionTitle>選擇預約日期及時間</SectionTitle>
      <BookingCalendar
        bookingStudioBasicInfo={bookingStudioBasicInfo}
        availableCredit={userAvailableCredit}
      />
    </>
  );
};

export default BookingPage;
