"use client";

import React, { useRef } from "react";
import { Button } from "@/components/shadcn/button";
import { ImageUp as ImageUpIcon } from "lucide-react";
import { allowedImageMineTypes } from "@/lib/validations/zod-schema/booking-schema";

interface UploadButtonProps {
  onFileSelect: (file: File | null) => void;
  buttonLabel?: string;
  accept?: string;
}

const acceptType = allowedImageMineTypes.toString();

const UploadButton: React.FC<UploadButtonProps> = ({ onFileSelect, buttonLabel = "Upload File", accept = acceptType }) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onFileSelect(file);
  };

  return (
    <div>
      <Button className="rounded-full text-sm border-primary hover:bg-primary hover:text-white" variant="outline" onClick={handleClick}>
        <ImageUpIcon /> {buttonLabel}
      </Button>
      <input className="hidden" type="file" accept={accept} onChange={handleFileChange} ref={hiddenFileInput} />
    </div>
  );
};

export default UploadButton;
