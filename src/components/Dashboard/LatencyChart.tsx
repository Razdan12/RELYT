// src/components/LatencyChart.tsx
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import useAuthStore from "@/store/auth.store";
import MetricsStore from "@/store/metrics.store";
import { getHMSUTC } from "@/helpers/GetTime";

// Izinkan y = number | null
type SeriesPoint = { x: number; y: number | null };
type Series = { name: string; data: SeriesPoint[] }[];

export function LatencyChart() {
  const { project } = useAuthStore();
  const { latencyList, GetLatency } = MetricsStore();
  const [visibleLines, setVisibleLines] = useState({
    p50: true,
    p95: true,
    p99: true,
  });

  useEffect(() => {
    const payload =
      "from=2025-10-01T00:00:00Z&to=2025-10-02T00:00:00Z&bucket=hour";
    if (project?.activeProjectId) {
      GetLatency(project.activeProjectId, payload);
    }
  }, [project, GetLatency]);

  const toggleLine = (line: keyof typeof visibleLines) => {
    setVisibleLines((prev) => ({ ...prev, [line]: !prev[line] }));
  };

  const toEpoch = (ts: string) => new Date(ts).getTime();
  const toNumOrNull = (v: unknown): number | null => {
    if (v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const baseSeries: Series = useMemo(() => {
    return [
      {
        name: "P50",
        data:
          latencyList?.map((i) => ({
            x: toEpoch(i.ts),
            y: toNumOrNull(i.p50),
          })) ?? [],
      },
      {
        name: "P95",
        data:
          latencyList?.map((i) => ({
            x: toEpoch(i.ts),
            y: toNumOrNull(i.p95),
          })) ?? [],
      },
      {
        name: "P99",
        data:
          latencyList?.map((i) => ({
            x: toEpoch(i.ts),
            y: toNumOrNull(i.p99),
          })) ?? [],
      },
    ];
  }, [latencyList]);

  const series: Series = useMemo(() => {
    const isOn = (name: string) =>
      visibleLines[name.toLowerCase() as "p50" | "p95" | "p99"];
    return baseSeries.filter((s) => isOn(s.name));
  }, [baseSeries, visibleLines]);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 320,
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 800 },
    },
    theme: { mode: "dark" },
    colors: ["#00E5FF", "#9B5CFF", "#FFC857"],
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 3, strokeWidth: 2, hover: { size: 5 } },
    grid: {
      show: true,
      borderColor: "#374151",
      strokeDashArray: 1,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: { colors: "#94A3B8", fontSize: "12px" },
        formatter: (val) => getHMSUTC(new Date(Number(val)).toISOString()),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#94A3B8", fontSize: "12px" },
        formatter: (v) => `${v}ms`,
      },
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px" },
      x: { format: "HH:mm 'UTC'" },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const ts =
          w.globals.seriesX[seriesIndex]?.[dataPointIndex] ??
          w.globals.labels[dataPointIndex];
        const time = getHMSUTC(new Date(Number(ts)).toISOString());

        let html = `
          <div class="bg-[#121A26] border border-white/20 rounded-xl p-3 shadow-lg backdrop-blur-md">
            <p class="text-white text-sm font-medium mb-2">Waktu: ${time}</p>
        `;

        series.forEach((values: any, idx: number) => {
          const name = w.globals.seriesNames[idx];
          const val = values[dataPointIndex];
          const color = (w.config.colors?.[idx] as string) ?? "#fff";
          const text = val == null ? "—" : `${val}ms`;
          html += `<p class="text-sm" style="color:${color}">${name}: ${text}</p>`;
        });

        html += "</div>";
        return html;
      },
    },
    legend: { show: false },
  };

  return (
    <Card className="glass-card border-[#9B5CFF]/20 hover-scale bg-[#9B5CFF]/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-3 h-3 bg-[#9B5CFF] rounded-full" />
            Latensy
          </CardTitle>
          <div className="flex gap-2">
            {Object.entries(visibleLines).map(([key, visible]) => (
              <Badge
                key={key}
                variant={visible ? "default" : "outline"}
                className={`cursor-pointer text-xs ${
                  visible
                    ? key === "p50"
                      ? "bg-[#00E5FF] text-black"
                      : key === "p95"
                      ? "bg-[#9B5CFF] text-white"
                      : "bg-[#FFC857] text-black"
                    : "border-white/30 text-white/70"
                }`}
                onClick={() => toggleLine(key as keyof typeof visibleLines)}
              >
                {key.toUpperCase()}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ReactApexChart options={options} series={series} type="line" height={"100%"} />
        </div>
      </CardContent>
    </Card>
  );
}
