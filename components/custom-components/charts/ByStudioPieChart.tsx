"use client";

import { Pie, PieChart } from "recharts";

import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/shadcn/chart";

const generateSkyBlueShade = (index: number) => `hsl(205, 80%, ${30 + index * 20}% )`;

const generateChartConfig = (chartData: { studio_name: string }[]) => {
  return chartData.reduce((config, item, index) => {
    config[item.studio_name] = {
      label: item.studio_name,
      color: generateSkyBlueShade(index),
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);
};

export function ByStudioPieChart({ chartData }: { chartData: { studio_name: string; total: number }[] }) {
  const itemsChartConfig = generateChartConfig(chartData);

  const chartConfig = { total: { label: "total" }, ...itemsChartConfig };

  const chartDataWithColors = chartData.map((item) => ({
    ...item,
    fill: itemsChartConfig[item.studio_name].color,
  }));

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie data={chartDataWithColors} dataKey="total" nameKey="studio_name" innerRadius={60} label />
        <ChartLegend content={<ChartLegendContent nameKey="studio_name" />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
      </PieChart>
    </ChartContainer>
  );
}
