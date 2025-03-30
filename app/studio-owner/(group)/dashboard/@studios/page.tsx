import StudioMiniCard from "@/components/custom-components/studio/StudioMiniCard";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import { dashboardService } from "@/services/Dashboard/DashboardService";

const page = async () => {
  const user = await sessionUser();
  const result = await dashboardService.getStudioOwnerActiveStudio(user?.id as string);

  return (
    <div className="grid grid-cols-4 gap-3">
      {result?.data?.map((item) => (
        <StudioMiniCard key={item.slug} studio_name={item.name} studio_slug={item.slug} cover_image={item.cover_photo} rating={item.rating} />
      ))}
    </div>
  );
};

export default page;
