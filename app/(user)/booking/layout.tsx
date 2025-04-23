import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import NavBar from "@/components/custom-components/layout/main-nav-bar/NavBar";
import Footer from "@/components/custom-components/layout/MainFooter";
import { auth } from "@/lib/next-auth-config/auth";
import React from "react";

export const metadata = {
  title: "預約",
};

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await auth();
  if (!user) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={"請先登入才可操作"}
        redirectPath={"/auth/login"}
      />
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow mx-auto container p-3 lg:p-5">{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
