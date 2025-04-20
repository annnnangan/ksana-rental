/* eslint-disable @next/next/no-img-element */
import Article from "@/components/custom-components/Article";
import React from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const page = () => {
  return (
    <Article
      title={"如何收取你的租金"}
      description={
        "當用戶於Ksana平台上租用了你的場地，Ksana會定期將每星期的場地收入作計算，並且返還給場地。"
      }
      coverImage={"/yoga-image-assets/getty-images-QhivR4cdUf0-unsplash.jpg"}
      updatedDate={"2025-04-20"}
    >
      <p>
        每個星期一，平台管理員會結算兩星期前之場地的收入。例如今天是2025年4月21日，你將會收到2025年3月31日到4月6日的收入。
      </p>
      <p>收入計算分為2部分：</p>
      <ol className="list-decimal ps-5">
        <li>該時間範圍之已完成並沒有投訴之預約費用總和；</li>
        <li>於此時間範圍內解決之投訴之預約費用，扣除退回用戶後之金額</li>
      </ol>

      <p className="mt-5">你可前往場地後台中的「結算」頁面查看每星期之收入及詳細資料。</p>
      <div className="grid grid-cols-2">
        <Zoom>
          <img
            src={"/articles/payout-record.png"}
            alt={"payout record screenshot"}
            className="object-cover h-auto"
          />
        </Zoom>
        <Zoom>
          <img
            src={"/articles/payout-details.png"}
            alt={"payout details screenshot"}
            className="object-cover h-auto"
          />
        </Zoom>
      </div>
    </Article>
  );
};

export default page;
