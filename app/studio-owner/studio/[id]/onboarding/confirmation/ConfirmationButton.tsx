"use client";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { Loader2, MoveRight } from "lucide-react";
import { useState } from "react";

interface Props {
  isFilledAllSteps: boolean;
  isAcceptedTnC: boolean;
  onSubmit: () => Promise<void>;
}

const ConfirmationButton = ({
  isFilledAllSteps,
  isAcceptedTnC,
  onSubmit,
}: Props) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await onSubmit(); // Call the submission function passed via props
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="submit"
          className="mt-5 px-12"
          disabled={!isFilledAllSteps || !isAcceptedTnC}
        >
          送出申請
        </Button>
      </DialogTrigger>
      {!isFilledAllSteps && (
        <p className="text-gray-500 text-xs mt-1">
          請先填妥所有步驟，才可送出申請。
        </p>
      )}
      {isAcceptedTnC && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>你確認要送出申請嗎？</DialogTitle>
            <DialogDescription>
              請確保所有資料正確無誤，否則申請通過時間會被延誤。
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                className="px-12"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? "申請送出中..." : "確認送出"}
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <MoveRight />
                )}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ConfirmationButton;
