"use client";
import ErrorMessage from "@/app/_components/ErrorMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudioPayoutFormData, StudioPayoutSchema } from "@/lib/validations";
import { payoutMethod } from "@/services/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import SubmitButton from "../_component/SubmitButton";
import FieldRemarks from "../_component/FieldRemarks";

interface defaultValue {
  method: string;
  account_name: string;
  account_number: string;
}

interface Props {
  studioId: number;
  defaultValue: defaultValue;
}

const PayoutForm = ({ studioId, defaultValue }: Props) => {
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudioPayoutFormData>({
    resolver: zodResolver(StudioPayoutSchema),
    defaultValues: {
      payoutMethod: defaultValue?.method,
      payoutAccountName: defaultValue?.account_name,
      payoutAccountNumber: defaultValue?.account_number,
    },
  });

  const onSubmit = async (data: StudioPayoutFormData) => {
    try {
      const response = await fetch(`/api/studio/${studioId}/payout-detail`, {
        method: "PUT",
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

      router.push(`/studio-owner/studio/${studioId}/onboarding/door-password`);
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
        <Label htmlFor="payoutMethod" className="text-base font-bold">
          收帳方法
        </Label>
        <Controller
          name="payoutMethod"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="選擇收帳方法" />
              </SelectTrigger>
              <SelectContent>
                {payoutMethod.map((item) => (
                  <SelectItem value={item.value} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <ErrorMessage> {errors.payoutMethod?.message}</ErrorMessage>

      <div className="grid w-full items-center gap-1 mt-8">
        <Label htmlFor="payoutAccountName" className="text-base font-bold">
          帳戶名稱
        </Label>
        <FieldRemarks>請填寫完整英文帳戶名稱(e.g. Chan Tai Man)。</FieldRemarks>
        <Input
          type="text"
          id="payoutAccountName"
          placeholder="請輸入帳戶名稱"
          className="text-sm"
          {...register("payoutAccountName")}
        />
      </div>

      <ErrorMessage> {errors.payoutAccountName?.message}</ErrorMessage>

      <div className="grid w-full items-center gap-1 mt-8">
        <Label htmlFor="payoutAccountNumber" className="text-base font-bold">
          帳戶號碼
        </Label>
        <Input
          type="text"
          id="payoutAccountNumber"
          placeholder="請輸入帳戶號碼"
          className="text-sm"
          {...register("payoutAccountNumber")}
        />
      </div>

      <ErrorMessage> {errors.payoutAccountNumber?.message}</ErrorMessage>

      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default PayoutForm;
