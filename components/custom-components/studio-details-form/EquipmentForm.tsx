"use client";

import { Checkbox } from "@/components/shadcn/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import SubmitButton from "../common/buttons/SubmitButton";

import {
  EquipmentFormData,
  EquipmentSchema,
} from "@/lib/validations/zod-schema/studio/studio-step-schema";

import { saveEquipment } from "@/actions/studio";
import { equipmentMap } from "@/lib/constants/studio-details";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { useSessionUser } from "@/hooks/use-session-user";
import useStudioStatus from "@/hooks/react-query/studio-panel/useStudioStatus";
import LoadingSpinner from "../common/loading/LoadingSpinner";

interface Props {
  defaultValues: string[] | [];
  studioId: string;
  isOnboardingStep: boolean;
}

const EquipmentForm = ({ defaultValues, studioId, isOnboardingStep }: Props) => {
  const user = useSessionUser();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { data: studioStatus, isLoading: isLoadingStudioStatus } = useStudioStatus(studioId);
  /* ------------------------- React Hook Form ------------------------ */
  const form = useForm<z.infer<typeof EquipmentSchema>>({
    resolver: zodResolver(EquipmentSchema),
    defaultValues: {
      equipment: [...defaultValues],
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: EquipmentFormData) => {
    startTransition(() => {
      saveEquipment(data, studioId, isOnboardingStep).then((data) => {
        toast(data.error?.message || "儲存成功。", {
          position: "top-right",
          type: data?.success ? "success" : "error",
          autoClose: 1000,
        });

        router.refresh();

        if (isOnboardingStep && data.success) {
          router.push(`/studio-owner/studio/${studioId}/onboarding/gallery`);
        }
      });
    });
  };

  if (isLoadingStudioStatus) return <LoadingSpinner height="h-48" />;
  const disableInput = studioStatus === "reviewing" && user?.role === "user";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="equipment"
          render={() => (
            <FormItem className="space-y-4">
              {equipmentMap.map((item) => (
                <FormField
                  key={item.value}
                  control={form.control}
                  name="equipment"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.value}
                        className="flex flex-row items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.value)}
                            className="h-6 w-6"
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field?.value, item.value])
                                : field.onChange(
                                    field?.value?.filter((value) => value !== item.value)
                                  );
                            }}
                            disabled={disableInput}
                          />
                        </FormControl>
                        <FormLabel className="text-md font-normal">{item.label}</FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
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

export default EquipmentForm;
