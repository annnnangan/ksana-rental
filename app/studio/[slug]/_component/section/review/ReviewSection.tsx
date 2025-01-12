import { Star } from "lucide-react";
import Section from "../../Section";
import RatingBreakdown from "./RatingBreakdown";
import ReviewCard from "./ReviewCard";

export interface ReviewUserProfile {
  name: string;
  icon: string | null;
}

interface ReviewDetails {
  rating: number;
  review_content: string;
  review_image_list: string[] | null;
  reviewed_at: string;
}

export interface Review {
  user_profile: ReviewUserProfile;
  review_details: ReviewDetails;
}

interface Props {
  review_list: Review[];
}

const ReviewSection = () => {
  const reviews = {
    review_overview: {
      avg_rate: 4.5,
      review_count: 120,
      rates: [
        { rate: 5, rateNumber: 101 },
        { rate: 4, rateNumber: 10 },
        { rate: 3, rateNumber: 5 },
        { rate: 2, rateNumber: 2 },
        { rate: 1, rateNumber: 2 },
      ],
    },
    review_list: [
      {
        user_profile: {
          name: "Mary",
          icon: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/user-icon/user-icon-1.jpg",
        },
        review_details: {
          review_id: 1,
          rating: 4,
          review_content:
            "呢間工作室啱啱好夠我10人嘅小型瑜伽班，設備齊全，有瑜伽墊、磚頭，仲有好好嘅音響設備用嚟播音樂。不過，附近嘅泊車位唔多，對啲學生嚟講有少少唔方便。不過整體嚟講真係一個好地方！",
          review_image_list: null,
          reviewed_at: "2025-01-05",
        },
      },
      {
        user_profile: {
          name: "Ksana User",
          icon: null,
        },
        review_details: {
          review_id: 2,
          rating: 5,
          review_content:
            "呢間工作室真係隱世之寶！位置好方便，又唔會喺繁忙街道旁邊，十分寧靜。牆上有鏡，對我嘅舞蹈瑜伽班非常實用。租用過程簡單，老闆回覆亦都好快。我諗我會成為呢度嘅常客！",
          review_image_list: [
            "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/review-image/review-image-1.jpg",
            "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/review-image/review-image-2.jpg",
            "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/review-image/review-image-3.jpg",
            "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/review-image/review-image-4.jpg",
            "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/review-image/review-image-5.jpg",
          ],
          reviewed_at: "2025-01-05",
        },
      },
      {
        user_profile: {
          name: "Ksana User",
          icon: null,
        },
        review_details: {
          review_id: 3,
          rating: 3,
          review_content:
            "工作室本身幾好，不過有啲地方需要維修。提供嘅瑜伽墊同輔助工具有少少舊，木地板亦有啲磨損。不過老闆好友善，話會盡快改善。希望下次嚟可以見到提升！",
          review_image_list: [
            "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/review-image/review-image-1.jpg",
            "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/review-image/review-image-2.jpg",
          ],
          reviewed_at: "2024-11-05",
        },
      },
      {
        user_profile: {
          name: "Ksana User",
          icon: null,
        },
        review_details: {
          review_id: 4,
          rating: 4,
          review_content:
            "我租咗呢間工作室嚟搞冥想工作坊，結果超乎預期！環境非常安靜，燈光可以調節，氣氛好容易營造到。參加者都話地方非常平靜舒服。工作室老闆都好配合。大力推薦！",
          review_image_list: null,
          reviewed_at: "2024-03-05",
        },
      },
    ],
  };

  return (
    <Section title="評論">
      <div className="h-[80px] w-[80px] bg-primary rounded-sm flex justify-center items-center mb-2">
        <p className="text-white text-2xl font-bold flex flex-col justify-center items-center">
          {reviews.review_overview.avg_rate}
          <Star size={16} fill="#ffffff" />
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        {reviews.review_overview.review_count}則留言
      </p>

      <RatingBreakdown
        reviewCount={reviews.review_overview.review_count}
        reviewRates={reviews.review_overview.rates}
      />

      <div className="flex flex-col gap-3">
        {reviews.review_list.map((review) => (
          <ReviewCard key={review.review_details.review_id} review={review} />
        ))}
      </div>
    </Section>
  );
};

export default ReviewSection;
