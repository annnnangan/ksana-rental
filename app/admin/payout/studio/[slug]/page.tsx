import { getStudioPayoutOverviewData } from "@/app/_actions/payout/actions";
import ToastMessageWithRedirect from "@/app/_components/ToastMessageWithRedirect";
import { Button } from "@/components/ui/button";
import { PayoutMethod, PayoutStatus } from "@/services/model";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";
import PayoutDetailsTab from "./_component/PayoutDetailsTab";
import StudioBasicInfo from "./_component/StudioBasicInfo";

export interface StudioPayoutOverviewData {
  studio_id: number;
  studio_name: string;
  studio_logo: string;
  studio_contact: string;
  studio_email: string;
  payout_status: PayoutStatus;
  payout_method: PayoutMethod;
  payout_account_number: string;
  payout_account_name: string;
  payout_proof: string[] | null;
  total_completed_booking_amount: number;
  total_dispute_amount: number;
  total_refund_amount: number;
  total_payout_amount: number;
}

interface StudioPayoutQuery {
  startDate: string;
  endDate: string;
}

type Params = Promise<{ slug: string }>;

interface Props {
  searchParams: Promise<StudioPayoutQuery>;
  params: Params;
}

const page = async (props: Props) => {
  const { startDate, endDate } = await props.searchParams;
  const { slug } = await props.params;

  const overviewDataResponse = await getStudioPayoutOverviewData(
    startDate,
    endDate,
    slug
  );

  if (!overviewDataResponse.success) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={overviewDataResponse.error.message}
        redirectPath={"/admin/payout"}
      />
    );
  }

  const overviewData: StudioPayoutOverviewData =
    overviewDataResponse.success &&
    (overviewDataResponse.data as StudioPayoutOverviewData);

  return (
    <div>
      <Button type="button" variant="ghost" className="fixed right-4 top-11">
        <Link
          href="/admin/payout"
          className="flex items-center gap-2 justify-center"
        >
          <CircleChevronLeft />
          Back
        </Link>
      </Button>
      <StudioBasicInfo studioInfo={overviewData} />
      <p className="text-lg mb-5">
        <span className="font-bold">Payout Period:</span> {startDate} to{" "}
        {endDate}
      </p>
      <PayoutDetailsTab payoutOverview={overviewData} />
    </div>
  );
};

export default page;
