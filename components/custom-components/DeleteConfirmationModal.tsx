import React, { useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Loader2, X } from "lucide-react";
import SubmitButton from "./SubmitButton";
import { Button } from "../shadcn/button";

interface Props {
  children: React.ReactNode;
  isOpenModal: boolean;
  setOpenModal: (response: boolean) => void;
  handleDeleteItem: (item: string | Date) => void;
}

const DeleteConfirmationModal = ({ children, isOpenModal, setOpenModal, handleDeleteItem }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <Dialog open={isOpenModal}>
      <DialogContent hideClose className="p-0 max-h-[90vh] overflow-y-auto">
        <X onClick={handleCloseModal} className="cursor-pointer w-5 h-5 text-gray-500 absolute top-0 right-0 me-5 mt-5" />
        <DialogHeader className="px-5 pt-8">
          <DialogTitle>你確定要刪除嗎？</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="px-5 pb-8">
          {children}
          <div className="flex items-center gap-3 mt-5">
            <Button type="submit" variant="destructive" className={`mt-5 px-1 w-1/2`} disabled={isPending}>
              {isPending ? "處理中..." : "確認刪除"}
              {isPending ? <Loader2 className="animate-spin" /> : ""}
            </Button>
            <Button type="button" variant="outline" className="w-1/2 mt-5" disabled={isPending} onClick={handleCloseModal}>
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
