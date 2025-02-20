import SearchFilter from "@/app/(user)/explore-studios/_component/Search";
import { studioCardInfo } from "@/components/custom-components/studio/StudioList";
import { allStudiosService } from "@/services/AllStudiosService";

import StudioCardSwiper from "../studio/StudioCardSwiper";
import ToastMessageWithRedirect from "../ToastMessageWithRedirect";
import ButtonLink from "../buttons/ButtonLink";

const StudiosSection = async () => {
  let studioListData: studioCardInfo[] = [];

  try {
    const studioList = await allStudiosService.getStudios();
    if (studioList.success) {
      studioListData = studioList.data;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "系統發生未預期錯誤，請重試。";
    return <ToastMessageWithRedirect type={"error"} message={errorMessage} redirectPath={"/"} />;
  }
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

export default StudiosSection;
