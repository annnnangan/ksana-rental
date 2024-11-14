/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

function convertTo24Hour(timeString) {
  let date = new Date(`01/01/2022 ${timeString}`);
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
      start_time: convertTo24Hour("10:00"),
      end_time: convertTo24Hour("11:00"),
      status: "confirm",
      whatsapp: "98765432",
      remarks: "可唔可以幫我set up一條Hammock。",
      is_complained: false,
    },
    {
      user_id: 2,
      studio_id: 1,
      date: new Date("2024-12-02"),
      start_time: convertTo24Hour("11:00"),
      end_time: convertTo24Hour("12:00"),
      status: "confirm",
      whatsapp: "98765432",
      remarks: "可唔可以幫我set up一條Hammock。",
      is_complained: false,
    },
    {
      user_id: 2,
      studio_id: 1,
      date: new Date("2024-12-02"),
      start_time: convertTo24Hour("12:00"),
      end_time: convertTo24Hour("13:00"),
      status: "pending for payment",
      whatsapp: "98765432",
      remarks: "可唔可以幫我set up一條Hammock。",
      is_complained: false,
    },
  ]);
};
