import { PayoutMethod, PayoutStatus } from "@/services/model";
import PayoutDetailsTab from "./PayoutDetailsTab";
import StudioBasicInfo from "./StudioBasicInfo";
import { studioService } from "@/services/studio/StudioService";
import { formatDate, getLastMonday } from "@/lib/utils/date-time-utils";
import { subDays } from "date-fns";
import { fetchWithBaseUrl } from "@/lib/utils/fetch-with-base-url";
import ToastMessageWithRedirect from "@/app/_components/ToastMessageWithRedirect";
import { Button } from "@/components/ui/button";
import { CircleChevronLeft } from "lucide-react";
import Link from "next/link";

export interface StudioPayoutOverviewData {
  studio_id: number;
  studio_name: string;
  studio_logo: string;
  studio_contact: string;
  studio_email: string;
  payout_status: PayoutStatus;
  total_payout_amount: number;
  payout_method: PayoutMethod;
  payout_account_number: string;
  payout_account_name: string;
  payout_proof: string[] | null;
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
  const searchParams = await props.searchParams;

  // const studioPayoutData: StudioPayoutData = {
  //   studio_info: {
  //     studio_id: 1,
  //     studio_name: "Soul Yogi Studio",
  //     studio_logo:
  //       "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/soul-yogi/soul-yogi-logo.png",
  //     studio_contact: "+8528765432",
  //     studio_email: "soul-yogi@gmail.com",
  //   },
  //   payout_overview: {
  //     payout_status: "pending",
  //     payout_amount: 480,
  //     payout_method: "fps",
  //     payout_account: "124592-525242",
  //     payout_name: "Chan Tai Man",
  //     payout_proof: [
  //       "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/payout-proof/payout-proof-1.PNG",
  //       "https://ksana-rental-local.s3.ap-southeast-1.amazonaws.com/seed-photo/payout-proof/payout-proof-2.PNG",
  //     ],
  //   },
  // };

  const defaultStartDate = formatDate(subDays(getLastMonday(new Date()), 14));
  const defaultEndDate = formatDate(subDays(getLastMonday(new Date()), 8));
  const payoutStartDate = searchParams.startDate || defaultStartDate;
  const payoutEndDate = searchParams.endDate || defaultEndDate;
  const studioPayoutOverviewDataResponse = await fetchWithBaseUrl(
    `/api/admin/payout/studio/${
      (
        await props.params
      ).slug
    }?startDate=${payoutStartDate}&endDate=${payoutEndDate}`
  );

  if (!studioPayoutOverviewDataResponse.success) {
    return (
      <ToastMessageWithRedirect
        type={"error"}
        message={studioPayoutOverviewDataResponse.error.message}
        redirectPath={"/admin/payout"}
      />
    );
  }

  const studioPayoutOverviewData: StudioPayoutOverviewData =
    studioPayoutOverviewDataResponse.data.studios_payout_list[0];

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
      <StudioBasicInfo studioInfo={studioPayoutOverviewData} />
      <p className="text-lg mb-5">
        <span className="font-bold">Payout Period:</span> {payoutStartDate} to{" "}
        {payoutEndDate}
      </p>
      <PayoutDetailsTab payoutOverview={studioPayoutOverviewData} />
    </div>
  );
};

export default page;
