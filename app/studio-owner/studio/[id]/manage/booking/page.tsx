import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth-config/auth";
import { bookingService } from "@/services/booking/BookingService";
import ResponsiveTab from "@/components/custom-components/layout/ResponsiveTab";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import BookingTable from "@/components/custom-components/manage-bookings/studio/BookingTable";

type searchParams = Promise<{ tab: string }>;
type params = Promise<{ id: string }>;

const tabListMap = [
  { name: "即將開始", query: "confirmed" },
  { name: "已完成", query: "completed" },
  { name: "已取消/已失效", query: "canceled-and-expired" },
];

const BookingPage = async ({
  searchParams,
  params,
}: {
  searchParams: searchParams;
  params: params;
}) => {
  const { tab } = await searchParams;
  const { id: studioId } = await params;
  const bookingStatus = tab || "confirmed";

  const allowedStatuses = ["confirmed", "pending-for-payment", "completed", "canceled-and-expired"];

  if (!allowedStatuses.includes(bookingStatus)) {
    redirect(`/studio-owner/studio/${studioId}/manage/booking?tab=confirmed`);
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
    (
      await bookingService.getBookingListByRoleAndStatus({
        studioId: studioId,
        bookingType: bookingStatus,
      })
    )?.data || [];

  return (
    <div>
      <SectionTitle textColor="text-primary">所有預約</SectionTitle>

      <ResponsiveTab activeTab={bookingStatus} tabListMap={tabListMap} />

      <BookingTable data={bookingRecords} />
    </div>
  );
};

export default BookingPage;
