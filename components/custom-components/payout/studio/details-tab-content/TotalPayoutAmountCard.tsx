import { Card, CardContent } from "@/components/shadcn/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/shadcn/accordion";

interface Props {
  finalPayoutAmount: number;
  completedBookingAmount: number;
  disputeTransactionsAmount: number;
  disputeTransactionsRefundAmount: number;
}

const TotalPayoutAmountCard = ({ finalPayoutAmount, completedBookingAmount, disputeTransactionsAmount, disputeTransactionsRefundAmount }: Props) => {
  return (
    <Accordion type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1" className="border-0">
        <AccordionTrigger className="text-primary text-xl font-bold p-0">Summary</AccordionTrigger>
        <AccordionContent>
          <Card className="p-5 mt-5">
            <CardContent className="flex flex-col gap-5 p-0">
              <div>
                <p className="text-brand-700 font-bold">1. Completed Booking</p>
                <p>+ HK$ {completedBookingAmount}</p>
              </div>
              <div>
                <p className="text-brand-700 font-bold">2.Dispute Transactions</p>
                <p className="text-brand-700 text-sm">Total Amount</p>
                <p>+ HK$ {disputeTransactionsAmount}</p>
                <p className="text-brand-700 text-sm">Refund Amount</p>
                <p>- HK$ {disputeTransactionsRefundAmount}</p>
              </div>

              <div className="border-t-2 pt-2">
                <p className="text-brand-700 font-bold">Total Payout Amount</p>
                <p>HKD$ {finalPayoutAmount}</p>
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TotalPayoutAmountCard;
