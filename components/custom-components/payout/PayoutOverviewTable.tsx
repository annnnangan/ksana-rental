"use client";
import { Button } from "@/components/shadcn/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";

import { Skeleton } from "@/components/shadcn/skeleton";
import usePayout from "@/hooks/react-query/usePayout";
import { payoutMethodMap } from "@/lib/constants/studio-details";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import { PayoutMethod, PayoutStatus } from "@/services/model";
import { ArrowUpIcon, HandCoins, Search } from "lucide-react";
import Link from "next/link";
import SectionFallback from "../SectionFallback";
import PayoutStatusBadge from "./PayoutStatusBadge";
import StudioFilter from "../filters-and-sort/payout/StudioFilter";
import StatusFilter from "../filters-and-sort/payout/StatusFilter";
import PayoutMethodFilter from "../filters-and-sort/payout/PayoutMethodFilter";
import PaginationWrapper from "../PaginationWrapper";

export interface PayoutQuery {
  startDate: string;
  endDate: string;
  payoutMethod: PayoutMethod;
  studio: string;
  payoutStatus: PayoutStatus;
  orderBy: string;
  page: string;
  orderDirection: string;
}

interface Props {
  searchParams: PayoutQuery;
  defaultStartDate: Date;
  defaultEndDate: Date;
}

//Table columns
const columns: {
  label: string;
  value: string;
}[] = [
  { label: "Studio Id", value: "studioId" },
  { label: "Studio Name", value: "studioName" },
  { label: "Payout Status", value: "payoutStatus" },
  { label: "Payout Method", value: "payoutMethod" },
  { label: "Payout Amount", value: "payoutAmount" },
  { label: "Payout Action", value: "payoutAction" },
];

const PayoutOverviewTable = ({ searchParams, defaultStartDate, defaultEndDate }: Props) => {
  const limit = 10;
  const payoutStartDate = searchParams.startDate || formatDate(defaultStartDate);
  const payoutEndDate = searchParams.endDate || formatDate(defaultEndDate);
  const studio = searchParams.studio;
  const payoutMethod = ["fps", "payme", "bank-transfer"].includes(searchParams.payoutMethod) ? searchParams.payoutMethod : undefined;
  const payoutStatus = ["pending", "complete"].includes(searchParams.payoutStatus) ? searchParams.payoutStatus : undefined;
  const page = Number(searchParams.page) || 1;
  const orderBy = ["studioId", "studioName", "payoutStatus", "payoutMethod", "payoutAmount", "payoutAction"].includes(searchParams.orderBy) ? searchParams.orderBy : "studioId";
  const orderDirection = ["asc", "desc"].includes(searchParams.orderDirection) ? searchParams.orderDirection : "asc";

  const { data: weeklyPayoutData, isLoading, isError, error } = usePayout(payoutStartDate, payoutEndDate, page, limit, studio, orderBy, orderDirection, payoutMethod, payoutStatus);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  console.log("count", weeklyPayoutData);
  return (
    <>
      {weeklyPayoutData.totalPayout.total_completed_booking_amount === 0 && weeklyPayoutData.totalPayout.total_dispute_amount === 0 && weeklyPayoutData.totalPayout.total_refund_amount === 0 ? (
        <div className="mt-20">
          <SectionFallback icon={HandCoins} fallbackText={"No payout is needed to handle this week."} />
        </div>
      ) : (
        <>
          <Table>
            {weeklyPayoutData.studioPayoutList.payoutList.length === 0 && (
              <TableCaption>
                <div className="mt-5">
                  <SectionFallback icon={Search} fallbackText={"No Search Result"} />
                </div>
              </TableCaption>
            )}
            <TableHeader>
              <TableRow>
                {columns.map((column) => {
                  const isActive = column.value === searchParams?.orderBy;
                  const currentDirection = searchParams?.orderDirection || "asc";
                  const nextDirection = isActive && currentDirection === "asc" ? "desc" : "asc";

                  return (
                    <TableHead key={column.value}>
                      <Link
                        href={{
                          query: {
                            ...searchParams,
                            orderBy: column.value,
                            orderDirection: nextDirection,
                          },
                        }}
                      >
                        {column.label}
                      </Link>

                      {isActive && <ArrowUpIcon className={`inline transition-transform ${currentDirection === "desc" ? "rotate-180" : ""}`} size={16} />}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>

            {weeklyPayoutData.studioPayoutList.payoutList.length > 0 && (
              <TableBody>
                {weeklyPayoutData.studioPayoutList.payoutList.map(
                  (studio: { studio_id: number; studio_name: string; studio_slug: string; payout_status: PayoutStatus; payout_method: string; total_payout_amount: number }) => (
                    <TableRow key={studio.studio_id}>
                      <TableCell>{studio.studio_id}</TableCell>
                      <TableCell>{studio.studio_name}</TableCell>

                      <TableCell>
                        <PayoutStatusBadge payoutStatus={studio.payout_status} />
                      </TableCell>
                      <TableCell>{payoutMethodMap.find((method) => method.value === studio.payout_method)?.label}</TableCell>
                      <TableCell>HKD$ {studio.total_payout_amount}</TableCell>
                      <TableCell>
                        <Button variant="link">
                          <Link href={`/admin/payout/studio/${studio.studio_slug}?startDate=${payoutStartDate}&endDate=${payoutEndDate}`} className="flex items-center gap-2">
                            <span className="hidden md:block">Payment Details</span>
                            <HandCoins />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            )}
          </Table>
          {weeklyPayoutData.studioPayoutList.totalCount > limit && (
            <div className="mt-8">
              <PaginationWrapper currentPage={page} itemCount={weeklyPayoutData.studioPayoutList.totalCount} pageSize={limit} useQueryString={true} />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default PayoutOverviewTable;
