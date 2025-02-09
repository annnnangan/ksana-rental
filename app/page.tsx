import SlideArrowButton from "@/components/animata/button/slide-arrow-button";
import FeatureCardSwiper from "@/components/custom-components/homepage/FeatureCardSwiper";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { Calendar, Clock5 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Be_Vietnam_Pro } from "next/font/google";
import BookingInstructionSection from "@/components/custom-components/homepage/BookingInstructionSection";
import JoinUsBannerSection from "@/components/custom-components/homepage/JoinUsBannerSection";
import StudiosSection from "@/components/custom-components/homepage/StudiosSection";

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
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-cover.jpg",
    },
    {
      studio_slug: "zen-oasis",
      studio_name: "Zen Oasis",
      rating: "5",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/zen-oasis/zen-oasis-cover.jpg",
    },
    {
      studio_slug: "larana-yoga",
      studio_name: "Larana Yoga",
      rating: "5",
      cover_photo:
        "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/larana/larana-cover.jpg",
    },
  ];
  return (
    <div className="container mx-auto px-2 py-5 md:px-4 lg:px-6">
      <div className="flex mb-5 flex-col  md:flex-row md:justify-between">
        <h1
          className={`w-full mb-5 md:mb-0 md:w-1/2 text-6xl ${VietnamProFont.className}`}
        >
          <span>Discover your</span>
          <br />
          <span>inner peace</span>
        </h1>
        {/* featured studios */}
        <div className="w-full md:w-1/2">
          <FeatureCardSwiper slideItems={featured_studios} />
        </div>
      </div>
      <div className="relative">
        {/* Hero banner */}
        <div className="relative h-96 rounded-2xl overflow-hidden">
          <Image
            src="/home-cover.png"
            alt="cover image"
            className="object-cover object-center"
            fill
            sizes="w-auto"
          />
        </div>

        {/* CTA button on banner */}
        <div className="absolute bottom-0 left-0 ms-5 lg:ms-10 mb-8">
          <Link href="/explore-studios">
            <SlideArrowButton
              primaryColor="hsl(var(--primary))"
              className="mt-5"
            >
              立即預約
            </SlideArrowButton>
          </Link>
        </div>
        {/* booking reminder card */}
        <div className="absolute top-0 right-0 mt-2 me-3">
          <Link href="/bookings" className="">
            <Card className="w-[150px] relative rounded-md border-0 shadow-2xl hover:animate-tiltShake transition">
              <CardHeader className="p-1">
                <div className="relative aspect-video rounded-md overflow-hidden">
                  <Image
                    src="/home-cover.png"
                    alt="cover image"
                    className="w-full h-full object-cover object-center"
                    fill
                    sizes="(min-width: 1540px) 724px, (min-width: 1280px) 596px, (min-width: 1040px) 468px, (min-width: 780px) 340px, 276px"
                  />
                </div>
              </CardHeader>
              <CardContent className="px-3 pt-2 pb-4">
                <p className="font-bold text-sm">Soul Yogi Studio</p>
                <div className="flex gap-1 flex-wrap mt-1">
                  <p className="text-[10px] text-gray-500 flex gap-1 items-center">
                    <Calendar size={14} />
                    2025-01-20
                  </p>
                  <p className="text-[10px] text-gray-500 flex gap-1 items-center">
                    <Clock5 size={14} />
                    11:00 - 12:00
                  </p>
                </div>
              </CardContent>
              <div className="rounded-2xl absolute top-0 left-0 ms-2 mt-3 bg-white text-[8px] px-2 py-1">
                Next Booking
              </div>
            </Card>
          </Link>
        </div>
      </div>

      <StudiosSection />
      <BookingInstructionSection />
      <JoinUsBannerSection />
    </div>
  );
}
