/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("review").del();

  const bookings = await knex("booking").select("reference_no");

  if (bookings.length === 0) {
    console.error("No booking found! Ensure you have booking in the database.");
    return;
  }

  const bookingList = bookings.map((booking) => booking.reference_no);

  await knex("review").insert([
    {
      booking_reference_no: bookingList[0],
      is_anonymous: true,
      rating: 5,
    },
    {
      booking_reference_no: bookingList[1],
      is_anonymous: true,
      rating: 4,
    },
    {
      booking_reference_no: bookingList[4],
      is_anonymous: true,
      rating: 2,
      is_complaint: true,
      review: "場地衛生非常糟糕。",
    },
    {
      booking_reference_no: bookingList[11],
      is_anonymous: true,
      rating: 2,
      is_complaint: true,
      review: "空調壞了，室內非常悶熱，影響練習效果。",
    },
    {
      booking_reference_no: bookingList[14],
      is_anonymous: true,
      rating: 2,
      is_complaint: true,
      review: "場地與照片上有嚴重落差。",
    },
  ]);
};
