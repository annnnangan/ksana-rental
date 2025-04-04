import { StudioPanelNavItems } from "@/components/custom-components/layout/backend-panel-nav-bar/nav-items/StudioPanelNavItems";
import { NavUserMenu } from "@/components/custom-components/layout/backend-panel-nav-bar/NavUser";
import { StudioSwitcher } from "@/components/custom-components/layout/backend-panel-nav-bar/StudioSwitcher";
import LogoutButton from "@/components/custom-components/layout/main-nav-bar/LogoutButton";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { DropdownMenuItem } from "@/components/shadcn/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/shadcn/sidebar";
import { GENERAL_ERROR_MESSAGE } from "@/lib/constants/error-message";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import { studioOwnerService } from "@/services/studio/StudioOwnerService";
import { validateStudioService } from "@/services/studio/ValidateStudio";

import { BriefcaseBusiness, Calendar1 } from "lucide-react";
import Link from "next/link";

export type Params = Promise<{ id: string }>;

interface Props {
  children: React.ReactNode;
  params: Params;
}

export default async function Layout({ children, params }: Props) {
  const { id: currentStudioId } = await params;
  const user = await sessionUser();

  if (!user) {
    return <ToastMessageWithRedirect type={"error"} message={"請先登入才可操作"} redirectPath={"/"} />;
  }

  // Check if the studio id belong to the user
  const isStudioBelongUserResponse = await validateStudioService.validateIsStudioBelongToUser(user?.id, currentStudioId);

  if (!isStudioBelongUserResponse.success) {
    return <ToastMessageWithRedirect type="error" message={isStudioBelongUserResponse?.error?.message || GENERAL_ERROR_MESSAGE} redirectPath="/" />;
  }

  // Get all the studio belongs to user
  const response = await studioOwnerService.getStudiosByUserId(user?.id);

  if (!response.success) {
    return <ToastMessageWithRedirect type="error" message={response?.error?.message || GENERAL_ERROR_MESSAGE} redirectPath="/" />;
  }

  const availableStudios = response.success && response.data;

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
        {user && (
          <SidebarFooter className="mb-4">
            <NavUserMenu userName={user.name!} userEmail={user.email!} userImage={user.image || ""}>
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
                <LogoutButton />
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
