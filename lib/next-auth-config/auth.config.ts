import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { userService } from "@/services/user/UserService";
import { LoginSchema } from "../zod-schema/auth";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        // Check if the input fields fulfill the validation schema
        const validateFields = LoginSchema.safeParse(credentials);

        if (validateFields.success) {
          const { email, password } = validateFields.data;
          // Check if there is such user in database by the email
          console.log(email, password);
          const user = await userService.getUserByEmail(email);

          console.log(user);
          // If user use google/github to register, then they don't have password.
          // In this case, we don't allow them to use the credential login
          if (!user || !user.data.password) return null;
          // Check if the password match for that user
          const passwordsMatch = await bcrypt.compare(
            password,
            user.data.password
          );

          if (passwordsMatch) return user.data;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
