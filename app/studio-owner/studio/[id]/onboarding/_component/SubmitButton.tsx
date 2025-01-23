import { Button } from "@/components/shadcn/button";
import { Loader2, MoveRight } from "lucide-react";
import React from "react";

interface Props {
  isSubmitting: boolean;
}

const SubmitButton = ({ isSubmitting }: Props) => {
  return (
    <Button type="submit" className="mt-5 px-12" disabled={isSubmitting}>
      {isSubmitting ? "資料儲存中..." : "往下一步"}
      {isSubmitting ? <Loader2 className="animate-spin" /> : <MoveRight />}
    </Button>
  );
};

export default SubmitButton;
