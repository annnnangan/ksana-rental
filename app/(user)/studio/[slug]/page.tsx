import BasicInfo from "@/components/custom-components/studio-page/BasicInfo";
import TopGallery from "@/components/custom-components/studio-page/gallery/TopGallery";
import DesktopSectionMenu from "@/components/custom-components/studio-page/section-menu/DesktopSectionMenu";
import MobileSectionMenu from "@/components/custom-components/studio-page/section-menu/MobileSectionMenu";
import DescriptionSection from "@/components/custom-components/studio-page/section/DescriptionSection";
import EquipmentSection from "@/components/custom-components/studio-page/section/EquipmentSection";
import LocationSection from "@/components/custom-components/studio-page/section/location/LocationSection";
import PriceSection from "@/components/custom-components/studio-page/section/PriceSection";
import ReviewSection from "@/components/custom-components/studio-page/section/review/ReviewSection";
import SocialMediaSection from "@/components/custom-components/studio-page/section/social-media/SocialMediaSection";
import SideSection from "@/components/custom-components/studio-page/SideSection";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { studioService } from "@/services/StudioService";

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

const StudioPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;
  let studioImages;

  //Get studio images
  try {
    const userId = 1;
    const res = await studioService.getStudioIdBySlug(slug);
    const studioId = res.data;

    const studioGalleryResponse = await studioService.getGallery(studioId, userId);

    studioImages = studioGalleryResponse.data ? studioGalleryResponse.data.map((image) => image.photo) : [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "系統出現錯誤。";
    return <ToastMessageWithRedirect type={"error"} message={errorMessage} redirectPath={"/explore-studios"} />;
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
    min_price: 100,
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
      <BasicInfo basicInfo={basicInfo} />
      <DesktopSectionMenu />
      <MobileSectionMenu />
      <div className="flex flex-row gap-5">
        <div className="md:basis-4/6 lg:basis-3/4">
          <DescriptionSection description={basicInfo.description} />
          <EquipmentSection equipments={basicInfo.equipments} />
          <PriceSection priceList={basicInfo.priceList} />
          <LocationSection address={basicInfo.address} />
          <SocialMediaSection socialMediaList={basicInfo.socialMedia} />
          <ReviewSection />
        </div>
        <div className="mt-5 hidden md:block md:basis-2/6 lg:basis-1/4">
          <SideSection peakHourPrice={basicInfo.priceList.peakHour} nonPeakHourPrice={basicInfo.priceList.nonPeakHour} />
        </div>
      </div>
    </>
  );
};

export default StudioPage;
