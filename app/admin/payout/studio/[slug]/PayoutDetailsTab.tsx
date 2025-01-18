import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { StudioPayoutOverview } from "./page";
import PayoutDetailsTabContent from "./_component/details-tab-content/PayoutDetailsTabContent";
import PayoutOverviewTabContent from "./_component/overview-tab-content/PayoutOverviewTabContent";

interface Props {
  payoutOverview: StudioPayoutOverview;
}

const PayoutDetailsTab = ({ payoutOverview }: Props) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <PayoutOverviewTabContent payoutOverview={payoutOverview} />
      </TabsContent>
      <TabsContent value="details">
        <PayoutDetailsTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default PayoutDetailsTab;
