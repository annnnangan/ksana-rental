import { allStudiosService } from "@/services/AllStudiosService";

import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import StudioList, { studioCardInfo } from "@/components/custom-components/studio/StudioList";
import SearchFilter from "./_component/Search";

export interface StudioQuery {
  location: string;
  date: string;
  startTime: string;
  endTime: string;
}

const ExploreStudiosPage = async () => {
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
    <>
      <SearchFilter />
      <StudioList studioList={studioListData} />
    </>
  );
};

export default ExploreStudiosPage;
