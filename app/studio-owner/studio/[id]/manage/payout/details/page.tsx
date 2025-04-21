"use client";
import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import PayoutBreakdownTable from "@/components/custom-components/payout/common/PayoutBreakdownTable";
import PayoutStatusBadge from "@/components/custom-components/payout/common/PayoutStatusBadge";
import TotalPayoutAmountCard from "@/components/custom-components/payout/common/TotalPayoutAmountCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Button } from "@/components/shadcn/button";
import { Skeleton } from "@/components/shadcn/skeleton";
import useStudioPayoutDetails from "@/hooks/react-query/studio-panel/useStudioPayoutDetails";
import { payoutMethodMap } from "@/lib/constants/studio-details";
import Image from "next/image";
import { differenceInDays, getDay, isAfter, startOfDay, startOfWeek, subDays } from "date-fns";
import { CircleChevronLeft, FileText, Loader2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import SectionFallback from "@/components/custom-components/common/SectionFallback";

const getPayoutStatus = (status: string | null, totalPayoutAmount: number) => {
  if (status === null && totalPayoutAmount === 0) {
    return "N/A";
  } else if (status === null && totalPayoutAmount > 0) {
    return "pending";
  } else {
    return status;
  }
};

const PayoutDetailsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useParams();
  const studioId = params.id;

  const payoutStartDate = searchParams.get("startDate");
  const payoutEndDate = searchParams.get("endDate");

  // Validate is valid payout date range
  const start = new Date(payoutStartDate || "");
  const end = new Date(payoutEndDate || "");

  const isValid =
    payoutStartDate &&
    payoutEndDate &&
    getDay(start) === 1 &&
    getDay(end) === 0 &&
    differenceInDays(end, start) === 6;

  const maxAllowedEndDate = startOfDay(subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 8));
  const isEndWithinRange = !isAfter(startOfDay(end), maxAllowedEndDate);
  const isDateRangeValid = isValid && isEndWithinRange;

  const { data, isLoading, isError } = useStudioPayoutDetails(
    studioId as string,
    payoutStartDate!,
    payoutEndDate!,
    { enabled: isDateRangeValid, studioId, payoutStartDate, payoutEndDate }
  );

  if (!isDateRangeValid) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={"無效結算時段"}
        redirectPath={`/studio-owner/studio/${studioId}/manage/payout`}
      />
    );
  }

  if (isError) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={"無效取得資料。"}
        redirectPath={`/studio-owner/studio/${studioId}/manage/payout`}
      />
    );
  }

  const payoutStatus = getPayoutStatus(
    data?.payoutOverviewData?.payout_status,
    data?.payoutOverviewData?.total_payout_amount
  );

  return (
    <div className="mt-5">
      <div className="flex justify-between mb-5">
        <div className="bg-gray-50 p-5 rounded-lg w-1/2">
          <p className="text-lg">
            <span className="font-bold">結算時段:</span> {payoutStartDate}
            <span className="text-sm"> 至 </span>
            {payoutEndDate}
          </p>
          <div className="flex text-lg gap-2 items-center">
            <p className="font-bold">結算狀態:</p>

            {isLoading ? (
              <Skeleton className="h-5 w-1/2" />
            ) : payoutStatus == "N/A" ? (
              <p>N/A</p>
            ) : (
              <PayoutStatusBadge payoutStatus={payoutStatus as "complete" | "pending"} />
            )}
          </div>
          <div className="flex text-lg gap-2">
            <p className="font-bold">結算日期:</p>
            {isLoading ? (
              <Skeleton className="h-5 w-1/2" />
            ) : (
              data?.payoutOverviewData.payout_at ?? "N/A"
            )}
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

        <div className="w-full xl:basis-1/4 flex flex-col gap-5">
          <div className="bg-gray-50 p-5 rounded-lg">
            <TotalPayoutAmountCard
              finalPayoutAmount={data?.payoutOverviewData.total_payout_amount}
              completedBookingAmount={data?.payoutOverviewData.total_completed_booking_amount}
              disputeTransactionsAmount={data?.payoutOverviewData.total_dispute_amount}
              disputeTransactionsRefundAmount={data?.payoutOverviewData.total_refund_amount}
              isLoading={isLoading}
            />
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="text-primary text-xl font-bold p-0">
                  收帳資料
                </AccordionTrigger>
                <AccordionContent className="mt-5 space-y-1">
                  {isLoading ? (
                    <Skeleton className="h-5 w-1/2" />
                  ) : (
                    <>
                      <p>
                        收帳方法：
                        {
                          payoutMethodMap.find(
                            (method) => method.value === data?.payoutOverviewData.payout_method
                          )?.label
                        }
                      </p>
                      <p>帳戶名稱：{data?.payoutOverviewData.payout_account_name}</p>
                      <p>帳戶號碼：{data?.payoutOverviewData.payout_account_number}</p>
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Breakdown Tables */}
        <div className="w-full xl:basis-3/4 space-y-5">
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-primary text-xl font-bold">詳細結算</h3>

            <Accordion type="multiple">
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="font-bold">完成預約款項</AccordionTrigger>
                <AccordionContent>
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <PayoutBreakdownTable
                      columns={BOOKING_TABLE_COLUMNS}
                      values={data.completedBookingList}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-0">
                <AccordionTrigger className="font-bold">爭議款項</AccordionTrigger>
                <AccordionContent>
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <PayoutBreakdownTable
                      columns={DISPUTE_TABLE_COLUMNS}
                      values={data.disputeTransactionList}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="bg-gray-50 p-5 rounded-lg">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="text-primary text-xl font-bold p-0">
                  收帳證明
                </AccordionTrigger>
                <AccordionContent className="mt-5 space-y-1">
                  {isLoading ? (
                    <Skeleton className="h-5 w-1/2" />
                  ) : (
                    <>
                      {data?.payoutOverviewData?.payout_proof_image_urls ? (
                        <div className="grid grid-cols-3">
                          {data?.payoutOverviewData?.payout_proof_image_urls.map(
                            (image: string) => (
                              <div className="relative aspect-[3/4]" key={image}>
                                <Image
                                  src={image}
                                  alt="payout proof image"
                                  fill
                                  sizes="(min-width: 1024px) 200px, 100vw"
                                  className="rounded-md object-contain object-center"
                                />
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="flex justify-center items-center">
                          <SectionFallback icon={FileText} fallbackText={"無收帳證明"} />
                        </div>
                      )}
                    </>
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
