"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";
import { ZodType } from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useEffect, useState } from "react";

import { districts } from "@/services/model";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/shadcn/select";
import { Textarea } from "@/components/shadcn/textarea";
import SubmitButton from "../SubmitButton";
import { Building2, ImageIcon, Loader2 } from "lucide-react";
import UploadButton from "@/components/custom-components/UploadButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import Image from "next/image";
import ErrorMessage from "../ErrorMessage";
import { maxCoverImageSize, maxLogoImageSize } from "@/lib/validations/file";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  isOnboardingStep: boolean;
  studioId: string;
}

const BasicInfoForm2 = <T extends FieldValues>({ isOnboardingStep, studioId, schema, defaultValues, onSubmit }: Props<T>) => {
  /* ------------------------- Check if slug is unique ------------------------ */
  const [debounceSlug, setDebounceSlug] = useState("");
  const [isCheckingSlugUnique, setCheckingSlugUnique] = useState(false);
  const [isUniqueSlug, setUniqueSlug] = useState(false);
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
          setCheckSlugUniqueMessage(result?.error?.message || "此網站別名未被使用。");
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

  /* ------------------------- File Upload ------------------------ */
  const [logoPreview, setLogoPreview] = useState<string | undefined>(undefined);
  const [coverPreview, setCoverPreview] = useState<string | undefined>(undefined);

  /* ------------------------- React Hook Form ------------------------ */

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const watch = form.watch;
  const { errors } = form.formState;

  const handleSubmit: SubmitHandler<T> = async (data) => {
    console.log(data);
  };

  const logoWatch = watch("logo");

  console.log(logoWatch);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
        {/* Cover */}
        <div>
          <div className="relative max-w-full w-auto h-60 aspect-[3/1] bg-neutral-200 rounded-md mb-1">
            {coverPreview && <Image src={coverPreview} alt="cover photo" fill className="absolute inset-0 w-full h-full object-cover rounded-md" />}
            {!coverPreview && (
              <div className="absolute right-1/2 top-1/2">
                <ImageIcon />
              </div>
            )}

            <div className="absolute bottom-3 right-3">
              <FormField
                control={form.control}
                name={"cover" as Path<T>}
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
          {errors?.cover?.message && <ErrorMessage>{String(errors?.cover?.message)}</ErrorMessage>}
        </div>

        {/* Logo */}
        <div>
          <div className="flex items-end gap-4 mb-1">
            <Avatar className="h-24 w-24">
              <AvatarImage src={logoPreview} className="object-cover" />
              <AvatarFallback>
                <Building2 />
              </AvatarFallback>
            </Avatar>
            <FormField
              control={form.control}
              name={"logo" as Path<T>}
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
          name={"name" as Path<T>}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-bold" htmlFor="studioName">
                場地名稱
              </FormLabel>
              <FormControl>
                <Input type="text" id="studioName" className="form-input text-sm" placeholder="請輸入場地名稱" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name={"slug" as Path<T>}
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
                    className="pl-[120px] text-sm"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                </div>
              </FormControl>

              {isCheckingSlugUnique && <Loader2 className="animate-spin h-3 w-3" />}
              {!isCheckingSlugUnique && checkSlugUniqueMessage && (
                <p className={`text-sm ${checkSlugUniqueMessage === "此網站別名未被使用。" ? "text-green-500" : "text-red-500"}`}>{checkSlugUniqueMessage}</p>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name={"description" as Path<T>}
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

        {/* Address */}
        <div>
          <FormField
            control={form.control}
            name={"district" as Path<T>}
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
            name={"address" as Path<T>}
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

        <SubmitButton isSubmitting={false} submittingText={isOnboardingStep ? "往下一步" : "儲存"} withIcon={isOnboardingStep ? true : false} />
      </form>
    </Form>
  );
};
export default BasicInfoForm2;
