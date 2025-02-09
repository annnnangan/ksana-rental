import StudioCard from "./StudioCard";

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
  studioList: studioCardInfo[];
}

const StudioList = ({ studioList }: Props) => {
  return (
    <div className="flex flex-wrap -mx-3">
      {studioList.map((studio) => (
        <StudioCard studio={studio} key={studio.slug} />
      ))}
    </div>
  );
};

export default StudioList;
