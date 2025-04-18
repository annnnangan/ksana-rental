"use client";

import { Checkbox } from "@/components/shadcn/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { z } from "zod";
import { toast } from "react-toastify";
import { saveEquipment } from "@/actions/studio";
import { equipmentMap } from "@/lib/constants/studio-details";

interface Props {
  defaultValues: string[] | [];
  studioId: string;
  isOnboardingStep: boolean;
}

const EquipmentForm = ({ defaultValues, studioId, isOnboardingStep }: Props) => {
  /* ------------------------- React Hook Form ------------------------ */
  const form = useForm<z.infer<typeof EquipmentSchema>>({
    resolver: zodResolver(EquipmentSchema),
    defaultValues: {
      equipment: [...defaultValues],
    },
  });

  const { isSubmitting } = form.formState;
  const { errors } = form.formState;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
        <SubmitButton
          isSubmitting={isSubmitting || isPending}
          nonSubmittingText={isOnboardingStep ? "往下一步" : "儲存"}
          withIcon={isOnboardingStep ? true : false}
        />
      </form>
    </Form>
  );
};

export default EquipmentForm;
