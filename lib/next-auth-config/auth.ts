import NextAuth from "next-auth";
import { knex } from "@/services/knex"; //db - config
import { KnexAdapter } from "./knex-adapter";
import authConfig from "./auth.config";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  adapter: KnexAdapter(knex),
  session: { strategy: "jwt" },
  ...authConfig,
});
