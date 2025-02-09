import { Button } from "@/components/shadcn/button";
import { Loader2, MoveRight } from "lucide-react";
import React from "react";

interface Props {
  isSubmitting: boolean;
  submittingText?: string;
  nonSubmittingText?: string;
  className?: string;
}

const SubmitButton = ({
  isSubmitting,
  submittingText = "資料儲存中...",
  nonSubmittingText = "往下一步",
  className,
}: Props) => {
  return (
    <Button
      type="submit"
      className={`mt-5 px-12 ${className}`}
      disabled={isSubmitting}
    >
      {isSubmitting ? submittingText : nonSubmittingText}
      {isSubmitting ? <Loader2 className="animate-spin" /> : <MoveRight />}
    </Button>
  );
};

export default SubmitButton;
