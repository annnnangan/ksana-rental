import { ByMonthBarChart } from "@/components/custom-components/charts/ByMonthBarChart";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import { dashboardService } from "@/services/Dashboard/DashboardService";

interface Props {
  searchParams: { dateRange: string };
}

const page = async (props: Props) => {
  const user = await sessionUser();
  const searchParams = await props.searchParams;
  const selectedDateRange = searchParams["dateRange"] || "last-6-months";
  const result = await dashboardService.getStudioBookingCount({
    timeframe: selectedDateRange,
    dateType: "booking_date",
    userId: user?.id!,
  });
  const data: { totalCount: number; monthBreakdown: { month: string; total: number }[] } =
    result.data!;

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-3xl md:text-4xl font-bold">{data.totalCount}</p>
      </div>
      <div>
        {result.success && <ByMonthBarChart chartData={data?.monthBreakdown} label={"預約數目"} />}
      </div>
    </>
  );
};

export default page;
