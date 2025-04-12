import { ByMonthBarChart } from "@/components/custom-components/charts/ByMonthBarChart";
import { ByMonthLineChart } from "@/components/custom-components/charts/ByMonthLineChart";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import { dashboardService } from "@/services/Dashboard/DashboardService";

interface Props {
  searchParams: { dateRange: string };
}

const page = async (props: Props) => {
  const user = await sessionUser();
  const searchParams = await props.searchParams;
  const selectedDateRange = searchParams["dateRange"] || "last-6-months";
  const result = await dashboardService.getStudioExpectedRevenue({ timeframe: selectedDateRange, dateType: "booking_date", userId: user?.id! });
  const data: { total: number; monthBreakdown: { month: string; total: number }[] } = result.data!;

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-3xl md:text-4xl font-bold">HKD ${data.total}</p>
      </div>
      <div>{result.success && <ByMonthLineChart chartData={data?.monthBreakdown} label={"預期收入"} />}</div>
    </>
  );
};

export default page;
