import AvatarWithFallback from "@/components/custom-components/common/AvatarWithFallback";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import ReviewImages from "./ReviewImages";
import ReviewRating from "./ReviewRating";
import { Review } from "./ReviewSection";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import { Skeleton } from "@/components/shadcn/skeleton";
import SectionFallback from "@/components/custom-components/common/SectionFallback";
import { MessageCircle } from "lucide-react";

interface Props {
  review?: Review;
  isLoading: boolean;
}

const ReviewCard = ({ review, isLoading = false }: Props) => {
  return (
    <>
      {isLoading && (
        <div className="border rounded-xl p-4">
          <div className="mb-1 flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />

            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="mt-4 space-y-1">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      )}
      {!isLoading && review && (
        <Card>
          <CardHeader className="p-4">
            <div className="flex gap-3 items-center">
              <AvatarWithFallback size="xs" avatarUrl={review.user_icon} type={"user"} />
              <div>
                <p className="font-bold text-md">{review.username}</p>
                <p className="text-xs text-muted-foreground">
                  評價日期：{formatDate(review.created_at)}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <ReviewRating rating={review.rating} />
            {review.review === null ? (
              <SectionFallback
                icon={MessageCircle}
                iconSize={20}
                textSize="text-sm"
                fallbackText={"未有留言"}
              />
            ) : (
              <p className="text-sm">{review.review}</p>
            )}
            {review.photos?.length > 0 && (
              <div className="grid gap-2 grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10">
                <ReviewImages
                  imageList={review.photos}
                  userProfile={{ icon: review.user_icon, name: review.username }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ReviewCard;
