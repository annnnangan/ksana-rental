"use client";
import { login } from "@/actions/auth";
import AuthForm from "@/components/custom-components/auth/AuthForm";
import { LoginSchema } from "@/lib/zod-schema/auth";
import React from "react";

const LoginPage = () => {
  return (
    <AuthForm
      type="LOGIN"
      schema={LoginSchema}
      defaultValues={{
        email: "",
        password: "",
      }}
      onSubmit={login}
    />
  );
};

export default LoginPage;
