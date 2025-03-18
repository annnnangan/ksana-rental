"use client";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/shadcn/pagination";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  itemCount: number;
  pageSize: number;
  currentPage: number;
}
const PaginationWrapper = ({ itemCount, pageSize, currentPage }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push("?" + params.toString());
  };

  const totalPages = Math.ceil(itemCount / pageSize);

  // Generates an array of all page numbers from 1 to totalPages.
  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const isMobile = useIsMobile();
  const offSetNumber = isMobile ? 2 : 3;

  return (
    <Pagination>
      <PaginationContent className="flex flex-wrap">
        <PaginationPrevious
          style={currentPage === 1 ? { pointerEvents: "none", color: "gray" } : {}}
          onClick={(e) => {
            if (currentPage === 1) {
              e.preventDefault();
            } else {
              changePage(currentPage - 1);
            }
          }}
        />

        {getPages().map((page) =>
          Math.abs(page - currentPage) < offSetNumber || page === 1 || page === totalPages ? (
            <PaginationItem key={page}>
              <PaginationLink isActive={page === currentPage} onClick={() => changePage(page)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : (
            (page === currentPage - offSetNumber && <PaginationEllipsis key={page} />) || (page === currentPage + offSetNumber && <PaginationEllipsis key={page} />)
          )
        )}

        <PaginationNext
          style={currentPage === totalPages ? { pointerEvents: "none", color: "gray" } : {}}
          onClick={(e) => {
            if (currentPage === totalPages) {
              e.preventDefault();
            } else {
              changePage(currentPage + 1);
            }
          }}
        />
      </PaginationContent>
    </Pagination>
  );
};
export default PaginationWrapper;
