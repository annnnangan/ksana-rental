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
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-cover.jpg",
      name: "Soul Yogi Studio",
      slug: "soul-yogi-studio",
      status: "active",
      is_approved: true,
      phone: "+85298765432",
      area: "kowloon",
      district: "sham-shui-po",
      address: "香港長沙灣大南西街609號2樓10室",
      description: `帶來內心平靜與身心和諧的空間，讓你放鬆自我，重拾能量🌱
🧘‍♂️ 空中舞蹈課程｜地面瑜伽課程｜場地租用
🏔️ 4.3米高樓底｜山景落地大玻璃｜800呎課室連獨立內廁
🌟 優雅圓拱門設計｜場地設有多種燈光效果｜高級音響設備`,
      is_reveal_door_password: true,
      door_password: "859304#",
    },
    {
      user_id: 1,
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/olivia/olivia-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/olivia/olivia-cover.jpg",
      name: "Olivia Studio",
      slug: "olivia-studio",
      status: "active",
      is_approved: true,
      phone: "+85298765432",
      area: "kowloon",
      district: "sham-shui-po",
      address: "香港荔枝角永康街63號Global Gateway Tower 2701室",
      description: `💪 瑜伽與普拉提結合課程｜身心靈調理｜個別指導
🪴 可調式瑜伽墊｜大面積綠意戶外空間
🔊 簡約大堂設計｜帶有溫暖氣氛的照明設備｜影像投影系統`,
      is_reveal_door_password: true,
      door_password: "859304#",
    },
    {
      user_id: 3,
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/zen-oasis/zen-oasis-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/zen-oasis/zen-oasis-cover.jpg",
      name: "Zen Oasis",
      slug: "zen-oasis",
      status: "active",
      is_approved: true,
      phone: "+85298765432",
      area: "kowloon",
      district: "sham-shui-po",
      address: "荔枝角金百盛大廈6樓20室",
      description: `🧘‍♂️ 陶冶身心的瑜伽課程｜動態與靜態練習
🌞 大型落地窗｜早晨的第一道陽光
🎶 簡約明亮設計｜高科技音響與視頻設備｜氛圍燈光效果`,
      is_reveal_door_password: true,
      door_password: "859304#",
    },
    {
      user_id: 3,
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/larana/larana-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/larana/larana-cover.jpg",
      name: "Larana Yoga",
      slug: "larana-yoga",
      status: "active",
      is_approved: true,
      phone: "+85298765432",
      area: "kowloon",
      district: "sham-shui-po",
      address: "荔枝角金百盛大廈10樓28室",
      description: `🧘‍♂️ 瑜伽冥想課程｜動作與呼吸協調
🏡 開放式設計｜大自然綠化空間｜舒適的瑜伽墊
🎶 溫暖木質設計｜柔和燈光與香薰氣氛｜影音互動設施`,
      is_reveal_door_password: true,
      door_password: "859304#",
    },
    {
      user_id: 1,
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/acro/acro-yoga-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/acro/acro-yoga-cover.jpg",
      name: "Acro Yoga",
      slug: "acro-yoga",
      status: "active",
      is_approved: true,
      phone: "+85298765432",
      area: "kowloon",
      district: "yau-tsim-mong",
      address: "尖沙咀彌敦道123號3樓",
      description:
        "🤸‍♀️ 空中瑜伽與雜技練習｜動態伸展與體力訓練\n🎯 多功能訓練空間｜適合小組活動\n💡 具有柔光與多重燈效設置，營造活力氛圍",
      is_reveal_door_password: true,
      door_password: "627493#",
    },
    {
      user_id: 4,
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/nala/nala-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/nala/nala-cover.jpg",
      name: "Nala Studio",
      slug: "nala-studio",
      status: "active",
      is_approved: true,
      phone: "+85298765432",
      area: "kowloon",
      district: "kowloon-city",
      address: "九龍城啟德道456號6樓",
      description:
        "🌸 融合瑜伽與冥想｜身心靈深度放鬆\n🏞️ 窗外可見迷人海景｜寧靜的環境讓人心曠神怡\n🪔 現代設計配合燭光效果，創造沉浸式體驗",
      is_reveal_door_password: true,
      door_password: "384926#",
    },
    {
      user_id: 4,
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/venus-moon/venus-moon-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/venus-moon/venus-moon-cover.jpg",
      name: "Venus Moon",
      slug: "venus-moon",
      status: "active",
      is_approved: true,
      phone: "+85298765432",
      area: "kowloon",
      district: "kwun-tong",
      address: "觀塘道789號5樓",
      description:
        "🌙 精緻瑜伽課程｜從身體放鬆到心靈啟發\n💪 互動式課程設計｜適合各種級別\n🏡 開放式設計與多功能空間，靈活變化課程需求",
      is_reveal_door_password: true,
      door_password: "920384#",
    },
    {
      user_id: 4,
      logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/yoga-delight/yoga-delight-logo.png",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/yoga-delight/yoga-delight-cover.jpg",
      name: "Yoga Delight",
      slug: "yoga-delight",
      status: "active",
      is_approved: true,
      phone: "+85298765432",
      area: "kowloon",
      district: "tsuen-wan",
      address: "荃灣青山道321號4樓",
      description:
        "🍃 舒適與放鬆並行的瑜伽課程｜專業的瑜伽指導\n🌞 環境簡約，充滿自然光，適合冥想與休息\n🎶 燈光與音響配合，為每一堂課創造和諧氛圍",
      is_reveal_door_password: true,
      door_password: "834751#",
    },
  ]);
};
