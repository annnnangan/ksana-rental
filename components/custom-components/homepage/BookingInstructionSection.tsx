import React from "react";
import InvertedBorderCard from "../InvertedBorderCard";
import { CalendarClock, HandCoins, KeyRound, HandHeart } from "lucide-react";

const BookingInstructionSection = () => {
  return (
    <div className="my-10 bg-brand-50 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-5">簡單4步，輕鬆預約</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InvertedBorderCard
          children={
            <div className="flex flex-col justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <CalendarClock size={35} color="#01a2c7" />
              <p className="mt-2 text-sm text-center">
                選擇場地、 預約日期時間
              </p>
            </div>
          }
          isLinkBtn={false}
          btn="1"
        />
        <InvertedBorderCard
          children={
            <div className="flex flex-col justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <HandCoins size={35} color="#01a2c7" />
              <p className="mt-2 text-sm text-center">平台上直接付款</p>
            </div>
          }
          isLinkBtn={false}
          btn="2"
        />
        <InvertedBorderCard
          children={
            <div className="flex flex-col justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <KeyRound size={35} color="#01a2c7" />
              <p className="mt-2 text-sm text-center">於平台查看場地密碼</p>
            </div>
          }
          isLinkBtn={false}
          btn="3"
        />
        <InvertedBorderCard
          children={
            <div className="flex flex-col justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <HandHeart size={35} color="#01a2c7" />
              <p className="mt-2 text-sm text-center">享受場地</p>
            </div>
          }
          isLinkBtn={false}
          btn="4"
        />
      </div>
    </div>
  );
};

export default BookingInstructionSection;
