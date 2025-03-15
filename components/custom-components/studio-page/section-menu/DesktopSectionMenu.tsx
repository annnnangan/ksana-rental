import { Button } from "@/components/shadcn/button";
import Link from "next/link";

export const sectionItemList = [
  {
    title: "關於場地",
    sectionId: "description",
  },
  {
    title: "場地設施",
    sectionId: "equipment",
  },
  {
    title: "場地費用",
    sectionId: "price",
  },
  {
    title: "場地位置",
    sectionId: "location",
  },
  {
    title: "社交媒體",
    sectionId: "social-media",
  },
  {
    title: "評論",
    sectionId: "reviews",
  },
];

const DesktopSectionMenu = () => {
  return (
    <div className="border py-2 px-3 mt-5 rounded-md sticky top-0 bg-white z-50 hidden md:flex">
      <ul className="flex gap-3 md:gap-5">
        {sectionItemList.map((item) => (
          <li key={item.sectionId}>
            <Button
              type="button"
              variant={"link"}
              className="text-sm md:text-md p-0"
            >
              <Link href={`#${item.sectionId}`}>{item.title}</Link>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DesktopSectionMenu;
