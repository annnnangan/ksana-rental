import { StudioPanelNavBar } from "@/components/custom-components/layout/backend-panel-nav-bar/StudioPanelNavBar";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/shadcn/sidebar";
import { GENERAL_ERROR_MESSAGE } from "@/lib/constants/error-message";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import { studioOwnerService } from "@/services/studio/StudioOwnerService";
import { validateStudioService } from "@/services/studio/ValidateStudio";

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
      <StudioPanelNavBar availableStudios={availableStudios as []} currentStudioId={currentStudioId} />
      <div className="px-5 lg:px-10 w-full">
        <SidebarInset className="pt-5">
          <SidebarTrigger />
          <div className="pb-10">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
