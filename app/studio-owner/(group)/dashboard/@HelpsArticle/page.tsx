import LinkButton from "@/components/animata/button/link-button";
import Image from "next/image";

const articles = [
  {
    image: "/yoga-image-assets/getty-images-jvT7HHaN-eg-unsplash.jpg",
    title: "如何開始建立第一個Studio？",
    href: "/studio-owner/helps/onboarding",
  },
  {
    image: "/yoga-image-assets/luna-active-fitness-iEpsg6OzyXw-unsplash.jpg",
    title: "如何在Ksana管理你的預約？",
    href: "/studio-owner/helps/manage-bookings",
  },
  {
    image: "/yoga-image-assets/getty-images-QhivR4cdUf0-unsplash.jpg",
    title: "如何收取你的租金？",
    href: "/studio-owner/helps/payout",
  },
];

const page = () => {
  return (
    <div className="mt-8 lg:mt-10 bg-brand-50 p-5 rounded-md">
      <h2 className="text-xl font-bold mb-5">Get Started with Ksana</h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {articles.map((article, index) => (
          <li className="flex flex-col justify-between" key={article.title}>
            <h4 className="font-semibold text-sm">
              {(index + 1).toString()}. {article.title}
            </h4>
            <LinkButton href={article.href}>Read</LinkButton>
            <div className="relative h-32">
              <Image src={article.image} alt="yoga banner image" fill sizes="(min-width: 1024px) 200px, 100vw" className="rounded-md object-cover object-center" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default page;
