"use client";

import { CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/shadcn/chart";

export function ByMonthLineChart({ chartData, label }: { chartData: { month: string; total: number }[]; label: string }) {
  const chartConfig = {
    total: {
      label,
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" aspect={2}>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            left: 12,
            right: 12,
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
  );
}
