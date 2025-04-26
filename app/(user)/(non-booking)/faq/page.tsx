import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import SectionTitle from "@/components/custom-components/common/SectionTitle";

const page = () => {
  return (
    <div>
      <SectionTitle>常見問題</SectionTitle>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>場地預約後，可以取消嗎？</AccordionTrigger>
          <AccordionContent>
            <p>
              48小時或之前取消預訂，會將場地費用/已使用積分全數退回為平台積分，下次租用時可使用，恕不提供退款選項。
            </p>
            <p>48小時內取消預訂，恕不退款/退回平台積分。</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>如何在 Ksana 平台預訂場地？</AccordionTrigger>
          <AccordionContent>
            您只需要註冊帳號並登入，選擇想要的場地、日期及時間後，依指示完成預訂程序並付款即可。預訂成功後，您將收到確認通知。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>預訂完成後，我如何進入場地？</AccordionTrigger>
          <AccordionContent>
            預約開始前2小時，可到「我的預約」頁面查看場地密碼，然後自行進入場地。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>如何成為場地主，在平台上出租我的場地？</AccordionTrigger>
          <AccordionContent>
            您可以透過平台填寫場地資料，並提交申請，經平台審核通過後，即可上架您的場地，開始接受租借。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger>預訂時需要付全額費用嗎？</AccordionTrigger>
          <AccordionContent>
            是的，為保障場地主與用戶雙方權益，預訂場地時需一次付清費用。本平台將於使用完成後，將租金撥款給場地主。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger>要如何聯繫客服？</AccordionTrigger>
          <AccordionContent>
            您可以寄信至客服信箱 - support@ksana-yoga-rental.site，我們會儘快回覆您的訊息。
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default page;
