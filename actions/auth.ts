"use server";

import * as z from "zod";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/next-auth-config/routes";
import { userService } from "@/services/user/UserService";
import { signIn } from "@/lib/next-auth-config/auth";
import { LoginSchema, RegisterSchema } from "@/lib/zod-schema/auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { success: false, error: { message: "Invalid Fields" } };
  }

  const { email, password } = validateFields.data;
  try {
    //give this function the provider for login, in this case, it is credentials
    //also give this function the information that is used to sign in
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: { message: "Invalid credentials" } };
        default:
          return {
            success: false,
            error: { message: "Something went wrong!" },
          };
      }
    }
    throw error;
  }
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);
  if (!validateFields.success) {
    return { success: false, error: { message: "Invalid Fields" } };
  }

  const { email, password, name } = validateFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await userService.getUserByEmail(email);

  if (existingUser) {
    return { success: false, error: { message: "Email already in use" } };
  }

  await userService.createNewUser({
    name,
    email,
    hashedPassword,
  });

  //TODO: Send verification token email

  return { success: true };
};
