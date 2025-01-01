"use client";
import ErrorMessage from "@/app/_components/ErrorMessage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { removeCountryCode } from "@/lib/utils/remove-country-code";
import { studioContactFormData, studioContactSchema } from "@/lib/validations";
import { SocialLinks, SocialPlatform } from "@/services/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import SubmitButton from "../_component/SubmitButton";
import { getOnboardingStep } from "@/lib/utils/get-onboarding-step-utils";

interface Props {
  studioId: number;
  phoneDefaultValue: string;
  socialDefaultValue: SocialLinks;
}

const socialChannels: SocialPlatform[] = [
  "website",
  "instagram",
  "facebook",
  "youtube",
];

const ContactForm = ({
  studioId,
  phoneDefaultValue,
  socialDefaultValue,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<studioContactFormData>({
    resolver: zodResolver(studioContactSchema),
    defaultValues: { phone: phoneDefaultValue, social: socialDefaultValue },
  });

  const onSubmit = async (data: studioContactFormData) => {
    try {
      //save in database only when change happens
      if (phoneDefaultValue !== data.phone) {
        const response = await fetch(`/api/studio/${studioId}/contact/phone`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData?.error.message || "系統發生未預期錯誤，請重試。"
          );
        }
      }

      //Check which social link needs to be updated
      const socialUpdates: Partial<SocialLinks> = {};
      for (const [key, value] of Object.entries(data.social) as [
        SocialPlatform,
        string
      ][]) {
        if (value !== socialDefaultValue[key]) {
          socialUpdates[key] = value;
        }
      }

      //Only when there is social link needs to be updated, we called the API
      if (Object.keys(socialUpdates).length > 0) {
        const socialResponse = await fetch(
          `/api/studio/${studioId}/contact/social`,
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

        if (!socialResponse.ok) {
          const errorData = await socialResponse.json();
          throw new Error(
            errorData?.error.message || "系統發生未預期錯誤，請重試。"
          );
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
      router.push(`/studio-owner/studio/${studioId}/onboarding/payout-info`);
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
      <div className="grid w-full md:w-1/2 items-center gap-1 mb-5">
        <Label htmlFor="phone" className="text-base font-bold">
          場地聯絡電話
        </Label>

        <div className="flex items-center">
          <p className="me-2">+852</p>

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                type="tel"
                id="phone"
                defaultValue={removeCountryCode(field.value)}
                placeholder="請填寫場地聯絡電話。"
                className="text-sm"
                onChange={(e) => {
                  setValue("phone", `+852${e.target.value}`);
                }}
              />
            )}
          />
        </div>

        <ErrorMessage>{errors.phone?.message}</ErrorMessage>
      </div>

      {socialChannels.map((item) => (
        <div
          className="grid w-full md:w-1/2 items-center gap-1 mb-5"
          key={item}
        >
          <Label htmlFor={item} className="text-base font-bold">
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </Label>

          <Input
            type="text"
            id={item}
            placeholder={`請填寫${item} - https://www.${item}.com/ksana`}
            className="text-sm"
            {...register(`social.${item}`)}
          />

          <ErrorMessage>{errors.social?.[item]?.message}</ErrorMessage>
        </div>
      ))}

      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
};

export default ContactForm;
