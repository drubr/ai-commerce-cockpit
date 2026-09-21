"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const activity = [
  { day: "1 Sep", ariba: 180, coupa: 110, srm: 60 },
  { day: "5 Sep", ariba: 320, coupa: 190, srm: 85 },
  { day: "10 Sep", ariba: 280, coupa: 165, srm: 72 },
  { day: "15 Sep", ariba: 470, coupa: 265, srm: 125 },
  { day: "20 Sep", ariba: 440, coupa: 290, srm: 115 },
  { day: "25 Sep", ariba: 640, coupa: 390, srm: 180 },
  { day: "30 Sep", ariba: 590, coupa: 350, srm: 160 },
];
const revenue = [
  { month: "Apr", revenue: 64000 },
  { month: "May", revenue: 78000 },
  { month: "Jun", revenue: 72000 },
  { month: "Jul", revenue: 89000 },
  { month: "Aug", revenue: 97000 },
  { month: "Sep", revenue: 124000 },
];
const activityConfig = {
  ariba: { label: "SAP Ariba", color: "var(--chart-1)" },
  coupa: { label: "Coupa", color: "var(--chart-2)" },
  srm: { label: "SAP SRM", color: "var(--chart-5)" },
} satisfies ChartConfig;
const revenueConfig = {
  revenue: { label: "Revenue (€)", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function DashboardCharts() {
  return (
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <Card className="min-w-0 shadow-none">
        <CardHeader>
          <CardTitle>Session activity</CardTitle>
          <CardDescription>
            September 2026 · Sample sessions by connection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={activityConfig}
            className="h-[250px] w-full"
            aria-label="Sample September sessions by connection, trending upward across SAP Ariba, Coupa, and SAP SRM"
          >
            <AreaChart
              accessibilityLayer
              data={activity}
              margin={{ left: -20, right: 8 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={24}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="srm"
                type="monotone"
                stackId="sessions"
                stroke="var(--color-srm)"
                fill="var(--color-srm)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                dataKey="coupa"
                type="monotone"
                stackId="sessions"
                stroke="var(--color-coupa)"
                fill="var(--color-coupa)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                dataKey="ariba"
                type="monotone"
                stackId="sessions"
                stroke="var(--color-ariba)"
                fill="var(--color-ariba)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="min-w-0 shadow-none">
        <CardHeader>
          <CardTitle>Punchout revenue</CardTitle>
          <CardDescription>
            April–September 2026 · Sample monthly revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={revenueConfig}
            className="h-[250px] w-full"
            aria-label="Sample monthly revenue, increasing from 64,000 euros in April to 124,000 euros in September"
          >
            <BarChart
              accessibilityLayer
              data={revenue}
              margin={{ left: -8, right: 8 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `€${value / 1000}k`}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={[5, 5, 0, 0]}
                maxBarSize={42}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
