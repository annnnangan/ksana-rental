import NextAuth from "next-auth";
import { knex } from "@/services/knex"; //db - config
import { KnexAdapter } from "./knex-adapter";
import authConfig from "./auth.config";
import { userService } from "@/services/user/UserService";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  events: {
    async linkAccount({ user }) {
      if (user) {
        await userService.updateEmailVerifiedTimestamp(user.id!);
      }
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;
      const existingUser = (await userService.getUserById(user.id!))?.data;
      // Prevent sign in without email verification
      if (!existingUser?.email_verified) return false;
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as "user" | "admin";
      }

      return session;
    },
    async jwt({ token }) {
      //If no user id, then return directly
      if (!token.sub) return token;

      const existingUser = (await userService.getUserById(token.sub))?.data;

      if (!existingUser) return token;
      token.role = existingUser.role;
      return token;
    },
  },
  adapter: KnexAdapter(knex),
  session: { strategy: "jwt" },
  ...authConfig,
});
