"use client";

import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/dialog";
import { Button } from "../shadcn/button";

export const ProjectNoticeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem("hasSeenProjectNotice");
    if (!hasSeenNotice) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenProjectNotice", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent hideClose>
        <DialogHeader>
          <DialogTitle className="text-center">本網站僅供作品參考，並非真實營運販售</DialogTitle>
        </DialogHeader>
        <Button onClick={handleClose} size="sm" className="mx-auto px-10">
          明白了
        </Button>
      </DialogContent>
    </Dialog>
  );
};
