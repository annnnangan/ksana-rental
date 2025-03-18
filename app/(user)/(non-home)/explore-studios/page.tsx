import StudioCard from "@/components/custom-components/studio/StudioCard";
import FilterGroup from "../../../../components/custom-components/filters/FilterGroup";
import PaginationWrapper from "@/components/custom-components/PaginationWrapper";
import { studioService } from "@/services/studio/StudioService";
import SectionFallback from "@/components/custom-components/SectionFallback";
import { MapPinHouse } from "lucide-react";
import { Suspense } from "react";

export interface StudioQuery {
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  page: string;
}

interface studioCardInfo {
  name: string;
  slug: string;
  cover_photo: string;
  logo: string;
  district: string;
  rating: number;
  number_of_review: number;
  number_of_completed_booking: number;
  min_price: number;
}

interface Props {
  searchParams: StudioQuery;
}

const ExploreStudiosPage = async (props: Props) => {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams["page"]) || 1;
  const districts = searchParams["location"];

  const pageSize = 8;

  const studioListResult = await studioService.getStudioBasicInfo({ status: "active", page: currentPage, limit: pageSize, district: districts });
  let studioListData: studioCardInfo[] = (studioListResult.success && studioListResult?.data?.studios) || [];

  return (
    <div className="flex flex-col">
      <FilterGroup />

      {studioListData.length === 0 ? (
        <div className="h-[200px] place-content-center">
          <SectionFallback icon={MapPinHouse} fallbackText={"暫無篩選場地"} />
        </div>
      ) : (
        <div className="flex flex-wrap -mx-3">
          {studioListData.map((studio) => (
            <StudioCard studio={studio} key={studio.slug} />
          ))}
        </div>
      )}

      {Number(studioListResult?.data?.totalCount) > pageSize && <PaginationWrapper currentPage={currentPage} itemCount={Number(studioListResult?.data?.totalCount) || 0} pageSize={pageSize} />}
    </div>
  );
};

export default ExploreStudiosPage;
