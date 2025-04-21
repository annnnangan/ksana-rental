"use client";
import { Button } from "@/components/shadcn/button";
import { EllipsisVertical, Trash2 } from "lucide-react";
import React, { useState } from "react";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { useTransition } from "react";
import { removeDraftStudio } from "@/actions/studio";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const DeleteDraftStudio = ({ studioName, studioId }: { studioName: string; studioId: string }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpenModal, setOpenModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDeleteItem = () => {
    startTransition(() => {
      removeDraftStudio(studioId).then((data) => {
        //@ts-expect-error expected
        toast(data?.success ? "成功刪除場地" : data.error?.message || "無法刪除場地", {
          position: "top-right",
          type: data?.success ? "success" : "error",
          autoClose: 1000,
        });
        router.refresh();
      });
    });
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          className="absolute top-0 right-0 hover:bg-transparent"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <EllipsisVertical />
        </Button>

        {isDropdownOpen && (
          <div className="absolute top-8 right-4 bg-white border border-gray-300 rounded shadow-lg">
            <Button
              variant="ghost"
              className="w-full text-left text-red-400 hover:text-red-500 hover:bg-transparent"
              size="sm"
              onClick={() => {
                setOpenModal(true);
                setIsDropdownOpen(false);
              }}
            >
              <Trash2 />
              刪除
            </Button>
          </div>
        )}
      </div>
      <DeleteConfirmationModal
        isOpenModal={isOpenModal}
        isDeleting={isPending}
        setOpenModal={setOpenModal}
        handleDeleteItem={handleDeleteItem}
      >
        {studioName}
      </DeleteConfirmationModal>
    </>
  );
};

export default DeleteDraftStudio;
