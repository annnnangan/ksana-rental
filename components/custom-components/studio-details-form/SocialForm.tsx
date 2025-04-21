"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import { SocialLinks, SocialPlatform } from "@/services/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Input } from "@/components/shadcn/input";
import {
  SocialFormData,
  SocialSchema,
} from "@/lib/validations/zod-schema/studio/studio-step-schema";
import { useTransition } from "react";
import SubmitButton from "../common/buttons/SubmitButton";
import { saveSocial } from "@/actions/studio";
import { toast } from "react-toastify";
import { useSessionUser } from "@/hooks/use-session-user";
import useStudioStatus from "@/hooks/react-query/studio-panel/useStudioStatus";
import LoadingSpinner from "../common/loading/LoadingSpinner";

interface Props {
  studioId: string;
  defaultValues: SocialLinks;
  isOnboardingStep: boolean;
}

const socialChannels: SocialPlatform[] = ["instagram", "website", "facebook", "youtube"];

const SocialForm = ({ studioId, defaultValues, isOnboardingStep }: Props) => {
  const user = useSessionUser();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data: studioStatus, isLoading: isLoadingStudioStatus } = useStudioStatus(studioId);

  /* ------------------------- React Hook Form ------------------------ */
  const form = useForm({
    resolver: zodResolver(SocialSchema),
    defaultValues: {
      social: defaultValues ?? { instagram: "", website: "", facebook: "", youtube: "" },
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (data: SocialFormData) => {
    // Update Database
    startTransition(() => {
      saveSocial(data, studioId, isOnboardingStep).then((data) => {
        toast(data.error?.message || "儲存成功。", {
          position: "top-right",
          type: data?.success ? "success" : "error",
          autoClose: 1000,
        });
        router.refresh();
        if (isOnboardingStep && data.success) {
          router.push(`/studio-owner/studio/${studioId}/onboarding/payout-info`);
        }
      });
    });
  };

  if (isLoadingStudioStatus) return <LoadingSpinner height="h-48" />;
  const disableInput = studioStatus === "reviewing" && user?.role === "user";

  return (
    <Form {...form}>
      {/* @ts-expect-error expected */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
        {socialChannels.map((item) => (
          <FormField
            key={`${item}`}
            control={form.control}
            name={`social.${item}`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-base font-bold" htmlFor={`${item}`}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                  {item === "instagram" && <FormDescription>必須填寫</FormDescription>}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    id={`${item}`}
                    className={`form-input text-sm${disableInput ? " bg-gray-200" : ""}`}
                    placeholder={`請填寫${item} - https://www.${item}.com/ksana`}
                    {...field}
                    disabled={disableInput}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {!disableInput && (
          <SubmitButton
            isSubmitting={isSubmitting || isPending}
            nonSubmittingText={isOnboardingStep ? "往下一步" : "儲存"}
            withIcon={isOnboardingStep ? true : false}
          />
        )}
      </form>
    </Form>
  );
};

export default SocialForm;
