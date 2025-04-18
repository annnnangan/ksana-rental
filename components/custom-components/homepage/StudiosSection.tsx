import { studioService } from "@/services/studio/StudioService";
import ButtonLink from "../common/buttons/ButtonLink";
import StudioCardSwiper from "./StudioCardSwiper";
import { studioCardInfo } from "@/app/(user)/explore-studios/page";

const HomepageStudioSection = async () => {
  const studioListResult = await studioService.getStudioBasicInfo({
    status: "active",
    page: 1,
    limit: 10,
  });
  const studioListData: studioCardInfo[] =
    (studioListResult.success && studioListResult?.data?.studios) || [];

  return (
    <div className="my-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mb-5">尋找場地</h2>
      {/* <SearchFilter isHideEndTime={true} /> */}
      <div className="w-full">
        <StudioCardSwiper slideItems={studioListData} />
      </div>

      <ButtonLink href="/explore-studios" variant="default" className="rounded-2xl">
        查看所有場地
      </ButtonLink>
    </div>
  );
};

export default HomepageStudioSection;
