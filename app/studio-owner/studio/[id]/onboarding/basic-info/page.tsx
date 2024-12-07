import ToastMessageWithRedirect from "@/app/_components/ToastMessageWithRedirect";
import { studioService } from "@/services/StudioService";
import BasicInfoForm from "./_component/BasicInfoForm";

interface images {
  cover_photo: string;
  logo: string;
}

//Component
const StudioCreatePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  //Get Studio ID from URL
  const studioId = Number((await params).id);

  //Get User ID
  const userId = 1;

  //Global variable for storing image URL from server
  let imageUrls: images = {
    cover_photo: "",
    logo: "",
  };

  try {
    //Get cover image and logo from database
    const imagesResponse = await studioService.getStudioCoverNLogoImages(
      studioId,
      userId
    );
    if (imagesResponse.success) {
      imageUrls = imagesResponse.data;
    }
  } catch (error) {
    <ToastMessageWithRedirect
      type={"error"}
      errorMessage={"系統出現錯誤，請重試。"}
      redirectPath={"/studio-owner/dashboard"}
    />;
  }

  return (
    <BasicInfoForm
      coverPhotoUrl={imageUrls["cover_photo"]}
      logoUrl={imageUrls["logo"]}
      studioId={studioId}
    />
  );
};

export default StudioCreatePage;
