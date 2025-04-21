import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";

import BookingRecordCard from "@/components/custom-components/manage-bookings/BookingRecordCard";
import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import { auth } from "@/lib/next-auth-config/auth";
import { userService } from "@/services/user/UserService";
import Link from "next/link";
import { redirect } from "next/navigation";
import SectionFallback from "@/components/custom-components/common/SectionFallback";
import { CalendarClock } from "lucide-react";

interface SearchQuery {
  tab: string;
}

interface Props {
  searchParams: SearchQuery;
}

export const metadata = {
  title: "我的預約",
};

const ManageBookingsPage = async (props: Props) => {
  const searchParams = await props.searchParams;

  const bookingStatus = searchParams["tab"];

  const allowedStatuses = ["confirmed", "completed", "canceled-and-expired"];

  if (!allowedStatuses.includes(bookingStatus)) {
    redirect("/manage-bookings?tab=confirmed");
  }

  const session = await auth();
  if (!session?.user.id)
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={"登入後才可查詢預約"}
        redirectPath={"/auth/login"}
      />
    );

  const bookingRecords =
    (await userService.getBookingsByUserId(session?.user.id, bookingStatus))?.data || [];

  return (
    <div>
      <h1 className="text-primary text-2xl font-bold mb-5">我的預約</h1>
      <Tabs defaultValue={bookingStatus}>
        <TabsList className="bg-primary gap-2 overflow-x-auto mb-5">
          <TabsTrigger value="confirmed" className="text-white p-0">
            <Link
              href={{
                query: { tab: "confirmed" },
              }}
              className="p-2"
            >
              已預約
            </Link>
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-white p-0">
            <Link
              href={{
                query: { tab: "completed" },
              }}
              className="p-2"
            >
              已完成
            </Link>
          </TabsTrigger>
          <TabsTrigger value="canceled-and-expired" className="text-white p-0">
            <Link
              href={{
                query: { tab: "canceled-and-expired" },
              }}
              className="p-2"
            >
              已取消 / 已失效
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {bookingRecords.length == 0 && (
        <div className="mt-5">
          <SectionFallback icon={CalendarClock} fallbackText={"未有記錄"} />
        </div>
      )}
      {bookingRecords.length > 0 &&
        bookingRecords.map((item) => (
          <BookingRecordCard bookingRecord={item} key={item.booking_reference_no} />
        ))}
    </div>
  );
};

export default ManageBookingsPage;
