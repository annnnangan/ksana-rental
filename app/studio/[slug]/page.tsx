import ToastMessageWithRedirect from "@/app/_components/ToastMessageWithRedirect";
import { studioService } from "@/services/StudioService";
import TopGallery from "./_component/gallery/TopGallery";
import BasicInfo from "./_component/BasicInfo";

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
  };

  return (
    <>
      <TopGallery images={studioImages} />
      <BasicInfo basicInfo={basicInfo} />
    </>
  );
};

export default StudioPage;
