import SectionTitle from "@/components/custom-components/common/SectionTitle";
import PayoutHistoryTable from "@/components/custom-components/payout/PayoutHistoryTable";
import { payoutService } from "@/services/payout/PayoutService";
import React from "react";

const page = async () => {
  const data = await payoutService.getTotalPayoutList();

  return (
    <>
      <SectionTitle textColor="text-primary">Payout History</SectionTitle>
      <p className="-mt-3 text-gray-400 text-sm">The actual payout amount that has paid to studios</p>
      <PayoutHistoryTable data={data.data?.payoutList} />
    </>
  );
};

export default page;
