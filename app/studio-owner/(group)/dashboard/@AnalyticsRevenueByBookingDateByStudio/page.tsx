import { ByStudioPieChart } from "@/components/custom-components/charts/ByStudioPieChart";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import { dashboardService } from "@/services/Dashboard/DashboardService";

interface Props {
  searchParams: { dateRange: string };
}

const page = async (props: Props) => {
  const user = await sessionUser();
  const searchParams = await props.searchParams;
  const selectedDateRange = searchParams["dateRange"] || "last-6-months";
  const result = await dashboardService.getRevenueBreakdownByStudio({ timeframe: selectedDateRange, dateType: "booking_date", userId: user?.id! });
  const data: { studio_name: string; total: number }[] = result.data!;

  return (
    <>
      <div>{result.success && <ByStudioPieChart chartData={data} />}</div>
    </>
  );
};

export default page;
