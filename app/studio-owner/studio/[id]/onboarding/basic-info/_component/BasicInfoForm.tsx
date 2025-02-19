"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePathname } from "next/navigation";

import ErrorMessage from "@/components/custom-components/ErrorMessage";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn/avatar";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";
import { uploadImage } from "@/lib/utils/s3-upload/s3-image-upload-utils";
import { studioBasicInfoSchema } from "@/lib/validations";
import { BasicInfo, districts } from "@/services/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Image as ImageIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import FieldRemarks from "../../_component/FieldRemarks";
import SubmitButton from "../../_component/SubmitButton";
import UploadButton from "./UploadButton";
import { getOnboardingStep } from "@/lib/utils/get-onboarding-step-utils";

interface Props {
  basicInfoData: BasicInfo;
  studioId: number;
}

type studioBasicInfoSchemaFormData = z.infer<typeof studioBasicInfoSchema>;

const BasicInfoForm = ({ basicInfoData, studioId }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<studioBasicInfoSchemaFormData>({
    resolver: zodResolver(studioBasicInfoSchema),
    defaultValues: {
      name: basicInfoData?.name || undefined,
      slug: basicInfoData?.slug || undefined,
      description: basicInfoData?.description || undefined,
      district: basicInfoData?.district || undefined,
      address: basicInfoData?.address || undefined,
    },
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [coverFileError, setCoverFileError] = useState<string | null>(null);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [logoFileError, setLogoFileError] = useState<string | null>(null);

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
    setCoverFileError(null);
    setLogoFileError(null);
    setSubmitting(true);

    try {
      //only when user has uploaded new images, will trigger image upload process
      if (
        (!coverFile && !basicInfoData.cover_photo) ||
        (!logoFile && !basicInfoData.logo)
      ) {
        if (!coverFile && !basicInfoData.cover_photo) {
          setCoverFileError("請上傳封面圖片");
          throw new Error("請上傳封面圖片");
        }

        if (!logoFile && !basicInfoData.logo) {
          setLogoFileError("請上傳Logo");
          throw new Error("請上傳Logo");
        }
        setSubmitting(false);
      }

      if (coverFile || logoFile) {
        // Upload cover image
        if (coverFile) {
          const errorResponse = await uploadImage(
            coverFile,
            "cover_photo",
            studioId,
            `/api/studio/${studioId}/basic-info/images`,
            "PUT"
          );
          if (errorResponse) {
            setCoverFileError(errorResponse);
            throw new Error(errorResponse);
          }
        }
        // Upload logo image
        if (logoFile) {
          const errorResponse = await uploadImage(
            logoFile,
            "logo",
            studioId,
            `/api/studio/${studioId}/basic-info/images`,
            "PUT"
          );
          if (errorResponse) {
            setLogoFileError(errorResponse);
            throw new Error(errorResponse);
          }
        }
      }

      const onboardingStep = getOnboardingStep(pathname);

      //Save Basic Info to Database
      const saveBasicInfoResponse = await fetch(
        `/api/studio/${studioId}/basic-info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data,
            onboardingStep,
          }),
        }
      );

      if (!saveBasicInfoResponse.ok) {
        // If the response status is not 2xx, throw an error with the response message
        const errorData = await saveBasicInfoResponse.json();
        throw new Error(errorData?.error.message || "系統發生未預期錯誤。");
      }

      //Save Onboarding Step Track
      const completeOnboardingStepResponse = await fetch(
        `/api/studio/${studioId}/onboarding-step`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            onboardingStep,
          }),
        }
      );

      if (!completeOnboardingStepResponse.ok) {
        // If the response status is not 2xx, throw an error with the response message
        const errorData = await completeOnboardingStepResponse.json();
        throw new Error(errorData?.error.message || "系統發生未預期錯誤。");
      }

      router.push(
        `/studio-owner/studio/${studioId}/onboarding/business-hour-and-price`
      );
      router.refresh();

      //Save text information to database
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "系統發生未預期錯誤，請重試。";
      toast(errorMessage, {
        position: "top-right",
        type: "error",
        autoClose: 1000,
      });
      router.refresh();
    }
    setSubmitting(false);
  });

  return (
    <form onSubmit={onSubmit}>
      {/* Input 1: Cover Image */}
      <div className="relative max-w-full w-auto h-60 aspect-[3/1] bg-neutral-200 rounded-md mb-1">
        {coverPreviewUrl && coverFile ? (
          <img
            src={coverPreviewUrl}
            alt="Cover preview"
            className="absolute inset-0 w-full h-full object-cover rounded-md"
          />
        ) : basicInfoData.cover_photo ? (
          <img
            src={basicInfoData.cover_photo}
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
      <FieldRemarks>圖片容量需為2MB內。</FieldRemarks>
      {coverFileError && <ErrorMessage> {coverFileError}</ErrorMessage>}

      {/* Input 2: Logo */}
      <div className="mt-5 mb-1 flex items-end gap-4">
        <Avatar className="h-24 w-24">
          {logoPreviewUrl && logoFile ? (
            <AvatarImage src={logoPreviewUrl} className="object-cover" />
          ) : basicInfoData.logo ? (
            <AvatarImage src={basicInfoData.logo} className="object-cover" />
          ) : (
            <AvatarFallback>
              <Building2 />
            </AvatarFallback>
          )}
        </Avatar>

        <UploadButton onFileSelect={handleLogoSelect} buttonLabel="上載Logo" />
      </div>

      <FieldRemarks>圖片容量需為2MB內。</FieldRemarks>

      {logoFileError && <ErrorMessage> {logoFileError}</ErrorMessage>}

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
          {...register("name")}
        />
      </div>

      <ErrorMessage> {errors.name?.message}</ErrorMessage>

      {/* Input 4: Studio slug */}
      {/* todo: validate if the studioSlug could be used when onblur */}
      <div className="grid w-full items-center gap-1 mt-8">
        <Label htmlFor="studioName" className="text-base font-bold">
          場地網站別名
        </Label>
        <FieldRemarks>
          此處將用於在網站中顯示出的場地連結。只接受英文字、數字和連字號(hyphens)。
        </FieldRemarks>

        <div className="relative flex items-center">
          <span className="absolute left-3 text-gray-500 text-sm">
            ksana.io/studio/
          </span>
          <Input
            type="text"
            id="studioSlug"
            placeholder="請填寫場地網站別名。"
            className="pl-[120px] text-sm"
            {...register("slug")}
          />
        </div>
      </div>

      <ErrorMessage> {errors.slug?.message}</ErrorMessage>

      {/* Input 5: Studio Description */}
      <div className="grid w-full items-center gap-1 mt-8">
        <Label htmlFor="studioDescription" className="text-base font-bold">
          場地介紹
        </Label>

        <Textarea
          id="studioDescription"
          placeholder="請填寫場地介紹。"
          className="text-sm"
          {...register("description")}
        />
      </div>

      <ErrorMessage> {errors.description?.message}</ErrorMessage>

      {/* Input 6: Address */}

      <div className="grid w-full items-center gap-1 mt-8">
        <Label htmlFor="district" className="text-base font-bold">
          場地地址
        </Label>
        <Controller
          name="district"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="選擇場地之地區" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((item) => (
                  <SelectGroup key={item.area.value}>
                    <SelectLabel>---- {item.area.label} ----</SelectLabel>
                    {item.district.map((location) => (
                      <SelectItem value={location.value} key={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <ErrorMessage> {errors.district?.message}</ErrorMessage>

        <Input
          type="text"
          id="address"
          placeholder="請填寫場地地址。"
          className="text-sm"
          {...register("address")}
        />
      </div>

      <ErrorMessage> {errors.address?.message}</ErrorMessage>

      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default BasicInfoForm;
