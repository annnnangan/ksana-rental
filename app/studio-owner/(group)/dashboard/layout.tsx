import ReportDateRangePicker from "@/components/custom-components/filters-and-sort/ReportDateRangePicker";
import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import { auth } from "@/lib/next-auth-config/auth";
import { studioOwnerService } from "@/services/studio/StudioOwnerService";
import React from "react";
import SectionTitle from "@/components/custom-components/common/SectionTitle";

const layout = async ({
  children,
  CreateNewStudio,
  HelpsArticle,
  DraftStudioStepTracker,
  ActiveStudios,
  AnalyticsMonthlyCountByBookingDate,
  AnalyticsMonthlyRevenueByBookingDate,
  AnalyticsCountByBookingDateByStudio,
  AnalyticsRevenueByBookingDateByStudio,
}: {
  children: React.ReactNode;
  CreateNewStudio: React.ReactNode;
  HelpsArticle: React.ReactNode;
  DraftStudioStepTracker: React.ReactNode;
  ActiveStudios: React.ReactNode;
  AnalyticsMonthlyCountByBookingDate: React.ReactNode;
  AnalyticsMonthlyRevenueByBookingDate: React.ReactNode;
  AnalyticsCountByBookingDateByStudio: React.ReactNode;
  AnalyticsRevenueByBookingDateByStudio: React.ReactNode;
}) => {
  const session = await auth();

  if (!session?.user.id) {
    return (
      <ToastMessageWithRedirect type={"error"} message={"請先登入"} redirectPath={"/auth/login"} />
    );
  }

  const studioStatusCountResult = await studioOwnerService.countStudioByStatusByUserId(
    session?.user.id
  );

  const activeCount =
    Number(studioStatusCountResult?.data?.find((item) => item.status === "active")?.count) || 0;
  const draftCount =
    Number(studioStatusCountResult?.data?.find((item) => item.status === "draft")?.count) || 0;

  return (
    <>
      <SectionTitle textColor="text-primary">儀表板</SectionTitle>
      <div className="space-y-10 mb-5">
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
