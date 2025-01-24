import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { studioService } from "@/services/StudioService";
import AddNewStudio from "./AddNewStudio";
import StudioCard from "./StudioCard";

//Get cover image, logo, name, status, id

const StudiosPage = async () => {
  const userId = 1;

  let studios;

  try {
    //Get Basic Info from Database
    const studiosResponse = await studioService.getAllStudios(userId);
    studios = studiosResponse.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "系統出現錯誤，請重試。";
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={errorMessage}
        redirectPath={"/studio-owner/dashboard"}
      />
    );
  }

  return (
    <div className="flex flex-wrap -mx-3">
      {studios.map((studio) => (
        <StudioCard key={studio.id} studioInfo={studio} />
      ))}
      <AddNewStudio />
    </div>
  );
};

export default StudiosPage;
