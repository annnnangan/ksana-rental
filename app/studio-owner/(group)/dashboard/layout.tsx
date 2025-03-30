import ReportDateRangePicker from "@/components/custom-components/filters-and-sort/ReportDateRangePicker";
import React from "react";

const layout = ({
  children,
  studios,
  AnalyticsMonthlyCountByCreatedAt,
  AnalyticsMonthlyCountByBookingDate,
  AnalyticsMonthlyRevenueByBookingDate,
  AnalyticsCountByBookingDateByStudio,
  AnalyticsCountByCreatedAtByStudio,
  AnalyticsRevenueByBookingDateByStudio,
}: {
  children: React.ReactNode;
  studios: React.ReactNode;
  AnalyticsMonthlyCountByCreatedAt: React.ReactNode;
  AnalyticsMonthlyCountByBookingDate: React.ReactNode;
  AnalyticsMonthlyRevenueByBookingDate: React.ReactNode;
  AnalyticsCountByBookingDateByStudio: React.ReactNode;
  AnalyticsCountByCreatedAtByStudio: React.ReactNode;
  AnalyticsRevenueByBookingDateByStudio: React.ReactNode;
}) => {
  return (
    <>
      <h1 className="text-primary text-2xl font-bold mb-5">儀表板</h1>

      <div className="space-y-5">
        {studios}
        <div>
          <ReportDateRangePicker parentPagePath={"/studio-owner/dashboard"} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AnalyticsMonthlyCountByCreatedAt}
            {AnalyticsCountByCreatedAtByStudio}
            {AnalyticsMonthlyCountByBookingDate}
            {AnalyticsCountByBookingDateByStudio}
            {AnalyticsMonthlyRevenueByBookingDate}
            {AnalyticsRevenueByBookingDateByStudio}
          </div>
        </div>
      </div>

      {children}
    </>
  );
};

export default layout;
