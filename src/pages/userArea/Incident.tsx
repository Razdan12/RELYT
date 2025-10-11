import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CheckCircle, Clock, MoreHorizontal, XCircle } from "lucide-react";
import useIncidentStore from "@/store/incident.store";
import useAuthStore from "@/store/auth.store";
import { useEffect, useMemo, useState } from "react";
import type { IncidentItem } from "@/types/Incident";
import { formatTimestamp } from "@/helpers/FormatTimeStamp";

function SeverityBadge({ severity }: { severity?: string }) {
  const map: Record<string, string> = {
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-400/30",
    medium: "bg-amber-500/10 text-amber-400 border-amber-400/30",
    high: "bg-rose-500/10 text-rose-400 border-rose-400/30",
  };
  const cls = severity ? map[severity] ?? map.low : "border-white/30 text-white/70";
  return (
    <Badge variant="outline" className={cls}>
      {severity ?? "-"}
    </Badge>
  );
}

export default function IncidentPage() {
  const { project } = useAuthStore();
  const { list, isLoading, GetIncidents, CloseIncident } = useIncidentStore();
  const [statusTab, setStatusTab] = useState<"open" | "closed">("open");

  useEffect(() => {
    if (project?.activeProjectId) GetIncidents(project.activeProjectId, statusTab);
  }, [project?.activeProjectId, statusTab]);

  const items: IncidentItem[] = useMemo(() => list ?? [], [list]);

  return (
    <Card className="glass-card bg-[#00E5FF]/5 border-[#00E5FF]/20 hover-scale transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Incidents</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={statusTab === "open" ? "default" : "outline"}
              className="rounded-xl"
              onClick={() => setStatusTab("open")}
            >
              Open
            </Button>
            <Button
              variant={statusTab === "closed" ? "default" : "outline"}
              className="rounded-xl"
              onClick={() => setStatusTab("closed")}
            >
              Closed
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#121A26]/50">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white font-medium">Check</TableHead>
                <TableHead className="text-white font-medium">Severity</TableHead>
                <TableHead className="text-white font-medium">Started</TableHead>
                <TableHead className="text-white font-medium">Duration</TableHead>
                <TableHead className="text-white font-medium">Last Error</TableHead>
                <TableHead className="text-white font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">Loading...</TableCell>
                </TableRow>
              )}
              {!isLoading && items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground">No incidents</TableCell>
                </TableRow>
              )}
              {items.map((inc) => (
                <TableRow key={inc.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white">{inc.checkName ?? inc.id}</TableCell>
                  <TableCell><SeverityBadge severity={inc.severity} /></TableCell>
                  <TableCell className="text-muted-foreground">{inc.startedAt ? formatTimestamp(inc.startedAt) : "-"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {typeof inc.durationSec === "number" ? `${inc.durationSec}s` : "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{inc.lastError ?? "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#121A26] border-white/20">
                          {statusTab === "open" ? (
                            <DropdownMenuItem className="text-white hover:bg-white/10" onClick={() => project?.activeProjectId && CloseIncident(project.activeProjectId, inc.id)}>
                              <CheckCircle className="w-4 h-4 mr-2" /> Close
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-white hover:bg-white/10">
                              <XCircle className="w-4 h-4 mr-2" /> Closed
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
