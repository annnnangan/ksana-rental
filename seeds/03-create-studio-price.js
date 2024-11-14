/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio_price").del();
  await knex("studio_price").insert([
    { studio_id: 1, price_type: "non-peak", price: 120 },
    { studio_id: 1, price_type: "peak", price: 200 },
  ]);
};
