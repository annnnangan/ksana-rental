import { studioCardInfo } from "@/app/(user)/(non-booking)/explore-studios/page";
import { auth } from "@/lib/next-auth-config/auth";
import { studioService } from "@/services/studio/StudioService";
import ButtonLink from "../common/buttons/ButtonLink";
import SlideUpTransition from "../framer-motion/SlideUpTransition";
import StudioCardSwiper from "./StudioCardSwiper";

const HomepageStudioSection = async () => {
  const user = await auth();
  const studioListResult = await studioService.getStudioBasicInfo({
    status: "active",
    page: 1,
    limit: 10,
    userId: user?.user.id,
  });
  const studioListData: studioCardInfo[] =
    (studioListResult.success && studioListResult?.data?.studios) || [];

  return (
    <SlideUpTransition>
      <div className="my-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-5">尋找場地</h2>
        <div className="w-full">
          <StudioCardSwiper slideItems={studioListData} />
        </div>

        <ButtonLink href="/explore-studios" variant="default" className="rounded-2xl">
          查看所有場地
        </ButtonLink>
      </div>
    </SlideUpTransition>
  );
};

export default HomepageStudioSection;
