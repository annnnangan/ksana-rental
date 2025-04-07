import { ByMonthBarChart } from "@/components/custom-components/charts/ByMonthBarChart";
import { ByMonthLineChart } from "@/components/custom-components/charts/ByMonthLineChart";
import ScoreCard from "@/components/custom-components/charts/ScoreCard";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import ReportDateRangePicker from "@/components/custom-components/filters-and-sort/ReportDateRangePicker";
import StudioMiniCard from "@/components/custom-components/studio/StudioMiniCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/card";
import React from "react";

const registerData = [
  {
    month: "Jan",
    total: 20,
  },
  { month: "Feb", total: 20 },
  { month: "Mar", total: 30 },
  {
    month: "Jan",
    total: 20,
  },
  { month: "Feb", total: 20 },
  { month: "Mar", total: 30 },
  {
    month: "Jan",
    total: 20,
  },
  { month: "Feb", total: 20 },
  { month: "Mar", total: 30 },
  {
    month: "Jan",
    total: 20,
  },
  { month: "Feb", total: 20 },
  { month: "Mar", total: 30 },
];

const bookingData = [
  {
    month: "Jan",
    total: 20,
  },
  { month: "Feb", total: 20 },
  { month: "Mar", total: 30 },
  {
    month: "Jan",
    total: 20,
  },
  { month: "Feb", total: 20 },
  { month: "Mar", total: 30 },
  {
    month: "Jan",
    total: 20,
  },
  { month: "Feb", total: 20 },
  { month: "Mar", total: 30 },
  {
    month: "Jan",
    total: 20,
  },
  { month: "Feb", total: 20 },
  { month: "Mar", total: 30 },
];

const page = () => {
  return (
    <div>
      <SectionTitle textColor="text-primary">Dashboard</SectionTitle>
      <ReportDateRangePicker parentPagePath={"/admin/dashboard"} />
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-5">
        <ScoreCard metricName={"Users"} value={50} toolTipContent={<p>網站註冊人數</p>} />
        <ScoreCard metricName={"Users"} value={50} toolTipContent={<p>網站註冊人數</p>} />
        <ScoreCard metricName={"Users"} value={50} toolTipContent={<p>網站註冊人數</p>} />
        <ScoreCard metricName={"Users"} value={50} toolTipContent={<p>網站註冊人數</p>} />
        <ScoreCard metricName={"Users"} value={50} toolTipContent={<p>網站註冊人數</p>} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="border-gray-200">
          <CardHeader className="pb-1 px-3 pt-3 space-y-1 md:space-y-1.5 flex flex-row items-start">
            <CardTitle className="text-sm md:text-base text-primary">Users</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1 pb-0 px-3 space-y-5">
            <ByMonthBarChart chartData={registerData} label={"註冊人數"} />
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardHeader className="pb-1 px-3 pt-3 space-y-1 md:space-y-1.5 flex flex-row items-start">
            <CardTitle className="text-sm md:text-base text-primary">Bookings</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1 pb-0 px-3 space-y-5">
            <ByMonthLineChart chartData={bookingData} label={"預約數量"} />
          </CardContent>
        </Card>

        <Card className="border-gray-200 h-fit">
          <CardHeader className="pb-1 px-3 pt-3 space-y-1 md:space-y-1.5 flex flex-row items-start">
            <CardTitle className="text-sm md:text-base text-primary">Top 5 Booking Studios</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1 px-3 space-y-5">
            <div className="flex flex-col">
              <div className="flex gap-2">
                <p className="text-xl font-bold">1</p>
                <div className="w-[250px]">
                  <StudioMiniCard
                    studio_name={"Soul Yogi Studio"}
                    studio_slug={"hi"}
                    cover_image={"https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-cover.jpg"}
                    rating={""}
                  />
                </div>

                <p className="text-sm">預約數量: 50</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <p className="text-xl font-bold">1</p>
                <div className="w-[250px]">
                  <StudioMiniCard
                    studio_name={"Soul Yogi Studio"}
                    studio_slug={"hi"}
                    cover_image={"https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-cover.jpg"}
                    rating={""}
                  />
                </div>

                <p className="text-sm">預約數量: 50</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <p className="text-xl font-bold">1</p>
                <div className="w-[250px]">
                  <StudioMiniCard
                    studio_name={"Soul Yogi Studio"}
                    studio_slug={"hi"}
                    cover_image={"https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-cover.jpg"}
                    rating={""}
                  />
                </div>

                <p className="text-sm">預約數量: 50</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <p className="text-xl font-bold">1</p>
                <div className="w-[250px]">
                  <StudioMiniCard
                    studio_name={"Soul Yogi Studio"}
                    studio_slug={"hi"}
                    cover_image={"https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-cover.jpg"}
                    rating={""}
                  />
                </div>

                <p className="text-sm">預約數量: 50</p>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <p className="text-xl font-bold">1</p>
                <div className="w-[250px]">
                  <StudioMiniCard
                    studio_name={"Soul Yogi Studio"}
                    studio_slug={"hi"}
                    cover_image={"https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-cover.jpg"}
                    rating={""}
                  />
                </div>

                <p className="text-sm">預約數量: 50</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
