"use client";
import React from "react";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils/tailwind-utils";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const isLoginPage = pathname === "/auth/login";

  return (
    <main
      className={cn(
        "relative flex flex-col-reverse gap-5 md:gap-7",
        isLoginPage ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Left Section */}
      <section className="flex h-full flex-1 items-center md:min-h-screen ">
        <div className="mx-auto flex flex-col md:gap-5 rounded-lg w-full px-10 mb-10">
          <div className="flex flex-row gap-3">
            <Image src="/logo.png" alt="logo" width={150} height={150} />
          </div>
          <div>{children}</div>
        </div>
      </section>

      {/* Right Section */}
      <section className="relative h-40 w-full md:top-0 md:h-screen md:flex-1 sm:relative overflow-hidden">
        <Image
          src={
            isLoginPage
              ? "/login-illustration.jpg"
              : "/register-illustration.jpg"
          }
          alt="auth illustration"
          fill
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>
    </main>
  );
};

export default AuthLayout;
