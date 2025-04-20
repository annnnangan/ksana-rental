"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  DoorPasswordFormData,
  DoorPasswordSchema,
} from "@/lib/validations/zod-schema/studio/studio-step-schema";
import { useTransition } from "react";
import SubmitButton from "../common/buttons/SubmitButton";
import { saveDoorPassword } from "@/actions/studio";
import useStudioStatus from "@/hooks/react-query/studio-panel/useStudioStatus";
import { useSessionUser } from "@/hooks/use-session-user";
import LoadingSpinner from "../common/loading/LoadingSpinner";

interface Props {
  studioId: string;
  defaultValues: string;
  isOnboardingStep: boolean;
}

const DoorPasswordForm = ({ studioId, defaultValues, isOnboardingStep }: Props) => {
  const user = useSessionUser();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data: studioStatus, isLoading: isLoadingStudioStatus } = useStudioStatus(studioId);

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

  if (isLoadingStudioStatus) return <LoadingSpinner height="h-48" />;
  const disableInput = studioStatus === "reviewing" && user?.role === "user";

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
                <Input
                  type="text"
                  id="doorPassword"
                  className={`form-input text-sm${disableInput ? " bg-gray-200" : ""}`}
                  placeholder="請輸入大門密碼"
                  {...field}
                  disabled={disableInput}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

export default DoorPasswordForm;
