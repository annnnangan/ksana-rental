import { studioService } from "@/services/StudioService";
import BasicInfoForm from "./_component/BasicInfoForm";

interface images {
  cover_photo: string;
  logo: string;
}

const StudioCreatePage = async () => {
  let imageUrls: images = {
    cover_photo: "",
    logo: "",
  };

  const studioId = 1;
  const userId = 1;

  try {
    const imagesResponse = await studioService.getStudioCoverNLogoImages(
      studioId,
      userId
    );

    if (imagesResponse.success) {
      imageUrls = imagesResponse.data;
    }
  } catch (error) {}
  //Get cover image from database

  return <BasicInfoForm coverPhotoUrl={imageUrls["cover_photo"]} />;
};

export default StudioCreatePage;
