// src/components/KPI/KPICards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown} from "lucide-react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import type { KPICardProps } from "@/types/Metrics";
import MetricsStore from "@/store/metrics.store";
import useAuthStore from "@/store/auth.store";
import { useEffect } from "react";
import { iconMapping } from "../IconMapping";


function KPICard({ title, value, trend, sparklineData, icon, color, onClick }: KPICardProps) {
  const colorClasses: Record<KPICardProps["color"], string> = {
    cyan: "border-[#00E5FF]/30 bg-[#00E5FF]/5 neon-glow",
    purple: "border-[#9B5CFF]/30 bg-[#9B5CFF]/5 neon-glow-purple",
    green: "border-[#14F195]/30 bg-[#14F195]/5",
    red: "border-[#FF4D6D]/30 bg-[#FF4D6D]/5",
    yellow: "border-[#FFC857]/30 bg-[#FFC857]/5",
  };

  const iconColorClasses: Record<KPICardProps["color"], string> = {
    cyan: "text-[#00E5FF]",
    purple: "text-[#9B5CFF]",
    green: "text-[#14F195]",
    red: "text-[#FF4D6D]",
    yellow: "text-[#FFC857]",
  };

  const sparklineColors: Record<KPICardProps["color"], string> = {
    cyan: "#00E5FF",
    purple: "#9B5CFF",
    green: "#14F195",
    red: "#FF4D6D",
    yellow: "#FFC857",
  };

  const sparklineOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 32,
      sparkline: { enabled: true },
      animations: { enabled: false },
      toolbar: { show: false },
      background: "transparent",
    },
    colors: [sparklineColors[color]],
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.2, stops: [0, 100] },
    },
    stroke: { curve: "smooth", width: 1.5 },
    tooltip: { enabled: false },
    xaxis: { labels: { show: false } },
    yaxis: { labels: { show: false } },
  };

  const sparklineSeries = sparklineData ? [{ data: sparklineData }] : [];

  return (
    <Card
      className={`glass-card hover-scale ${colorClasses[color]} transition-all duration-300 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{value}</span>
              {trend && (
                <div
                  className={`flex items-center gap-1 text-sm ${
                    trend.direction === "up" ? "text-[#14F195]" : "text-[#FF4D6D]"
                  }`}
                >
                  {trend.direction === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{trend.percentage}%</span>
                </div>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-xl bg-white/5 ${iconColorClasses[color]}`}>{iconMapping[icon]}</div>
        </div>

        {sparklineData && (
          <div className="mt-4">
            <ReactApexChart options={sparklineOptions} series={sparklineSeries} type="area" height={32} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function KPICards() {
  const {GetSummary, summaryList} = MetricsStore()
  const {project} = useAuthStore()

  useEffect(() => {
    GetSummary(project?.activeProjectId ?? '')
  },[project])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {summaryList?.map((kpi, idx) => (
        <KPICard key={idx} {...kpi} />
      ))}
    </div>
  );
}
