"use client";

import ErrorMessage from "@/app/_components/ErrorMessage";
import { Checkbox } from "@/components/ui/checkbox";
import {
  studioEquipmentFormData,
  studioEquipmentSchema,
} from "@/lib/validations";
import { equipmentMap } from "@/services/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import SubmitButton from "../_component/SubmitButton";
import { getOnboardingStep } from "@/lib/utils/get-onboarding-step-utils";

interface Props {
  defaultValue: string[];
  studioId: number;
}

const EquipmentForm = ({ defaultValue, studioId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<studioEquipmentFormData>({
    resolver: zodResolver(studioEquipmentSchema),
    defaultValues: {
      equipment: defaultValue,
    },
  });

  const onSubmit = async (data: studioEquipmentFormData) => {
    try {
      const saveEquipmentResponse = await fetch(
        `/api/studio/${studioId}/equipment`,
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

      if (!saveEquipmentResponse.ok) {
        const errorData = await saveEquipmentResponse.json();
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

      router.push(`/studio-owner/studio/${studioId}/onboarding/gallery`);
      router.refresh();

      //Save text information to database
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
      <div className="mb-2">
        <ErrorMessage>{errors.equipment?.message}</ErrorMessage>
      </div>
      {equipmentMap.map((item) => (
        <div key={item.value} className="flex items-center space-x-2 mb-3">
          <Controller
            name="equipment"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value?.includes(item.value)}
                id={item.value}
                onCheckedChange={(checked) => {
                  return checked
                    ? field.onChange([...field.value, item.value])
                    : field.onChange(
                        field.value?.filter((value) => value !== item.value)
                      );
                }}
              />
            )}
          />
          <label htmlFor={item.value}>{item.label}</label>
        </div>
      ))}

      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default EquipmentForm;
