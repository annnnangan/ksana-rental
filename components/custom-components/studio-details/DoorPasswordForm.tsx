"use client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { getOnboardingStep } from "@/lib/utils/get-onboarding-step-utils";
import { DoorPasswordFormData, DoorPasswordSchema } from "@/lib/validations/zod-schema/studio/studio-step-schema";
import { useTransition } from "react";
import SubmitButton from "../buttons/SubmitButton";
import { saveDoorPassword } from "@/actions/studio";

interface Props {
  studioId: string;
  defaultValues: string;
  isOnboardingStep: boolean;
}

const DoorPasswordForm = ({ studioId, defaultValues, isOnboardingStep }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(DoorPasswordSchema),
    defaultValues: { doorPassword: defaultValues ?? "" },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (data: DoorPasswordFormData) => {
    // Update Database
    startTransition(() => {
      saveDoorPassword(data, studioId, isOnboardingStep).then((data) => {
        toast(data.error?.message || "儲存成功。", {
          position: "top-right",
          type: data?.success ? "success" : "error",
          autoClose: 1000,
        });
        router.refresh();

        if (isOnboardingStep && data.success) {
          router.push(`/studio-owner/studio/${studioId}/onboarding/social`);
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="doorPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-bold" htmlFor="doorPassword">
                大門密碼
              </FormLabel>
              <FormControl>
                <Input type="text" id="doorPassword" className="form-input text-sm" placeholder="請輸入大門密碼" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton isSubmitting={isSubmitting || isPending} nonSubmittingText={isOnboardingStep ? "往下一步" : "儲存"} withIcon={isOnboardingStep ? true : false} />
      </form>
    </Form>
  );
};

export default DoorPasswordForm;
