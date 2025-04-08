"use client";
import { ByMonthBarChart } from "@/components/custom-components/charts/ByMonthBarChart";
import { ByMonthLineChart } from "@/components/custom-components/charts/ByMonthLineChart";
import ScoreCard from "@/components/custom-components/charts/ScoreCard";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import ReportDateRangePicker from "@/components/custom-components/filters-and-sort/ReportDateRangePicker";
import SectionFallback from "@/components/custom-components/SectionFallback";
import StudioMiniCard from "@/components/custom-components/studio/StudioMiniCard";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Skeleton } from "@/components/shadcn/skeleton";
import useAdminDashboard from "@/hooks/react-query/useAdminDashboard";
import { useSessionUser } from "@/hooks/use-session-user";
import { House } from "lucide-react";

import { useSearchParams } from "next/navigation";

const page = () => {
  const user = useSessionUser();
  if (user?.role !== "admin") {
    return <ToastMessageWithRedirect type={"error"} message={"你沒有此權限。"} redirectPath={"/"} />;
  }
  const searchParams = useSearchParams();
  const dateRangeParam = searchParams.get("dateRange") || "last-6-months";
  const { data, isLoading, isError } = useAdminDashboard(dateRangeParam);

  return (
    <div>
      <SectionTitle textColor="text-primary">Dashboard</SectionTitle>
      <ReportDateRangePicker parentPagePath={"/admin/dashboard"} />

      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-5">
        <ScoreCard metricName={"Users"} value={data?.userCount?.total} toolTipContent={<p>Website registration total amount</p>} isLoading={isLoading} />
        <ScoreCard metricName={"Bookings"} value={data?.bookingCount?.total} toolTipContent={<p>Booking total amount</p>} isLoading={isLoading} />
        <ScoreCard metricName={"Studios"} value={data?.activeStudioCount?.total} toolTipContent={<p>Active studio total amount</p>} isLoading={isLoading} />
        <ScoreCard metricName={"Booking Revenue"} value={data?.bookingRevenue?.total} toolTipContent={<p>Booking revenue total amount</p>} isLoading={isLoading} isRevenue={true} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="border-gray-200">
          <CardHeader className="pb-1 px-3 pt-3 space-y-1 md:space-y-1.5 flex flex-row items-start">
            <CardTitle className="text-sm md:text-base text-primary">Users</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1 pb-3 px-3 space-y-5">
            <ByMonthBarChart chartData={data?.userCount?.monthBreakdown} label={"Users"} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-1 px-3 pt-3 space-y-1 md:space-y-1.5 flex flex-row items-start">
            <CardTitle className="text-sm md:text-base text-primary">Bookings</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1 pb-3 px-3 space-y-5">
            <ByMonthLineChart chartData={data?.bookingCount?.monthBreakdown} label={"Bookings"} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Card className="border-gray-200 h-fit">
          <CardHeader className="pb-1 px-3 pt-3 space-y-1 md:space-y-1.5 flex flex-row items-start">
            <CardTitle className="text-sm md:text-base text-primary">Top 5 Booking Studios</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1 px-3 space-y-5">
            {isLoading &&
              Array.from({ length: 5 }, (_, index) => (
                <div key={index}>
                  <Skeleton className="h-20 w-full mt-2" />
                </div>
              ))}

            {data?.top5BookingStudio.length > 0 &&
              data?.top5BookingStudio?.map((studio: { id: string; name: string; slug: string; cover_photo: string; rating: string; total: string }, index: number) => (
                <div className="flex flex-col" key={studio.id}>
                  <div className="flex gap-2">
                    <p className="text-xl font-bold">{index + 1}</p>
                    <div className="w-[250px]">
                      <StudioMiniCard studio_name={studio.name} studio_slug={studio.slug} cover_image={studio.cover_photo} rating={studio.rating} />
                    </div>

                    <p className="text-sm">預約數量: {studio.total}</p>
                  </div>
                </div>
              ))}

            {data?.top5BookingStudio.length === 0 && <SectionFallback icon={House} fallbackText={"此時間段沒有預約"} textSize="text-sm" />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
