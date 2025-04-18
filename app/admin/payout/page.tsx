"use client";
import DateFilter from "@/components/custom-components/filters-and-sort/payout/DateFilter";
import PayoutMethodFilter from "@/components/custom-components/filters-and-sort/payout/PayoutMethodFilter";
import StudioFilter from "@/components/custom-components/filters-and-sort/payout/StudioFilter";

import SectionTitle from "@/components/custom-components/common/SectionTitle";
import { PayoutMethod, PayoutStatus } from "@/services/model";
import { startOfWeek, subDays } from "date-fns";

import LoadingSpinner from "@/components/custom-components/common/loading/LoadingSpinner";
import PaginationWrapper from "@/components/custom-components/common/PaginationWrapper";
import SectionFallback from "@/components/custom-components/common/SectionFallback";
import PayoutStatusFilter from "@/components/custom-components/filters-and-sort/payout/PayoutStatusFilter";
import PayoutStatusBadge from "@/components/custom-components/payout/common/PayoutStatusBadge";
import { Button } from "@/components/shadcn/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import useAdminStudioPayoutList from "@/hooks/react-query/admin-panel/useAdminStudioPayoutList";
import { payoutMethodMap } from "@/lib/constants/studio-details";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";
import { ArrowUpIcon, HandCoins, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export interface StudiosPayoutList {
  studio_id: number;
  studio_name: string;
  studio_slug: string;
  payout_status: PayoutStatus;
  payout_amount: number;
  payout_method: PayoutMethod;
}

export type AdminPayoutFilters = {
  studio: string;
  orderBy: string;
  orderDirection: string;
  payoutMethod: string;
  payoutStatus: string;
};

const limit = 10;
const PayoutPage = () => {
  const defaultStartDate = subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 14);
  const defaultEndDate = subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 8);
  const [selectedWeek, setSelectedWeek] = useState<DateRange>({
    from: defaultStartDate,
    to: defaultEndDate,
  });

  const [filters, setFilter] = useState({
    studio: "",
    orderBy: "studioId",
    orderDirection: "asc",
    payoutMethod: "",
    payoutStatus: "",
  });

  const [page, setPage] = useState(1);

  const { data: weeklyPayoutData, isLoading } = useAdminStudioPayoutList(
    formatDate(selectedWeek.from!),
    formatDate(selectedWeek.to!),
    page,
    limit,
    filters.studio,
    filters.orderBy,
    filters.orderDirection,
    filters.payoutMethod,
    filters.payoutStatus
  );

  return (
    <>
      <SectionTitle textColor="text-primary">Payout</SectionTitle>
      <div className="flex flex-col mt-5 mb-10">
        <DateFilter selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} />

        <div className="flex gap-4 mb-10 mt-5">
          <StudioFilter setFilter={setFilter} filter={filters} />
          <PayoutStatusFilter setFilter={setFilter} filter={filters} />
          <PayoutMethodFilter setFilter={setFilter} filter={filters} />
        </div>
        {isLoading ? (
          <LoadingSpinner height="h-[250px]" />
        ) : (
          <>
            {weeklyPayoutData.totalPayout.total_completed_booking_amount === 0 &&
            weeklyPayoutData.totalPayout.total_dispute_amount === 0 &&
            weeklyPayoutData.totalPayout.total_refund_amount === 0 ? (
              <div className="mt-14">
                <SectionFallback icon={HandCoins} fallbackText={"No payout to handle this week."} />
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
                        const isActive = column.value === filters.orderBy;
                        const currentDirection = filters.orderDirection;
                        const nextDirection =
                          isActive && currentDirection === "asc" ? "desc" : "asc";

                        return (
                          <TableHead key={column.value}>
                            <Button
                              variant="ghost"
                              onClick={() =>
                                setFilter({
                                  ...filters,
                                  orderBy: column.value,
                                  orderDirection: nextDirection,
                                })
                              }
                            >
                              {column.label}
                            </Button>

                            {isActive && (
                              <ArrowUpIcon
                                className={`inline transition-transform ${
                                  currentDirection === "desc" ? "rotate-180" : ""
                                }`}
                                size={16}
                              />
                            )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>

                  {weeklyPayoutData.studioPayoutList.payoutList.length > 0 && (
                    <TableBody>
                      {weeklyPayoutData.studioPayoutList.payoutList.map(
                        (studio: {
                          studio_id: number;
                          studio_name: string;
                          studio_slug: string;
                          payout_status: PayoutStatus;
                          payout_method: string;
                          total_payout_amount: number;
                        }) => (
                          <TableRow key={studio.studio_id}>
                            <TableCell>{studio.studio_id}</TableCell>
                            <TableCell>{studio.studio_name}</TableCell>

                            <TableCell>
                              <PayoutStatusBadge payoutStatus={studio.payout_status} />
                            </TableCell>
                            <TableCell>
                              {
                                payoutMethodMap.find(
                                  (method) => method.value === studio.payout_method
                                )?.label
                              }
                            </TableCell>
                            <TableCell>HKD$ {studio.total_payout_amount}</TableCell>
                            <TableCell>
                              <Button variant="link">
                                <Link
                                  href={`/admin/payout/studio/${
                                    studio.studio_id
                                  }?startDate=${formatDate(
                                    selectedWeek.from!
                                  )}&endDate=${formatDate(selectedWeek.to!)}`}
                                  className="flex items-center gap-2"
                                >
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
                    <PaginationWrapper
                      currentPage={page}
                      itemCount={weeklyPayoutData.studioPayoutList.totalCount}
                      pageSize={limit}
                      useQueryString={false}
                      setCurrentPage={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PayoutPage;

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
