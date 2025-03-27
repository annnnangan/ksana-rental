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

  const positiveReviewComment = [
    "這間瑜珈館的環境非常舒適，空間寬敞、整潔，讓人一踏進來就感到放鬆。設備齊全，瑜珈墊、輔具都保持得很乾淨，真的很推薦！",
    "這間瑜珈教室的空間非常寬敞，採光良好，空氣流通，讓人一進來就覺得放鬆。地板乾淨、環境整潔，非常適合瑜珈練習或小型團體課程使用。",
    "場地內提供乾淨的瑜珈墊、輔具，還有鏡子可以調整動作。音響設備也很好，讓我們的練習更有氛圍。租借過程順利，設備維護得非常好，值得推薦！",
    "場地品質超越預期！很適合定期使用或舉辦小型瑜珈活動。",
    "教室地點很好，交通便利，學員們來上課都很方便。還有充足的停車位，開車來也不用擔心。",
    "場地保持得非常乾淨，地板沒有灰塵，瑜珈墊也消毒過，讓人使用起來很安心。洗手間和更衣室也整理得很整潔，整體體驗非常好！",
    "室內燈光唔會太光或者太暗，氣氛剛剛好。冷氣夠涼但唔會太凍，練習嘅時候感覺好舒服，唔會影響動作。",
    "場地夠大，最多可以容納一班人一齊練習，無論係私人班、團體活動，甚至拍攝瑜珈教學影片都好適合！",
    "負責人好友善，回覆好快，而且有咩特別要求都會盡量配合。比其他租過嘅場地體驗好太多，以後都會再租！",
    "場地裝修好簡約，完全冇雜亂或者多餘裝飾，令人可以更專注喺瑜珈練習上，環境靜謐，好有 Zen 嘅感覺！",
    "瑜珈室地板係木質，好有溫暖感，而且清潔得好乾淨，赤腳練習都覺得好舒服，完全唔會有灰塵或者黏笠感！",
    "場地有超大窗戶，白天時完全唔需要開燈，自然光透入嚟令空間感更加開揚，影相或者錄影都特別靚！",
  ];

  const negativeReviewComment = [
    "成個環境睇落幾乾淨，但練習嘅時候發現地板有啲灰塵，感覺清潔做得唔夠徹底，希望場地方可以加強打掃。",
    "冷氣開到最大都唔夠涼，夏天練習一陣就成身汗，空氣流通都一般，希望可以改善冷氣系統或者加設風扇。",
    "場內設備雖然齊全，但部分瑜珈墊已經有啲舊，甚至有磨損痕跡，希望場地方可以定期更換，提升使用體驗",
    "網上圖片睇落好大，但去到發現空間細咗啲，而且擺滿設備後可用空間唔多，最多只適合小組使用。",
    "場地隔音一般，練習時成日聽到外面嘅人聲同交通噪音，影響專注，做冥想同靜觀練習特別困難。",
  ];

  const complaintComment = [
    "場地衛生狀況非常差，地板有塵、有毛髮，瑜珈墊仲有汗漬，完全無清潔過嘅感覺。更衣室同洗手間都發霉、有異味，垃圾桶滿晒都冇人清理，整體環境令人非常唔舒服。呢種清潔標準根本唔適合做瑜珈練習，場地方完全無做好基本衛生管理，真係令人失望，絕對唔會再租！",
    "場內設備衞生情況極差，瑜珈墊有明顯污漬同異味，部分仲有破損，完全冇定期清潔或更換嘅跡象。瑜珈磚同其他輔助工具都沾滿灰塵，摸落去有黏笠感，根本唔敢放心使用。呢種環境根本唔適合練習，場地方完全無做好基本消毒同維護，令人質疑管理水平，唔會再考慮嚟呢度租場！",
  ];

  let reviewList = [];

  [1, 2].map((booking) =>
    reviewList.push({
      booking_reference_no: bookingList[booking - 1],
      is_anonymous: false,
      rating: 5,
      review: positiveReviewComment[booking - 1],
      created_at: "2025-01-06 22:35:56.749",
    })
  );

  [3, 4].map((booking) =>
    reviewList.push({
      booking_reference_no: bookingList[booking - 1],
      is_anonymous: true,
      rating: 4,
      review: positiveReviewComment[booking - 1],
      created_at: "2025-01-07 22:35:56.749",
    })
  );

  [5].map((booking) =>
    reviewList.push({
      booking_reference_no: bookingList[booking - 1],
      is_anonymous: false,
      rating: 2,
      review: complaintComment[0],
      created_at: "2025-01-09 22:35:56.749",
    })
  );

  [6, 7].map((booking) =>
    reviewList.push({
      booking_reference_no: bookingList[booking - 1],
      is_anonymous: false,
      rating: 4,
      review: positiveReviewComment[booking - 1 - 1],
      created_at: "2025-01-07 22:35:56.749",
    })
  );

  [8, 9, 10, 11].map((booking) =>
    reviewList.push({
      booking_reference_no: bookingList[booking - 1],
      is_anonymous: false,
      rating: 4,
      review: positiveReviewComment[booking - 1 - 1],
      created_at: "2025-01-07 22:35:56.749",
    })
  );

  [12].map((booking) =>
    reviewList.push({
      booking_reference_no: bookingList[booking - 1],
      is_anonymous: false,
      rating: 2,
      review: complaintComment[1],
      created_at: "2025-01-09 22:35:56.749",
    })
  );

  [13, 14].map((booking, index) =>
    reviewList.push({
      booking_reference_no: bookingList[booking - 1],
      is_anonymous: true,
      rating: 3,
      review: negativeReviewComment[index],
      created_at: "2025-01-10 22:35:56.749",
    })
  );

  [15].map((booking, index) =>
    reviewList.push({
      booking_reference_no: bookingList[booking - 1],
      is_anonymous: true,
      rating: 2,
      review: complaintComment[1],
      created_at: "2025-01-07 22:35:56.749",
    })
  );

  [16].map((booking) =>
    reviewList.push({
      booking_reference_no: bookingList[booking - 1],
      is_anonymous: false,
      rating: 4,
      review: positiveReviewComment[11],
      created_at: "2025-01-07 22:35:56.749",
    })
  );

  await knex("review").insert(reviewList);
};
