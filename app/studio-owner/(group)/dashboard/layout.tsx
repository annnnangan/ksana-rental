import ReportDateRangePicker from "@/components/custom-components/filters-and-sort/ReportDateRangePicker";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { auth } from "@/lib/next-auth-config/auth";
import { studioOwnerService } from "@/services/studio/StudioOwnerService";
import React from "react";

const layout = async ({
  children,
  CreateNewStudio,
  HelpsArticle,
  DraftStudioStepTracker,
  ActiveStudios,
  AnalyticsMonthlyCountByCreatedAt,
  AnalyticsMonthlyCountByBookingDate,
  AnalyticsMonthlyRevenueByBookingDate,
  AnalyticsCountByBookingDateByStudio,
  AnalyticsCountByCreatedAtByStudio,
  AnalyticsRevenueByBookingDateByStudio,
}: {
  children: React.ReactNode;
  CreateNewStudio: React.ReactNode;
  HelpsArticle: React.ReactNode;
  DraftStudioStepTracker: React.ReactNode;
  ActiveStudios: React.ReactNode;
  AnalyticsMonthlyCountByCreatedAt: React.ReactNode;
  AnalyticsMonthlyCountByBookingDate: React.ReactNode;
  AnalyticsMonthlyRevenueByBookingDate: React.ReactNode;
  AnalyticsCountByBookingDateByStudio: React.ReactNode;
  AnalyticsCountByCreatedAtByStudio: React.ReactNode;
  AnalyticsRevenueByBookingDateByStudio: React.ReactNode;
}) => {
  const session = await auth();

  if (!session?.user.id) {
    return <ToastMessageWithRedirect type={"error"} message={"請先登入"} redirectPath={"/auth/login"} />;
  }

  const studioStatusCountResult = await studioOwnerService.countStudioByStatusByUserId(session?.user.id);

  const activeCount = Number(studioStatusCountResult?.data?.find((item) => item.status === "active")?.count) || 0;
  const draftCount = Number(studioStatusCountResult?.data?.find((item) => item.status === "draft")?.count) || 0;

  return (
    <>
      <h1 className="text-primary text-2xl font-bold mb-5">儀表板</h1>
      <div className="space-y-10">
        {draftCount > 0 && DraftStudioStepTracker}
        {draftCount > 0 && activeCount === 0 && HelpsArticle}

        {draftCount === 0 && activeCount === 0 && CreateNewStudio}
        {draftCount === 0 && activeCount === 0 && HelpsArticle}

        {activeCount > 0 && (
          <div className="space-y-10">
            {ActiveStudios}
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
        )}

        {children}
      </div>
    </>
  );
};

export default layout;
