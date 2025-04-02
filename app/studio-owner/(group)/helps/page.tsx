import React from "react";
import Image from "next/image";
import Link from "next/link";

const articles = [
  {
    image: "/yoga-image-assets/getty-images-jvT7HHaN-eg-unsplash.jpg",
    title: "場地申請教學",
    href: "/studio-owner/helps/article/onboarding",
  },
  {
    image: "/yoga-image-assets/getty-images-zFgdwsNh3Q4-unsplash.jpg",
    title: "如何更新場地可預約時間？",
    href: "/studio-owner/helps/article/update-availability",
  },
  {
    image: "/yoga-image-assets/luna-active-fitness-iEpsg6OzyXw-unsplash.jpg",
    title: "如何在Ksana管理你的預約？",
    href: "/studio-owner/helps/article/manage-bookings",
  },
  {
    image: "/yoga-image-assets/getty-images-QhivR4cdUf0-unsplash.jpg",
    title: "如何收取你的租金？",
    href: "/studio-owner/helps/article/payout",
  },
];

const OwnerGuidelinePage = () => {
  return (
    <>
      <h1 className="text-primary text-2xl font-bold mb-5">幫助中心</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link href={article.href} key={article.href}>
            <div className="relative rounded-md overflow-hidden shadow">
              {/* Cover Image */}
              <div className="aspect-[3/1] bg-neutral-200 mb-1 overflow-hidden">
                <Image alt={`help image`} width={500} height={500} src={article.image} className="w-full h-full object-cover object-center transition-transform duration-300" />
              </div>

              <div className="p-5">
                <h2 className="font-bold">{article.title}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default OwnerGuidelinePage;
