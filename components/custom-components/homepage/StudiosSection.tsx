import SearchFilter from "@/components/custom-components/filters/FilterGroup";
import { studioCardInfo } from "@/components/custom-components/studio/StudioList";
import { allStudiosService } from "@/services/AllStudiosService";

import StudioCardSwiper from "../studio/StudioCardSwiper";
import ToastMessageWithRedirect from "../ToastMessageWithRedirect";
import ButtonLink from "../buttons/ButtonLink";
import { studioService } from "@/services/studio/StudioService";

const HomepageStudioSection = async () => {
  let studioListData: studioCardInfo[] = [];

  const studioListResult = await studioService.getStudioBasicInfo({ status: "active", page: 1, limit: 10 });
  studioListData = studioListResult.success && studioListResult.data;

  return (
    <div className="my-10 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center mb-5">尋找場地</h2>
      <SearchFilter isHideEndTime={true} />
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
