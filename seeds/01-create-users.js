const { password } = require("pg/lib/defaults");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      first_name: "Anna",
      last_name: "Ngan",
      email: "annangan1998@gmail.com",
      password: "123456",
      image: "",
      status: "active",
      role: "studio owner",
      login_method: "credential",
    },
    {
      first_name: "Mary",
      last_name: "Lam",
      email: "mary_test@gmail.com",
      password: "123456",
      image: "",
      status: "active",
      role: "rental user",
      login_method: "credential",
    },
  ]);
};
