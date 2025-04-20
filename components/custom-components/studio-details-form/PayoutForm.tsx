"use client";
import { Input } from "@/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { savePayoutInfo } from "@/actions/studio";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import { payoutMethodMap } from "@/lib/constants/studio-details";
import {
  PayoutFormData,
  PayoutSchema,
} from "@/lib/validations/zod-schema/studio/studio-step-schema";
import { useTransition } from "react";
import SubmitButton from "../common/buttons/SubmitButton";
import useStudioStatus from "@/hooks/react-query/studio-panel/useStudioStatus";
import LoadingSpinner from "../common/loading/LoadingSpinner";
import { useSessionUser } from "@/hooks/use-session-user";

interface defaultValue {
  method: string;
  account_name: string;
  account_number: string;
}

interface Props {
  studioId: string;
  defaultValues: defaultValue;
  isOnboardingStep: boolean;
}

const PayoutForm = ({ studioId, defaultValues, isOnboardingStep }: Props) => {
  const user = useSessionUser();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data: studioStatus, isLoading: isLoadingStudioStatus } = useStudioStatus(studioId);

  /* ------------------------- React Hook Form ------------------------ */
  const form = useForm({
    resolver: zodResolver(PayoutSchema),
    defaultValues: {
      payoutMethod: defaultValues?.method ?? "",
      payoutAccountName: defaultValues?.account_name ?? "",
      payoutAccountNumber: defaultValues?.account_number ?? "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (data: PayoutFormData) => {
    // Update Database
    startTransition(() => {
      savePayoutInfo(data, studioId, isOnboardingStep).then((data) => {
        toast(data.error?.message || "儲存成功。", {
          position: "top-right",
          type: data?.success ? "success" : "error",
          autoClose: 1000,
        });
        router.refresh();

        if (isOnboardingStep && data.success) {
          router.push(`/studio-owner/studio/${studioId}/onboarding/confirmation`);
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
          name="payoutMethod"
          render={({ field }) => (
            <FormItem className="w-[150px] mb-2">
              <FormLabel className="text-base font-bold" htmlFor="payoutMethod">
                收帳方法
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    disabled={disableInput}
                    className={`${disableInput ? " bg-gray-200" : ""}`}
                  >
                    <SelectValue placeholder="選擇收帳方法" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {payoutMethodMap.map((item) => (
                    <SelectItem value={item.value} key={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payoutAccountName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-bold" htmlFor="payoutAccountName">
                帳戶號碼
              </FormLabel>
              <FormDescription>請填寫完整英文帳戶名稱(e.g. Chan Tai Man)。</FormDescription>
              <FormControl>
                <Input
                  type="text"
                  id="payoutAccountName"
                  className={`form-input text-sm${disableInput ? " bg-gray-200" : ""}`}
                  placeholder="請輸入帳戶名稱"
                  {...field}
                  disabled={disableInput}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payoutAccountNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-base font-bold" htmlFor="payoutAccountNumber">
                帳戶號碼
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  id="payoutAccountNumber"
                  className={`form-input text-sm${disableInput ? " bg-gray-200" : ""}`}
                  placeholder="請輸入帳戶號碼"
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

export default PayoutForm;
