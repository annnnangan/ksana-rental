"use server";

import * as z from "zod";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/next-auth-config/routes";
import { userService } from "@/services/user/UserService";
import { signIn } from "@/lib/next-auth-config/auth";
import { LoginSchema, RegisterSchema } from "@/lib/zod-schema/auth";
import { generateVerificationToken } from "@/lib/utils/generate-verification-token";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { success: false, error: { message: "資料錯誤，無法登入。" } };
  }

  const { email, password } = validateFields.data;
  const existingUser = (await userService.getUserByEmail(email))?.data;

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { success: false, error: { message: "資料錯誤，無法登入。" } };
  }

  if (!existingUser.email_verified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    console.log(verificationToken);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: true,
      data: { message: "新的電郵驗證已傳送，驗證電郵後才可登入。" },
    };
  }

  try {
    //give this function the provider for login, in this case, it is credentials
    //also give this function the information that is used to sign in
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return { success: true, data: { message: "成功登入" } };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: { message: "資料錯誤，無法登入，請重試。" },
          };
        default:
          return {
            success: false,
            error: { message: "系統出現問題。" },
          };
      }
    }
    throw error;
  }
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);
  if (!validateFields.success) {
    return {
      success: false,
      error: { message: "資料錯誤，無法註冊，請重試。" },
    };
  }

  const { email, password, name } = validateFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = (await userService.getUserByEmail(email))?.data;

  if (existingUser) {
    return {
      success: false,
      error: { message: "資料錯誤，無法註冊，請重試。" },
    };
  }

  await userService.createNewUser({
    name,
    email,
    hashedPassword,
  });

  //Generate the verification token
  const verificationToken = await generateVerificationToken(email);
  //Send verification token email with the above token

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: true,
    data: { message: "電郵驗證已傳送，驗證電郵後才可登入。" },
  };
};
