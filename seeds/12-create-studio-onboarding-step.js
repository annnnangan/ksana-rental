/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio_onboarding_step").del();
  await knex("studio_onboarding_step").insert([
    {
      studio_id: 1,
      step: "basic-info",
      is_complete: true,
    },
    {
      studio_id: 1,
      step: "business-hour-and-price",
      is_complete: true,
    },
    {
      studio_id: 1,
      step: "equipment",
      is_complete: true,
    },
    {
      studio_id: 1,
      step: "gallery",
      is_complete: true,
    },
    {
      studio_id: 1,
      step: "door-password",
      is_complete: true,
    },
    {
      studio_id: 1,
      step: "contact",
      is_complete: true,
    },
    {
      studio_id: 1,
      step: "payout-info",
      is_complete: true,
    },
    {
      studio_id: 1,
      step: "confirmation",
      is_complete: true,
    },
    {
      studio_id: 2,
      step: "basic-info",
      is_complete: false,
    },
    {
      studio_id: 2,
      step: "business-hour-and-price",
      is_complete: false,
    },
    {
      studio_id: 2,
      step: "equipment",
      is_complete: false,
    },
    {
      studio_id: 2,
      step: "gallery",
      is_complete: false,
    },
    {
      studio_id: 2,
      step: "door-password",
      is_complete: false,
    },
    {
      studio_id: 2,
      step: "contact",
      is_complete: false,
    },
    {
      studio_id: 2,
      step: "payout-info",
      is_complete: false,
    },
    {
      studio_id: 2,
      step: "confirmation",
      is_complete: false,
    },
  ]);
};
