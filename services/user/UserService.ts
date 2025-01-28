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
}

export const userService = new UserService(knex);
