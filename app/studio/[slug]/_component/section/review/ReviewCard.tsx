import AvatarWithFallback from "@/app/_components/AvatarWithFallback";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReviewImages from "./ReviewImages";
import ReviewRating from "./ReviewRating";
import { Review } from "./ReviewSection";

interface Props {
  review: Review;
}

const ReviewCard = ({ review: { user_profile, review_details } }: Props) => {
  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex gap-3 items-center">
          <AvatarWithFallback
            size="xs"
            avatarUrl={user_profile.icon}
            type={"user"}
          />
          <div>
            <p className="font-bold text-md">{user_profile.name}</p>
            <p className="text-xs text-muted-foreground">
              評價時間：{review_details.reviewed_at}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <ReviewRating rating={review_details.rating} />
        <p className="text-sm line-clamp-3">{review_details.review_content}</p>
        {review_details.review_image_list?.length && (
          <div className="grid gap-2 grid-cols-10">
            <ReviewImages
              imageList={review_details.review_image_list}
              userProfile={user_profile}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
