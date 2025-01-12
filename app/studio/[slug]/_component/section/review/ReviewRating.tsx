import { Star } from "lucide-react";
import React from "react";

interface Props {
  rating: number;
}

const ReviewRating = ({ rating }: Props) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          size={16}
          fill={index < rating ? "#01a2c7" : "none"}
          color={index < rating ? "#01a2c7" : "black"}
        />
      ))}
    </div>
  );
};

export default ReviewRating;
