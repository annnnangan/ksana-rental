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
    { studio_id: 2, price_type: "non-peak", price: 150 },
    { studio_id: 2, price_type: "peak", price: 220 },
    { studio_id: 3, price_type: "non-peak", price: 130 },
    { studio_id: 3, price_type: "peak", price: 210 },
    { studio_id: 4, price_type: "non-peak", price: 140 },
    { studio_id: 4, price_type: "peak", price: 230 },
    { studio_id: 5, price_type: "non-peak", price: 160 },
    { studio_id: 5, price_type: "peak", price: 240 },
    { studio_id: 6, price_type: "non-peak", price: 125 },
    { studio_id: 6, price_type: "peak", price: 210 },
    { studio_id: 7, price_type: "non-peak", price: 110 },
    { studio_id: 7, price_type: "peak", price: 190 },
    { studio_id: 8, price_type: "non-peak", price: 170 },
    { studio_id: 8, price_type: "peak", price: 250 },
  ]);
};
