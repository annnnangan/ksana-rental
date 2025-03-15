"use client";
import { login } from "@/actions/auth";
import AuthForm from "@/components/custom-components/auth/AuthForm";
import { LoginSchema } from "@/lib/validations/zod-schema/auth";
import React from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/next-auth-config/routes";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  return (
    <AuthForm
      type="LOGIN"
      schema={LoginSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={login}
      isModal={false}
      callbackUrl={redirectUrl || DEFAULT_LOGIN_REDIRECT}
    />
  );
};

export default LoginPage;
