"use client";
import ErrorMessage from "@/components/custom-components/ErrorMessage";
import { Checkbox } from "@/components/shadcn/checkbox";
import { StudioOnBoardingTermsFormData, StudioOnBoardingTermsSchema } from "@/lib/validations/zod-schema/booking-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ConfirmationButton from "./ConfirmationButton";
import TermsAndConditions from "./TermsAndConditions";
import { getOnboardingStep } from "@/lib/utils/get-onboarding-step-utils";

interface Props {
  studioId: number;
  isFilledAllSteps: boolean;
}

const ConfirmationForm = ({ studioId, isFilledAllSteps }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<StudioOnBoardingTermsFormData>({
    resolver: zodResolver(StudioOnBoardingTermsSchema),
    defaultValues: { onboardingTerms: false },
  });

  const onboardingTermsValue = watch("onboardingTerms");

  const onSubmit = async (data: StudioOnBoardingTermsFormData) => {
    try {
      const response = await fetch(`/api/studio/${studioId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
        }),
      });

      if (!response.ok) {
        // If the response status is not 2xx, throw an error with the response message
        const errorData = await response.json();
        throw new Error(errorData?.error.message || "系統發生未預期錯誤。");
      }

      //Save Onboarding Step Track
      const onboardingStep = getOnboardingStep(pathname);
      const completeOnboardingStepResponse = await fetch(`/api/studio/${studioId}/onboarding-step`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          onboardingStep,
        }),
      });

      if (!completeOnboardingStepResponse.ok) {
        // If the response status is not 2xx, throw an error with the response message
        const errorData = await completeOnboardingStepResponse.json();
        throw new Error(errorData?.error.message || "系統發生未預期錯誤。");
      }

      toast.success("申請成功送出，請等待申請審查。");
      router.push("/studio-owner/studios");
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
    <form onSubmit={(e) => e.preventDefault()}>
      <TermsAndConditions />
      <div className="flex mt-5 gap-2 items-center">
        <Controller name="onboardingTerms" control={control} render={({ field }) => <Checkbox checked={field.value} id="onboardingTerms" onCheckedChange={field.onChange} />} />
        <label htmlFor="onboardingTerms">同意以上條款與細則</label>
      </div>
      <ErrorMessage>{errors.onboardingTerms?.message}</ErrorMessage>

      <ConfirmationButton isFilledAllSteps={isFilledAllSteps} isAcceptedTnC={onboardingTermsValue} onSubmit={handleSubmit(onSubmit)} />
    </form>
  );
};

export default ConfirmationForm;
