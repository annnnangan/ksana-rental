import ToastMessageWithRedirect from "@/app/_components/ToastMessageWithRedirect";
import StepTitle from "../_component/StepTitle";
import GalleryForm from "./GalleryForm";
import { studioService } from "@/services/StudioService";

const GalleryPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  //Get Studio ID from URL
  const studioId = Number((await params).id);

  //Get User ID
  const userId = 1;

  //Get existing value as default value
  const studioGalleryResponse = await studioService.getGallery(
    studioId,
    userId
  );

  if (!studioGalleryResponse.success) return;

  const defaultValues = studioGalleryResponse.data
    ? studioGalleryResponse.data.map((image) => image.photo)
    : [];

  return (
    <>
      <div>
        <StepTitle>上傳場地照片</StepTitle>
        <p className="text-sm md:text-base mb-6">
          請上傳最少3張，最多15張場地照片。
        </p>
      </div>
      <GalleryForm studioId={studioId} defaultValues={defaultValues} />
    </>
  );
};

export default GalleryPage;
