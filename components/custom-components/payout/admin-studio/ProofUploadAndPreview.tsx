"use client";

import ErrorMessage from "@/components/custom-components/common/ErrorMessage";
import ImagesGridPreview from "@/components/custom-components/ImagesGridPreview";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "react-toastify";

import SubmitButton from "@/components/custom-components/common/buttons/SubmitButton";
import { StudioPayoutOverviewData } from "@/app/admin/payout/studio/[id]/page";
import { generateAWSImageUrls } from "@/lib/utils/s3-upload/s3-image-upload-utils";
import { confirmStudioPayout } from "@/actions/admin";
import { useQueryClient } from "@tanstack/react-query";

const addUploadTimestampToFile = (file: File, index: number) => {
  // Encode the index into the lastModified timestamp
  const lastModifiedWithIndex = Date.now() + index;

  const newFile = new File([file], file.name, {
    type: file.type,
    lastModified: lastModifiedWithIndex,
  });
  return newFile;
};

interface Props {
  payoutOverview: StudioPayoutOverviewData;
}

const ProofUploadAndPreview = ({ payoutOverview }: Props) => {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      //convert FileList to array
      const newFiles = Array.from(e.target.files);
      const newImageURLs = newFiles.map((file, index) => addUploadTimestampToFile(file, index));
      setImages([...images, ...newImageURLs]);
      //reset input after upload
      e.target.value = "";
    }
  };

  const handleImageRemove = (identifier: string | number, imageSrc: string) => {
    const updatedImages = images.filter(
      (image) => !(image instanceof File && image.lastModified === identifier)
    );
    URL.revokeObjectURL(imageSrc);
    setImages(updatedImages);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const payoutRecord: PayoutCompleteRecordType = {
      payoutStartDate: searchParams.get("startDate")!,
      payoutEndDate: searchParams.get("endDate")!,
      studio_id: payoutOverview.studio_id.toString(),
      slug: params.slug,
      method: payoutOverview.payout_method,
      account_name: payoutOverview.payout_account_name,
      account_number: payoutOverview.payout_account_number,
      total_payout_amount: payoutOverview.total_payout_amount,
      completed_booking_amount: payoutOverview.total_completed_booking_amount,
      dispute_amount: payoutOverview.total_dispute_amount,
      refund_amount: payoutOverview.total_refund_amount,
    };

    const uploadedProofImageURLs = await generateAWSImageUrls(
      images as File[],
      `studio/${payoutOverview.studio_id}/payout`,
      "payout"
    );

    if (!uploadedProofImageURLs.success) {
      toast("圖片無法儲存，請重試。", {
        position: "top-right",
        type: "error",
        autoClose: 1000,
      });
      return;
    } else {
      startTransition(() => {
        confirmStudioPayout(uploadedProofImageURLs.data as string[], payoutRecord).then((data) => {
          toast(data.error?.message || "儲存成功。", {
            position: "top-right",
            type: data?.success ? "success" : "error",
            autoClose: 1000,
          });
          router.refresh();
          queryClient.invalidateQueries({
            queryKey: ["payout", payoutRecord.payoutStartDate, payoutRecord.payoutEndDate],
          });
          queryClient.invalidateQueries({
            queryKey: [
              "payout",
              payoutRecord.payoutStartDate,
              payoutRecord.payoutEndDate,
              payoutRecord.slug,
            ],
          });
        });
      });
    }

    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <p className="font-bold mb-2">Upload payout proof</p>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          multiple
          className="text-sm"
          onChange={handleFileSelect}
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {images.length > 0 && (
          <>
            <div className="mt-5">
              <p className="font-bold">Payout Proof Preview</p>
              <ImagesGridPreview
                images={images}
                removeImage={handleImageRemove}
                imageAlt={"payout proof"}
                allowDeleteImage={true}
                gridCol={"grid-cols-3"}
                imageRatio="aspect-[3/4]"
              />
            </div>
            <SubmitButton
              isSubmitting={loading}
              submittingText="Saving..."
              nonSubmittingText="Submit and Confirm Payout"
            />{" "}
          </>
        )}
      </form>
    </>
  );
};

export default ProofUploadAndPreview;
