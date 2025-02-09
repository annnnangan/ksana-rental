/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      name: "Anna Ngan",
      email: "anna_ngan@test.com",
      password: "$2a$10$IK0Ps09yk93ZUikTkJPH9.ArJhUazOsoarU9hN3DyVAVdwTt40TPe",
      email_verified: new Date(),
    },
    {
      name: "Mary Chan",
      email: "mary_test@test.com",
      password: "$2a$10$IK0Ps09yk93ZUikTkJPH9.ArJhUazOsoarU9hN3DyVAVdwTt40TPe",
      email_verified: new Date(),
    },
    {
      name: "Ken Lam",
      email: "ken_lam@test.com",
      password: "$2a$10$IK0Ps09yk93ZUikTkJPH9.ArJhUazOsoarU9hN3DyVAVdwTt40TPe",
      email_verified: new Date(),
    },
    {
      name: "Yoyo Or",
      email: "yoyo_or@test.com",
      password: "$2a$10$IK0Ps09yk93ZUikTkJPH9.ArJhUazOsoarU9hN3DyVAVdwTt40TPe",
      email_verified: new Date(),
    },
    {
      name: "Ma Ming Tai",
      email: "ma_ming_tai@test.com",
      password: "$2a$10$IK0Ps09yk93ZUikTkJPH9.ArJhUazOsoarU9hN3DyVAVdwTt40TPe",
      email_verified: new Date(),
    },
    {
      name: "Fa Lam",
      email: "fa_lam@test.com",
      password: "$2a$10$IK0Ps09yk93ZUikTkJPH9.ArJhUazOsoarU9hN3DyVAVdwTt40TPe",
      email_verified: new Date(),
    },
  ]);
};
