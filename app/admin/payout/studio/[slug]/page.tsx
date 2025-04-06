"use client";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { Button } from "@/components/shadcn/button";
import { PayoutMethod, PayoutStatus } from "@/services/model";
import { CircleChevronLeft, Frown, Loader, Loader2 } from "lucide-react";

import AvatarWithFallback from "@/components/custom-components/AvatarWithFallback";
import PayoutStatusBadge from "@/components/custom-components/payout/PayoutStatusBadge";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import usePayout from "@/hooks/react-query/usePayout";
import { payoutMethodMap } from "@/lib/constants/studio-details";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ImagesGridPreview from "@/components/custom-components/ImagesGridPreview";
import ProofUploadAndPreview from "@/components/custom-components/payout/studio/overview-tab-content/ProofUploadAndPreview";
import TotalPayoutAmountCard from "@/components/custom-components/payout/studio/details-tab-content/TotalPayoutAmountCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shadcn/accordion";
import PayoutBreakdownTable from "@/components/custom-components/payout/studio/details-tab-content/PayoutBreakdownTable";
import usePayoutDetails from "@/hooks/react-query/usePayoutDetails";
import SectionFallback from "@/components/custom-components/SectionFallback";

export interface StudioPayoutOverviewData {
  studio_id: number;
  studio_name: string;
  studio_logo: string;
  studio_slug: string;
  studio_contact: string;
  studio_email: string;
  payout_status: PayoutStatus;
  payout_method: PayoutMethod;
  payout_account_number: string;
  payout_account_name: string;
  payout_proof_image_urls: string[] | null;
  total_completed_booking_amount: number;
  total_dispute_amount: number;
  total_refund_amount: number;
  total_payout_amount: number;
}

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const payoutStartDate = searchParams.get("startDate");
  const payoutEndDate = searchParams.get("endDate");
  const studio = params.slug as string;

  if (!payoutStartDate || !payoutEndDate || !studio) {
    return <ToastMessageWithRedirect type={"error"} message={"無法取得資料"} redirectPath={"/admin/payout"} />;
  }

  const { data: payoutOverviewData, isLoading: isLoadingPayoutOverview } = usePayout(payoutStartDate, payoutEndDate, 1, 1, studio);
  const { data: payoutDetails, isLoading: isLoadingPayoutDetails, isError: isPayoutDetailsError } = usePayoutDetails(payoutStartDate, payoutEndDate, studio);

  const payoutOverview = payoutOverviewData && payoutOverviewData?.studioPayoutList?.payoutList?.[0];

  return (
    <div className="my-8">
      <Button type="button" variant="ghost" className="fixed right-4 top-11" asChild>
        <Button variant="ghost" className="flex items-center gap-2 justify-center" onClick={() => router.back()}>
          <CircleChevronLeft />
          Back
        </Button>
      </Button>
      <div className="flex gap-5 mb-10">
        {isLoadingPayoutOverview ? (
          <Skeleton className="h-20 w-1/2" />
        ) : (
          <>
            <AvatarWithFallback avatarUrl={payoutOverview.studio_logo} type={"studio"} size="lg" />
            <div>
              <p>
                <span className="font-bold">Studio: </span>
                {payoutOverview.studio_name}
              </p>
              <p>
                <span className="font-bold">Contact: </span>
                {payoutOverview.studio_contact}
              </p>
              <p>
                <span className="font-bold">Email: </span>
                {payoutOverview.studio_email}
              </p>
            </div>
          </>
        )}
      </div>
      <p className="text-lg mb-5">
        <span className="font-bold">Payout Period:</span> {payoutStartDate} to {payoutEndDate}
      </p>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {isLoadingPayoutOverview ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col bg-gray-50 p-5 rounded-lg gap-5 w-full md:col-span-1">
                <div>
                  <p className="font-bold">Payout Status</p>
                  <PayoutStatusBadge payoutStatus={payoutOverview.payout_status} />
                </div>
                <div>
                  <p className="font-bold">Payout Amount</p>
                  <p>HKD$ {payoutOverview.total_payout_amount}</p>
                </div>
                <div>
                  <p className="font-bold">Payout Method</p>
                  <p>{payoutMethodMap.find((method) => method.value === payoutOverview.payout_method)?.label}</p>
                </div>
                <div>
                  <p className="font-bold">Payout Account</p>
                  <p>{payoutOverview.payout_account_number}</p>
                </div>
                <div>
                  <p className="font-bold">Payout Name</p>
                  <p>{payoutOverview.payout_account_name}</p>
                </div>
              </div>

              <div className="md:col-span-2 bg-gray-50 p-5 rounded-lg">
                {payoutOverview.payout_proof_image_urls ? (
                  <ImagesGridPreview images={payoutOverview.payout_proof_image_urls} imageAlt={"payout proof"} allowDeleteImage={false} gridCol={"grid-cols-3"} imageRatio="aspect-[3/4]" />
                ) : (
                  <ProofUploadAndPreview payoutOverview={payoutOverview} />
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="details">
          <div className="flex flex-wrap xl:flex-nowrap gap-5">
            {/* Payout Amount Card */}
            {isLoadingPayoutOverview ? (
              <Skeleton className="h-32" />
            ) : (
              <div className="w-full xl:basis-1/4 bg-gray-50 p-5 rounded-lg">
                <TotalPayoutAmountCard
                  finalPayoutAmount={payoutOverview.total_payout_amount}
                  completedBookingAmount={payoutOverview.total_completed_booking_amount}
                  disputeTransactionsAmount={payoutOverview.total_dispute_amount}
                  disputeTransactionsRefundAmount={payoutOverview.total_refund_amount}
                />
              </div>
            )}

            {/* Breakdown Tables */}
            <div className="w-full xl:basis-3/4">
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-primary text-xl font-bold">Payout Details</h3>

                <Accordion type="multiple">
                  <AccordionItem value="item-1" className="border-0">
                    <AccordionTrigger className="font-bold">Completed Booking</AccordionTrigger>
                    <AccordionContent>
                      {isLoadingPayoutDetails ? <Loader2 className="animate-spin" /> : <PayoutBreakdownTable columns={BOOKING_TABLE_COLUMNS} values={payoutDetails.completedBookingList} />}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-0">
                    <AccordionTrigger className="font-bold">Dispute Transactions</AccordionTrigger>
                    <AccordionContent>
                      {isLoadingPayoutDetails ? <Loader2 className="animate-spin" /> : <PayoutBreakdownTable columns={DISPUTE_TABLE_COLUMNS} values={payoutDetails.disputeTransactionList} />}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;

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
