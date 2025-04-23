"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { useEffect, useState } from "react";

const sectionItemList = [
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
    title: "評價",
    sectionId: "reviews",
  },
];

const MobileSectionMenu = ({ children }: { children: React.ReactNode }) => {
  const [activeSection, setActiveSection] = useState(sectionItemList[0].sectionId);

  useEffect(() => {
    const handleScroll = () => {
      const dropdownOffset = 64; // Offset of dropdown from top in pixels
      const scrollPosition = window.scrollY + dropdownOffset;

      // Loop through sections and find the one near the dropdown
      for (let i = 0; i < sectionItemList.length; i++) {
        const section = document.getElementById(sectionItemList[i].sectionId);
        const sectionTop = section?.offsetTop ?? 0;
        const sectionBottom = sectionTop + (section?.offsetHeight ?? 0);

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveSection(sectionItemList[i].sectionId);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectChange = (value: string) => {
    setActiveSection(value);

    // Scroll to the selected section
    const sectionElement = document.getElementById(value);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-0 z-10 w-full md:hidden mt-5">
      <Select value={activeSection} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full bg-white bg-opacity-95 font-bold shadow-lg text-center py-6 justify-start gap-3 relative">
          <SelectValue placeholder="Select a section" />
        </SelectTrigger>
        <div className="absolute top-1.5 right-2 ">{children}</div>
        <SelectContent>
          {sectionItemList.map((section) => (
            <SelectItem
              key={section.sectionId}
              value={section.sectionId}
              className={activeSection === section.sectionId ? "text-primary font-bold" : ""}
            >
              {section.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MobileSectionMenu;
