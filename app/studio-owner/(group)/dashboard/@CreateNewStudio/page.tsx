import AddNewStudio from "@/components/custom-components/studio-owner/AddNewStudio";
import Image from "next/image";

const page = () => {
  return (
    <div>
      <div className="relative h-24 md:h-[150px] lg:h-[180px]">
        <Image src="/yoga-image-assets/getty-images-MOQcVp3z1hg-unsplash.jpg" alt="yoga banner image" sizes="100vw" fill className="rounded-md object-cover object-center" />
      </div>

      <div className="mt-5">
        <h2 className="text-lg md:text-2xl font-bold">於Ksana刊登你的第一個瑜珈場地</h2>
        <p className="text-sm md:text-lg mt-2">填妥場地相關資料，等待審核通過後，便可於Ksana刊登你的瑜珈場地。</p>
        <AddNewStudio hasCreatedStudio={false} isDashboard={true} />
      </div>
    </div>
  );
};

export default page;
