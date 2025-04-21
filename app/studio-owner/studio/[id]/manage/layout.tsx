import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import { StudioPanelNavItems } from "@/components/custom-components/layout/backend-panel-nav-bar/nav-items/StudioPanelNavItems";
import { NavUserMenu } from "@/components/custom-components/layout/backend-panel-nav-bar/NavUser";
import { StudioSwitcher } from "@/components/custom-components/layout/backend-panel-nav-bar/StudioSwitcher";
import LogoutButton from "@/components/custom-components/layout/main-nav-bar/LogoutButton";
import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/shadcn/sidebar";
import { GENERAL_ERROR_MESSAGE } from "@/lib/constants/error-message";
import { studioOwnerService } from "@/services/studio/StudioOwnerService";
import { validateStudioService } from "@/services/studio/ValidateStudio";

import { auth } from "@/lib/next-auth-config/auth";
import { studioService } from "@/services/studio/StudioService";
import { BriefcaseBusiness, Calendar1 } from "lucide-react";
import Link from "next/link";

export type Params = Promise<{ id: string }>;

interface Props {
  children: React.ReactNode;
  params: Params;
}

export const metadata = {
  title: "場地管理",
};

export default async function Layout({ children, params }: Props) {
  const session = await auth();

  if (!session?.user) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={"請先登入後才可處理。"}
        redirectPath={"/auth/login"}
      />
    );
  }
  const { id: currentStudioId } = await params;

  // Check if the studio id belong to the user
  const isStudioBelongUserResponse = await validateStudioService.validateIsStudioBelongToUser(
    session.user?.id,
    currentStudioId
  );

  if (!isStudioBelongUserResponse.success) {
    return (
      <ToastMessageWithRedirect
        type="error"
        message={isStudioBelongUserResponse?.error?.message || GENERAL_ERROR_MESSAGE}
        redirectPath="/"
      />
    );
  }

  // Check studio status, unable to reach the studio panel when studio is still in draft,
  const isStudioDraft = await studioService.getStudioStatus(currentStudioId);

  if (isStudioDraft.data === "draft") {
    return (
      <ToastMessageWithRedirect
        type="error"
        message={"請先完成場地註冊。"}
        redirectPath="/studio-owner/studios"
      />
    );
  }
  // Get all the studio belongs to user
  const response = await studioOwnerService.getStudiosByUserId(session.user?.id, "non-draft");

  if (!response.success && response.data?.length === 0) {
    return (
      <ToastMessageWithRedirect
        type="error"
        //@ts-expect-error expected
        message={response?.error?.message || GENERAL_ERROR_MESSAGE}
        redirectPath="/"
      />
    );
  }

  const availableStudios = response.data!;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="mt-5">
          <StudioSwitcher availableStudios={availableStudios} currentStudioId={currentStudioId} />
        </SidebarHeader>
        <SidebarContent>
          <StudioPanelNavItems />
        </SidebarContent>
        <SidebarRail />
        {session.user && (
          <SidebarFooter className="mb-4">
            <NavUserMenu
              userName={session.user.name!}
              userEmail={session.user.email!}
              userImage={session.user.image || ""}
            >
              <Link href="/studio-owner/dashboard">
                <DropdownMenuItem className="cursor-pointer">
                  <BriefcaseBusiness />
                  切換回場主模式
                </DropdownMenuItem>
              </Link>

              <Link href="/">
                <DropdownMenuItem className="cursor-pointer">
                  <Calendar1 />
                  切換回租場模式
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem>
                <LogoutButton direction="justify-start" />
              </DropdownMenuItem>
            </NavUserMenu>
          </SidebarFooter>
        )}
      </Sidebar>
      <div className="px-5 lg:px-10 w-full">
        <SidebarInset className="pt-5">
          <SidebarTrigger />
          <div className="pb-10">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
