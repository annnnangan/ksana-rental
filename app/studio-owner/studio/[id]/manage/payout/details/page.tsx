"use client";
import PayoutStatusBadge from "@/components/custom-components/payout/common/PayoutStatusBadge";
import PayoutBreakdownTable from "@/components/custom-components/payout/common/PayoutBreakdownTable";
import TotalPayoutAmountCard from "@/components/custom-components/payout/common/TotalPayoutAmountCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";
import { differenceInDays, getDay, isAfter, startOfWeek, subDays } from "date-fns";
import { CircleChevronLeft, Loader2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

const payoutDetails = {
  method: "fps",
  account_name: "ngan yuk man",
  account_number: "xxxxx",
  payout_status: "complete",
  total_payout_amount: 1,
  total_completed_booking_amount: 2,
  total_dispute_amount: 3,
  total_refund_amount: 4,
  completedBookingList: [
    {
      index: "#",
      booking_reference_no: "預約編號",
      booking_date: "預約日期",
      booking_price: "價錢",
      booking_status: "預約狀態",
      is_complaint: "是否投訴",
    },
  ],
  disputeTransactionList: [
    {
      booking_reference_no: "預約編號",
      booking_date: "預約日期",
      booking_price: "價錢",
      is_complaint: "是否投訴",
      complaint_status: "狀態",
      complaint_resolved_at: "投訴解決日期",
      is_refund: "是否退款",
      refund_method: "退款方法",
      refund_amount: "退款金額",
    },
    {
      booking_reference_no: "預約編號",
      booking_date: "預約日期",
      booking_price: "價錢",
      is_complaint: "是否投訴",
      complaint_status: "狀態",
      complaint_resolved_at: "投訴解決日期",
      is_refund: "是否退款",
      refund_method: "退款方法",
      refund_amount: "退款金額",
    },
    {
      booking_reference_no: "預約編號",
      booking_date: "預約日期",
      booking_price: "價錢",
      is_complaint: "是否投訴",
      complaint_status: "狀態",
      complaint_resolved_at: "投訴解決日期",
      is_refund: "是否退款",
      refund_method: "退款方法",
      refund_amount: "退款金額",
    },
    {
      booking_reference_no: "預約編號",
      booking_date: "預約日期",
      booking_price: "價錢",
      is_complaint: "是否投訴",
      complaint_status: "狀態",
      complaint_resolved_at: "投訴解決日期",
      is_refund: "是否退款",
      refund_method: "退款方法",
      refund_amount: "退款金額",
    },
    {
      booking_reference_no: "預約編號",
      booking_date: "預約日期",
      booking_price: "價錢",
      is_complaint: "是否投訴",
      complaint_status: "狀態",
      complaint_resolved_at: "投訴解決日期",
      is_refund: "是否退款",
      refund_method: "退款方法",
      refund_amount: "退款金額",
    },
    {
      booking_reference_no: "預約編號",
      booking_date: "預約日期",
      booking_price: "價錢",
      is_complaint: "是否投訴",
      complaint_status: "狀態",
      complaint_resolved_at: "投訴解決日期",
      is_refund: "是否退款",
      refund_method: "退款方法",
      refund_amount: "退款金額",
    },
    {
      booking_reference_no: "預約編號",
      booking_date: "預約日期",
      booking_price: "價錢",
      is_complaint: "是否投訴",
      complaint_status: "狀態",
      complaint_resolved_at: "投訴解決日期",
      is_refund: "是否退款",
      refund_method: "退款方法",
      refund_amount: "退款金額",
    },
    {
      booking_reference_no: "預約編號",
      booking_date: "預約日期",
      booking_price: "價錢",
      is_complaint: "是否投訴",
      complaint_status: "狀態",
      complaint_resolved_at: "投訴解決日期",
      is_refund: "是否退款",
      refund_method: "退款方法",
      refund_amount: "退款金額",
    },
    {
      booking_reference_no: "預約編號",
      booking_date: "預約日期",
      booking_price: "價錢",
      is_complaint: "是否投訴",
      complaint_status: "狀態",
      complaint_resolved_at: "投訴解決日期",
      is_refund: "是否退款",
      refund_method: "退款方法",
      refund_amount: "退款金額",
    },
    {
      booking_reference_no: "預約編號",
      booking_date: "預約日期",
      booking_price: "價錢",
      is_complaint: "是否投訴",
      complaint_status: "狀態",
      complaint_resolved_at: "投訴解決日期",
      is_refund: "是否退款",
      refund_method: "退款方法",
      refund_amount: "退款金額",
    },
  ],
};

const PayoutDetailsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoadingPayoutDetails = false;
  const params = useParams();
  const studioId = params.id;

  const payoutStartDate = searchParams.get("startDate");
  const payoutEndDate = searchParams.get("endDate");

  useEffect(() => {
    const start = new Date(payoutStartDate as string);
    const end = new Date(payoutEndDate as string);

    const isValid = getDay(start) === 1 && getDay(end) === 0 && differenceInDays(end, start) === 6;

    const maxAllowedEndDate = subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 8);
    const isValidEnd = !isAfter(end, maxAllowedEndDate);

    if (!isValid || !isValidEnd) {
      toast("此結算時段無效。", {
        position: "top-right",
        type: "error",
        autoClose: 1000,
      });

      router.replace(`/studio-owner/studio/${studioId}/manage/payout`);
    }
  }, [payoutStartDate, payoutEndDate, router, studioId]);

  return (
    <div className="mt-5">
      <div className="flex justify-between mb-5">
        <div className="bg-gray-50 p-5 rounded-lg w-1/2">
          <p className="text-lg">
            <span className="font-bold">結算時段:</span> {payoutStartDate}
            <span className="text-sm"> 至 </span>
            {payoutEndDate}
          </p>
          <div className="flex text-lg gap-2">
            <p className="font-bold">結算狀態:</p>
            <PayoutStatusBadge payoutStatus={payoutDetails.payout_status as "complete"} />
          </div>
        </div>

        <Button
          variant="ghost"
          className="flex items-center gap-2 justify-center"
          onClick={() => router.back()}
        >
          <CircleChevronLeft />
          Back
        </Button>
      </div>

      <div className="flex flex-wrap xl:flex-nowrap gap-5">
        {/* Payout Amount Card */}
        {isLoadingPayoutDetails ? (
          <Skeleton className="h-32" />
        ) : (
          <div className="w-full xl:basis-1/4 flex flex-col gap-5">
            <div className="bg-gray-50 p-5 rounded-lg">
              <TotalPayoutAmountCard
                finalPayoutAmount={payoutDetails.total_payout_amount}
                completedBookingAmount={payoutDetails.total_completed_booking_amount}
                disputeTransactionsAmount={payoutDetails.total_dispute_amount}
                disputeTransactionsRefundAmount={payoutDetails.total_refund_amount}
              />
            </div>
            <div className="bg-gray-50 p-5 rounded-lg">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="text-primary text-xl font-bold p-0">
                    收帳資料
                  </AccordionTrigger>
                  <AccordionContent className="mt-5 space-y-1">
                    <p>收帳方法: {payoutDetails.method}</p>
                    <p>帳戶名稱：{payoutDetails.account_name}</p>
                    <p>帳戶號碼：{payoutDetails.account_number}</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )}

        {/* Breakdown Tables */}
        <div className="w-full xl:basis-3/4">
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-primary text-xl font-bold">詳細結算</h3>

            <Accordion type="multiple">
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="font-bold">完成預約款項</AccordionTrigger>
                <AccordionContent>
                  {isLoadingPayoutDetails ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <PayoutBreakdownTable
                      columns={BOOKING_TABLE_COLUMNS}
                      values={payoutDetails.completedBookingList}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-0">
                <AccordionTrigger className="font-bold">爭議款項</AccordionTrigger>
                <AccordionContent>
                  {isLoadingPayoutDetails ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <PayoutBreakdownTable
                      columns={DISPUTE_TABLE_COLUMNS}
                      values={payoutDetails.disputeTransactionList}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutDetailsPage;

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
