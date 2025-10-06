
import { KPICards } from "@/components/Dashboard/KpiCard";
import { UptimeChart } from "@/components/Dashboard/UptimeChart";
import { LatencyChart } from "@/components/Dashboard/LatencyChart";
import { IncidentsChart } from "@/components/Dashboard/IncidentsChart";
import { ChecksTable } from "@/components/Dashboard/CheckTable";
import { RecentActivity } from "@/components/Dashboard/RecentActivity";
import { OpenIncidents } from "@/components/Dashboard/OpenIncidents";
import MetricsStore from "@/store/metrics.store";

export default function Dashboard() {
  const { isLoading } = MetricsStore();
  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#121A26] rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white">Memuat data...</span>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-balance">Project Dashboard</h1>
      </div>

      <KPICards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UptimeChart />
        <LatencyChart />
      </div>
      <IncidentsChart />
      <div className="space-y-8">
        <ChecksTable />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <OpenIncidents />
        </div>
      </div>
    </>
  );
}
