/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const tableName = "booking_complaint";
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex(tableName).del();
  await knex(tableName).insert([
    {
      review_id: 3,
      status: "in-progress",
      resolved_at: null,
      is_refund: null,
      refund_amount: null,
      refund_method: null,
      remarks: null,
    },
    {
      review_id: 4,
      status: "resolved",
      resolved_at: new Date("2025-01-09"),
      is_refund: true,
      refund_amount: 60,
      refund_method: "credit",
      remarks: null,
    },
    {
      review_id: 5,
      status: "resolved",
      resolved_at: new Date("2025-01-09"),
      is_refund: true,
      refund_amount: 120,
      refund_method: "credit",
      remarks: null,
    },
  ]);
};
