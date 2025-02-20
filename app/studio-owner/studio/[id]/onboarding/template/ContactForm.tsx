"use client";
import { studioContactFormData, studioContactSchema } from "@/lib/validations/zod-schema/booking-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import SubmitButton from "../_component/SubmitButton";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface Props {
  studioId: number;
}

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
      console.log(data);

      router.push(`/studio-owner/studio/${studioId}/onboarding/equipment`);
      router.refresh();

      //Save text information to database
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "系統發生未預期錯誤，請重試。";
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
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default ContactForm;
