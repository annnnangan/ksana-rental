import LinkButton from "@/components/animata/button/link-button";
import ArticleCard from "./ArticleCard";
import cardImage1 from "@/public/yoga/yoga-horizontal-1.jpg";
import cardImage2 from "@/public/yoga/yoga-horizontal-2.jpg";
import cardImage3 from "@/public/yoga/yoga-horizontal-3.jpg";

const articles = [
  {
    image: cardImage1,
    title: "如何開始建立第一個Studio？",
    href: "/studio-owner/helps-and-resources",
  },
  {
    image: cardImage2,
    title: "如何在Ksana管理你的預約？",
    href: "/studio-owner/helps-and-resources",
  },
  {
    image: cardImage3,
    title: "如果收取你的租金？",
    href: "/studio-owner/helps-and-resources",
  },
];

const GetStarted = () => {
  return (
    <div className="mt-10 lg:mt-20 bg-brand-50 p-5 rounded-md">
      <h2 className="text-xl font-bold">Get Started with Ksana</h2>
      <LinkButton
        children={"了解更多細則"}
        href={"/studio-owner/helps-and-resources"}
      />
      <ul className="flex flex-wrap -mx-3">
        {articles.map((article, index) => (
          <ArticleCard
            key={article.title}
            title={index + 1 + ". " + article.title}
            href={article.href}
            image={article.image}
          />
        ))}
      </ul>
    </div>
  );
};

export default GetStarted;
