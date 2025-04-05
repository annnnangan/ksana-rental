"use client";
import ToastMessageWithRedirect from "@/components/custom-components/ToastMessageWithRedirect";
import { Button } from "@/components/shadcn/button";
import { PayoutMethod, PayoutStatus } from "@/services/model";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";

import AvatarWithFallback from "@/components/custom-components/AvatarWithFallback";
import PayoutStatusBadge from "@/components/custom-components/payout/PayoutStatusBadge";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import usePayout from "@/hooks/react-query/usePayout";
import { payoutMethodMap } from "@/lib/constants/studio-details";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ImagesGridPreview from "@/components/custom-components/ImagesGridPreview";
import ProofUploadAndPreview from "@/components/custom-components/payout/studio/overview-tab-content/ProofUploadAndPreview";

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

  const { data, isLoading, isError, error } = usePayout(payoutStartDate, payoutEndDate, 1, 1, studio);

  const payout = data && data?.studioPayoutList?.payoutList?.[0];

  return (
    <div className="my-8">
      <Button type="button" variant="ghost" className="fixed right-4 top-11" asChild>
        <Button variant="ghost" className="flex items-center gap-2 justify-center" onClick={() => router.back()}>
          <CircleChevronLeft />
          Back
        </Button>
      </Button>
      <div className="flex gap-5 mb-10">
        {isLoading ? (
          <Skeleton className="h-20 w-1/2" />
        ) : (
          <>
            <AvatarWithFallback avatarUrl={payout.studio_logo} type={"studio"} size="lg" />
            <div>
              <p>
                <span className="font-bold">Studio: </span>
                {payout.studio_name}
              </p>
              <p>
                <span className="font-bold">Contact: </span>
                {payout.studio_contact}
              </p>
              <p>
                <span className="font-bold">Email: </span>
                {payout.studio_email}
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
                  <PayoutStatusBadge payoutStatus={payout.payout_status} />
                </div>
                <div>
                  <p className="font-bold">Payout Amount</p>
                  <p>HKD$ {payout.total_payout_amount}</p>
                </div>
                <div>
                  <p className="font-bold">Payout Method</p>
                  <p>{payoutMethodMap.find((method) => method.value === payout.payout_method)?.label}</p>
                </div>
                <div>
                  <p className="font-bold">Payout Account</p>
                  <p>{payout.payout_account_number}</p>
                </div>
                <div>
                  <p className="font-bold">Payout Name</p>
                  <p>{payout.payout_account_name}</p>
                </div>
              </div>

              <div className="md:col-span-2 bg-gray-50 p-5 rounded-lg">
                {payout.payout_proof_image_urls ? (
                  <ImagesGridPreview images={payout.payout_proof_image_urls} imageAlt={"payout proof"} allowDeleteImage={false} gridCol={"grid-cols-3"} imageRatio="aspect-[3/4]" />
                ) : (
                  <ProofUploadAndPreview payoutOverview={payout} />
                )}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="details">
          <div>Hello</div>
          {/* <DetailsTabContent payoutOverview={payoutOverview} searchParams={searchParams} params={params} /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
