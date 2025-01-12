import ToastMessageWithRedirect from "@/app/_components/ToastMessageWithRedirect";
import { studioService } from "@/services/StudioService";
import BasicInfo from "./_component/BasicInfo";
import TopGallery from "./_component/gallery/TopGallery";
import PriceSection from "./_component/section/PriceSection";
import LocationSection from "./_component/section/LocationSection";
import DescriptionSection from "./_component/section/DescriptionSection";
import EquipmentSection from "./_component/section/EquipmentSection";
import SocialMediaSection from "./_component/section/SocialMediaSection";
import ReviewSection from "./_component/section/review/ReviewSection";

export interface StudioInfo {
  name: string;
  logo: string;
  district: string;
  contact: string;
  rating: number;
  number_of_review: number;
  number_of_completed_booking: number;
  description: string;
  address: string;
}

const StudioPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  let studioImages;

  //Get studio images
  try {
    const userId = 1;
    const res = await studioService.getStudioIdBySlug(slug);
    const studioId = res.data;

    const studioGalleryResponse = await studioService.getGallery(
      studioId,
      userId
    );

    studioImages = studioGalleryResponse.data
      ? studioGalleryResponse.data.map((image) => image.photo)
      : [];
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "系統出現錯誤。";
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={errorMessage}
        redirectPath={"/explore-studios"}
      />
    );
  }

  const basicInfo = {
    name: "Soul Yogi Studio",
    logo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-logo.png",
    district: "sham-shui-po",
    rating: 4.5,
    number_of_completed_booking: 3,
    number_of_review: 2,
    contact: "+8529876543",
    description:
      "帶來內心平靜與身心和諧的空間，讓你放鬆自我，重拾能量🌱\n🧘‍♂️ 空中舞蹈課程｜地面瑜伽課程｜場地租用\n🏔️ 4.3米高樓底｜山景落地大玻璃｜800呎課室連獨立內廁\n🌟 優雅圓拱門設計｜場地設有多種燈光效果｜高級音響設備",
    equipments: ["yoga-mat", "yoga-block", "yoga-wheel", "hammock"],
    priceList: { peakHour: 120, nonPeakHour: 100 },
    address: "香港長沙灣大南西街609號2樓10室",
    socialMedia: [
      { type: "instagram", contact: "https://www.instagram.com/soul-yogi" },
      { type: "website", contact: "https://www.soul-yogi.com" },
      { type: "facebook", contact: "https://www.instagram.com/soul-yogi" },
      { type: "youtube", contact: "https://www.soul-yogi.com" },
    ],
  };

  return (
    <>
      <TopGallery images={studioImages} />
      <div className="flex flex-row gap-5">
        <div className="basis-3/4">
          <BasicInfo basicInfo={basicInfo} />
          <DescriptionSection description={basicInfo.description} />
          <EquipmentSection equipments={basicInfo.equipments} />
          <PriceSection priceList={basicInfo.priceList} />
          {/* <LocationSection address={basicInfo.address} /> */}
          <SocialMediaSection socialMediaList={basicInfo.socialMedia} />
          <ReviewSection />
        </div>
        <div className="basis-1/4">
          <div className="px-5 border border-primary">Hello</div>
        </div>
      </div>
    </>
  );
};

export default StudioPage;
