"use client";
import ToastMessageWithRedirect from "@/components/custom-components/common/ToastMessageWithRedirect";
import { Button } from "@/components/shadcn/button";
import { PayoutMethod, PayoutStatus } from "@/services/model";
import { CircleChevronLeft, Loader2 } from "lucide-react";
import AvatarWithFallback from "@/components/custom-components/common/AvatarWithFallback";
import ImagesGridPreview from "@/components/custom-components/ImagesGridPreview";
import ProofUploadAndPreview from "@/components/custom-components/payout/admin-studio/ProofUploadAndPreview";
import PayoutBreakdownTable from "@/components/custom-components/payout/common/PayoutBreakdownTable";
import PayoutStatusBadge from "@/components/custom-components/payout/common/PayoutStatusBadge";
import TotalPayoutAmountCard from "@/components/custom-components/payout/common/TotalPayoutAmountCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";

import { payoutMethodMap } from "@/lib/constants/studio-details";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { differenceInDays, getDay, isAfter, startOfDay, startOfWeek, subDays } from "date-fns";
import useAdminStudioPayoutDetails from "@/hooks/react-query/admin-panel/useAdminStudioPayoutDetails";

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

const AdminPayoutPage = () => {
  const router = useRouter();

  // Get Studio Id from route
  const params = useParams();
  const studioId = params.id;

  // Get Payout Start and End Date from route
  const searchParams = useSearchParams();
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

  // Call API to Get Studio Payout Details
  const { data, isLoading, isError } = useAdminStudioPayoutDetails(
    studioId as string,
    payoutStartDate!,
    payoutEndDate!,
    { enabled: isDateRangeValid, studioId, payoutStartDate, payoutEndDate }
  );

  // Redirect back to payout list page when input details is incorrect
  if (!isDateRangeValid) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={"無效結算時段"}
        redirectPath={"/admin/payout"}
      />
    );
  }

  if (!studioId) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={"無法取得資料"}
        redirectPath={"/admin/payout"}
      />
    );
  }

  return (
    <div className="my-8">
      <Button type="button" variant="ghost" className="fixed right-4 top-11" asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 justify-center"
          onClick={() => router.back()}
        >
          <CircleChevronLeft />
          Back
        </Button>
      </Button>
      <div className="flex gap-5 mb-10">
        {isLoading ? (
          <Skeleton className="h-20 w-1/2" />
        ) : (
          <>
            <AvatarWithFallback
              avatarUrl={data.payoutOverviewData.studio_logo}
              type={"studio"}
              size="lg"
            />
            <div>
              <p>
                <span className="font-bold">Studio: </span>
                {data.payoutOverviewData.studio_name}
              </p>
              <p>
                <span className="font-bold">Contact: </span>
                {data.payoutOverviewData.studio_contact}
              </p>
              <p>
                <span className="font-bold">Email: </span>
                {data.payoutOverviewData.studio_email}
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
          {isLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col bg-gray-50 p-5 rounded-lg gap-5 w-full md:col-span-1">
                <div>
                  <p className="font-bold">Payout Status</p>
                  <PayoutStatusBadge payoutStatus={data.payoutOverviewData.payout_status} />
                </div>
                <div>
                  <p className="font-bold">Payout Amount</p>
                  <p>HKD$ {data.payoutOverviewData.total_payout_amount}</p>
                </div>
                <div>
                  <p className="font-bold">Payout Method</p>
                  <p>
                    {
                      payoutMethodMap.find(
                        (method) => method.value === data.payoutOverviewData.payout_method
                      )?.label
                    }
                  </p>
                </div>
                <div>
                  <p className="font-bold">Payout Account</p>
                  <p>{data.payoutOverviewData.payout_account_number}</p>
                </div>
                <div>
                  <p className="font-bold">Payout Name</p>
                  <p>{data.payoutOverviewData.payout_account_name}</p>
                </div>
              </div>

              <div className="md:col-span-2 bg-gray-50 p-5 rounded-lg">
                {data.payoutOverviewData.payout_proof_image_urls ? (
                  <ImagesGridPreview
                    images={data.payoutOverviewData.payout_proof_image_urls}
                    imageAlt={"payout proof"}
                    allowDeleteImage={false}
                    gridCol={"grid-cols-3"}
                    imageRatio="aspect-[3/4]"
                  />
                ) : (
                  <ProofUploadAndPreview payoutOverview={data.payoutOverviewData} />
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="details">
          <div className="flex flex-wrap xl:flex-nowrap gap-5">
            {/* Payout Amount Card */}

            <div className="w-full xl:basis-1/4 bg-gray-50 p-5 rounded-lg">
              <TotalPayoutAmountCard
                isLoading={isLoading}
                finalPayoutAmount={data.payoutOverviewData.total_payout_amount}
                completedBookingAmount={data.payoutOverviewData.total_completed_booking_amount}
                disputeTransactionsAmount={data.payoutOverviewData.total_dispute_amount}
                disputeTransactionsRefundAmount={data.payoutOverviewData.total_refund_amount}
              />
            </div>

            {/* Breakdown Tables */}
            <div className="w-full xl:basis-3/4">
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-primary text-xl font-bold">Payout Details</h3>

                <Accordion type="multiple">
                  <AccordionItem value="item-1" className="border-0">
                    <AccordionTrigger className="font-bold">Completed Booking</AccordionTrigger>
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
                    <AccordionTrigger className="font-bold">Dispute Transactions</AccordionTrigger>
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
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPayoutPage;

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
