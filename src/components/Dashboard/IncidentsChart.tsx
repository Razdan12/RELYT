// src/components/LandingPage/IncidentsChart.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import useAuthStore from "@/store/auth.store";
import MetricsStore from "@/store/metrics.store";
import { useEffect, useMemo } from "react";

type BarPoint = { x: string | number; y: number; fillColor?: string };

export function IncidentsChart() {
  const { project } = useAuthStore();
  const { incidentDayList, GetIncidentDay } = MetricsStore();

  useEffect(() => {
    const payload = "range=7d";
    if (project?.activeProjectId) {
      GetIncidentDay(project.activeProjectId, payload);
    }
  }, [project, GetIncidentDay]);

  const threshold = 2;

  const data: BarPoint[] = useMemo(() => {
    return (
      incidentDayList?.map((item) => ({
        x: item.date, // gunakan tanggal sebagai kategori
        y: Number(item.count) || 0,
        fillColor: (Number(item.count) || 0) > threshold ? "#FF4D6D" : "#FFC857",
      })) ?? []
    );
  }, [incidentDayList]);

  const maxY = useMemo(() => {
    const vals = incidentDayList?.map((d) => Number(d.count) || 0) ?? [0];
    const m = Math.max(...vals);
    return m + 1; // beri headroom
  }, [incidentDayList]);

  const series = [
    {
      name: "Insiden",
      data, // gunakan point object + fillColor per point
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 256,
      background: "transparent",
      toolbar: { show: false },
      animations: { enabled: true, speed: 800 },
    },
    theme: { mode: "dark" },
    colors: ["#FFC857"], // base, akan ditimpa oleh fillColor point
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
        distributed: true, // aktifkan distributed agar warna per point konsisten
      },
    },
    // tidak perlu fill.colors karena kita sudah set fillColor per-point
    grid: {
      show: true,
      borderColor: "#374151",
      strokeDashArray: 1,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      type: "category",
      // categories otomatis diambil dari point.x; boleh dikosongkan
      labels: { style: { colors: "#94A3B8", fontSize: "12px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      max: maxY,
      labels: { style: { colors: "#94A3B8", fontSize: "12px" } },
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px" },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const count = series[seriesIndex][dataPointIndex];
        const date =
          (w.globals.labels && w.globals.labels[dataPointIndex]) ??
          data[dataPointIndex]?.x ??
          "-";
        const color =
          (w.globals?.colors && w.globals.colors[dataPointIndex]) || "#FFC857";
        return `
          <div class="bg-[#121A26] border border-white/20 rounded-xl p-3 shadow-lg backdrop-blur-md">
            <p class="text-white text-sm font-medium">Tanggal: ${date}</p>
            <p class="text-sm" style="color:${color}">Insiden: ${count} ${count === 1 ? "kejadian" : "kejadian"}</p>
          </div>
        `;
      },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
  };

  return (
    <Card className="glass-card border-[#FF4D6D]/20 hover-scale bg-[#FF4D6D]/5 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-[#FF4D6D]" />
          Incidents per Day (Last 7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ReactApexChart options={options} series={series} type="bar" height={256} />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FFC857] rounded" />
            <span className="text-muted-foreground">Normal (≤{threshold})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FF4D6D] rounded" />
            <span className="text-muted-foreground">Hight (&gt;{threshold})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
