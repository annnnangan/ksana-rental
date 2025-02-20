import NavBar from "@/components/custom-components/layout/main-nav-bar/NavBar";
import Footer from "@/components/custom-components/layout/MainFooter";
import React from "react";

const userLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavBar />
      <main className="mx-auto container p-3 lg:p-5">{children}</main>
      <Footer />
    </>
  );
};

export default userLayout;
