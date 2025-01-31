import { knex } from "@/services/knex";
import { Knex } from "knex";

export class UserService {
  constructor(private knex: Knex) {}

  async getUserByEmail(email: string) {
    try {
      const user = (
        await this.knex.select("*").from("users").where({ email })
      )[0];

      return {
        success: true,
        data: user,
      };
    } catch {
      return null;
    }
  }

  async getUserById(userId: string) {
    try {
      const user = (
        await this.knex.select("*").from("users").where({ id: userId })
      )[0];

      return {
        success: true,
        data: user,
      };
    } catch {
      return null;
    }
  }

  async countStudioByUserId(userId: string) {
    try {
      const studio = await this.knex
        .select("*")
        .from("studio")
        .where({ user_id: userId });

      return {
        success: true,
        data: { studio_count: studio.length },
      };
    } catch {
      return null;
    }
  }

  async createNewUser(data: {
    name: string;
    email: string;
    hashedPassword: string;
  }) {
    const { name, email, hashedPassword } = data;

    const insertedData = await this.knex("users")
      .insert({
        name,
        email,
        password: hashedPassword,
      })
      .returning("id");

    return {
      success: true,
      data: insertedData[0].id,
    };
  }

  async updateEmailVerifiedTimestamp(userId: string) {
    await this.knex("users")
      .where({ id: userId })
      .update({ email_verified: new Date() });
  }
}

export const userService = new UserService(knex);
