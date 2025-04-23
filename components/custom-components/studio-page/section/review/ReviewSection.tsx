"use client";
import PaginationWrapper from "@/components/custom-components/common/PaginationWrapper";
import SectionFallback from "@/components/custom-components/common/SectionFallback";
import { Progress } from "@/components/shadcn/progress";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Star } from "lucide-react";
import { useState } from "react";
import Section from "../Section";
import ReviewCard from "./ReviewCard";

export interface Review {
  id: string;
  username: string;
  user_icon: string;
  rating: number;
  review: string | null;
  created_at: Date;
  is_anonymous: boolean;
  photos: string[];
}

interface Props {
  ratingOverview: {
    rating_breakdown: {
      [key: number]: { count: number };
    };
    rating: number;
    review_amount: number;
  };
  studioSlug: string;
}
const pageSize = 5;

const ReviewSection = ({ ratingOverview, studioSlug }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useStudioReviews(studioSlug, currentPage, pageSize);

  return (
    <Section title="評價">
      <div className="flex gap-5 flex-wrap">
        <div className="h-[80px] w-[80px] bg-primary rounded-sm flex justify-center items-center mb-2">
          <p className="text-white text-2xl font-bold flex flex-col justify-center items-center">
            {ratingOverview.rating !== null
              ? (Math.round(Number(ratingOverview.rating) * 10) / 10).toFixed(1)
              : "--"}
            <Star size={16} fill="#ffffff" />
          </p>
        </div>

        <div className="mb-5 flex flex-col gap-2 w-full md:w-1/2">
          {Object.entries(ratingOverview.rating_breakdown)
            .sort(([a], [b]) => Number(b) - Number(a)) // Sort by numeric value in descending order
            .map(([rate, count]) => (
              <div className="flex items-center" key={rate}>
                <p className="text-xs me-2 flex justify-center items-center">
                  {rate} <Star size={12} fill="#01a2c7" color="#01a2c7" />
                </p>
                <Progress value={(count.count / ratingOverview.review_amount) * 100} />
                <p className="text-xs ms-3">({count.count})</p>
              </div>
            ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{ratingOverview.review_amount}則評價</p>

      {!isLoading && data?.reviews.length === 0 && (
        <div className="mt-10">
          <SectionFallback icon={MessageCircle} fallbackText={"未有評價"} />
        </div>
      )}
      <div className="flex flex-col gap-3">
        {isLoading &&
          Array.from({ length: 5 }, (_, index) => <ReviewCard isLoading={true} key={index} />)}
        {!isLoading &&
          data?.reviews &&
          data.reviews.length > 0 &&
          data?.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} isLoading={false} />
          ))}
      </div>

      {!isLoading && Number(data?.total_count) > pageSize && (
        <div className="mt-8">
          <PaginationWrapper
            currentPage={currentPage}
            itemCount={Number(data?.total_count)}
            pageSize={pageSize}
            useQueryString={false}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </Section>
  );
};

export default ReviewSection;

// React Query
const useStudioReviews = (studioSlug: string, page: number, limit: number) => {
  return useQuery({
    queryKey: ["reviews", studioSlug, page, limit],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const res = await fetch(`/api/studio/${studioSlug}/reviews?page=${page}&limit=${limit}`);
      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data.data as { reviews: Review[]; total_count: number };
    },
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    enabled: !!studioSlug && !!page, // Fetch only when both are provided
  });
};
