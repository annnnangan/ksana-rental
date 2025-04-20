import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Noto_Sans_TC } from "next/font/google";
import { ToastContainer } from "react-toastify";
import QueryClientProvider from "./QueryClientProvider";

import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { ProjectNoticeModal } from "@/components/custom-components/ProjectNoticeModal";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"], // Include subsets as per your use case
  weight: ["400", "700"], // Add weights you need
  display: "swap", // Optional for performance
  preload: true,
});

export const metadata: Metadata = {
  title: "Ksana | 瑜珈場地租用網站",
  description:
    "Ksana 是一個專注於瑜珈場地租用的線上平台，為瑜珈老師、團體與練習者提供彈性預約、透明價格及多樣化地點選擇，無論是私人教學、小班課程還是工作坊，都能輕鬆找到合適的場地。我們致力於打造一個簡單、高效且充滿靈性氛圍的租用體驗，讓你專注於分享與練習瑜珈的美好時刻。",
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
            <CopilotKit runtimeUrl="/api/copilotkit">
              <ProjectNoticeModal />
              {children}
            </CopilotKit>
            <ToastContainer />
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
