/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("studio").del();
  await knex("studio").insert([
    {
      user_id: 1,
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/15740c472df24fde1d3f9b4fefcbdced743bf57acd26ed8c820c56a887d663d2.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/2da6e2bc0b9c4bde8241c937e0672f22602607021868eab8b3a5f741c0354d82.png",
      name: "Soul Yogi Studio",
      slug: "soul-yogi-studio",
      status: "active",
      is_approved: true,
      area: "kowloon",
      district: "sham-shui-po",
      address: "荔枝角金百盛大廈20樓20室",
      description: `🩰 空中舞蹈課程｜空中及地面瑜伽課程｜場地租用 
🏞️ 4.3米高樓底｜山景落地大玻璃｜800呎課室連獨立內廁 
🏛️ 優雅圓拱門設計｜場地設有多種燈光效果`,
      is_reveal_door_password: true,
      door_password: "859304#",
    },
    {
      user_id: 1,
      status: "draft",
      is_approved: false,
    },
  ]);
};
