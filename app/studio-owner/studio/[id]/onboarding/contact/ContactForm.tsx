"use client";
import { studioContactFormData, studioContactSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import SubmitButton from "../_component/SubmitButton";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ErrorMessage from "@/app/_components/ErrorMessage";
import { SocialPlatform } from "@/services/model";

interface Props {
  studioId: number;
}

const socialChannels: SocialPlatform[] = [
  "website",
  "instagram",
  "facebook",
  "youtube",
];

const ContactForm = ({ studioId }: Props) => {
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<studioContactFormData>({
    resolver: zodResolver(studioContactSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: studioContactFormData) => {
    try {
      const response = await fetch(`/api/studio/${studioId}/contact`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
        }),
      });
      //   router.push(`/studio-owner/studio/${studioId}/onboarding/equipment`);
      //   router.refresh();
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
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full md:w-1/2 items-center gap-1 mb-5">
        <Label htmlFor="phone" className="text-base font-bold">
          場地聯絡電話
        </Label>

        <div className="flex items-center">
          <p className="me-2">+852</p>
          <Input
            type="tel"
            id="phone"
            placeholder="請填寫場地聯絡電話。"
            className="text-sm"
            onChange={(e) => {
              setValue("phone", `+852${e.target.value}`);
            }}
          />
        </div>

        <ErrorMessage>{errors.phone?.message}</ErrorMessage>
      </div>

      {socialChannels.map((item) => (
        <div
          className="grid w-full md:w-1/2 items-center gap-1 mb-5"
          key={item}
        >
          <Label htmlFor={item} className="text-base font-bold">
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Label>

          <Input
            type="tel"
            id={item}
            placeholder={`請填寫${item} - https://www.${item}.com/ksana`}
            className="text-sm"
            {...register(`social.${item}`)}
          />

          <ErrorMessage>{errors.social?.[item]?.message}</ErrorMessage>
        </div>
      ))}

      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default ContactForm;
