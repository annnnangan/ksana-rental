import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="flex flex-col">
        <div className="h-[250px] bg-[url(/yoga-image-assets/dane-wetton-AkSJQnem75Y-unsplash.jpg)] bg-cover bg-center mb-6 rounded-2xl overflow-hidden">
          <div className="bg-black/30 backdrop-invert backdrop-opacity-10 h-full">
            <h1 className="text-center text-4xl md:text-5xl text-white drop-shadow-lg font-bold pt-24">
              關於我們
            </h1>
          </div>
        </div>
      </div>
      <div className="md:grid md:grid-cols-3 space-x-5">
        <div className="flex mb-5 md:mb-0 md:block space-x-5 md:space-x-0 md:space-y-5">
          <Image
            src="/yoga-image-assets/getty-images-jvT7HHaN-eg-unsplash.jpg"
            width={300}
            height={300}
            alt="yoga image"
            className="rounded-lg overflow-hidden"
          />
          <Image
            src="/yoga-image-assets/getty-images-zFgdwsNh3Q4-unsplash.jpg"
            width={300}
            height={300}
            alt="yoga image"
            className="rounded-lg overflow-hidden"
          />
        </div>
        <div className=" md:col-span-2 space-y-5">
          <p>Ksana，一詞源自古老梵文，意指「極短暫的一瞬」或「微妙的平衡狀態」。</p>
          <p>
            這個名字承載著我們的理念 ——
            在快節奏、壓力繁重的都市生活中，人們仍值得擁有屬於自己的寧靜片刻，找到內心的平衡與安定。
            我們相信，每一段自我練習，不論是瑜伽、冥想、舞蹈，或是任何形式的身心探索，都需要一個安穩而舒適的空間作為承載。
          </p>
          <p>
            而 Ksana
            正是為此而誕生的平台。我們希望幫助用家輕鬆找到理想的練習場地，無論是個人練習、團體課程，抑或是臨時租用，都能一目了然、便捷預訂。同時，Ksana
            也致力於讓場地擁有者能更有效率地管理資源、提升場地使用率，專注於發展屬於自己的社群與品牌。
          </p>
          <p>
            我們相信，空間不僅僅是四面牆壁，它承載著每一次呼吸、每一場心靈的探索。我們希望，透過
            Ksana，讓每個人在自己的節奏裡，遇見那一刻的寧靜與力量。 在這個片刻連接彼此 —— 這就是
            Ksana 想要帶給世界的故事。
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
