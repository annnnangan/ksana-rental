import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/tabs";
import { Params, StudioPayoutOverviewData, StudioPayoutQuery } from "../page";
import DetailsTabContent from "./details-tab-content/DetailsTabContent";
import OverviewTabContent from "./overview-tab-content/OverviewTabContent";

interface Props {
  payoutOverview: StudioPayoutOverviewData;
  searchParams: Promise<StudioPayoutQuery>;
  params: Params;
}

const PayoutDetailsTab = ({ payoutOverview, searchParams, params }: Props) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <OverviewTabContent payoutOverview={payoutOverview} />
      </TabsContent>
      <TabsContent value="details">
        <DetailsTabContent
          payoutOverview={payoutOverview}
          searchParams={searchParams}
          params={params}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PayoutDetailsTab;
