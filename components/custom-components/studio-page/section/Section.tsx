import { ReactNode } from "react";
import { sectionItemList } from "../section-menu/DesktopSectionMenu";

interface Props {
  title: string;
  children: ReactNode;
}

const getSectionIdByTitle = (title: string) => {
  const item = sectionItemList.find((section) => section?.title === title);
  return item ? item.sectionId : undefined;
};

const Section = ({ title, children }: Props) => {
  return (
    <div className="mt-5 bg-gray-50 p-4 lg:p-8 rounded-lg" id={getSectionIdByTitle(title)}>
      <h3 className="text-xl text-primary font-bold pl-3 py-1 border-l-8">{title}</h3>
      <div className="mt-4 lg:mt-2 pl-0 lg:pl-5">{children}</div>
    </div>
  );
};

export default Section;
