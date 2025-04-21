import AdminStudiosTable from "@/components/custom-components/admin/AdminStudiosTable";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import ResponsiveTab from "@/components/custom-components/layout/ResponsiveTab";
import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import { sessionUserRole } from "@/lib/next-auth-config/session-user";
import { adminService } from "@/services/admin/AdminService";
import React from "react";

const tabListMap = [
  { name: "Awaiting approval", query: "awaiting-approval" },
  { name: "Active", query: "active" },
];

type searchParams = Promise<{ tab: string }>;

const page = async ({ searchParams }: { searchParams: searchParams }) => {
  const userRole = await sessionUserRole();
  if (userRole !== "admin") {
    return (
      <ToastMessageWithRedirect type={"error"} message={"你沒有此權限。"} redirectPath={"/"} />
    );
  }
  const { tab } = await searchParams;

  const activeTab = tab || "awaiting-approval";

  const studioList =
    (await adminService.getStudioList(activeTab === "awaiting-approval" ? "reviewing" : "active"))
      .data || [];

  return (
    <div>
      <SectionTitle textColor="text-primary">All Studios</SectionTitle>
      <ResponsiveTab activeTab={activeTab} tabListMap={tabListMap} />
      <AdminStudiosTable data={studioList} />
    </div>
  );
};

export default page;
