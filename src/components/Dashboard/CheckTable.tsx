import { Card, CardContent, CardHeader} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Globe,
  Heart,

  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatTimestamp } from "@/helpers/FormatTimeStamp";
import useAuthStore from "@/store/auth.store";
import MetricsStore from "@/store/metrics.store";
import type { StatusCheck } from "@/types/Metrics";


function StatusBadge({ status }: { status: StatusCheck["status"] | string }) {
  const statusConfig = {
    up: {
      icon: CheckCircle,
      label: "Up",
      className: "bg-[#14F195]/10 text-[#14F195] border-[#14F195]/30",
    },
    down: {
      icon: XCircle,
      label: "Down",
      className: "bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/30",
    },
    degraded: {
      icon: AlertCircle,
      label: "Degraded",
      className: "bg-[#FFC857]/10 text-[#FFC857] border-[#FFC857]/30",
    },
    unknown: {
      icon: HelpCircle,
      label: "Unknown",
      className: "bg-white/10 text-white/70 border-white/30",
    },
  } as const;

  const cfg = (statusConfig as any)[status] ?? statusConfig.unknown;
  const Icon = cfg.icon;

  return (
    <Badge variant="outline" className={cfg.className}>
      <Icon className="w-3 h-3 mr-1" />
      {cfg.label}
    </Badge>
  );
}

function TypeBadge({ type }: { type: StatusCheck["type"] }) {
  return (
    <Badge variant="outline" className="border-white/30 text-white/70">
      {type === "http" ? (
        <>
          <Globe className="w-3 h-3 mr-1" />
          HTTP
        </>
      ) : (
        <>
          <Heart className="w-3 h-3 mr-1" />
          Heartbeat
        </>
      )}
    </Badge>
  );
}

export function ChecksTable() {
  const {checkList, GetStatusCheck} = MetricsStore()
  const { project } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    GetStatusCheck(project?.activeProjectId ?? "");
  }, [project]);

  return (
    <Card className="glass-card bg-[#00E5FF]/5 border-[#00E5FF]/20 hover-scale transition-all duration-300">
      <CardHeader>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Cari nama check..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#121A26] border-white/20 text-white"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 bg-[#121A26] border-white/20 text-white">
              <SelectValue placeholder="Tipe" />
            </SelectTrigger>
            <SelectContent className="bg-[#121A26] border-white/20">
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="http">HTTP</SelectItem>
              <SelectItem value="heartbeat">Heartbeat</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-[#121A26] border-white/20 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#121A26] border-white/20">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="up">Up</SelectItem>
              <SelectItem value="down">Down</SelectItem>
              <SelectItem value="degraded">Degraded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#121A26]/50">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white font-medium">Name</TableHead>
                <TableHead className="text-white font-medium">Type</TableHead>
                <TableHead className="text-white font-medium">
                  Interval
                </TableHead>
                <TableHead className="text-white font-medium">Status</TableHead>
                <TableHead className="text-white font-medium">
                  Last Run
                </TableHead>
               
              </TableRow>
            </TableHeader>
            <TableBody>
              {checkList?.map((check) => (
                <TableRow
                  key={check.id}
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="font-medium text-white">
                    {check.name}
                  </TableCell>
                  <TableCell>
                    <TypeBadge type={check.type} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {check.intervalSec}s
                  </TableCell>
                  <TableCell><StatusBadge status={check.status} /></TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        {check?.lastRun?.code && (
                          <Badge
                            variant="outline"
                            className="text-xs border-[#14F195]/30 text-[#14F195]"
                          >
                            {check?.lastRun?.code}
                          </Badge>
                        )}
                        {check?.lastRun?.latencyMs && (
                          <span className="text-muted-foreground">
                            {check?.lastRun?.latencyMs}ms
                          </span>
                        )}
                        {check?.lastRun?.errorMsg && (
                          <Badge
                            variant="outline"
                            className="text-xs border-[#FF4D6D]/30 text-[#FF4D6D]"
                          >
                            {check?.lastRun?.errorMsg}
                          </Badge>
                        )}
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(check?.lastRun?.ts)}
                      </div>
                      </div>
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
