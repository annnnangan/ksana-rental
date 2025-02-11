import { auth } from "@/lib/next-auth-config/auth";
import { studioOwnerService } from "@/services/studio/StudioOwnerService";

import AddNewStudio from "@/components/custom-components/studio-owner/AddNewStudio";
import StudioCard from "@/components/custom-components/studio-owner/StudioCard";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";

const StudiosPage = async () => {
  const session = await auth();

  if (!session?.user) {
    return <ToastMessageWithRedirect type={"error"} message={"請先登入後才可處理。"} redirectPath={"/auth/login"} />;
  }

  const response = await studioOwnerService.getStudiosByUserId(session?.user.id || "");

  if (!response.success) {
    return <ToastMessageWithRedirect type={"error"} message={response?.error?.message} redirectPath={"/"} />;
  }

  const studios = response.success && response.data;

  return (
    <>
      {!studios && <AddNewStudio type="new" />}
      {studios && (
        <div className="flex flex-wrap -mx-3">
          {studios?.map((studio) => (
            <StudioCard key={studio.id} studioInfo={studio} />
          ))}
          <AddNewStudio type="existing" />
        </div>
      )}
    </>
  );
};

export default StudiosPage;
