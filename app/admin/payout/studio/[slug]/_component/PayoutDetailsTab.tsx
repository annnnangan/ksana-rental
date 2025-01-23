import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PayoutOverviewTabContent from "./overview-tab-content/OverviewTabContent";
import PayoutDetailsTabContent from "./details-tab-content/DetailsTabContent";
import { StudioPayoutOverviewData } from "../page";
import DetailsTabContent from "./details-tab-content/DetailsTabContent";
import OverviewTabContent from "./overview-tab-content/OverviewTabContent";

interface Props {
  payoutOverview: StudioPayoutOverviewData;
}

const PayoutDetailsTab = ({ payoutOverview }: Props) => {
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
        <DetailsTabContent payoutOverview={payoutOverview} />
      </TabsContent>
    </Tabs>
  );
};

export default PayoutDetailsTab;
