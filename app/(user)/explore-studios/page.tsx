import PaginationWrapper from "@/components/custom-components/PaginationWrapper";
import SectionFallback from "@/components/custom-components/SectionFallback";
import StudioCard from "@/components/custom-components/studio/StudioCard";
import { studioService } from "@/services/studio/StudioService";
import { MapPinHouse } from "lucide-react";

export interface StudioQuery {
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  page?: string;
  equipment: string;
}

export interface studioCardInfo {
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
  const equipment = searchParams["equipment"];

  const pageSize = 8;

  const studioListResult = await studioService.getStudioBasicInfo({ status: "active", page: currentPage, limit: pageSize, district: districts, equipment: equipment });
  const studioListData: studioCardInfo[] = (studioListResult.success && studioListResult?.data?.studios) || [];

  return (
    <>
      <p className="text-sm text-gray-400 mb-2">場地數量：{studioListResult.data?.totalCount || 0}</p>
      {studioListData.length === 0 ? (
        <div className="h-[200px] place-content-center">
          <SectionFallback icon={MapPinHouse} fallbackText={"暫無篩選場地"} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {studioListData.map((studio) => (
            <StudioCard studio={studio} key={studio.slug} />
          ))}
        </div>
      )}

      <div className="mt-8">
        {Number(studioListResult?.data?.totalCount) > pageSize && <PaginationWrapper currentPage={currentPage} itemCount={Number(studioListResult?.data?.totalCount) || 0} pageSize={pageSize} />}
      </div>
    </>
  );
};

export default ExploreStudiosPage;
