import { Star } from "lucide-react";
import React from "react";

interface Props {
  rating: number;
  numberOfReview: number;
  numberOfCompletedBooking: number;
}

const StudioRating = ({
  rating,
  numberOfReview,
  numberOfCompletedBooking,
}: Props) => {
  return (
    <div className="flex items-center">
      <Star size={14} className="me-1" fill="#01a2c7" strokeWidth={0} />
      <p className="text-sm me-2">
        {rating !== null
          ? (Math.round(Number(rating) * 10) / 10).toFixed(1)
          : "--"}
        ({numberOfReview})
      </p>
      <p className="h-1 w-1 rounded-full bg-gray-400"></p>
      <p className="text-sm ms-2">{numberOfCompletedBooking}個已完成預約</p>
    </div>
  );
};

export default StudioRating;
