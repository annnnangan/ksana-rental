"use client";
import { login } from "@/actions/auth";
import AuthForm from "@/components/custom-components/auth/AuthForm";
import { LoginSchema } from "@/lib/validations/zod-schema/auth";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/next-auth-config/routes";
import LoadingSpinner from "@/components/custom-components/common/loading/LoadingSpinner";

const LoginPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginPageContent />
    </Suspense>
  );
};

const LoginPageContent = () => {
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
