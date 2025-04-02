import React from "react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shadcn/accordion";

const page = () => {
  return (
    <div className="my-5">
      <div className="relative aspect-[7/1] bg-neutral-200 mb-1 overflow-hidden">
        <Image alt={`article image`} sizes="w-full" fill src={"/yoga-image-assets/getty-images-jvT7HHaN-eg-unsplash.jpg"} className="w-full h-full object-cover object-center" />
      </div>
      <h1 className="font-bold text-3xl mt-2">場地申請教學</h1>
      <p className="text-xs text-gray-500 mt-2">最後更新：2025-04-02</p>
      <div className="mt-8">
        <h2 className="mb-5">
          場主需先填寫場地申請表格，遞交後，管理員將會於3-7個工作天內審核你的申請。申請通過後，場地才會於網站中刊登。部分場地資料(e.g. 大門密碼、營業時間等等)可於審核後，進行更改。
        </h2>

        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-bold">📍 1. 在 「所有場地」，選擇 「新增場地」，填寫場地名稱</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-2">請填寫你的場地名稱</div>

                <div className="h-auto w-48">
                  <Zoom>
                    <img src={"/onboarding-steps/name.png"} alt={"step name screenshot"} className="object-cover h-auto" />
                  </Zoom>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-bold">📍 2. 填寫場地基本資料</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-2">
                  請上傳封面圖片及場地Logo，並填寫場地的基本資訊，包括：
                  <ul className="list-disc p-5">
                    <li>場地名稱(送出申請後無法更改)</li>
                    <li>場地網站別名(用於在網站中顯示出的場地連結，送出申請後無法更改)</li>
                    <li>場地介紹</li>
                    <li>場地聯絡電話</li>
                    <li>場地區域及地址</li>
                  </ul>
                </div>

                <div className="h-auto w-48">
                  <Zoom>
                    <img src={"/onboarding-steps/basic-info-mobile.png"} alt={"step basic info screenshot"} className="object-cover h-auto" />
                  </Zoom>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="font-bold">📍 3. 設定營業時間與價格</AccordionTrigger>
            <AccordionContent>
              <p>於此設定場地營業時間及每個時段之價格。若需於營業時間中關閉某些特定日期時段，你可於申請送出後，於場地管理系統中進行調整。</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-2">
                  <ol className="list-decimal ps-5 space-y-4">
                    <li>設定繁忙時段和非繁忙時段價格</li>
                    <li>
                      設定營業時間
                      <ul className="list-disc ps-5">
                        <li>設定星期一到日開放時段，一天可設定多個開放時段，例如：星期一 10:00 - 18:00和22:00 - 24:00。</li>
                        <li>為每一個開放時段設定繁忙時段/非繁忙時段，例如：星期一 10:00 - 18:00 為非繁忙時段，該時段價格將以非繁忙時段收取。</li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="h-auto w-48">
                  <Zoom>
                    <img src={"/onboarding-steps/business-hour-price.png"} alt={"step business hour and price screenshot"} className="object-cover h-auto" />
                  </Zoom>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="font-bold">📍 4. 設定場地設備</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-2">
                  <p>選擇場地內有的設備。</p>
                </div>

                <div className="h-auto w-48">
                  <Zoom>
                    <img src={"/onboarding-steps/equipment.png"} alt={"step equipment screenshot"} className="object-cover h-auto" />
                  </Zoom>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="font-bold">📍 5. 上傳場地照片</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-2">
                  <p>上傳最少6張，最多15張場地照片，讓用戶看見場地的真實樣貌。</p>
                </div>

                <div className="h-auto w-48">
                  <Zoom>
                    <img src={"/onboarding-steps/gallery.png"} alt={"step gallery screenshot"} className="object-cover h-auto" />
                  </Zoom>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger className="font-bold">📍 6. 設定大門密碼</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-2">
                  <p>Ksana會於預約2小時前於平台上自動發送場地大門密碼給場地租用用戶，預約過程更自動化。</p>
                </div>

                <div className="h-auto w-48">
                  <Zoom>
                    <img src={"/onboarding-steps/door-password.png"} alt={"step door password screenshot"} className="object-cover h-auto" />
                  </Zoom>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger className="font-bold">📍 7. 設定場地社交媒體</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-2">
                  <p>請填寫場地社交媒體，讓用戶可以了解更多場地。</p>
                </div>

                <div className="h-auto w-48">
                  <Zoom>
                    <img src={"/onboarding-steps/social.png"} alt={"step social media screenshot"} className="object-cover h-auto" />
                  </Zoom>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger className="font-bold">📍 8. 填寫收帳資料</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-2">
                  <p>Ksana會利用所填寫資料將每星期款項存入你的帳戶，請確保資料正確，否則會無法收取款項。</p>
                  <p>請選擇收帳方法、完整英文帳戶名稱及帳戶號碼。</p>
                </div>

                <div className="h-auto w-48">
                  <Zoom>
                    <img src={"/onboarding-steps/payout.png"} alt={"step payout screenshot"} className="object-cover h-auto" />
                  </Zoom>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9">
            <AccordionTrigger className="font-bold">📍 9. 確認並提交申請</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-2">
                  <p>請閱讀和同意條款與細則，並送出你的申請，Ksana會於3-7個工作天內審查你的申請。審核通過後，您的場地將正式上架，租客就可以開始預訂了！</p>
                </div>

                <div className="h-auto w-48">
                  <Zoom>
                    <img src={"/onboarding-steps/confirmation.png"} alt={"step confirmation screenshot"} className="object-cover h-auto" />
                  </Zoom>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default page;
