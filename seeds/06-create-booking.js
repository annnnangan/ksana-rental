/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

function formatTime(time) {
  let date = new Date(`01/01/2022 ${time}`);
  let formattedTime = date.toLocaleTimeString("en-US", { hour12: false });
  return formattedTime;
}

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("booking").del();
  await knex("booking").insert([
    {
      user_id: 2,
      studio_id: 1,
      date: new Date("2024-12-02"),
      start_time: formatTime("10:00"),
      end_time: formatTime("11:00"),
      status: "confirm",
      price: 120,
      whatsapp: "98765432",
      remarks: "可唔可以幫我set up一條Hammock。",
      is_complained: false,
    },
    {
      user_id: 2,
      studio_id: 1,
      date: new Date("2024-12-02"),
      start_time: formatTime("11:00"),
      end_time: formatTime("12:00"),
      status: "confirm",
      price: 120,
      whatsapp: "98765432",
      remarks: "可唔可以幫我set up一條Hammock。",
      is_complained: false,
    },
    {
      user_id: 2,
      studio_id: 1,
      date: new Date("2024-12-02"),
      start_time: formatTime("12:00"),
      end_time: formatTime("13:00"),
      price: 120,
      status: "pending for payment",
      whatsapp: "98765432",
      remarks: "可唔可以幫我set up一條Hammock。",
      is_complained: false,
    },
  ]);
};
