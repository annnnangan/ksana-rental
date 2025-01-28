"use client";

import { register } from "@/actions/auth";
import AuthForm from "@/components/custom-components/auth/AuthForm";
import { RegisterSchema } from "@/lib/zod-schema/auth";

const RegisterPage = () => (
  <AuthForm
    type="REGISTER"
    schema={RegisterSchema}
    defaultValues={{
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }}
    onSubmit={register}
  />
);

export default RegisterPage;
