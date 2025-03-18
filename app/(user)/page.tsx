import FeatureCardSwiper from "@/components/custom-components/homepage/FeatureCardSwiper";
import { CalendarCheck2, UserRoundSearch } from "lucide-react";
import Image from "next/image";

import LinkButton from "@/components/animata/button/link-button";
import BookingInstructionSection from "@/components/custom-components/homepage/BookingInstructionSection";
import HomepageStudioSection from "@/components/custom-components/homepage/StudiosSection";
import NavBar from "@/components/custom-components/layout/main-nav-bar/NavBar";
import Footer from "@/components/custom-components/layout/MainFooter";
import { Be_Vietnam_Pro } from "next/font/google";

const VietnamProFont = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: "700",
});

export default function Home() {
  const featured_studios = [
    {
      studio_slug: "soul-yogi-studio",
      studio_name: "Soul Yogi Studio",
      rating: "5",
      cover_photo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-cover.jpg",
    },
    {
      studio_slug: "zen-oasis",
      studio_name: "Zen Oasis",
      rating: "5",
      cover_photo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/zen-oasis/zen-oasis-cover.jpg",
    },
    {
      studio_slug: "larana-yoga",
      studio_name: "Larana Yoga",
      rating: "5",
      cover_photo: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/larana/larana-cover.jpg",
    },
  ];
  return (
    <div className="">
      <div className="flex flex-col pb-5 min-h-[700px] bg-[url(/yoga-image-assets/karolina-grabowska-GkXJisd5W1M-unsplash-m.jpg)] bg-cover bg-center">
        <div className="container mx-auto pt-5 px-4 md:px-0">
          <NavBar />
        </div>

        {/* Hero Section */}
        <div className="container mx-auto flex flex-col grow px-4 md:px-0">
          {/* Text */}
          <div className="text-white grow mt-7">
            <div className="flex items-center gap-3">
              <h1 className={`text-6xl ${VietnamProFont.className} drop-shadow-xl`}>Find Your</h1>
              <div className="relative w-28 h-12 rounded-full overflow-hidden shadow-2xl">
                <Image src="/yoga-image-assets/getty-images-zFgdwsNh3Q4-unsplash.jpg" alt="cover image" className="object-cover object-bottom" fill sizes="w-auto" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-28 h-12 rounded-full overflow-hidden shadow-2xl">
                <Image src="/yoga-image-assets/stephanie-greene-1aB-1s4BIEo-unsplash.jpg" alt="cover image" className="object-cover object-bottom" fill sizes="w-auto" />
              </div>

              <h2 className={`text-6xl ${VietnamProFont.className} drop-shadow-xl`}>Inner Peace</h2>
            </div>
          </div>

          {/* Recommend Studio Swiper */}
          <div className="flex justify-end">
            <div className="w-full md:w-[500px]">
              <FeatureCardSwiper slideItems={featured_studios} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-0">
        <HomepageStudioSection />
        <BookingInstructionSection />
        <div className="my-10 bg-[url(/yoga-image-assets/join-us-background.png)] bg-cover bg-left-top h-[300px] rounded-lg flex items-center justify-end p-5">
          <div className="w-1/2 bg-white bg-opacity-80 p-5 rounded-lg">
            {/* Takes half of the container */}
            <h2 className="text-2xl font-bold">Join Us</h2>
            <p className="text-sm">成為我們的場地提供者</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="rounded-full bg-white w-8 h-8 flex justify-center items-center">
                <CalendarCheck2 size={20} color="#01a2c7" />
              </div>
              <p className="text-sm">輕鬆管理所有場地預約</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="rounded-full bg-white w-8 h-8 flex justify-center items-center">
                <UserRoundSearch size={20} color="#01a2c7" />
              </div>
              <p className="text-sm">尋找更多顧客</p>
            </div>

            <LinkButton href="/auth/register?redirect=/studio-owner/dashboard">加入我們</LinkButton>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
