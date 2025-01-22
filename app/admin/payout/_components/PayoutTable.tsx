import ToastMessageWithRedirect from "@/app/_components/ToastMessageWithRedirect";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, getLastMonday } from "@/lib/utils/date-time-utils";
import { fetchWithBaseUrl } from "@/lib/utils/fetch-with-base-url";
import { payoutMethod, PayoutStatus } from "@/services/model";
import { startOfWeek, subDays } from "date-fns";
import { ArrowUpIcon, HandCoins } from "lucide-react";
import Link from "next/link";
import PayoutStatusBadge from "./PayoutStatusBadge";

export interface PayoutQuery {
  startDate: string;
  endDate: string;
  payoutMethod: string;
  studio: string;
  status: PayoutStatus;
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

const PayoutTable = async ({
  searchParams,
  defaultStartDate,
  defaultEndDate,
}: Props) => {
  const payoutStartDate =
    searchParams.startDate || formatDate(defaultStartDate);
  const payoutEndDate = searchParams.endDate || formatDate(defaultEndDate);
  const payoutOverviewDataResponse = await fetchWithBaseUrl(
    `/api/admin/payout?startDate=${payoutStartDate}&endDate=${payoutEndDate}`
  );

  if (!payoutOverviewDataResponse.success) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={payoutOverviewDataResponse.error.message}
        redirectPath={"/admin/payout"}
      />
    );
  }

  const { total_payout_amount, studios_payout_list: payoutList } =
    payoutOverviewDataResponse.data;

  return (
    <Table>
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
              {column.value === searchParams?.orderBy && (
                <ArrowUpIcon className="inline" size={16} />
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {payoutList.map(
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
                  payoutMethod.find(
                    (method) => method.value === studio.payout_method
                  )?.label
                }
              </TableCell>
              <TableCell>HKD$ {studio.total_payout_amount}</TableCell>
              <TableCell>
                <Button variant="link">
                  <Link
                    href={`/admin/payout/studio/${studio.studio_slug}?startDate=${payoutStartDate}&endDate=${payoutEndDate}`}
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
    </Table>
  );
};

export default PayoutTable;
