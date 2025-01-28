import { knex } from "@/services/knex";
import { Knex } from "knex";

export class VerificationService {
  constructor(private knex: Knex) {}

  async getVerificationTokenByToken(token: string) {
    try {
      const verificationToken = (
        await this.knex.select("*").from("verification_token").where({ token })
      )[0];

      return {
        success: true,
        data: verificationToken,
      };
    } catch {
      return null;
    }
  }

  async getVerificationTokenByEmail(email: string) {
    try {
      const verificationToken = (
        await this.knex.select("*").from("verification_token").where({ email })
      )[0];

      return {
        success: true,
        data: verificationToken,
      };
    } catch {
      return null;
    }
  }

  async deleteVerificationToken(id: string) {
    await this.knex("verification_token")
      .where({
        id,
      })
      .del();
  }

  async insertVerificationToken(email: string, token: string, expires: Date) {
    const newVerificationToken: { email: string; token: string } = (
      await this.knex("verification_token")
        .insert({
          email,
          token,
          expires,
        })
        .returning(["email", "token"])
    )[0];

    return { success: true, data: newVerificationToken };
  }
}

export const verificationService = new VerificationService(knex);
