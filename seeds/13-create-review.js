/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("review").del();
  await knex("review").insert([
    {
      booking_id: 1,
      anonymous: true,
      rating: 5,
    },
    {
      booking_id: 2,
      anonymous: true,
      rating: 4,
    },
  ]);
};
