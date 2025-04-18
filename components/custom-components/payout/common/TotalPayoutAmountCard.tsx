import { Card, CardContent } from "@/components/shadcn/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import { Skeleton } from "@/components/shadcn/skeleton";

interface Props {
  finalPayoutAmount: number;
  completedBookingAmount: number;
  disputeTransactionsAmount: number;
  disputeTransactionsRefundAmount: number;
  isLoading: boolean;
}

const TotalPayoutAmountCard = ({
  finalPayoutAmount,
  completedBookingAmount,
  disputeTransactionsAmount,
  disputeTransactionsRefundAmount,
  isLoading,
}: Props) => {
  return (
    <Accordion type="single" defaultValue="item-1" collapsible>
      <AccordionItem value="item-1" className="border-0">
        <AccordionTrigger className="text-primary text-xl font-bold p-0">總結</AccordionTrigger>
        <AccordionContent>
          <Card className="p-5 mt-5">
            <CardContent className="flex flex-col gap-5 p-0">
              <div>
                <p className="text-brand-700 font-bold">1. 完成預約款項</p>
                {isLoading ? (
                  <Skeleton className="mt-1 h-5 w-1/2" />
                ) : (
                  <p>+ HK$ {completedBookingAmount}</p>
                )}
              </div>
              <div>
                <p className="text-brand-700 font-bold">2.爭議款項</p>
                <p className="text-brand-700 text-sm">爭議預約金額</p>
                {isLoading ? (
                  <Skeleton className="mt-1 h-5 w-1/2" />
                ) : (
                  <p>+ HK$ {disputeTransactionsAmount}</p>
                )}

                <p className="text-brand-700 text-sm">退款</p>
                {isLoading ? (
                  <Skeleton className="mt-1 h-5 w-1/2" />
                ) : (
                  <p>- HK$ {disputeTransactionsRefundAmount}</p>
                )}
              </div>

              <div className="border-t-2 pt-2">
                <p className="text-brand-700 font-bold">總結算款項</p>
                {isLoading ? (
                  <Skeleton className="mt-1 h-5 w-1/2" />
                ) : (
                  <p>HKD$ {finalPayoutAmount}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TotalPayoutAmountCard;
