import { studioService } from "@/services/StudioService";
import TopGallery from "./_component/gallery/TopGallery";

const StudioPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  //todo - get studio id by slug

  const studioId = 8;
  //Get User ID
  const userId = 1;

  //Get existing value as default value
  const studioGalleryResponse = await studioService.getGallery(
    studioId,
    userId
  );

  if (!studioGalleryResponse.success) return;

  const studioImages = studioGalleryResponse.data
    ? studioGalleryResponse.data.map((image) => image.photo)
    : [];

  return (
    <>
      <TopGallery images={studioImages} />
    </>
  );
};

export default StudioPage;
