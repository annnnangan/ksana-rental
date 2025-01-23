import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Params,
  StudioPayoutOverviewData,
  StudioPayoutQuery,
} from "../../page";
import PayoutBreakdownTable from "./PayoutBreakdownTable";
import TotalPayoutAmountCard from "./TotalPayoutAmountCard";
import { getStudioPayoutBreakdownData } from "@/app/_actions/payout/actions";
import ToastMessageWithRedirect from "@/app/_components/ToastMessageWithRedirect";

// Convert `keyof` to string explicitly
type DisputeTableKeys = Exclude<keyof typeof DISPUTE_TABLE_COLUMNS, "index"> &
  string;
type BookingTableKeys = Exclude<keyof typeof BOOKING_TABLE_COLUMNS, "index"> &
  string;

// Example: Props using the extracted keys
export interface PayoutBreakdownData {
  dispute_transaction_list: Array<
    Record<DisputeTableKeys, string | boolean | number>
  >;
  completed_booking_list: Array<
    Record<BookingTableKeys, string | boolean | number>
  >;
}

interface Props {
  payoutOverview: StudioPayoutOverviewData;
  searchParams: Promise<StudioPayoutQuery>;
  params: Params;
}

const DetailsTabContent = async ({
  payoutOverview: {
    total_completed_booking_amount,
    total_dispute_amount,
    total_refund_amount,
    total_payout_amount,
  },
  searchParams,
  params,
}: Props) => {
  const response = await getStudioPayoutBreakdownData(
    (
      await searchParams
    ).startDate,
    (
      await searchParams
    ).endDate,
    (
      await params
    ).slug
  );

  if (!response.success) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={response.error.message}
        redirectPath={"/admin/payout"}
      />
    );
  }

  const breakdownDataList: PayoutBreakdownData =
    response.success && (response.data as PayoutBreakdownData);

  return (
    <div className="flex flex-wrap xl:flex-nowrap gap-5">
      {/* Payout Amount Card */}
      <div className="w-full xl:basis-1/4">
        <TotalPayoutAmountCard
          finalPayoutAmount={total_payout_amount}
          completedBookingAmount={total_completed_booking_amount}
          disputeTransactionsAmount={total_dispute_amount}
          disputeTransactionsRefundAmount={total_refund_amount}
        />
      </div>

      {/* Breakdown Tables */}
      <div className="w-full xl:basis-3/4">
        <div>
          <h3 className="text-primary text-xl font-bold">Payout Details</h3>

          <Accordion type="multiple">
            <AccordionItem value="item-1" className="border-0">
              <AccordionTrigger className="font-bold">
                Completed Booking
              </AccordionTrigger>
              <AccordionContent>
                <PayoutBreakdownTable
                  columns={BOOKING_TABLE_COLUMNS}
                  values={breakdownDataList.completed_booking_list}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-0">
              <AccordionTrigger className="font-bold">
                Dispute Transactions
              </AccordionTrigger>
              <AccordionContent>
                <PayoutBreakdownTable
                  columns={DISPUTE_TABLE_COLUMNS}
                  values={breakdownDataList.dispute_transaction_list}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default DetailsTabContent;

const DISPUTE_TABLE_COLUMNS = {
  index: "#",
  booking_reference_no: "預約編號",
  booking_date: "預約日期",
  booking_price: "價錢",
  is_complaint: "是否投訴",
  complaint_status: "狀態",
  complaint_resolved_at: "投訴解決日期",
  is_refund: "是否退款",
  refund_method: "退款方法",
  refund_amount: "退款金額",
} as const;

const BOOKING_TABLE_COLUMNS = {
  index: "#",
  booking_reference_no: "預約編號",
  booking_date: "預約日期",
  booking_price: "價錢",
  booking_status: "預約狀態",
  is_complaint: "是否投訴",
} as const;
