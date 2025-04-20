import Article from "@/components/custom-components/Article";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const page = () => {
  return (
    <Article
      title={"如何更新場地可預約時間？"}
      description={
        "於場地管理後台，前往「可預約時間及價錢」，場主可設定一般情況下，一週每天可預約時間的時間，並可設定每個時段之價格（繁忙/非繁忙時間)。若有特定日期需修改可預約時間，你可以設定特定日期的可預約時間。"
      }
      coverImage={"/yoga-image-assets/getty-images-zFgdwsNh3Q4-unsplash.jpg"}
      updatedDate={"2025-04-20"}
    >
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-bold">📍 1. 設定一般營業時間</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="col-span-2">
                <p>設定週一至週日之營業時間</p>
                <p>若當日恆常不開放，可關掉當天（參考圖片中星期一）。</p>
                <p>
                  若當日開放，你可以設定不同時段開放時間，並且為每一個時段設定其價格（參考圖片中星期二）。
                </p>
              </div>

              <div className="h-auto w-48">
                <Zoom>
                  <img
                    src={"/articles/update-business-hour.png"}
                    alt={"step name screenshot"}
                    className="object-cover h-auto"
                  />
                </Zoom>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="font-bold">📍 2. 設定特定日期可預約時間</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="col-span-2">
                <ol className="list-decimal ps-5">
                  <li>於「可預約時間及價錢」頁面中選擇「設定特定日期可預約時間」。</li>
                  <li>點擊「新增」</li>
                  <li>選擇日期</li>
                  <li>
                    設定新的時段。若需關閉該天時間，可點擊時段旁邊X的標誌把所有時段刪去。若需新增多個時段，點擊右上角「新增時段」。
                  </li>
                </ol>
              </div>

              <div className="h-auto w-48">
                <Zoom>
                  <img
                    src={"/articles/specific-date.png"}
                    alt={"step name screenshot"}
                    className="object-cover h-auto"
                  />
                </Zoom>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Article>
  );
};

export default page;
