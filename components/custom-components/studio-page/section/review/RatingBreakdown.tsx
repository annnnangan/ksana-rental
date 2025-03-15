import { Progress } from "@/components/shadcn/progress";

interface Props {
  reviewCount: number;
  reviewRates: {
    rate: number;
    rateNumber: number;
  }[];
}

const RatingBreakdown = ({ reviewCount, reviewRates }: Props) => {
  return (
    <div className="mb-5 flex flex-col gap-2 w-full md:w-1/2">
      {reviewRates.map((rate) => (
        <div className="flex items-center" key={rate.rate}>
          <Progress value={(rate.rateNumber / reviewCount) * 100} />
          <p className="text-xs ms-3">({rate.rateNumber})</p>
        </div>
      ))}
    </div>
  );
};

export default RatingBreakdown;
