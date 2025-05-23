import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Noto_Sans_TC } from "next/font/google";
import { ToastContainer } from "react-toastify";
import QueryClientProvider from "./QueryClientProvider";
import { GoogleTagManager } from "@next/third-parties/google";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { ProjectNoticeModal } from "@/components/custom-components/ProjectNoticeModal";
import { Suspense } from "react";
import LoadingSpinner from "@/components/custom-components/common/loading/LoadingSpinner";
import UserID from "@/components/custom-components/datalayer/UserID";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"], // Include subsets as per your use case
  weight: ["400", "700"], // Add weights you need
  display: "swap", // Optional for performance
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: "%s | Ksana | 瑜珈場地租用網站",
    default: "Ksana | 瑜珈場地租用網站",
  },
  description:
    "Ksana 是一個專注於瑜珈場地租用的線上平台，為瑜珈老師、團體與練習者提供彈性預約、透明價格及多樣化地點選擇，無論是私人教學、小班課程還是工作坊，都能輕鬆找到合適的場地。我們致力於打造一個簡單、高效且充滿靈性氛圍的租用體驗，讓你專注於分享與練習瑜珈的美好時刻。",
  openGraph: {
    title: "Ksana | 瑜珈場地租用網站",
    description: "彈性預約、透明價格、多樣地點，為瑜珈教學與練習打造理想空間。",
    url: "https://ksana-yoga-rental.site/",
    siteName: "Ksana",
    images: [
      {
        url: "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/og-image.png", // replace with your actual image
        width: 1200,
        height: 630,
        alt: "Ksana Yoga Studio Rental",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ksana | 瑜珈場地租用網站",
    description: "彈性預約、透明價格、多樣地點，為瑜珈教學與練習打造理想空間。",
    images: ["https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-HK" className="scroll-smooth">
      <GoogleTagManager gtmId="GTM-WZTCKC7T" />
      <body className={`${notoSansTC.className} antialiased`}>
        <SessionProvider>
          <QueryClientProvider>
            <CopilotKit runtimeUrl="/api/copilotkit">
              <ProjectNoticeModal />
              <Suspense fallback={<LoadingSpinner />}>
                <UserID>{children}</UserID>
              </Suspense>
            </CopilotKit>
            <ToastContainer />
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
