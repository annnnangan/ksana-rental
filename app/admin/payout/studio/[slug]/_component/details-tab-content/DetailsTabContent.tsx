import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StudioPayoutOverviewData } from "../../page";
import PayoutBreakdownTable from "./PayoutBreakdownTable";
import TotalPayoutAmountCard from "./TotalPayoutAmountCard";

interface Props {
  payoutOverview: StudioPayoutOverviewData;
}

const DetailsTabContent = ({
  payoutOverview: {
    total_completed_booking_amount,
    total_dispute_amount,
    total_refund_amount,
    total_payout_amount,
  },
}: Props) => {
  const finalPayoutAmount = 480;

  const disputeTransactions = {
    dispute_transactions_amount: 365,
    dispute_transactions_refund_amount: 150,
    dispute_transactions_list: [
      {
        booking_reference_no: "tMZHMAnwBlsvmotRHqiUW",
        booking_date: "2024-10-02",
        booking_price: 100,
        is_complaint: true,
        complaint_status: "resolved",
        complaint_resolved_at: "2024-10-25 20:00",
        is_refund: true,
        refund_method: "credit",
        refund_amount: 100,
      },
      {
        booking_reference_no: "tMZHMAnwBlsvmotR",
        booking_date: "2024-10-02",
        booking_price: 100,
        is_complaint: true,
        complaint_status: "resolved",
        complaint_resolved_at: "2024-10-25 20:00",
        is_refund: true,
        refund_method: "credit",
        refund_amount: 100,
      },
    ],
  };

  const completedBooking = {
    completed_booking_amount: 265,
    completed_booking_list: [
      {
        booking_reference_no: "ISml7JTJvACAkL2SI3hQ3",
        booking_date: "2024-10-24",
        booking_price: 165,
        booking_status: "completed",
        is_complaint: false,
      },
    ],
  };

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
                  values={[]}
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
                  values={[]}
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

// // Convert `keyof` to string explicitly
// type DisputeTableKeys = Exclude<keyof typeof DISPUTE_TABLE_COLUMNS, "index"> &
//   string;
// type BookingTableKeys = Exclude<keyof typeof BOOKING_TABLE_COLUMNS, "index"> &
//   string;

// // Example: Props using the extracted keys
// interface Props {
//   disputeTransactionsList: Array<
//     Record<DisputeTableKeys, string | boolean | number>
//   >;
//   completedBookingList: Array<
//     Record<BookingTableKeys, string | boolean | number>
//   >;
// }
