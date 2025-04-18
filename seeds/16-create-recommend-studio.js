/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("recommend_studio").del();

  await knex("recommend_studio").insert([
    {
      studio_id: 1,
      rank: 1,
    },
    {
      studio_id: 6,
      rank: 2,
    },
    {
      studio_id: 9,
      rank: 3,
    },
    {
      studio_id: 10,
      rank: 4,
    },
    {
      studio_id: 15,
      rank: 5,
    },
    {
      studio_id: 2,
      rank: 6,
    },
  ]);
};
