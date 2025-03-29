"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/shadcn/chart";

export function ByMonthLineChart({ chartData, label }: { chartData: { month: string; total: number }[]; label: string }) {
  const chartConfig = {
    total: {
      label, // Dynamically set the label
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig}>
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Line dataKey="total" type="linear" strokeWidth={2} />
        <YAxis type="number" domain={[0, (dataMax: number) => Math.ceil(dataMax * 2)]} interval={0} allowDecimals={false} hide />
      </LineChart>
    </ChartContainer>
  );
}
