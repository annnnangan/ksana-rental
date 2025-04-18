import ButtonLink from "@/components/custom-components/common/buttons/ButtonLink";
import { auth } from "@/lib/next-auth-config/auth";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import { Bell, Building2, Calendar, MapPinHouse } from "lucide-react";
import Image from "next/image";
import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import { bookingService } from "@/services/booking/BookingService";
import { GENERAL_ERROR_MESSAGE } from "@/lib/constants/error-message";
import { convertTimeToString } from "@/lib/utils/date-time/format-time-utils";

const BookingSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // Check
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

  const bookingReference = (await searchParams)?.booking;

  if (!bookingReference) {
    return <ToastMessageWithRedirect type={"error"} message={"沒有此預約"} redirectPath={"/"} />;
  }

  let bookingRecordResponse = await bookingService.getBookingInfoForBookingSuccessPage(
    bookingReference as string,
    session.user.id
  );
  if (!bookingRecordResponse.success) {
    // @ts-ignore
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={bookingRecordResponse?.error?.message || GENERAL_ERROR_MESSAGE}
        redirectPath={"/"}
      />
    );
  }

  let bookingRecord = bookingRecordResponse.success && bookingRecordResponse.data;

  return (
    <div className="flex flex-col items-center">
      <Image src="/yoga-cartoon/scale-yoga-pose.png" alt="yoga image" width="300" height="300" />

      <h1 className="text-lg font-bold mb-2">預約成功</h1>
      <div className="bg-gray-100 p-5 rounded-2xl w-full md:w-[400px] mb-2">
        <ul className="list-none space-y-3">
          <li className="md:flex md:justify-between">
            <p className="flex items-center gap-1 text-gray-500">
              <Calendar size={18} />
              預約日期時間:{" "}
            </p>
            <p>
              {formatDate(new Date(bookingRecord.date))}{" "}
              {convertTimeToString(bookingRecord.start_time)} -{" "}
              {convertTimeToString(bookingRecord.end_time)}
            </p>
          </li>
          <li className="md:flex md:justify-between">
            <p className="flex items-center gap-1 text-gray-500">
              <Building2 size={18} />
              場地名稱:
            </p>
            <p>{bookingRecord.studio_name}</p>
          </li>
          <li className="md:flex md:justify-between">
            <p className="flex items-center gap-1 text-gray-500">
              <MapPinHouse size={18} />
              場地地址:
            </p>
            <p>{bookingRecord.studio_address}</p>
          </li>
        </ul>
      </div>

      <div className="border px-5 py-3 rounded-lg">
        <p className="flex items-center gap-1 text-sm">
          <Bell size={18} />
          你可於預約前2小時，到我的預約頁面中查看場地密碼
        </p>
      </div>

      <ButtonLink href="/">返回主頁</ButtonLink>
    </div>
  );
};

export default BookingSuccessPage;
