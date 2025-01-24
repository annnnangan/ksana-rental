"use client";
import SubmitButton from "@/app/studio-owner/studio/[id]/onboarding/_component/SubmitButton";
import ErrorMessage from "@/components/custom-components/ErrorMessage";
import ImagesGridPreview from "@/components/custom-components/ImagesGridPreview";
import { uploadImage } from "@/lib/utils/s3-upload/s3-image-upload-utils";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { StudioPayoutOverviewData } from "../../page";

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

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      //convert FileList to array
      const newFiles = Array.from(e.target.files);
      const newImageURLs = newFiles.map((file, index) =>
        addUploadTimestampToFile(file, index)
      );
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
      slug: params.slug,
      method: payoutOverview.payout_method,
      account_name: payoutOverview.payout_account_name,
      account_number: payoutOverview.payout_account_number,
      total_payout_amount: payoutOverview.total_payout_amount,
      completed_booking_amount: payoutOverview.total_completed_booking_amount,
      dispute_amount: payoutOverview.total_dispute_amount,
      refund_amount: payoutOverview.total_refund_amount,
    };

    const response = await fetch("/api/admin/payout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payoutRecord),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    const { payout_id, studio_id } = result.data;

    //Upload Image
    const errorResponse = await Promise.all(
      images
        .filter((image) => image instanceof File)
        .map(
          async (image) =>
            await uploadImage(
              image,
              "payout-proof",
              studio_id,
              `/api/admin/payout/proof`,
              "POST",
              "payout-proof",
              payout_id
            )
        )
    );

    const error = errorResponse.filter(
      (errorMessage) => errorMessage !== undefined
    );

    if (error.length > 0) {
      setError(error.toString());
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
    toast("Payout is confirmed", {
      position: "top-right",
      type: "success",
      autoClose: 1000,
    });
  };

  return (
    <>
      <form className="border rounded-lg p-5 mb-5" onSubmit={handleSubmit}>
        <p className="font-bold mb-2">Upload payout proof</p>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          multiple
          className="text-sm"
          onChange={handleFileSelect}
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div className="mt-5 mb-20">
          <p className="font-bold">Payout Proof Preview</p>
          <ImagesGridPreview
            images={images}
            removeImage={handleImageRemove}
            imageAlt={"payout proof"}
            allowDeleteImage={true}
            gridCol={3}
            gridColSpan={""}
            imageRatio="aspect-[3/4]"
          />
        </div>

        <SubmitButton
          isSubmitting={loading}
          submittingText="Saving..."
          nonSubmittingText="Submit and Confirm Payout"
        />
      </form>
    </>
  );
};

export default ProofUploadAndPreview;
