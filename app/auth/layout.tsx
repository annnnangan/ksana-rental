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
        "relative flex flex-col-reverse md:h-screen md:overflow-hidden",
        isLoginPage ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Form Section */}
      <section className="flex h-full flex-1 items-center md:overflow-y-auto">
        <div className="m-auto flex w-full flex-col px-10 pb-5 md:pb-2 md:gap-5">
          <div className="flex flex-row gap-3">
            <Image src="/logo.png" alt="logo" width={150} height={150} />
          </div>
          <div>{children}</div>
        </div>
      </section>

      {/* Image Section */}
      <section className="relative h-40 md:flex-1 md:block md:h-full md:top-0">
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
