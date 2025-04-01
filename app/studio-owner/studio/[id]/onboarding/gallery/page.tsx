import GalleryForm from "@/components/custom-components/studio-details/GalleryForm";
import { studioService } from "@/services/studio/StudioService";
import StepIntro from "../StepIntro";

const GalleryPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const studioId = (await params).id;

  const formDataResponse = await studioService.getGallery({ studioId: studioId });

  if (!formDataResponse.success) {
    return;
  }

  let formDataDefaultValues = formDataResponse.data;

  return (
    <>
      <StepIntro title={"上傳場地照片"} description="請上傳最少3張，最多15張場地照片。" />

      <GalleryForm studioId={studioId} defaultValues={formDataDefaultValues!} isOnboardingStep={true} />
    </>
  );
};

export default GalleryPage;
