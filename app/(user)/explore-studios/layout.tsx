import FilterGroup from "@/components/custom-components/filters/FilterGroup";
import NavBar from "@/components/custom-components/layout/main-nav-bar/NavBar";
import Footer from "@/components/custom-components/layout/MainFooter";
import React from "react";

const userLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <div className="h-[250px] md:h-[300px] bg-[url(/yoga-image-assets/karolina-grabowska-0kAUvX5OvEY-unsplash.jpg)] bg-cover bg-center mb-6">
        <div className="bg-black/30 backdrop-invert backdrop-opacity-10 h-full">
          <div className="container mx-auto pt-5 px-4 md:px-0 mb-14">
            <NavBar />
          </div>
          <h1 className="text-center text-4xl md:text-5xl text-white drop-shadow-lg font-bold">探索所有場地</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-2">
        <div className="mb-5 md:mb-8">
          <FilterGroup />
        </div>

        <main className="flex-grow">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default userLayout;
