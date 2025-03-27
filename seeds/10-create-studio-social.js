/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Fetch all user IDs from the users table
  const studios = await knex("studio").select("slug", "id");

  if (studios.length === 0) {
    console.error("No studios found! Ensure you have studios in the database.");
    return;
  }

  let socialList = [];
  studios.map((studio) =>
    socialList.push({
      studio_id: studio.id,
      type: "instagram",
      contact: `https://www.instagram.com/${studio.slug}`,
    })
  );

  [1, 2, 3].map((studio, index) =>
    socialList.push({
      studio_id: studio,
      type: "website",
      contact: `https://www.${studios[index].slug}.com/`,
    })
  );

  [1, 2, 3, 4, 5].map((studio, index) =>
    socialList.push({
      studio_id: studio,
      type: "youtube",
      contact: `https://www.youtube.com/@${studios[index].slug}`,
    })
  );

  // Deletes ALL existing entries
  await knex("studio_social").del();
  await knex("studio_social").insert(socialList);
};
