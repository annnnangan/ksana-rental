import ButtonLink from "@/components/custom-components/common/buttons/ButtonLink";
import NavBar from "@/components/custom-components/layout/main-nav-bar/NavBar";
import Footer from "@/components/custom-components/layout/MainFooter";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow flex flex-col items-center justify-center">
        <SearchX className="mb-3" />
        <h2 className="font-bold mb-3 text-2xl">找不到頁面</h2>
        <ButtonLink href="/" variant="ghost">
          返回主頁
        </ButtonLink>
      </main>
      <Footer />
    </div>
  );
}
