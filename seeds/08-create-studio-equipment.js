/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio_equipment").del();
  await knex("studio_equipment").insert([
    { studio_id: 1, equipment_id: 1 },
    { studio_id: 1, equipment_id: 2 },
    { studio_id: 1, equipment_id: 3 },
    { studio_id: 1, equipment_id: 6 },
    { studio_id: 1, equipment_id: 7 },
    { studio_id: 1, equipment_id: 8 },
    { studio_id: 1, equipment_id: 9 },
  ]);
};
