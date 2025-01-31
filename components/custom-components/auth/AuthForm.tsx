"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";

import { Button } from "@/components/shadcn/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { AUTH_FIELD_NAMES, AUTH_FIELD_TYPES } from "@/lib/constants/auth";
import Link from "next/link";
import { useState, useTransition } from "react";
import AuthResponse from "./AuthResponse";
import { SocialLogin } from "./SocialLogin";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{
    success: boolean;
    data?: { message: string };
    error?: { message: string };
  }>;
  type: "LOGIN" | "REGISTER";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  // const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const isLogin = type === "LOGIN";

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (values) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      onSubmit(values).then((data) => {
        setError(data?.error?.message);
        setSuccess(data?.data?.message);
      });
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-5 flex-wrap">
        <h1 className="text-2xl font-semibold">
          {isLogin ? "歡迎回來Ksana" : "創建帳號"}
        </h1>
        <p className="text-center text-sm text-gray-400">
          {isLogin ? "還未有帳號？ " : "已有帳號? "}
          <Button variant="link" type="button" className="p-0">
            <Link
              href={isLogin ? "/auth/register" : "/auth/login"}
              className="font-bold text-primary"
            >
              {isLogin ? "快速註冊" : "馬上登入"}
            </Link>
          </Button>
        </p>
      </div>
      <div className="my-3">
        <SocialLogin />
      </div>

      <div className="flex items-center justify-center gap-3">
        <span className="flex-1 border-t border-gray-300"></span>{" "}
        <p className="text-gray-400 text-center">
          {isLogin ? "或使用電郵密碼登入" : "或填寫以下資料創建帳號。"}
        </p>
        <span className="flex-1 border-t border-gray-300"></span>{" "}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full space-y-6"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {
                      AUTH_FIELD_NAMES[
                        field.name as keyof typeof AUTH_FIELD_NAMES
                      ]
                    }
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type={
                        AUTH_FIELD_TYPES[
                          field.name as keyof typeof AUTH_FIELD_TYPES
                        ]
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <AuthResponse type="error" message={error} />

          <AuthResponse type="success" message={success} />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isLogin ? "登入" : "創建帳號"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default AuthForm;
