"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/shadcn/chart";
import { Skeleton } from "@/components/shadcn/skeleton";

export function ByMonthBarChart({ chartData, label, isLoading = false }: { chartData: { month: string; total: number }[]; label: string; isLoading?: boolean }) {
  const chartConfig = {
    total: {
      label,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <>
      {isLoading ? (
        <Skeleton className="w-full h-48" />
      ) : (
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" aspect={2}>
            {/* <-- Add this block */}
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="total" radius={8} fill="hsl(var(--chart-3))">
                <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </>
  );
}
