"use client";
import React, { useState } from "react";
import { CirclePlus, Copy, Loader2, MoveRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { studioNameSchema } from "@/lib/validations";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/app/_components/ErrorMessage";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
type StudioNameFormData = z.infer<typeof studioNameSchema>;

const AddNewStudio = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudioNameFormData>({
    resolver: zodResolver(studioNameSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const response = await fetch("/api/studio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // If the response status is not 2xx, throw an error with the response message
        const errorData = await response.json();
        throw new Error(errorData?.error.message || "系統發生錯誤，請重試。");
      }

      const studioIdResult = await response.json();

      router.push(
        `/studio-owner/studio/${studioIdResult.data}/onboarding/basic-info`
      );
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      const errorMessage = (error as Error).message || "系統發生錯誤，請重試。";
      router.refresh();
      toast(errorMessage, {
        position: "bottom-right",
        type: "error",
        autoClose: 1000,
      });
    }
  });

  return (
    <Dialog>
      <DialogTrigger className="px-3 pb-10 w-full min-h-[250px] lg:min-h-[300px] lg:w-1/2 xl:w-1/3">
        <div className="border-2 h-full rounded-sm bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
          <div className="flex gap-x-1 justify-center items-center h-full">
            <CirclePlus size={20} className="text-primary" />
            <p className="text-sm text-primary font-bold">新增場地</p>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增場地</DialogTitle>
          <DialogDescription>輸入場地名稱開始登記</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="name" className="sr-only">
                Link
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="請輸入場地名稱"
                className="text-sm"
                {...register("name")}
              />
              <ErrorMessage> {errors.name?.message}</ErrorMessage>
            </div>
          </div>
          <DialogFooter className="sm:justify-start mt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "處理中..." : "開始建立"}
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <MoveRight />
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewStudio;
