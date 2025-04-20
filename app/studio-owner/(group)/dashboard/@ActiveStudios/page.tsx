import StudioMiniCard from "@/components/custom-components/studio-card/StudioMiniCard";
import { sessionUser } from "@/lib/next-auth-config/session-user";
import { dashboardService } from "@/services/Dashboard/DashboardService";

const page = async () => {
  const user = await sessionUser();
  const result = await dashboardService.getStudioOwnerActiveStudio(user?.id as string);

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex space-x-3">
        {result?.data?.map((item) => (
          <div key={item.slug} className="min-w-[180px]">
            <StudioMiniCard
              studio_name={item.name}
              studio_slug={item.slug}
              cover_image={item.cover_photo}
              rating={item.rating}
              district={item.district}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
