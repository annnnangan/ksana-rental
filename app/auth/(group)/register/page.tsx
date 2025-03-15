"use client";

import { register } from "@/actions/auth";
import AuthForm from "@/components/custom-components/auth/AuthForm";
import { RegisterSchema } from "@/lib/validations/zod-schema/auth";

const RegisterPage = () => {
  return (
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
      isModal={false}
    />
  );
};

export default RegisterPage;
