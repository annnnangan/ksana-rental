import PayoutDetails from "./PayoutDetails";
import TotalPayoutAmountCard from "./TotalPayoutAmountCard";

const PayoutDetailsTabContent = () => {
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
      <div className="w-full xl:basis-1/4">
        <TotalPayoutAmountCard
          finalPayoutAmount={finalPayoutAmount}
          completedBookingAmount={completedBooking.completed_booking_amount}
          disputeTransactionsAmount={
            disputeTransactions.dispute_transactions_amount
          }
          disputeTransactionsRefundAmount={
            disputeTransactions.dispute_transactions_refund_amount
          }
        />
      </div>
      <div className="w-full xl:basis-3/4">
        <PayoutDetails
          disputeTransactionsList={
            disputeTransactions.dispute_transactions_list
          }
          completedBookingList={completedBooking.completed_booking_list}
        />
      </div>
    </div>
  );
};

export default PayoutDetailsTabContent;
