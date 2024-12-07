"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadImage } from "@/lib/utils/s3-image-upload-utils";
import { Building2, Image as ImageIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import UploadButton from "./UploadButton";
import { z } from "zod";
import { studioBasicInfoSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/app/_components/ErrorMessage";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  coverPhotoUrl?: string;
  logoUrl?: string;
  studioId: number;
}

type studioBasicInfoSchemaFormData = z.infer<typeof studioBasicInfoSchema>;

const BasicInfoForm = ({ coverPhotoUrl, logoUrl, studioId }: Props) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<studioBasicInfoSchemaFormData>({
    resolver: zodResolver(studioBasicInfoSchema),
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);

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

  const onSubmit = handleSubmit(async (data) => {
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
  });

  return (
    <form onSubmit={onSubmit}>
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
      <div className="mt-5 flex items-end gap-4">
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
      <div className="grid w-full items-center gap-1 mt-8">
        <Label htmlFor="studioName" className="text-base font-bold">
          場地名稱
        </Label>
        <Input
          type="text"
          id="studioName"
          placeholder="請輸入場地名稱"
          className="text-sm"
          {...register("studioName")}
        />
      </div>

      <ErrorMessage> {errors.studioName?.message}</ErrorMessage>

      {/* Input 4: Studio slug */}
      {/* todo: validate if the studioSlug could be used when onblur */}
      <div className="grid w-full items-center gap-1 mt-8">
        <Label htmlFor="studioName" className="text-base font-bold">
          場地網站別名
        </Label>
        <p className="text-xs text-gray-500">
          此處將用於在網站中顯示出的場地連結。只接受英文字、數字和連字號(hyphens)。
        </p>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-500 text-sm">
            ksana.io/studio/
          </span>
          <Input
            type="text"
            id="studioSlug"
            placeholder="請填寫場地網站別名。"
            className="pl-[120px] text-sm"
            {...register("studioSlug")}
          />
        </div>
      </div>

      <ErrorMessage> {errors.studioSlug?.message}</ErrorMessage>

      {/* Input 5: Studio Description */}
      <div className="grid w-full items-center gap-1 mt-8">
        <Label htmlFor="studioDescription" className="text-base font-bold">
          場地介紹
        </Label>

        <Textarea
          id="studioDescription"
          placeholder="請填寫場地介紹。"
          className="text-sm"
          {...register("studioDescription")}
        />
      </div>

      <ErrorMessage> {errors.studioDescription?.message}</ErrorMessage>

      {/* Input 6: Address */}
      <Button type="submit" className="mt-5">
        Save
      </Button>
    </form>
  );
};

export default BasicInfoForm;
