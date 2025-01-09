import { allStudiosService } from "@/services/AllStudiosService";
import Search from "./_component/Search";
import StudioList, { studioCardInfo } from "./_component/StudioList";
import ToastMessageWithRedirect from "../_components/ToastMessageWithRedirect";

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
    const errorMessage =
      error instanceof Error ? error.message : "系統發生未預期錯誤，請重試。";
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={errorMessage}
        redirectPath={"/"}
      />
    );
  }

  return (
    <>
      <Search />
      <StudioList studioList={studioListData} />
    </>
  );
};

export default ExploreStudiosPage;
