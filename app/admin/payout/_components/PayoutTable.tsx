import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { payoutMethod, PayoutStatus } from "@/services/model";
import { ArrowRight, ArrowUpIcon } from "lucide-react";
import Link from "next/link";
import PayoutStatusBadge from "./PayoutStatusBadge";
import { StudiosPayoutList } from "../page";

export interface PayoutQuery {
  dateRange: string;
  payoutMethod: string;
  studio: string;
  status: PayoutStatus;
  orderBy: string;
  page: string;
}

interface Props {
  searchParams: PayoutQuery;
  payoutList: StudiosPayoutList[];
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

const PayoutTable = ({ searchParams, payoutList }: Props) => {
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
        {payoutList.map((studio) => (
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
            <TableCell>${studio.payout_amount}</TableCell>
            <TableCell>
              <Button variant="link" className="pl-0">
                <Link
                  href={`/admin/payout/studio/${studio.studio_slug}?startDate=2024-10-24&endDate=2024-10-30`}
                  className="flex gap-2 items-center"
                >
                  Payout Details <ArrowRight />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PayoutTable;
