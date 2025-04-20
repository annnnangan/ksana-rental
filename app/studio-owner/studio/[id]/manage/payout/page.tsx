"use client";

import LoadingSpinner from "@/components/custom-components/common/loading/LoadingSpinner";
import PaginationWrapper from "@/components/custom-components/common/PaginationWrapper";
import SectionFallback from "@/components/custom-components/common/SectionFallback";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import DateFilter from "@/components/custom-components/filters-and-sort/payout/DateFilter";
import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import useStudioPayoutList from "@/hooks/react-query/studio-panel/useStudioPayoutList";
import useStudioStatus from "@/hooks/react-query/studio-panel/useStudioStatus";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import { HandCoins } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const columns: {
  label: string;
  value: string;
}[] = [
  { label: "開始日期", value: "payoutStartDate" },
  { label: "完結日期", value: "payoutEndDate" },
  { label: "結算金額", value: "payoutAmount" },
  { label: "結算日期", value: "payoutAt" },
  { label: "", value: "payoutAction" },
];

const limit = 10;
const PayoutPage = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const studioId = params.id as string;
  const { data: studioStatus, isLoading: isLoadingStudioStatus } = useStudioStatus(studioId);

  const [selectedWeek, setSelectedWeek] = useState<DateRange>({
    from: searchParams.get("startDate")
      ? new Date(searchParams.get("startDate") as string)
      : undefined,
    to: searchParams.get("endDate") ? new Date(searchParams.get("endDate") as string) : undefined,
  });

  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useStudioPayoutList(
    page,
    limit,
    studioId as string,
    { enabled: studioStatus !== "reviewing" ? true : false },
    selectedWeek.from ? formatDate(selectedWeek.from) : undefined
  );

  if (isLoadingStudioStatus) {
    return <LoadingSpinner height="h-48" />;
  }

  return (
    <>
      <SectionTitle textColor="text-primary">結算記錄</SectionTitle>
      <div className="flex gap-2">
        <DateFilter selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} />
        <Button
          variant={"ghost"}
          size={"sm"}
          onClick={() => setSelectedWeek({ from: undefined, to: undefined })}
        >
          取消日期設定
        </Button>
      </div>
      <div>
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
                return <TableHead key={column.value}>{column.label}</TableHead>;
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }, (_, index) => (
                <TableRow key={index} className="border-0">
                  <TableCell colSpan={5}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading &&
              studioStatus !== "reviewing" &&
              data?.payoutList.length > 0 &&
              data?.payoutList.map(
                (item: {
                  payout_start_date: string;
                  payout_end_date: string;
                  total_payout_amount: number;
                  payout_at: string | null;
                }) => (
                  <TableRow key={item.payout_start_date}>
                    <TableCell>{item.payout_start_date}</TableCell>
                    <TableCell>{item.payout_end_date}</TableCell>

                    <TableCell>HKD$ {item.total_payout_amount}</TableCell>
                    <TableCell>{item.payout_at ?? "N/A"}</TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0">
                        <Link
                          href={`payout/details?startDate=${item.payout_start_date}&endDate=${item.payout_end_date}`}
                          className="flex items-center gap-2"
                        >
                          <span className="hidden md:block">詳情</span>
                          <HandCoins />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
        {!isLoading && studioStatus === "reviewing" && (
          <div className="mt-10">
            <SectionFallback icon={HandCoins} fallbackText={"暫未有結算"} />
          </div>
        )}

        {!isLoading && data?.payoutList.length === 0 && (
          <div className="mt-10">
            <SectionFallback icon={HandCoins} fallbackText={"暫未有結算"} />
          </div>
        )}

        {isError && (
          <div className="mt-10">
            <SectionFallback icon={HandCoins} fallbackText={"未能取得結算資料。"} />
          </div>
        )}

        {!isLoading && data?.totalCount > limit && studioStatus !== "reviewing" && (
          <div className="mt-8">
            <PaginationWrapper
              currentPage={page}
              itemCount={data?.totalCount}
              pageSize={limit}
              useQueryString={false}
              setCurrentPage={setPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default PayoutPage;
