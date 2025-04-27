"use server";

import * as z from "zod";

import { sendVerificationEmail } from "@/lib/mail";
import { signIn } from "@/lib/next-auth-config/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/next-auth-config/routes";
import { generateVerificationToken } from "@/lib/utils/generate-verification-token";
import { LoginSchema, RegisterSchema } from "@/lib/validations/zod-schema/auth";
import { userService } from "@/services/user/UserService";
import { verificationService } from "@/services/user/VerificationService";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>, redirect?: string) => {
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
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

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
      redirectTo: redirect || DEFAULT_LOGIN_REDIRECT,
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

export const register = async (values: z.infer<typeof RegisterSchema>, redirect?: string) => {
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

  await sendVerificationEmail(verificationToken.email, verificationToken.token, redirect);

  return {
    success: true,
    data: { message: "電郵驗證已傳送，驗證電郵後才可登入。" },
  };
};

export const newVerification = async (token: string) => {
  const existingToken = (await verificationService.getVerificationTokenByToken(token))?.data;

  if (!existingToken) {
    return { success: false, error: { message: "驗證碼錯誤，無法驗證。" } };
  }
  //Check if the verification token is expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { success: false, error: { message: "驗證碼已過期，無法驗證。" } };
  }

  const existingUser = (await userService.getUserByEmail(existingToken.email))?.data;

  if (!existingUser) {
    return { success: false, error: { message: "驗證碼錯誤，無法驗證。" } };
  }

  //Update the verification time on user table
  await userService.updateEmailVerifiedTimestamp(existingUser.id);

  //delete the verification token in the database after it is success
  await verificationService.deleteVerificationToken(token);

  return { success: true, data: { message: "驗證成功。" } };
};

export const resendVerification = async (token: string) => {
  //Check if the verification code exist
  const isExistingToken = (await verificationService.getVerificationTokenByToken(token))?.data;

  if (!isExistingToken) return { success: false, error: { message: "驗證碼錯誤，無法重新發送。" } };
  //Generate the verification token
  const verificationToken = await generateVerificationToken(isExistingToken.email);
  //Send verification token email with the above token
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: true,
    data: { message: "電郵驗證已傳送，驗證碼有效1小時。" },
  };
};
