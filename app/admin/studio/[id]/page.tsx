"use client";
import { approveStudio } from "@/actions/admin";
import AvatarWithFallback from "@/components/custom-components/common/AvatarWithFallback";
import SubmitButton from "@/components/custom-components/common/buttons/SubmitButton";
import SectionTitle from "@/components/custom-components/common/SectionTitle";
import ResponsiveTab from "@/components/custom-components/layout/ResponsiveTab";
import BasicInfoForm from "@/components/custom-components/studio-details-form/BasicInfoForm";
import BusinessHourAndPriceForm from "@/components/custom-components/studio-details-form/BusinessHourAndPriceForm";
import DoorPasswordForm from "@/components/custom-components/studio-details-form/DoorPasswordForm";
import EquipmentForm from "@/components/custom-components/studio-details-form/EquipmentForm";
import GalleryForm from "@/components/custom-components/studio-details-form/GalleryForm";
import PayoutForm from "@/components/custom-components/studio-details-form/PayoutForm";
import SocialForm from "@/components/custom-components/studio-details-form/SocialForm";
import StudioStatusBadge from "@/components/custom-components/StudioStatusBadge";
import { Button } from "@/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn/dialog";
import { Skeleton } from "@/components/shadcn/skeleton";
import useStudioFormData from "@/hooks/react-query/studio-panel/useStudioFormData";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-toastify";

const tabListMap = [
  { name: "基本資料", query: "basic-info" },
  { name: "可預約時間", query: "business-hours-and-price" },
  { name: "設備", query: "equipment" },
  { name: "圖片", query: "gallery" },
  { name: "大門密碼", query: "door-password" },
  { name: "社交媒體", query: "social" },
  { name: "收款資料", query: "payout-info" },
];

const AdminStudioPage = () => {
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const params = useParams();
  const studioId = params.id as string;

  const { data, isLoading } = useStudioFormData(studioId);

  const onSubmit = async () => {
    startTransition(() => {
      approveStudio(studioId).then((data) => {
        toast(data?.success ? "Successful studio approval" : "Fail to approve studio", {
          position: "top-right",
          type: data?.success ? "success" : "error",
          autoClose: 1000,
        });

        router.refresh();
        router.push(`/admin/studio`);
      });
    });
  };

  return (
    <div>
      <SectionTitle textColor="text-primary">場地資料</SectionTitle>

      {isLoading ? (
        <Skeleton className="h-20 w-1/2 mb-6" />
      ) : (
        <div className="mb-6">
          <div className="flex gap-4 items-center">
            <AvatarWithFallback avatarUrl={data.basicInfo.logo} type={"studio"} size="md" />
            <div>
              <p>
                <span className="font-bold">Studio: </span>
                {data.basicInfo.name}
              </p>
              <p>
                <span className="font-bold">Contact: </span>
                {data.basicInfo.phone}
              </p>
              <div className="flex gap-2">
                <span className="font-bold">Status: </span>
                <StudioStatusBadge status={data.status} />
              </div>
            </div>
          </div>
          {data.status === "reviewing" && (
            <Dialog>
              <DialogTrigger className="ms-auto mt-1 md:-mt-8" asChild>
                <Button className="flex justify-end">Approve Studio</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="flex items-center">
                  <DialogTitle>Are you sure to approve this studio?</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="w-full flex justify-center" onClick={onSubmit}>
                    <SubmitButton
                      isSubmitting={isPending}
                      submittingText={"Handling"}
                      nonSubmittingText={"Approve"}
                      withIcon={false}
                    />
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}

      <ResponsiveTab
        activeTab={activeTab}
        tabListMap={tabListMap}
        useQueryString={false}
        setActiveTab={setActiveTab}
      />

      <div className="my-5">
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <>
            {activeTab === "basic-info" && (
              <BasicInfoForm
                studioId={studioId}
                isOnboardingStep={false}
                defaultValues={data.basicInfo}
              />
            )}
            {activeTab === "business-hours-and-price" && (
              <BusinessHourAndPriceForm
                studioId={studioId}
                isOnboardingStep={false}
                defaultValue={data.businessHoursAndPrice}
              />
            )}
            {activeTab === "gallery" && (
              <GalleryForm
                studioId={studioId}
                isOnboardingStep={false}
                defaultValues={data.gallery}
              />
            )}
            {activeTab === "equipment" && (
              <EquipmentForm
                studioId={studioId}
                isOnboardingStep={false}
                defaultValues={data.equipment}
              />
            )}
            {activeTab === "door-password" && (
              <DoorPasswordForm
                studioId={studioId}
                isOnboardingStep={false}
                defaultValues={data.doorPassword}
              />
            )}
            {activeTab === "social" && (
              <SocialForm
                studioId={studioId}
                isOnboardingStep={false}
                defaultValues={data.social}
              />
            )}
            {activeTab === "payout-info" && (
              <PayoutForm
                studioId={studioId}
                isOnboardingStep={false}
                defaultValues={data.payoutInfo}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminStudioPage;
