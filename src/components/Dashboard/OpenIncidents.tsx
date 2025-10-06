import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, X } from "lucide-react";
import useAuthStore from "@/store/auth.store";
import MetricsStore from "@/store/metrics.store";
import type { Incident } from "@/types/Metrics";
import { useEffect } from "react";
import { formatStartTime } from "@/helpers/GetTime";

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}


function SeverityBadge({ severity }: { severity: Incident["severity"] }) {
  const severityConfig = {
    low: {
      label: "Rendah",
      className: "bg-[#FFC857]/10 text-[#FFC857] border-[#FFC857]/30",
    },
    medium: {
      label: "Sedang",
      className: "bg-[#FF8C00]/10 text-[#FF8C00] border-[#FF8C00]/30",
    },
    high: {
      label: "Tinggi",
      className: "bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/30",
    },
  };

  const config = severityConfig[severity];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}

function IncidentItem({ incident }: { incident: Incident }) {
  return (
    <div className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#FF4D6D]" />
          <span className="font-medium text-white">{incident.checkName}</span>
          <SeverityBadge severity={incident.severity} />
        </div>

        <button
          className="btn btn-ghost text-[#14F195] hover:bg-transparent rounded-2xl"
        >
          <X className="w-4 h-4 mr-1" />
          Close
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Started: {formatStartTime(incident.startedAt)}</span>
          <span>•</span>
          <span>Duration: {formatDuration(incident.durationSec)}</span>
        </div>

        <div className="text-muted-foreground">
          <span className="text-white/90">Last Error:</span>{" "}
          {incident.lastError}
        </div>
      </div>
    </div>
  );
}

export function OpenIncidents() {
  const { project } = useAuthStore();
  const { incidentList, GetIncident } = MetricsStore();

  useEffect(() => {
    if (project) {
      GetIncident(project.activeProjectId);
    }
  }, [project, GetIncident]);

  const lenght = incidentList ? incidentList.length : 0
  return (
    <Card className="glass-card bg-[#FF4D6D]/5 border-[#FF4D6D]/20 hover-scale transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FF4D6D]" />
            Active Incident
            {lenght > 0 && (
              <Badge
                variant="outline"
                className="border-[#FF4D6D]/30 text-[#FF4D6D] ml-2"
              >
                {lenght}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {lenght > 0 ? (
          <div className=" space-y-1 max-h-96 overflow-y-auto">
            {incidentList?.map((incident) => (
              <IncidentItem key={incident.id} incident={incident} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-[#14F195]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 text-[#14F195]" />
            </div>
            <div className="text-white font-medium mb-1">
              Tidak ada insiden aktif
            </div>
            <div className="text-muted-foreground text-sm">
              Semua sistem berjalan normal
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
