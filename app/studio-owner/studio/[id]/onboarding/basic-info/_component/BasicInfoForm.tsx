"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, ImageUp as ImageUpIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Building2 } from "lucide-react";
import UploadButton from "./UploadButton";
import { uploadImage } from "@/lib/utils/s3-image-upload-utils";

interface Props {
  coverPhotoUrl?: string;
  logoUrl?: string;
  studioId: number;
}

const BasicInfoForm = ({ coverPhotoUrl, logoUrl, studioId }: Props) => {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  //Display uploaded image
  const handleCoverSelect = (selectedFile: File | null) => {
    setCoverFile(selectedFile);

    if (coverPreviewUrl) {
      URL.revokeObjectURL(coverPreviewUrl);
    }

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setCoverPreviewUrl(url);
    } else {
      setCoverPreviewUrl(null);
    }
  };

  const handleLogoSelect = (selectedFile: File | null) => {
    setLogoFile(selectedFile);

    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl);
    }

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setLogoPreviewUrl(url);
    } else {
      setLogoPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (coverFile || logoFile) {
      try {
        // Upload cover image
        if (coverFile) {
          await uploadImage(coverFile, "cover_photo", studioId);
        }

        // Upload logo image
        if (logoFile) {
          await uploadImage(logoFile, "logo", studioId);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "系統發生未預期錯誤，請重試。";
        toast(errorMessage, {
          position: "top-right",
          type: "error",
          autoClose: 1000,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input 1: Cover Image */}

      <div className="relative max-w-full w-auto h-60 aspect-[3/1] bg-neutral-200 rounded-md">
        {coverPreviewUrl && coverFile ? (
          <img
            src={coverPreviewUrl}
            alt="Cover preview"
            className="absolute inset-0 w-full h-full object-cover rounded-md"
          />
        ) : coverPhotoUrl ? (
          <img
            src={coverPhotoUrl}
            alt="Cover photo"
            className="absolute inset-0 w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="absolute right-1/2 top-1/2">
            <ImageIcon />
          </div>
        )}

        <div className="absolute bottom-3 right-3">
          <UploadButton
            onFileSelect={handleCoverSelect}
            buttonLabel="上載封面圖片"
          />
        </div>
      </div>

      {/* Input 2: Logo */}
      <div className="mt-5 flex items-center gap-4">
        <Avatar className="h-24 w-24">
          {logoPreviewUrl && logoFile ? (
            <AvatarImage src={logoPreviewUrl} className="object-cover" />
          ) : logoUrl ? (
            <AvatarImage src={logoUrl} className="object-cover" />
          ) : (
            <AvatarFallback>
              <Building2 />
            </AvatarFallback>
          )}
        </Avatar>

        <UploadButton onFileSelect={handleLogoSelect} buttonLabel="上載Logo" />
      </div>

      {/* Input 3: Studio Name */}

      {/* Input 4: Studio slug */}

      <Button type="submit" className="mt-5">
        Save
      </Button>
    </form>
  );
};

export default BasicInfoForm;
