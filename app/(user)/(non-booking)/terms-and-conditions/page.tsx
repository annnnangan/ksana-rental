import SectionTitle from "@/components/custom-components/common/SectionTitle";

const page = () => {
  return (
    <div>
      <SectionTitle>條款與細則</SectionTitle>
      <ol className="space-y-5">
        <li>
          <h2 className="font-bold">一、服務內容</h2>
          <p className="ms-2">
            本平台提供租借場地資訊，讓用戶（包括「場地租借人」與「場地主」）能夠方便地搜尋、預訂及管理空間。平台亦提供相關預約管理、支付、通知等輔助功能。
          </p>
        </li>
        <li>
          <h2 className="font-bold">二、使用者資格</h2>
          <ol className="list-decimal ps-7">
            <li>您必須為具備完全民事行為能力之自然人，或經合法登記之法人，方可使用本平台。</li>
          </ol>
        </li>
        <li>
          <h2 className="font-bold">三、用戶帳號</h2>
          <ol className="list-decimal ps-7">
            <li>註冊時所填寫的資料必須正確、完整，若資料有變更，請即時更新。</li>
            <li>帳號及密碼應妥善保管，不得轉讓、出借予第三人使用。</li>
            <li>若發現帳號遭盜用或異常使用，應立即通知本平台。</li>
          </ol>
        </li>
        <li>
          <h2 className="font-bold">四、租借與取消政策</h2>
          <ol className="list-decimal ps-7">
            <li>場地租借之條件、價格、取消規定，依各場地主所設定為準。</li>
            <li>用戶應於預約時詳閱場地規範，並遵守相關規定。</li>
            <li>
              48小時或之前取消預訂，會將場地費用/已使用積分全數退回為平台積分，下次租用時可使用，恕不提供退款選項。
            </li>
            <li>48小時內取消預訂，恕不退款/退回平台積分。</li>
            <li>
              若因不可抗力因素（如天災、政府法規）導致場地無法使用，本平台將安排延期或全額退款。
            </li>
            <li>若租用者因個人原因未能準時使用場地，恕不補時或退款。</li>
          </ol>
        </li>
        <li>
          <h2 className="font-bold">五、用戶義務</h2>
          <ol className="list-decimal ps-7">
            <li>
              用戶應合法使用本平台，不得從事任何違法行為（包括但不限於詐騙、侵權、破壞場地設施等）。
            </li>
            <li>用戶應自行負責在使用場地期間內的安全與財產保管。</li>
            <li>若用戶取消預訂，相關退費規則依平台或場地主設定的政策執行。</li>
            <li>若因用戶行為導致平台或其他第三人受損，用戶應負全部賠償責任。</li>
          </ol>
        </li>
        <li>
          <h2 className="font-bold">六、平台責任限制</h2>
          <ol className="list-decimal ps-7">
            <li>本平台僅提供資訊媒合服務，場地租借之權利義務存在於場地主與租借人之間。</li>
            <li>本平台不擔保場地品質、安全性、或適合性，請用戶自行判斷與承擔使用風險。</li>
            <li>
              本平台對於因系統維護、異常、中斷、或不可抗力因素造成的服務中斷或資料損失，不負任何賠償責任。
            </li>
          </ol>
        </li>
        <li>
          <h2 className="font-bold">七、智慧財產權</h2>
          <p className="ps-2">
            本平台所有內容（包括但不限於文字、圖片、標誌、系統設計）均為平台或授權方所有，未經授權，不得擅自使用、重製、改作或散布。
          </p>
        </li>
        <li>
          <h2 className="font-bold">八、條款修改</h2>
          <p className="ps-2">
            本平台有權隨時修改本條款。若有重大變更，將提前於網站公告或以電子郵件通知。您繼續使用平台服務，即視為同意更新後之條款內容。
          </p>
        </li>
      </ol>
    </div>
  );
};

export default page;
