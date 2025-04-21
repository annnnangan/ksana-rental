import NavBar from "@/components/custom-components/layout/main-nav-bar/NavBar";
import Footer from "@/components/custom-components/layout/MainFooter";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow mx-auto container p-3 lg:p-5">{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
