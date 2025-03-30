"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/shadcn/chart";

export function ByMonthBarChart({ chartData, label }: { chartData: { month: string; total: number }[]; label: string }) {
  const chartConfig = {
    total: {
      label,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
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
    </ChartContainer>
  );
}
