import StudioCard from "@/components/custom-components/studio/StudioCard";
import FilterGroup from "../../../../components/custom-components/filters/FilterGroup";
import PaginationWrapper from "@/components/custom-components/PaginationWrapper";

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

  console.log(searchParams);

  let studioListData: studioCardInfo[] = [];

  const currentPage = Number(searchParams["page"]);

  return (
    <div className="flex flex-col">
      <FilterGroup />
      <div className="flex flex-wrap -mx-3">
        {studioListData.map((studio) => (
          <StudioCard studio={studio} key={studio.slug} />
        ))}
      </div>
      <PaginationWrapper currentPage={currentPage} itemCount={100} pageSize={10} />
    </div>
  );
};

export default ExploreStudiosPage;
