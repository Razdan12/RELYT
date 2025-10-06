import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Globe, Heart, Activity } from "lucide-react"
import type { RecentRun } from "@/types/Metrics"
import useAuthStore from "@/store/auth.store"
import MetricsStore from "@/store/metrics.store"
import { useEffect } from "react"
import { formatTimestamp } from "@/helpers/FormatTimeStamp"


function ActivityItem({ run }: { run: RecentRun}) {
  const StatusIcon = run.ok ? CheckCircle : XCircle
  const TypeIcon = run.type === "http" ? Globe : Heart

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
      <div className={`p-2 rounded-lg ${run.ok ? "bg-[#14F195]/10 text-[#14F195]" : "bg-[#FF4D6D]/10 text-[#FF4D6D]"}`}>
        <StatusIcon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-white truncate">{run.checkName}</span>
          <Badge variant="outline" className="text-xs border-white/30 text-white/70 shrink-0">
            <TypeIcon className="w-3 h-3 mr-1" />
            {run.type.toUpperCase()}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {run.code && (
            <Badge
              variant="outline"
              className={`text-xs ${
                run.ok ? "border-[#14F195]/30 text-[#14F195]" : "border-[#FF4D6D]/30 text-[#FF4D6D]"
              }`}
            >
              {run.code}
            </Badge>
          )}

          {run.latencyMs && <span className="text-muted-foreground">{run.latencyMs}ms</span>}

          {run.errorMsg && (
            <Badge variant="outline" className="text-xs border-[#FF4D6D]/30 text-[#FF4D6D]">
              {run.errorMsg}
            </Badge>
          )}

          <span className="text-muted-foreground ml-auto">{formatTimestamp(run.ts)}</span>
        </div>
      </div>
    </div>
  )
}

export function RecentActivity() {
  const {project} = useAuthStore()
  const {recentRunList, GetRecentRun} = MetricsStore()

  useEffect(( ) => {
    const payload = `limit=10`
    if(project){
      GetRecentRun(project.activeProjectId, payload)
    }
  },[project, GetRecentRun])


  return (
    <Card className="glass-card  bg-[#00E5FF]/5 border-[#00E5FF]/20 hover-scale transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#00E5FF]" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {recentRunList?.map((run) => (
            <ActivityItem key={run.id} run={run} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
