import * as z from "zod";

const registerPasswordValidation = z
  .string()
  .min(8, { message: "密碼長度需介乎於8-15位。" })
  .max(15, { message: "密碼長度需介乎於8-15位。" })
  .regex(/^(?=.*[A-Z])(?=.*\d).{8,15}$/, {
    message: "密碼需至少包含一個大寫字母及一個數字，且長度需介乎於8至15位。",
  });

export const LoginSchema = z.object({
  email: z.string().email({ message: "請輸入電郵。" }),
  password: z.string().min(1, { message: "請輸入密碼。" }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: "請輸入電郵。" }),
    password: registerPasswordValidation,
    confirmPassword: z.string().min(1, { message: "請確認您的密碼。" }), // Ensures confirmPassword is not empty
    name: z.string().min(1, { message: "請輸入名字。" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼與確認密碼不一致。",
    path: ["confirmPassword"], // Associates the error with the confirmPassword field
  });
