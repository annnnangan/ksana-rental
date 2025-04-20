"use client";
import useStudioStatus from "@/hooks/react-query/studio-panel/useStudioStatus";
import { useSessionUser } from "@/hooks/use-session-user";
import { useParams } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const user = useSessionUser();
  const params = useParams();
  const studioId = params.id as string;
  const { data: studioStatus, isLoading: isLoadingStudioStatus } = useStudioStatus(studioId);
  if (isLoadingStudioStatus) return null;
  const disableInput = studioStatus === "reviewing" && user?.role === "user";

  return (
    <>
      {disableInput && (
        <p className="text-center text-xs bg-destructive text-white py-1 px-2 rounded-lg font-bold">
          管理員正在審核你的申請，在此期間，無法修改恆常營業時間，但可增加特定日期可預約時間。
        </p>
      )}

      {children}
    </>
  );
};

export default Layout;
