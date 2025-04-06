import AdminStudiosTable from "@/components/custom-components/admin/AdminStudiosTable";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import ResponsiveTab from "@/components/custom-components/layout/ResponsiveTab";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { sessionUserRole } from "@/lib/next-auth-config/session-user";
import { adminService } from "@/services/admin/AdminService";
import React from "react";

const tabListMap = [
  { name: "Awaiting approval", query: "awaiting-approval" },
  { name: "Active", query: "active" },
];

interface SearchQuery {
  tab: string;
}

interface Props {
  searchParams: SearchQuery;
}

const data = [
  {
    studio_id: "1",
    studio_name: "Soul Yogi Studio",
    studio_slug: "soul-yogi-studio",
    request_review_date: "2025-03-22",
  },
  {
    studio_id: "2",
    studio_name: "Olivia Studio",
    studio_slug: "olivia-studio",
    request_review_date: "2025-03-23",
  },
];

const page = async (props: Props) => {
  const userRole = await sessionUserRole();
  if (userRole !== "admin") {
    return <ToastMessageWithRedirect type={"error"} message={"你沒有此權限。"} redirectPath={"/"} />;
  }
  const activeTab = (await props.searchParams).tab || "awaiting-approval";

  const studioList = (await adminService.getStudioList(activeTab === "awaiting-approval" ? "reviewing" : "active")).data;

  return (
    <div>
      <SectionTitle textColor="text-primary">All Studios</SectionTitle>
      <ResponsiveTab activeTab={activeTab} tabListMap={tabListMap} />
      <AdminStudiosTable data={studioList} />
    </div>
  );
};

export default page;
