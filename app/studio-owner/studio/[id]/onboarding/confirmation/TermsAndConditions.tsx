import { ScrollArea } from "@/components/shadcn/scroll-area";
import React from "react";

const TermsAndConditions = () => {
  return (
    <>
      <h3 className="text-lg font-bold">註冊條款與細則</h3>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        <div>
          <ol>
            <li className="mb-4">
              <h4 className="font-bold text-brand-600">服務範圍</h4>
              <p>
                本平台旨在提供瑜伽館經營者一個管理預訂、處理客戶查詢以及促銷服務的工具。
                註冊後，您同意按照本條款的規定使用平台服務。
              </p>
            </li>
            <li className="mb-4">
              <h4 className="font-bold text-brand-600">註冊責任</h4>

              <p>
                註冊者須為瑜伽館的合法經營者，並提供真實且準確的商業資訊（例如：營業執照、聯絡方式等）。
                註冊時須設置安全密碼，並妥善保管賬戶資訊，避免未經授權的使用。
              </p>
            </li>
            <li className="mb-4">
              <h4 className="font-bold text-brand-600">內容準確性</h4>
              <p>
                瑜伽館需保證上傳的課程資訊、圖片、價格等內容的真實性和合法性。
                平台保留審核和修改不符合規定內容的權利。
              </p>
            </li>
            <li className="mb-4">
              <h4 className="font-bold text-brand-600">數據隱私與安全</h4>
              <p>
                平台將根據相關法律，妥善保護您的數據與隱私。
                您承諾不會洩露或分享平台提供的用戶數據，未經授權的使用或分享將構成違規。
              </p>
            </li>
            <li className="mb-4">
              <h4 className="font-bold text-brand-600">服務費用</h4>
              <p>
                瑜伽館可能需支付使用平台的相關服務費用，具體金額及支付條款以平台公告為準。
                如有費用調整，平台將提前通知用戶。
              </p>
            </li>
            <li className="mb-4">
              <h4 className="font-bold text-brand-600">責任限制</h4>
              <p>
                平台作為技術服務提供者，對瑜伽館與客戶之間的交易糾紛不承擔直接責任，但可協助調解。
                因不可抗力導致的服務中斷或數據丟失，平台不承擔任何責任。
              </p>
            </li>
            <li className="mb-4">
              <h4 className="font-bold text-brand-600">違規處理</h4>
              <p>
                如發現任何欺詐行為、不實信息或違規操作，平台有權暫停或終止賬戶使用權。
              </p>
            </li>
            <li className="mb-4">
              <h4 className="font-bold text-brand-600">條款變更</h4>
              <p>
                平台有權根據運營需求或法律要求修改本條款，修改內容將提前通知。
                繼續使用平台即視為接受新條款。
              </p>
            </li>
            <li className="mb-4">
              <h4 className="font-bold text-brand-600">適用法律與爭議解決</h4>
              <p>
                本條款受當地法律管轄，若有任何爭議，應友好協商解決；如協商未果，可提交當地法院處理。
              </p>
            </li>
            <li className="mb-4">
              <h4 className="font-bold text-brand-600">聯絡方式</h4>
              <p>如有任何問題，請通過平台提供的聯絡方式與我們取得聯繫。</p>
            </li>
          </ol>
        </div>
      </ScrollArea>
    </>
  );
};

export default TermsAndConditions;
