/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {
  const peakHourId = [];
  const nonPeakHourId = [];

  for (let i = 1; i <= 38; i++) {
    if (i % 2 === 0) {
      peakHourId.push(i);
    } else {
      nonPeakHourId.push(i);
    }
  }

  // Deletes ALL existing entries
  await knex("studio_business_hour").del();
  await knex("studio_business_hour").insert([
    /* --------------------------------  📅  Monday ------------------------------- */
    /* -------------------------------- Studio ID: 1 - 8 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Monday",
      is_closed: false,
      from: "00:00",
      to: "12:00",
      price_type_id: nonPeakHourId[i],
    })),

    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Monday",
      is_closed: false,
      from: "14:00",
      to: "17:00",
      price_type_id: nonPeakHourId[i],
    })),

    // Peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Monday",
      is_closed: false,
      from: "22:00",
      to: "24:00",
      price_type_id: peakHourId[i],
    })),

    /* -------------------------------- Studio ID: 9 - 16 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Monday",
      is_closed: false,
      from: "14:00",
      to: "17:00",
      price_type_id: nonPeakHourId[i + 9 - 1],
    })),

    // peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Monday",
      is_closed: false,
      from: "23:00",
      to: "24:00",
      price_type_id: peakHourId[i + 9 - 1],
    })),

    /* -------------------------------- Studio ID: 17 - 19 ------------------------------- */
    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Monday",
      is_closed: true,
    })),

    /* --------------------------------  📅 Tuesday ------------------------------- */
    /* -------------------------------- Studio ID: 1 - 8 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Tuesday",
      is_closed: false,
      from: "00:00",
      to: "15:00",
      price_type_id: nonPeakHourId[i],
    })),

    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Tuesday",
      is_closed: false,
      from: "17:00",
      to: "18:00",
      price_type_id: nonPeakHourId[i],
    })),

    // Peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Tuesday",
      is_closed: false,
      from: "22:00",
      to: "24:00",
      price_type_id: peakHourId[i],
    })),

    /* -------------------------------- Studio ID: 9 - 16 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Tuesday",
      is_closed: false,
      from: "00:00",
      to: "11:00",
      price_type_id: nonPeakHourId[i + 9 - 1],
    })),

    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Tuesday",
      is_closed: false,
      from: "15:00",
      to: "18:00",
      price_type_id: nonPeakHourId[i + 9 - 1],
    })),

    // peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Tuesday",
      is_closed: false,
      from: "20:00",
      to: "24:00",
      price_type_id: peakHourId[i + 9 - 1],
    })),

    /* -------------------------------- Studio ID: 17 - 19 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Tuesday",
      is_closed: false,
      from: "00:00",
      to: "18:00",
      price_type_id: nonPeakHourId[i + 17 - 1],
    })),

    // peak
    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Tuesday",
      is_closed: false,
      from: "18:00",
      to: "24:00",
      price_type_id: peakHourId[i + 17 - 1],
    })),
    /* --------------------------------  📅 Wednesday ------------------------------- */
    /* -------------------------------- Studio ID: 1 - 8 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Wednesday",
      is_closed: false,
      from: "00:00",
      to: "15:00",
      price_type_id: nonPeakHourId[i],
    })),

    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Wednesday",
      is_closed: false,
      from: "17:00",
      to: "18:00",
      price_type_id: nonPeakHourId[i],
    })),

    // Peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Wednesday",
      is_closed: false,
      from: "22:00",
      to: "24:00",
      price_type_id: peakHourId[i],
    })),

    /* -------------------------------- Studio ID: 9 - 16 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Wednesday",
      is_closed: false,
      from: "00:00",
      to: "11:00",
      price_type_id: nonPeakHourId[i + 9 - 1],
    })),

    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Wednesday",
      is_closed: false,
      from: "15:00",
      to: "18:00",
      price_type_id: nonPeakHourId[i + 9 - 1],
    })),

    // peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Wednesday",
      is_closed: false,
      from: "20:00",
      to: "24:00",
      price_type_id: peakHourId[i + 9 - 1],
    })),

    /* -------------------------------- Studio ID: 17 - 19 ------------------------------- */
    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Wednesday",
      is_closed: true,
    })),

    /* --------------------------------  📅 Thursday ------------------------------- */
    /* -------------------------------- Studio ID: 1 - 8 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Thursday",
      is_closed: false,
      from: "00:00",
      to: "15:00",
      price_type_id: nonPeakHourId[i],
    })),

    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Thursday",
      is_closed: false,
      from: "17:00",
      to: "18:00",
      price_type_id: nonPeakHourId[i],
    })),

    // Peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Thursday",
      is_closed: false,
      from: "22:00",
      to: "24:00",
      price_type_id: peakHourId[i],
    })),

    /* -------------------------------- Studio ID: 9 - 16 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Thursday",
      is_closed: false,
      from: "00:00",
      to: "18:00",
      price_type_id: nonPeakHourId[i + 9 - 1],
    })),

    // peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Thursday",
      is_closed: false,
      from: "22:00",
      to: "24:00",
      price_type_id: peakHourId[i + 9 - 1],
    })),

    /* -------------------------------- Studio ID: 17 - 19 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Thursday",
      is_closed: false,
      from: "00:00",
      to: "12:00",
      price_type_id: nonPeakHourId[i + 17 - 1],
    })),

    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Thursday",
      is_closed: false,
      from: "15:00",
      to: "18:00",
      price_type_id: nonPeakHourId[i + 17 - 1],
    })),

    // peak
    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Thursday",
      is_closed: false,
      from: "20:00",
      to: "24:00",
      price_type_id: peakHourId[i + 17 - 1],
    })),

    /* --------------------------------  📅 Friday ------------------------------- */
    /* -------------------------------- Studio ID: 1 - 8 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Friday",
      is_closed: false,
      from: "00:00",
      to: "10:00",
      price_type_id: nonPeakHourId[i],
    })),

    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Friday",
      is_closed: false,
      from: "14:00",
      to: "16:00",
      price_type_id: nonPeakHourId[i],
    })),

    // Peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Friday",
      is_closed: false,
      from: "22:00",
      to: "24:00",
      price_type_id: peakHourId[i],
    })),

    /* -------------------------------- Studio ID: 9 - 16 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Friday",
      is_closed: false,
      from: "00:00",
      to: "18:00",
      price_type_id: nonPeakHourId[i + 9 - 1],
    })),

    // peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Friday",
      is_closed: false,
      from: "22:00",
      to: "24:00",
      price_type_id: peakHourId[i + 9 - 1],
    })),

    /* -------------------------------- Studio ID: 17 - 19 ------------------------------- */
    // Non-peak
    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Friday",
      is_closed: false,
      from: "00:00",
      to: "12:00",
      price_type_id: nonPeakHourId[i + 17 - 1],
    })),

    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Friday",
      is_closed: false,
      from: "15:00",
      to: "17:00",
      price_type_id: nonPeakHourId[i + 17 - 1],
    })),

    // peak
    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Friday",
      is_closed: false,
      from: "22:00",
      to: "24:00",
      price_type_id: peakHourId[i + 17 - 1],
    })),
    /* --------------------------------  📅 Saturday ------------------------------- */
    /* -------------------------------- Studio ID: 1 - 8 ------------------------------- */
    // Peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Saturday",
      is_closed: false,
      from: "00:00",
      to: "12:00",
      price_type_id: peakHourId[i],
    })),

    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Saturday",
      is_closed: false,
      from: "17:00",
      to: "21:00",
      price_type_id: peakHourId[i],
    })),

    // Non-Peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Saturday",
      is_closed: false,
      from: "21:00",
      to: "24:00",
      price_type_id: nonPeakHourId[i],
    })),

    /* -------------------------------- Studio ID: 9 - 16 ------------------------------- */
    // Peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Saturday",
      is_closed: false,
      from: "00:00",
      to: "24:00",
      price_type_id: peakHourId[i + 9 - 1],
    })),

    /* -------------------------------- Studio ID: 17 - 19 ------------------------------- */
    // Peak
    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Saturday",
      is_closed: false,
      from: "00:00",
      to: "12:00",
      price_type_id: peakHourId[i + 17 - 1],
    })),

    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Saturday",
      is_closed: false,
      from: "18:00",
      to: "24:00",
      price_type_id: peakHourId[i + 17 - 1],
    })),

    /* --------------------------------  📅 Sunday ------------------------------- */
    /* -------------------------------- Studio ID: 1 - 8 ------------------------------- */
    // Peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Sunday",
      is_closed: false,
      from: "00:00",
      to: "12:00",
      price_type_id: peakHourId[i],
    })),

    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Sunday",
      is_closed: false,
      from: "17:00",
      to: "21:00",
      price_type_id: peakHourId[i],
    })),

    // Non-Peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 1,
      day_of_week: "Sunday",
      is_closed: false,
      from: "21:00",
      to: "24:00",
      price_type_id: nonPeakHourId[i],
    })),

    /* -------------------------------- Studio ID: 9 - 16 ------------------------------- */
    // Peak
    ...Array.from({ length: 8 }, (_, i) => ({
      studio_id: i + 9,
      day_of_week: "Sunday",
      is_closed: false,
      from: "00:00",
      to: "24:00",
      price_type_id: peakHourId[i + 9 - 1],
    })),

    /* -------------------------------- Studio ID: 17 - 19 ------------------------------- */
    // Peak
    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Sunday",
      is_closed: false,
      from: "00:00",
      to: "12:00",
      price_type_id: peakHourId[i + 17 - 1],
    })),

    ...Array.from({ length: 3 }, (_, i) => ({
      studio_id: i + 17,
      day_of_week: "Sunday",
      is_closed: false,
      from: "18:00",
      to: "24:00",
      price_type_id: peakHourId[i + 17 - 1],
    })),
  ]);
};
