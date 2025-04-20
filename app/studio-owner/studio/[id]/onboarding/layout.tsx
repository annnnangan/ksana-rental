import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import StudioOnboardingNavItems from "@/components/custom-components/layout/backend-panel-nav-bar/nav-items/StudioOnboardingNavItems";
import { GENERAL_ERROR_MESSAGE } from "@/lib/constants/error-message";
import { auth } from "@/lib/next-auth-config/auth";
import { studioService } from "@/services/studio/StudioService";
import { validateStudioService } from "@/services/studio/ValidateStudio";

type Params = Promise<{ id: string }>;

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
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

  const isStudioDraft = await studioService.getStudioStatus(currentStudioId);

  if (isStudioDraft.data !== "draft") {
    return (
      <ToastMessageWithRedirect
        type="error"
        message={"你已完成/等待通過場地註冊。"}
        redirectPath="/studio-owner/studios"
      />
    );
  }

  return <StudioOnboardingNavItems>{children} </StudioOnboardingNavItems>;
}
