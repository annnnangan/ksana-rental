import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Noto_Sans_TC } from "next/font/google";
import { ToastContainer } from "react-toastify";
import QueryClientProvider from "./QueryClientProvider";

import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"], // Include subsets as per your use case
  weight: ["400", "700"], // Add weights you need
  display: "swap", // Optional for performance
  preload: true,
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK" className="scroll-smooth">
      <body className={`${notoSansTC.className} antialiased`}>
        <SessionProvider>
          <QueryClientProvider>
            <CopilotKit runtimeUrl="/api/copilotkit">{children}</CopilotKit>
            <ToastContainer />
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
