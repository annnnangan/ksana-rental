/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio_payout_detail").del();
  await knex("studio_payout_detail").insert([
    {
      studio_id: 1,
      method: "fps",
      account_name: "Chan Tai Man",
      account_number: "98765432",
    },
  ]);
};
