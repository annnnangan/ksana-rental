"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";

import UploadButton from "@/components/custom-components/buttons/UploadButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";
import { Building2, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import ErrorMessage from "../ErrorMessage";
import SubmitButton from "../buttons/SubmitButton";

import { saveBasicInfoForm } from "@/actions/studio";
import { removeCountryCode } from "@/lib/utils/remove-country-code";
import { generateAWSImageUrls } from "@/lib/utils/s3-upload/s3-image-upload-utils";
import { maxCoverImageSize, maxLogoImageSize } from "@/lib/validations/file";
import { BasicInfoFormData, BasicInfoSchema } from "@/lib/validations/zod-schema/studio/studio-step-schema";
import { districts } from "@/services/model";
import { useSessionUser } from "@/hooks/use-session-user";

interface Props {
  defaultValues: BasicInfoFormData;
  isOnboardingStep: boolean;
  studioId: string;
}

const emptyDefaultValues = {
  logo: "",
  cover_photo: "",
  name: "",
  slug: "",
  description: "",
  address: "",
  district: "",
  phone: "",
};

const BasicInfoForm = ({ isOnboardingStep, studioId, defaultValues }: Props) => {
  const user = useSessionUser();
  /* ------------------------- React Hook Form ------------------------ */
  const form = useForm({
    resolver: zodResolver(BasicInfoSchema),
    defaultValues: defaultValues ?? emptyDefaultValues,
  });

  const { setValue } = form;

  const { isSubmitting } = form.formState;
  const { errors } = form.formState;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  /* ------------------------- Check if slug is unique ------------------------ */
  const [debounceSlug, setDebounceSlug] = useState("");
  const [isCheckingSlugUnique, setCheckingSlugUnique] = useState(false);
  const [isUniqueSlug, setUniqueSlug] = useState(true);
  const [checkSlugUniqueMessage, setCheckSlugUniqueMessage] = useState("");

  const debounced = useDebounceCallback(setDebounceSlug, 2000);

  useEffect(() => {
    const checkSlugUnique = async () => {
      if (debounceSlug) {
        setCheckingSlugUnique(true);
        setCheckSlugUniqueMessage("");
        setUniqueSlug(false);
        try {
          const response = await fetch(`/api/studio/check-slug-unique?slug=${debounceSlug}`);
          const result = await response.json();
          setCheckSlugUniqueMessage(result?.error?.message || "可使用此網站別名。");
          if (result.success) setUniqueSlug(true);
        } catch {
          setCheckSlugUniqueMessage("無法識別此網站別名。");
        } finally {
          setCheckingSlugUnique(false);
        }
      } else {
        setCheckSlugUniqueMessage("");
        setCheckingSlugUnique(false);
        setUniqueSlug(false);
      }
    };
    checkSlugUnique();
  }, [debounceSlug]);

  /* ------------------------- File Preview ------------------------ */
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const [coverPreview, setCoverPreview] = useState<string | undefined>(undefined);

  /* ------------------------- Form Submit ------------------------ */
  const handleSubmit = async (data: BasicInfoFormData) => {
    const initialSlug = defaultValues.slug;

    // If the slug hasn't changed, skip the uniqueness check
    if (data.slug !== initialSlug && !isUniqueSlug) {
      return;
    }

    // Create AWS S3 Image URLs
    if (logoPreview) {
      // Generate AWS Image URLs
      const imageUrl = await generateAWSImageUrls([data.logo] as File[], `studio/${studioId}/logo`, "logo");

      if (!imageUrl.success) {
        toast(`Logo無法儲存: ${imageUrl?.error?.message}`, {
          position: "top-right",
          type: "error",
          autoClose: 1000,
        });
        return;
      }

      data = { ...data, logo: imageUrl?.data?.[0] };
    }

    if (coverPreview) {
      // Generate AWS Image URLs
      const imageUrl = await generateAWSImageUrls([data.cover_photo] as File[], `studio/${studioId}/cover`, "cover");

      if (!imageUrl.success) {
        toast(`封面圖片無法儲存: ${imageUrl?.error?.message}。`, {
          position: "top-right",
          type: "error",
          autoClose: 1000,
        });
        return;
      }

      data = { ...data, cover_photo: imageUrl?.data?.[0] };
    }

    // Update Database
    startTransition(() => {
      saveBasicInfoForm(data, studioId, isOnboardingStep).then((data) => {
        toast(data.error?.message || "儲存成功。", {
          position: "top-right",
          type: data?.success ? "success" : "error",
          autoClose: 1000,
        });
        router.refresh();

        if (isOnboardingStep && data.success) {
          router.push(`/studio-owner/studio/${studioId}/onboarding/business-hour-and-price`);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
        {/* Cover */}
        <div>
          <div className="relative max-w-full w-auto h-60 aspect-[3/1] bg-neutral-200 rounded-md mb-1">
            {(coverPreview || defaultValues?.cover_photo) && (
              <Image
                src={coverPreview || (defaultValues.cover_photo as string)}
                alt="cover photo"
                fill
                className="absolute inset-0 w-full h-full object-cover rounded-md"
                sizes="(min-width: 1540px) 724px, (min-width: 1280px) 596px, (min-width: 1040px) 468px, (min-width: 780px) 340px, 276px"
              />
            )}

            {!coverPreview && !defaultValues?.cover_photo && (
              <div className="absolute right-1/2 top-1/2">
                <ImageIcon />
              </div>
            )}

            <div className="absolute bottom-3 right-3">
              <FormField
                control={form.control}
                name="cover_photo"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <UploadButton
                        buttonLabel="上傳封面圖片"
                        onFileSelect={(file) => {
                          field.onChange(file);
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            setCoverPreview(imageUrl);
                          } else {
                            setCoverPreview(undefined);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormDescription>圖片大小需小於{maxCoverImageSize / (1024 * 1024)}MB。</FormDescription>
          {errors?.cover_photo?.message && <ErrorMessage>{String(errors?.cover_photo?.message)}</ErrorMessage>}
        </div>

        {/* Logo */}
        <div>
          <div className="flex items-end gap-4 mb-1">
            <Avatar className="h-24 w-24">
              <AvatarImage src={logoPreview || (defaultValues?.logo as string)} className="object-cover" />
              <AvatarFallback>
                <Building2 />
              </AvatarFallback>
            </Avatar>
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <UploadButton
                      buttonLabel="上傳Logo"
                      onFileSelect={(file) => {
                        field.onChange(file);
                        if (file) {
                          const imageUrl = URL.createObjectURL(file);
                          setLogoPreview(imageUrl);
                        } else {
                          setLogoPreview(undefined);
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>圖片大小需小於{maxLogoImageSize / (1024 * 1024)}MB。</FormDescription>
                </FormItem>
              )}
            />
          </div>
          {errors?.logo?.message && <ErrorMessage>{String(errors?.logo?.message)}</ErrorMessage>}
        </div>

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-bold" htmlFor="studioName">
                場地名稱
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="studioName"
                  className={`form-input text-sm ${!isOnboardingStep && user?.role !== "admin" ? "bg-gray-200" : ""}`}
                  placeholder="請輸入場地名稱"
                  {...field}
                  disabled={!isOnboardingStep && user?.role !== "admin"}
                />
              </FormControl>
              {!isOnboardingStep && <FormDescription>建立場地後無法修改，如需修改，請聯絡管理員。</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-bold" htmlFor="studioSlug">
                場地網站別名
              </FormLabel>
              <FormDescription>此處將用於在網站中顯示出的場地連結。只接受英文字、數字和連字號(hyphens)。</FormDescription>
              <FormControl>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-gray-500 text-sm">ksana.io/studio/</span>
                  <Input
                    type="text"
                    id="studioSlug"
                    placeholder="請填寫場地網站別名。"
                    className={`pl-[120px] text-sm ${!isOnboardingStep && user?.role !== "admin" ? "bg-gray-200" : ""}`}
                    {...field}
                    disabled={!isOnboardingStep && user?.role !== "admin"}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                </div>
              </FormControl>
              {!isOnboardingStep && <FormDescription>建立場地後無法修改，如需修改，請聯絡管理員。</FormDescription>}
              {isCheckingSlugUnique && <Loader2 className="animate-spin h-3 w-3" />}
              {!isCheckingSlugUnique && checkSlugUniqueMessage && (
                <p className={`text-sm ${checkSlugUniqueMessage === "可使用此網站別名。" ? "text-green-500" : "text-red-500"}`}>{checkSlugUniqueMessage}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-bold" htmlFor="studioDescription">
                場地介紹
              </FormLabel>
              <FormControl>
                <Textarea id="studioDescription" placeholder="請填寫場地介紹。" className="text-sm" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-bold" htmlFor="studioPhone">
                聯絡電話
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="studioPhone"
                  className="form-input text-sm"
                  placeholder="請填寫場地聯絡電話"
                  // Strip the country code when displaying the value
                  defaultValue={removeCountryCode(field.value)} // Remove country code for display
                  onChange={(e) => {
                    const phoneNumber = e.target.value;
                    // Update the form value with the country code on change
                    setValue("phone", `+852${phoneNumber}`);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <div>
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem className="w-[150px] mb-2">
                <FormLabel className="text-base font-bold" htmlFor="district">
                  場地地址
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="選擇場地之地區" />
                    </SelectTrigger>
                  </FormControl>
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

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input type="text" id="studioAddress" className="form-input text-sm" placeholder="請填寫場地地址" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SubmitButton isSubmitting={isSubmitting || isPending} nonSubmittingText={isOnboardingStep ? "往下一步" : "儲存"} withIcon={isOnboardingStep ? true : false} />
      </form>
    </Form>
  );
};
export default BasicInfoForm;
