import React from "react";
import Section from "./Section";

interface Props {
  priceList: { peak: number; "non-peak": number };
}

const PriceSection = ({ priceList }: Props) => {
  return (
    <Section title={"場地費用"}>
      <div className="flex flex-row gap-5 flex-wrap">
        <div className="ps-3 py-2 border border-primary rounded-md basis-full md:basis-1/2 lg:basis-1/3">
          <p className="text-xs text-gray-500">繁忙時間 / Peak Hour</p>
          <p className="text-lg">HK$ {[[priceList.peak]]}</p>
        </div>

        <div className="ps-3 py-2 border border-primary rounded-md basis-full md:basis-1/2 lg:basis-1/3">
          <p className="text-xs text-gray-500">非繁忙時間 / Non-Peak Hour</p>
          <p className="text-lg">HK$ {[[priceList["non-peak"]]]}</p>
        </div>
      </div>
    </Section>
  );
};

export default PriceSection;
