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
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/1d43d4ec82137555a5666ace24b450b66281e05b213a7ee644f99adae233d800.jpg",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/279d3d3c1520a8e134ecfae6f0148416a793fd3390edd14128d8a470f0a137c1.png",
      name: "Soul Yogi Studio",
      slug: "soul-yogi-studio",
      status: "active",
      is_approved: true,
      phone: "+85298765432",
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
      name: "Olivia Studio",
      status: "draft",
      is_approved: false,
    },
  ]);
};
