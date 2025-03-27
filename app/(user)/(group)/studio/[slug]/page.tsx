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

import { GENERAL_ERROR_MESSAGE } from "@/lib/constants/error-message";
import { studioService } from "@/services/studio/StudioService";
import { validateStudioService } from "@/services/studio/ValidateStudio";

export interface StudioInfo {
  name: string;
  logo: string;
  district: string;
  phone: string;
  rating: number;
  number_of_review: number;
  number_of_completed_booking: number;
  description: string;
  address: string;
}

const StudioPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;

  const isStudioExist = await validateStudioService.validateIsStudioExistBySlug(slug);

  if (!isStudioExist.success) {
    return <ToastMessageWithRedirect type={"error"} message={"場地不存在。"} redirectPath={"/explore-studios"} />;
  }

  let studioImages;
  let studioBasicInfo;
  let studioEquipment;
  let studioSocial;
  let studioPice;
  let studioRatingOverview;

  try {
    const [basicInfoResult, galleryResult, equipmentResult, priceResult, socialResult, ratingOverviewResult] = await Promise.all([
      studioService.getStudioBasicInfo({ slug: slug }),
      studioService.getGallery({ studioSlug: slug }),
      studioService.getEquipment({ studioSlug: slug }),
      studioService.getPrice({ studioSlug: slug }),
      studioService.getSocial({ studioSlug: slug }),
      studioService.getStudioRatingOverview(slug),
    ]);
    if (!basicInfoResult.success || !galleryResult.success || !equipmentResult.success || !priceResult.success || !socialResult.success || !ratingOverviewResult.success) {
      throw new Error(GENERAL_ERROR_MESSAGE);
    } else {
      studioBasicInfo = basicInfoResult?.data?.studios[0];
      studioImages = galleryResult.data;
      studioEquipment = equipmentResult.data;
      studioSocial = socialResult.data;
      studioPice = priceResult.data;
      studioRatingOverview = ratingOverviewResult.data;
    }
  } catch {
    return <ToastMessageWithRedirect type={"error"} message={GENERAL_ERROR_MESSAGE} redirectPath={"/explore-studios"} />;
  }

  return (
    <>
      <TopGallery images={studioImages!} />
      <BasicInfo basicInfo={studioBasicInfo} />
      <DesktopSectionMenu />
      <MobileSectionMenu />
      <div className="flex flex-row gap-5">
        <div className="md:basis-4/6 lg:basis-3/4">
          <DescriptionSection description={studioBasicInfo.description} />
          <EquipmentSection equipments={studioEquipment!} />
          <PriceSection priceList={studioPice} />
          <LocationSection address={studioBasicInfo.address} />
          <SocialMediaSection socialMediaList={studioSocial} />
          <ReviewSection ratingOverview={studioRatingOverview!} studioSlug={slug} />
        </div>
        <div className="mt-5 hidden md:block md:basis-2/6 lg:basis-1/4">
          <SideSection peakHourPrice={studioPice.peak} nonPeakHourPrice={studioPice["non-peak"]} />
        </div>
      </div>
    </>
  );
};

export default StudioPage;
