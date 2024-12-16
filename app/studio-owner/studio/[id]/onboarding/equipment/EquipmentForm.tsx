"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { studioEquipmentSchema } from "@/lib/validations";
import { equipmentMap } from "@/services/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import SubmitButton from "../_component/SubmitButton";
import ErrorMessage from "@/app/_components/ErrorMessage";

type studioEquipmentFormData = z.infer<typeof studioEquipmentSchema>;

const EquipmentForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<studioEquipmentFormData>({
    resolver: zodResolver(studioEquipmentSchema),
    defaultValues: {
      equipment: [],
    },
  });

  const onSubmit = (data: studioEquipmentFormData) => {
    console.log(data);
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
