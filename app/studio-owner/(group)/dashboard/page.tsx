import { sessionUser } from "@/lib/next-auth-config/session-user";
import { dashboardService } from "@/services/Dashboard/DashboardService";

import { Frown } from "lucide-react";
import { ByMonthLineChart } from "@/components/custom-components/charts/ByMonthLineChart";
import FeatureCardSwiper from "@/components/custom-components/homepage/FeatureCardSwiper";
import SectionFallback from "@/components/custom-components/SectionFallback";
import ActiveStudioSwiper from "@/components/custom-components/studio-owner/dashboard/ActiveStudioSwiper";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import ReportDateRangePicker from "@/components/custom-components/filters-and-sort/ReportDateRangePicker";

interface Props {
  searchParams: { dateRange: string };
}

const DashboardPage = async (props: Props) => {
  const user = await sessionUser();
  const searchParams = await props.searchParams;
  const selectedDateRange = searchParams["dateRange"] || "last-6-months";

  console.log(selectedDateRange);

  if (!user) {
    <ToastMessageWithRedirect type={"error"} message={"請先登入。"} redirectPath={"/"} />;
  }
  //studio totalCount > 1 - estimate revenue breakdown by studio

  //studio totalCount = 0 -> create your first studio

  //latest studio in draft -> progress bar
  const featured_studios = [
    {
      studio_slug: "soul-yogi-studio",
      studio_name: "Soul Yogi Studio",
      rating: "5",
      cover_photo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-cover.jpg",
    },
    {
      studio_slug: "zen-oasis",
      studio_name: "Zen Oasis",
      rating: "5",
      cover_photo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/zen-oasis/zen-oasis-cover.jpg",
    },
    {
      studio_slug: "larana-yoga",
      studio_name: "Larana Yoga",
      rating: "5",
      cover_photo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/larana/larana-cover.jpg",
    },
  ];

  const monthlyBookingAmountResult = await dashboardService.getMonthlyConfirmedBookingAmountBreakdown(selectedDateRange, user?.id!);

  //@ts-expect-error will not return undefined
  const monthlyBookingAmountData: { totalAmount: number; monthBreakdown: { month: string; total: number }[] } = monthlyBookingAmountResult.success && monthlyBookingAmountResult.data;

  return (
    <>
      <h1 className="text-primary text-2xl font-bold mb-5">儀表板</h1>
      {/* <Card className="border-gray-300 md:col-span-2">
          <CardHeader className="pb-1 space-y-1 md:space-y-1.5">
            <CardTitle className="text-sm md:text-base text-primary">正在營運之場地</CardTitle>
            <CardDescription className="text-xs md:text-sm "></CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1">
            <ActiveStudioSwiper slideItems={featured_studios} />
          </CardContent>
        </Card> */}
      <ReportDateRangePicker parentPagePath={"/studio-owner/dashboard"} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="border-gray-300">
          <CardHeader className="pb-1 space-y-1 md:space-y-1.5">
            <CardTitle className="text-sm md:text-base text-primary">所有預約 *</CardTitle>
            <CardDescription className="text-xs md:text-sm ">* 只包括即將開始和已完成之預約。</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-3xl md:text-4xl font-bold">{monthlyBookingAmountData.totalAmount}</p>
            </div>
            <div>
              {monthlyBookingAmountResult.success ? (
                <ByMonthLineChart chartData={monthlyBookingAmountData?.monthBreakdown} label={"預約數目"} />
              ) : (
                <SectionFallback icon={Frown} fallbackText={"無法取得資料"} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-300">
          <CardHeader className="pb-1 space-y-1 md:space-y-1.5">
            <CardTitle className="text-sm md:text-base text-primary">預計收入</CardTitle>
            <CardDescription className="text-xs md:text-sm ">營運之今所有預約收入，不包括取消、失效、有爭議未完成處理訂單。</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-3xl md:text-4xl font-bold">HKD $50</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DashboardPage;
