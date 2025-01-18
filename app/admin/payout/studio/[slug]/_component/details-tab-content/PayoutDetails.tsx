import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PayoutDetailsTable from "./PayoutDetailsTable";

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

// Convert `keyof` to string explicitly
type DisputeTableKeys = Exclude<keyof typeof DISPUTE_TABLE_COLUMNS, "index"> &
  string;
type BookingTableKeys = Exclude<keyof typeof BOOKING_TABLE_COLUMNS, "index"> &
  string;

// Example: Props using the extracted keys
interface Props {
  disputeTransactionsList: Array<
    Record<DisputeTableKeys, string | boolean | number>
  >;
  completedBookingList: Array<
    Record<BookingTableKeys, string | boolean | number>
  >;
}

const PayoutDetails = ({
  disputeTransactionsList,
  completedBookingList,
}: Props) => {
  return (
    <div>
      <h3 className="text-primary text-xl font-bold">Payout Details</h3>

      <Accordion type="multiple">
        <AccordionItem value="item-1" className="border-0">
          <AccordionTrigger className="font-bold">
            Completed Booking
          </AccordionTrigger>
          <AccordionContent>
            <PayoutDetailsTable
              columns={BOOKING_TABLE_COLUMNS}
              values={completedBookingList}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2" className="border-0">
          <AccordionTrigger className="font-bold">
            Dispute Transactions
          </AccordionTrigger>
          <AccordionContent>
            <PayoutDetailsTable
              columns={DISPUTE_TABLE_COLUMNS}
              values={disputeTransactionsList}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default PayoutDetails;
