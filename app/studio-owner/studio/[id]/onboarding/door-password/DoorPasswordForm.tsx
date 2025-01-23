"use client";
import ErrorMessage from "@/components/custom-components/ErrorMessage";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import {
  StudioDoorPasswordFormData,
  StudioDoorPasswordSchema,
} from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import SubmitButton from "../_component/SubmitButton";
import { getOnboardingStep } from "@/lib/utils/get-onboarding-step-utils";

interface defaultValue {
  is_reveal_door_password: boolean;
  door_password: string;
}

interface Props {
  studioId: number;
  defaultValue: defaultValue;
}

const DoorPasswordForm = ({ studioId, defaultValue }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StudioDoorPasswordFormData>({
    resolver: zodResolver(StudioDoorPasswordSchema),
    defaultValues: {
      isRevealDoorPassword:
        defaultValue.is_reveal_door_password !== null
          ? (defaultValue.is_reveal_door_password.toString() as
              | "true"
              | "false")
          : undefined,
      doorPassword:
        defaultValue.is_reveal_door_password !== null
          ? defaultValue.door_password
          : undefined,
    },
  });

  const isRevealDoorPasswordData = watch("isRevealDoorPassword");

  const onSubmit = async (data: StudioDoorPasswordFormData) => {
    try {
      if (
        (defaultValue.is_reveal_door_password !== null &&
          defaultValue.is_reveal_door_password.toString() !==
            data.isRevealDoorPassword) ||
        defaultValue.door_password !== data.doorPassword
      ) {
        const saveDoorPasswordResponse = await fetch(
          `/api/studio/${studioId}/door-password`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data,
            }),
          }
        );

        if (!saveDoorPasswordResponse.ok) {
          // If the response status is not 2xx, throw an error with the response message
          const errorData = await saveDoorPasswordResponse.json();
          throw new Error(errorData?.error.message || "系統發生未預期錯誤。");
        }

        //Save Onboarding Step Track
        const onboardingStep = getOnboardingStep(pathname);
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
      }

      router.push(`/studio-owner/studio/${studioId}/onboarding/contact`);
      router.refresh();
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
      <div className="grid w-full items-center gap-1 mt-8">
        <Label htmlFor="isRevealDoorPassword" className="text-base font-bold">
          是否同意Ksana會於預約2小時前於平台上自動發送場地大門密碼給場地租用用戶？
        </Label>
        <Controller
          name="isRevealDoorPassword"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="請選擇是否同意" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">同意</SelectItem>
                <SelectItem value="false">不同意</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <ErrorMessage>{errors.isRevealDoorPassword?.message}</ErrorMessage>

      {isRevealDoorPasswordData === "true" && (
        <>
          <div className="grid w-full items-center gap-1 mt-8">
            <Label htmlFor="doorPassword" className="text-base font-bold">
              大門密碼
            </Label>
            <Input
              type="text"
              id="doorPassword"
              placeholder="請輸入大門密碼"
              className="text-sm"
              {...register("doorPassword")}
            />
          </div>

          <ErrorMessage> {errors.doorPassword?.message}</ErrorMessage>
        </>
      )}

      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default DoorPasswordForm;
