import ActiveStudioSwiper from "@/components/custom-components/studio-owner/dashboard/ActiveStudioSwiper";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import { dashboardService } from "@/services/Dashboard/DashboardService";

const page = async () => {
  const user = await sessionUser();
  const studioList = (await dashboardService.getStudioOwnerActiveStudio(user?.id!)).data;

  return <ActiveStudioSwiper slideItems={studioList!} />;
};

export default page;
