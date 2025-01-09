import ToastMessageWithRedirect from "@/app/_components/ToastMessageWithRedirect";
import { studioService } from "@/services/StudioService";
import TopGallery from "./_component/gallery/TopGallery";

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

  return (
    <>
      <TopGallery images={studioImages} />
    </>
  );
};

export default StudioPage;
