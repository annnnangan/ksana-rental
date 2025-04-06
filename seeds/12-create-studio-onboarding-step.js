/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio_onboarding_step").del();

  const studios = await knex("studio").select("id");

  if (studios.length === 0) {
    console.error("No users found! Ensure you have studios in the database.");
    return;
  }
  const steps = ["basic-info", "business-hour-and-price", "equipment", "gallery", "door-password", "social", "payout-info", "confirmation"];

  let insertList = [];

  for (let studio_id = 1; studio_id <= studios.length; studio_id++) {
    steps.forEach((step) => {
      insertList.push({
        studio_id,
        step,
        is_complete: true,
      });
    });
  }

  await knex("studio_onboarding_step").insert(insertList);
};
