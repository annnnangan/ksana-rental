import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import PayoutOverviewTabContent from "./_component/PayoutOverviewTabContent";
import { StudioPayoutOverview } from "./page";
import ImagePreview from "./_component/ImagePreview";

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
      <TabsContent value="details">Change your password here.</TabsContent>
    </Tabs>
  );
};

export default PayoutDetailsTab;
