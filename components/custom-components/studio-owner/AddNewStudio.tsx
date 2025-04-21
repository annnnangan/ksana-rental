"use client";
import SlideArrowButton from "@/components/animata/button/slide-arrow-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { CirclePlus } from "lucide-react";
import SubmitButton from "../common/buttons/SubmitButton";

import {
  StudioNameFormData,
  StudioNameSchema,
} from "@/lib/validations/zod-schema/studio/studio-step-schema";

import { createNewDraftStudio } from "@/actions/studio";
import { useSessionUser } from "@/hooks/use-session-user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  hasCreatedStudio: boolean;
  isDashboard?: boolean;
}

const AddNewStudio = ({ hasCreatedStudio, isDashboard }: Props) => {
  /* ------------------------- React Hook Form ------------------------ */
  const form = useForm({
    resolver: zodResolver(StudioNameSchema),
    defaultValues: { name: "" },
  });

  const { isSubmitting } = form.formState;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  /* ------------------------- Form Submit ------------------------ */
  const handleSubmit = async (data: StudioNameFormData) => {
    // Update Database
    startTransition(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      createNewDraftStudio(data).then((data) => {
        if (!data.success) {
          toast("無法建立場地。", {
            position: "top-right",
            type: "error",
            autoClose: 1000,
          });
        } else {
          router.push(`/studio-owner/studio/${data.data.id}/onboarding/basic-info`);
        }
        router.refresh();
      });
    });
  };

  return (
    <Dialog>
      {hasCreatedStudio && (
        <DialogTrigger className="px-3 pb-10 w-full min-h-[250px] lg:min-h-[300px]">
          <div className="border-2 h-full rounded-sm bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex gap-x-1 justify-center items-center h-full">
              <CirclePlus size={20} className="text-primary" />
              <p className="text-sm text-primary font-bold">新增場地</p>
            </div>
          </div>
        </DialogTrigger>
      )}

      {!hasCreatedStudio && !isDashboard && (
        <div className="flex justify-center items-center mt-20">
          <DialogTrigger asChild>
            <div className="flex flex-col items-center cursor-pointer">
              <Image
                src="/yoga-cartoon/yoga-girl-doing-anjaneyasana-pose.png"
                alt="yoga image"
                width="200"
                height="200"
              />
              <SlideArrowButton primaryColor="hsl(var(--primary))">
                建立你的第一個場地
              </SlideArrowButton>
            </div>
          </DialogTrigger>
        </div>
      )}

      {!hasCreatedStudio && isDashboard && (
        <DialogTrigger asChild>
          <SlideArrowButton primaryColor="hsl(var(--primary))" className="mt-5">
            開始建立
          </SlideArrowButton>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增場地</DialogTitle>
          <DialogDescription>輸入場地名稱開始登記</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="text"
                      id="studioName"
                      className={`form-input text-sm`}
                      placeholder="請輸入場地名稱"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton isSubmitting={isSubmitting || isPending} nonSubmittingText={"開始建立"} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewStudio;
