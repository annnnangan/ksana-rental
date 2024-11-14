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
  await knex("studio_timeblock").del();
  await knex("studio_timeblock").insert([
    {
      studio_id: 1,
      date: new Date("2024-12-02"),
      start_time: convertTo24Hour("19:00"),
      end_time: convertTo24Hour("20:00"),
    },
    {
      studio_id: 1,
      date: new Date("2024-12-05"),
      start_time: convertTo24Hour("14:00"),
      end_time: convertTo24Hour("16:00"),
    },
  ]);
};
