"use client";
import SubmitButton from "@/components/custom-components/buttons/SubmitButton";
import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/shadcn/form";
import { OnboardingTermsFormData, OnboardingTermsSchema } from "@/lib/validations/zod-schema/studio/studio-step-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TermsAndConditions from "./TermsAndConditions";
import { toast } from "react-toastify";
import { completeOnboardingApplication } from "@/actions/studio";

interface Props {
  studioId: string;
  isFilledAllSteps: boolean;
}

const ConfirmationForm = ({ studioId, isFilledAllSteps }: Props) => {
  const form = useForm<z.infer<typeof OnboardingTermsSchema>>({
    resolver: zodResolver(OnboardingTermsSchema),
    defaultValues: {
      onboardingTerms: false,
    },
  });

  const { isSubmitting } = form.formState;

  const { watch } = form;

  const onboardingTermsWatch = watch("onboardingTerms");

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onSubmit = async (data: OnboardingTermsFormData) => {
    startTransition(() => {
      completeOnboardingApplication(data, studioId).then((data) => {
        toast(data.error?.message || "申請成功送出，請等待申請審查。", {
          position: "top-right",
          type: data?.success ? "success" : "error",
          autoClose: 1000,
        });
        router.refresh();
        if (data.success) {
          router.push("/studio-owner/studios");
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <TermsAndConditions />
        <FormField
          control={form.control}
          name="onboardingTerms"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6" />
                </FormControl>
                <FormLabel className="text-md font-normal">同意以上條款與細則</FormLabel>
              </FormItem>
            );
          }}
        />

        <Dialog>
          <DialogTrigger asChild>
            <Button type="button" className="mt-5 px-12" disabled={!isFilledAllSteps || !onboardingTermsWatch}>
              送出申請
            </Button>
          </DialogTrigger>

          {onboardingTermsWatch && (
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>你確認要送出申請嗎？</DialogTitle>
                <DialogDescription>請確保所有資料正確無誤，否則申請通過時間會被延誤。</DialogDescription>
              </DialogHeader>

              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <div onClick={form.handleSubmit(onSubmit)}>
                    <SubmitButton isSubmitting={isSubmitting} submittingText={"申請送出中..."} nonSubmittingText={"確認送出"} />
                  </div>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </form>
    </Form>
  );
};

export default ConfirmationForm;
