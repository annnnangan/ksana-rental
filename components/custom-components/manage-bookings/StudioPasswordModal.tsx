import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import ErrorMessage from "../common/ErrorMessage";
import { Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  setOpenModal: (open: boolean) => void;
  doorPassword: string | null;
  errorMessage: string | null;
  isLoading: boolean;
}

const StudioPasswordModal = ({
  isOpen,
  setOpenModal,
  doorPassword,
  errorMessage,
  isLoading,
}: Props) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent hideClose>
        <DialogHeader className="flex justify-center items-center">
          <DialogTitle>場地大門密碼</DialogTitle>
          <DialogDescription>若密碼無法顯示，請聯絡場地。</DialogDescription>
        </DialogHeader>

        <p className="flex items-center justify-center font-bold text-xl">
          {isLoading ? <Loader2 className="animate-spin" /> : doorPassword}
        </p>

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <Button variant="outline" onClick={() => setOpenModal(false)}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default StudioPasswordModal;
