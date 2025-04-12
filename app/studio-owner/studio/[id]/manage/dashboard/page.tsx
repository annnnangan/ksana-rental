"use client";
import AvatarWithFallback from "@/components/custom-components/AvatarWithFallback";
import { ByMonthLineChart } from "@/components/custom-components/charts/ByMonthLineChart";
import ChartCard from "@/components/custom-components/charts/ChartCard";
import ScoreCard from "@/components/custom-components/charts/ScoreCard";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import ReportDateRangePicker from "@/components/custom-components/filters-and-sort/ReportDateRangePicker";
import SectionFallback from "@/components/custom-components/SectionFallback";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Skeleton } from "@/components/shadcn/skeleton";
import useStudioDashboard from "@/hooks/react-query/useStudioDashboard";
import { convertTimeToString } from "@/lib/utils/date-time/format-time-utils";
import { CalendarCheck2, CircleX, Clock5 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams, useSearchParams } from "next/navigation";

const BookingAmountToolTipContent = () => {
  return (
    <div className="text-xs md:text-sm ">
      <p>計算方式</p>
      <p>根據「預約完成日期」，統計符合以下條件的預約數量：</p>
      <p>1. 即將開始的預約</p>
      <p>2. 已完成的預約</p>
    </div>
  );
};

const ExpectedRevenueToolTipContent = () => {
  return (
    <div className="text-xs md:text-sm ">
      <p>計算方式</p>
      <p>根據「預約完成日期」，統計符合以下條件的預計收入：</p>
      <p>1. 即將開始的預約</p>
      <p>2. 已完成的預約</p>
      <p>如有已/未處理爭議付款，仍已原本預約費用計算在內。</p>
    </div>
  );
};

const ActualRevenueToolTipContent = () => {
  return (
    <div className="text-xs md:text-sm ">
      <p>計算方式：</p>
      <p>根據「結算完成日期」，Ksana實際已給付場地之總​收入。</p>
    </div>
  );
};

const StudioPanelDashboardPage = () => {
  const { status: userStatus } = useSession();

  const searchParams = useSearchParams();
  const dateRangeParam = searchParams.get("dateRange") || "last-6-months";

  const params = useParams();
  const studioId = params.id as string;

  const { data, isLoading, isError, error } = useStudioDashboard(studioId, dateRangeParam, {
    enabled: userStatus === "authenticated",
  });

  if (userStatus === "unauthenticated") {
    return <ToastMessageWithRedirect type={"error"} message={"請先登入。"} redirectPath={"/auth/login"} />;
  }

  if (isError && error.message === "無權儲取此場地資料。") {
    return <ToastMessageWithRedirect type={"error"} message={"無權儲取此場地資料。"} redirectPath={"/"} />;
  }

  if (isError) {
    return (
      <div className="mt-10">
        <SectionFallback icon={CircleX} fallbackText={"無法取得資料"} />
      </div>
    );
  }

  return (
    <>
      <SectionTitle>儀表板</SectionTitle>

      <div className="flex flex-col-reverse gap-10 md:gap-5 md:grid md:grid-cols-3">
        <div className="border-gray-300 border-t pt-10 md:border-t-0 md:pt-0 md:col-span-2 md:border-r md:pr-5">
          <ReportDateRangePicker parentPagePath={`/studio-owner/studio/${studioId}/manage/dashboard`} />

          <div className="grid grid-cols-3 gap-4 mb-5">
            <ScoreCard metricName={"預約數量"} value={data?.bookingCount.total} toolTipContent={<BookingAmountToolTipContent />} isLoading={isLoading || userStatus === "loading"} />
            <ScoreCard
              metricName={"預計收入"}
              value={data?.expectedRevenue.total}
              toolTipContent={<ExpectedRevenueToolTipContent />}
              isLoading={isLoading || userStatus === "loading"}
              isRevenue={true}
            />
            <ScoreCard metricName={"實質已收取​收入"} value={data?.payout.total} toolTipContent={<ActualRevenueToolTipContent />} isLoading={isLoading || userStatus === "loading"} isRevenue={true} />
          </div>

          <div className="space-y-5">
            <ChartCard
              chart={<ByMonthLineChart chartData={data?.bookingCount.monthBreakdown} label={"預約數目"} isLoading={isLoading || userStatus === "loading"} />}
              cardTitle={"每月預約數目"}
              toolTipContent={<BookingAmountToolTipContent />}
            />
            <ChartCard
              chart={<ByMonthLineChart chartData={data?.expectedRevenue.monthBreakdown} label={"預計收入"} isLoading={isLoading || userStatus === "loading"} />}
              cardTitle={"每月預計收入"}
              toolTipContent={<BookingAmountToolTipContent />}
            />

            <ChartCard
              chart={<ByMonthLineChart chartData={data?.payout.monthBreakdown} label={"預計收入"} isLoading={isLoading || userStatus === "loading"} />}
              cardTitle={"每月實質已收取​收入"}
              toolTipContent={<ActualRevenueToolTipContent />}
            />
          </div>
        </div>
        <div className="md:col-span-1">
          <Card className="border-gray-200">
            <CardHeader className="pb-1 px-3 pt-3 space-y-1 md:space-y-1.5 flex flex-row items-start">
              <CardTitle className="text-sm md:text-base text-primary">最近5個預約</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="pt-2 md:pt-1 pb-3 px-3 space-y-3">
              {userStatus == "loading" || isLoading
                ? Array.from({ length: 5 }, (_, index) => (
                    <div key={index}>
                      <Skeleton className="h-20 w-full mt-2" />
                    </div>
                  ))
                : data?.upcoming5Bookings.bookingList.map((item: { reference_no: string; name: string; image: string; booking_date: string; start_time: string; end_time: string }) => (
                    <div className="border border-gray-200 rounded-lg p-3 flex gap-3 shadow" key={item.reference_no}>
                      <AvatarWithFallback avatarUrl={item.image} type={"user"} />
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <CalendarCheck2 size={14} />
                          <p className="text-sm">{item.booking_date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock5 size={14} />
                          <p className="text-sm">
                            {convertTimeToString(item.start_time)} - {convertTimeToString(item.end_time)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default StudioPanelDashboardPage;
