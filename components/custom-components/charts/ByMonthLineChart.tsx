"use client";

import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/shadcn/chart";
import { Skeleton } from "@/components/shadcn/skeleton";

export function ByMonthLineChart({ chartData, label, isLoading = false }: { chartData: { month: string; total: number }[]; label: string; isLoading?: boolean }) {
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
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                left: 15,
                right: 15,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Line dataKey="total" type="linear" strokeWidth={2}>
                <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </>
  );
}
