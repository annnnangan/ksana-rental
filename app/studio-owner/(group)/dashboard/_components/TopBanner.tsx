import ProgressBar from "@/app/_components/ProgressBar";
import SlideArrowButton from "@/components/animata/button/slide-arrow-button";
import bannerBackground from "@/public/yoga/yoga-horizontal-7.jpg";
import Image from "next/image";
import Link from "next/link";

const TopBanner = () => {
  return (
    <>
      <Image
        src={bannerBackground}
        alt="yoga banner image"
        sizes="100vw"
        className="rounded-md object-cover h-20 lg:h-48 object-center" // Adjust these values as needed
      />
      <div className="mt-5">
        <h1 className="text-2xl font-bold">於Ksana刊登你的第一個瑜珈場地</h1>
        <p className="text-lg mt-2">
          填妥場地相關資料，等待審核通過後，便可於Ksana刊登你的瑜珈場地。
        </p>
        <Link href="/studio-owner/studio/1/onboarding/basic-info">
          <SlideArrowButton primaryColor="hsl(var(--primary))" className="mt-5">
            開始建立
          </SlideArrowButton>
        </Link>
      </div>
    </>
  );
};

export default TopBanner;
