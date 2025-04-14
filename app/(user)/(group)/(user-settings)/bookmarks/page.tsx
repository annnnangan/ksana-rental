import { sessionUser } from "@/lib/next-auth-config/session-user";
import { userService } from "@/services/user/UserService";
import { MapPinHouse } from "lucide-react";
import { redirect } from "next/navigation";

import { studioCardInfo } from "@/app/(user)/explore-studios/page";
import LinkButton from "@/components/animata/button/link-button";
import PaginationWrapper from "@/components/custom-components/common/PaginationWrapper";
import SectionFallback from "@/components/custom-components/common/SectionFallback";

import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import StudioCard from "@/components/custom-components/studio-card/StudioCard";

interface SearchQuery {
  page: string;
}

interface Props {
  searchParams: SearchQuery;
}

const pageSize = 6;
const BookmarksPage = async (props: Props) => {
  const user = await sessionUser();
  if (!user) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={"請先登入才可操作"}
        redirectPath={"/auth/login"}
      />
    );
  }
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams["page"]) || 1;
  const bookmarkResult = await userService.getUserAllStudioBookmark(
    user?.id,
    currentPage,
    pageSize
  );
  const bookmarkList = bookmarkResult.success
    ? bookmarkResult.data
    : { bookmarkList: [], totalCount: 0 };

  if (currentPage > 1 && Number(bookmarkList?.bookmarkList.length) === 0) {
    redirect("/bookmarks?page=1");
  }

  return (
    <div>
      <h1 className="text-primary text-2xl font-bold mb-5">我的收藏</h1>

      {bookmarkList?.bookmarkList.length === 0 ? (
        <div className="h-[200px] place-content-center flex flex-col space-y-4 items-center">
          <SectionFallback icon={MapPinHouse} fallbackText={"暫無收藏任何場地"} />
          <LinkButton href={"/explore-studios"}>探索場地</LinkButton>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarkList?.bookmarkList.map((studio: studioCardInfo) => (
            <StudioCard studio={studio} key={studio.slug} bookmarkRouterRefresh={true} />
          ))}
        </div>
      )}

      <div className="mt-8">
        {Number(bookmarkList?.totalCount) > pageSize && (
          <PaginationWrapper
            currentPage={currentPage}
            itemCount={Number(bookmarkList?.totalCount) || 0}
            pageSize={pageSize}
            useQueryString={true}
          />
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
