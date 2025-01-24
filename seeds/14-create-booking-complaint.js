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
      booking_id: 5,
      content: "場地衛生非常糟糕。",
      status: "in-progress",
      resolved_at: null,
      is_refund: null,
      refund_amount: null,
      refund_method: null,
      remarks: null,
    },
    {
      booking_id: 12,
      content: "空調壞了，室內非常悶熱，影響練習效果。",
      status: "resolved",
      resolved_at: new Date("2025-01-09"),
      is_refund: true,
      refund_amount: 60,
      refund_method: "credit",
      remarks: null,
    },
    {
      booking_id: 15,
      content: "場地與照片上有嚴重落差。",
      status: "resolved",
      resolved_at: new Date("2025-01-09"),
      is_refund: true,
      refund_amount: 120,
      refund_method: "credit",
      remarks: null,
    },
  ]);
};
