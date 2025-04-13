"use client";

import SectionTitle from "@/components/custom-components/common/SectionTitle";
import DateFilter from "@/components/custom-components/filters-and-sort/payout/DateFilter";
import PayoutStatusBadge from "@/components/custom-components/payout/common/PayoutStatusBadge";
import { Button } from "@/components/shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import { HandCoins } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const columns: {
  label: string;
  value: string;
}[] = [
  { label: "開始日期", value: "payoutStartDate" },
  { label: "完結日期", value: "payoutEndDate" },
  { label: "結算狀態", value: "payoutStatus" },
  { label: "結算金額", value: "payoutAmount" },
  { label: "結算日期", value: "payoutAt" },
  { label: "", value: "payoutAction" },
];

const payoutList = [
  {
    payout_start_date: "2025-03-10",
    payout_end_date: "2025-03-16",
    total_payout_amount: 200,
    payout_status: "complete",
    payout_at: "2025-02-20",
  },
  {
    payout_start_date: "2025-04-07",
    payout_end_date: "2025-04-13",
    total_payout_amount: 200,
    payout_status: "pending",
    payout_at: "2025-02-20",
  },
];

const PayoutPage = () => {
  const searchParams = useSearchParams();

  const [selectedWeek, setSelectedWeek] = useState<DateRange>({
    from: searchParams.get("startDate")
      ? new Date(searchParams.get("startDate") as string)
      : undefined,
    to: searchParams.get("endDate") ? new Date(searchParams.get("endDate") as string) : undefined,
  });

  return (
    <>
      <SectionTitle>結算記錄</SectionTitle>
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
            {payoutList.map((item) => (
              <TableRow key={item.payout_start_date}>
                <TableCell>{item.payout_start_date}</TableCell>
                <TableCell>{item.payout_end_date}</TableCell>
                <TableCell>
                  <PayoutStatusBadge payoutStatus={item.payout_status as "complete"} />
                </TableCell>
                <TableCell>HKD$ {item.total_payout_amount}</TableCell>
                <TableCell>{item.payout_at}</TableCell>
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
            ))}
          </TableBody>
        </Table>
        {/* {weeklyPayoutData.studioPayoutList.totalCount > limit && (
          <div className="mt-8">
            <PaginationWrapper
              currentPage={page}
              itemCount={weeklyPayoutData.studioPayoutList.totalCount}
              pageSize={limit}
              useQueryString={true}
            />
          </div>
        )} */}
      </div>
    </>
  );
};

export default PayoutPage;
