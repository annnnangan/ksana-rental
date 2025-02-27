import SectionTitle from "@/components/custom-components/studio-details/SectionTitle";
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { TotalBookingsByMonth } from "@/components/custom-components/charts/TotalBookingsByMonth";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/shadcn/table";

const DashboardPage = () => {
  return (
    <div>
      <SectionTitle>儀表板</SectionTitle>

      <div className="grid grid-cols-1 gap-y-3 gap-x-4 md:grid-cols-2">
        <Card className="border-gray-300 md:col-span-2">
          <CardHeader className="pb-1 space-y-1 md:space-y-1.5">
            <CardTitle className="text-sm md:text-base text-primary">所有預約</CardTitle>
            <CardDescription className="text-xs md:text-sm ">營運之今所有預約包括即將開始、已完成、取消及已失效預約。</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-3xl md:text-4xl font-bold">50</p>
              <ul className="flex gap-3">
                <li>
                  <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 transition-colors">
                    即將開始
                  </Badge>
                  <p className="text-lg font-semibold">20</p>
                </li>
                <li>
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600 transition-colors">
                    已完成
                  </Badge>
                  <p className="text-lg font-semibold">20</p>
                </li>
                <li>
                  <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 transition-colors">
                    已取消
                  </Badge>
                  <p className="text-lg font-semibold">20</p>
                </li>
                <li>
                  <Badge variant="default" className="bg-gray-500 hover:bg-gray-600 transition-colors">
                    已失效
                  </Badge>
                  <p className="text-lg font-semibold">20</p>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-300">
          <CardHeader className="pb-1 space-y-1 md:space-y-1.5">
            <CardTitle className="text-sm md:text-base text-primary">預計收入</CardTitle>
            <CardDescription className="text-xs md:text-sm ">營運之今所有預約收入，不包括取消、失效、有爭議未完成處理訂單。</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-3xl md:text-4xl font-bold">HKD $50</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-300">
          <CardHeader className="pb-1 space-y-1 md:space-y-1.5">
            <CardTitle className="text-sm md:text-base text-primary">實質已收取​收入</CardTitle>
            <CardDescription className="text-xs md:text-sm ">營運之今Ksana已給付場地之總​收入。</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <p className="text-3xl md:text-4xl font-bold">HKD $50</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-300">
          <CardHeader className="pb-1 space-y-1 md:space-y-1.5">
            <CardTitle className="text-sm md:text-base text-primary">實質已收取​收入</CardTitle>
            <CardDescription className="text-xs md:text-sm ">營運之今Ksana已給付場地之總​收入。</CardDescription>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1">
            <TotalBookingsByMonth />
          </CardContent>
        </Card>
        <Card className="border-gray-300">
          <CardHeader className="pb-1 space-y-1 md:space-y-1.5">
            <CardTitle className="text-sm md:text-base text-primary">即將開始的10張訂單</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 md:pt-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
