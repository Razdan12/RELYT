// src/components/UptimeChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import MetricsStore from "@/store/metrics.store";
import useAuthStore from "@/store/auth.store";
import { useEffect, useMemo } from "react";
import { getHMSUTC } from "@/helpers/GetTime";

// Definisikan tipe seri axis chart sendiri
type Series = { name: string; data: { x: number; y: number }[] }[];

export function UptimeChart() {
  const { GetUptime, uptimeList } = MetricsStore();
  const { project } = useAuthStore();

  useEffect(() => {
    const payload =
      "from=2025-10-01T00:00:00Z&to=2025-10-02T00:00:00Z&bucket=hour";
    if (project?.activeProjectId) {
      GetUptime(project.activeProjectId, payload);
    }
  }, [project, GetUptime]);

  const series: Series = useMemo(() => {
    const data =
      uptimeList?.map((item) => ({
        x: new Date(item.ts).getTime(), // epoch ms untuk xaxis datetime
        y: Number(item.uptime),
      })) ?? [];
    return [{ name: "Uptime", data }];
  }, [uptimeList]);

  const minY = useMemo(() => {
    if (!uptimeList?.length) return 0;
    const m = Math.min(...uptimeList.map((i) => Number(i.uptime)));
    return Math.max(0, Math.min(100, Math.floor((m - 0.5) * 100) / 100));
  }, [uptimeList]);

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 320,
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 800 },
    },
    theme: { mode: "dark" },
    colors: ["#00E5FF"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.05,
        stops: [0, 100],
        colorStops: [
          { offset: 0, color: "#00E5FF", opacity: 0.3 },
          { offset: 100, color: "#00E5FF", opacity: 0.05 },
        ],
      },
    },
    stroke: { curve: "smooth", width: 2, colors: ["#00E5FF"] },
    markers: {
      size: 4,
      colors: ["#00E5FF"],
      strokeColors: "#00E5FF",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      show: true,
      borderColor: "#374151",
      strokeDashArray: 1,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      type: "datetime",                // penting saat pakai {x, y}
      labels: {
        style: { colors: "#94A3B8", fontSize: "12px" },
        formatter: (val) =>
          getHMSUTC(new Date(Number(val)).toISOString()),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      // HAPUS categories karena kita pakai {x, y}
    },
    yaxis: {
      min: minY,                       // atau kunci ke 99.5 jika mau fokus SLA
      max: 100,
      labels: {
        style: { colors: "#94A3B8", fontSize: "12px" },
        formatter: (v) => `${v}%`,
      },
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px" },
      x: { format: "HH:mm 'UTC'" },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const value = series[seriesIndex][dataPointIndex];
        const ts = w.globals.seriesX[seriesIndex][dataPointIndex];
        const time = getHMSUTC(new Date(ts).toISOString());
        return `
          <div class="bg-[#121A26] border border-white/20 rounded-xl p-3 shadow-lg backdrop-blur-md">
            <p class="text-white text-sm font-medium">Waktu: ${time}</p>
            <p class="text-[#00E5FF] text-sm">Uptime: ${value}%</p>
          </div>
        `;
      },
    },
    annotations: {
      yaxis: [
        {
          y: 99.9,
          borderColor: "#fbff00",
          strokeDashArray: 5,
          label: {
            text: "SLA Target 99.9%",
            position: "right",
            style: { color: "#fbff00", background: "transparent" },
          },
        },
      ],
    },
    legend: { show: false },
    dataLabels: { enabled: false },
  };

  return (
    <Card className="glass-card border-[#00E5FF]/20 hover-scale bg-[#00E5FF]/5 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <div className="w-3 h-3 bg-[#00E5FF] rounded-full" />
          Uptime (UTC)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={320}
          />
        </div>
      </CardContent>
    </Card>
  );
}
