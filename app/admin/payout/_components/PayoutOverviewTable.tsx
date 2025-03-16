import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { Button } from "@/components/shadcn/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";

import { fetchWithBaseUrl } from "@/lib/utils/fetch-with-base-url";
import { PayoutMethod, PayoutStatus } from "@/services/model";
import { startOfWeek, subDays } from "date-fns";
import { ArrowUpIcon, HandCoins } from "lucide-react";
import Link from "next/link";
import PayoutStatusBadge from "./PayoutStatusBadge";
import { payoutMethodMap } from "@/lib/constants/studio-details";
import { formatDate } from "@/lib/utils/date-time/format-date-utils";

export interface PayoutQuery {
  startDate: string;
  endDate: string;
  payoutMethod: PayoutMethod;
  studio: string;
  payoutStatus: PayoutStatus;
  orderBy: string;
  page: string;
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
  { label: "Studio Name", value: "Studio Name" },
  { label: "Payout Status", value: "payoutStatus" },
  { label: "Payout Method", value: "payoutMethod" },
  { label: "Payout Amount", value: "payoutAmount" },
  { label: "Payout Action", value: "payoutAction" },
];

const PayoutOverviewTable = async ({ searchParams, defaultStartDate, defaultEndDate }: Props) => {
  const payoutStartDate = searchParams.startDate || formatDate(defaultStartDate);
  const payoutEndDate = searchParams.endDate || formatDate(defaultEndDate);

  const queryParams = new URLSearchParams({
    startDate: payoutStartDate,
    endDate: payoutEndDate,
  });

  // Add payoutMethod if it exists
  if (searchParams.payoutMethod) {
    queryParams.append("payoutMethod", searchParams.payoutMethod);
  }

  // Add payoutStatus if it exists
  if (searchParams.payoutStatus) {
    queryParams.append("payoutStatus", searchParams.payoutStatus);
  }

  // Add studio if it exists
  if (searchParams.studio) {
    queryParams.append("studio", searchParams.studio);
  }

  // Fetch data
  const payoutOverviewDataResponse = await fetchWithBaseUrl(`/api/admin/payout?${queryParams.toString()}`);

  if (!payoutOverviewDataResponse.success) {
    return <ToastMessageWithRedirect type={"error"} message={payoutOverviewDataResponse.error.message} redirectPath={"/admin/payout"} />;
  }

  const { total_payout_amount, studios_payout_list: payoutList } = payoutOverviewDataResponse.data;

  return (
    <Table>
      {payoutList.length === 0 && <TableCaption>No Payout Information</TableCaption>}

      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.value}>
              <Link
                href={{
                  query: { orderBy: column.value },
                }}
              >
                {column.label}
              </Link>
              {column.value === searchParams?.orderBy && <ArrowUpIcon className="inline" size={16} />}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      {payoutList.length > 0 && (
        <TableBody>
          {payoutList.map((studio: { studio_id: number; studio_name: string; studio_slug: string; payout_status: PayoutStatus; payout_method: string; total_payout_amount: number }) => (
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
          ))}
        </TableBody>
      )}
    </Table>
  );
};

export default PayoutOverviewTable;
