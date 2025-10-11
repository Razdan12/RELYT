import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/InputField";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Globe,
  Heart,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  CheckCircle,
  XCircle,
  Play,
  StopCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatTimestamp } from "@/helpers/FormatTimeStamp";
import useAuthStore from "@/store/auth.store";

import type { StatusCheck } from "@/types/Metrics";
import type { Check } from "@/types/Check";
import CheckStore from "@/store/check.store";
import Modal, { closeModal, openModal } from "@/components/ui/Modal";
import { checkSchema, type CheckFormValues } from "@/schema/check.schema";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createCheck, DeleteCheck } from "@/midleware/HttpCheck.api";
import { toast } from "sonner";
import getErrorMessage from "@/midleware/HelperApi";

function StatusBadge(status: boolean) {
  const statusConfig = {
    up: {
      icon: CheckCircle,
      label: "Running",
      className: "bg-[#14F195]/10 text-[#14F195] border-[#14F195]/30",
    },
    down: {
      icon: XCircle,
      label: "Stoped",
      className: "bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/30",
    },
  } as const;
  const running = status ? "up" : "down";
  const config = statusConfig[running];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
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

export function ChecksList() {
  const { getAllCheck, checkList } = CheckStore();
  const { project } = useAuthStore();
  // const [searchTerm, setSearchTerm] = useState("");
  const [Type, setType] = useState<string>("http");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [triger, setTriger] = useState<boolean>(false);

  const resolver = yupResolver(checkSchema) as Resolver<CheckFormValues>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CheckFormValues>({
    resolver,
    defaultValues: {
      type: "http",
    },
  });

  useEffect(() => {
    getAllCheck(project?.activeProjectId ?? "");
  }, [project, triger]);

  const items: Check[] = Array.isArray(checkList) ? (checkList as Check[]) : (checkList?.items ?? []);

  const onSubmit = async (formData: CheckFormValues) => {
    try {
      const id = project?.activeProjectId ?? "";
      await createCheck(id, formData);
      toast.success("Check has been created");
      closeModal("add-check");
      reset();
      setTriger(!triger);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = (id: string) => {
    toast("Are You Sure Delete Check?", {
      action: {
        label: "Delete",
        onClick: () => deleteCheck(id),
      },
    });
  };
  const deleteCheck = async (id: string) => {
    try {
      const idProject = project?.activeProjectId ?? "";
      await DeleteCheck(idProject, id);
      setTriger(!triger);
      toast.success("Check has been deleted");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card className="glass-card bg-[#00E5FF]/5 border-[#00E5FF]/20 hover-scale transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Checklist</CardTitle>
          <Button
            className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90 rounded-xl cursor-pointer"
            onClick={() => openModal("add-check")}
          >
            Add Check
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
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
                <TableHead className="text-white font-medium">Interval</TableHead>
                <TableHead className="text-white font-medium">Status</TableHead>
                <TableHead className="text-white font-medium">Last Run</TableHead>
                <TableHead className="text-white font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((check: Check) => (
                <TableRow key={check.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white">{check.name}</TableCell>
                  <TableCell>
                    <TypeBadge type={check.type} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{check.intervalSec}s</TableCell>
                  <TableCell>{StatusBadge(check.enabled)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        {check?.runs[0]?.code && (
                          <Badge variant="outline" className="text-xs border-[#14F195]/30 text-[#14F195]">
                            {check?.runs[0]?.code}
                          </Badge>
                        )}
                        {check?.runs[0]?.latencyMs && (
                          <span className="text-muted-foreground">{check?.runs[0]?.latencyMs}ms</span>
                        )}
                        {check?.runs[0]?.errorMsg && (
                          <Badge variant="outline" className="text-xs border-[#FF4D6D]/30 text-[#FF4D6D]">
                            {check?.runs[0]?.errorMsg}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{formatTimestamp(check?.runs[0]?.ts)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#121A26] border-white/20">
                          <DropdownMenuItem className="text-white hover:bg-white/10">
                            {check.enabled ? (
                              <>
                                <StopCircle className="w-4 h-4 mr-2" /> Stop
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" /> Run
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-white/10">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[#FF4D6D] hover:bg-[#FF4D6D]/10" onClick={() => handleDelete(check.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Hapus
                          </DropdownMenuItem>
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

      <Modal id="add-check">
        <div className="text-white flex flex-col items-center">
          <span>Check</span>
          <form className="mt-5 space-y-1 w-full" onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Type</legend>
              <select defaultValue="Pick a text editor" className="select border-white border w-full" {...register("type")} onChange={(e) => setType(e.target.value)}>
                <option disabled={true}>Pick a type</option>
                <option value={"http"}>HTTP</option>
                <option value={"heartbeat"}>Heartbeat</option>
              </select>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Name</legend>
              <Input id="name" type="text" {...register("name")} error={errors.name?.message} placeholder="Enter name" required />
            </fieldset>
            {Type === "http" && (
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Target</legend>
                <Input id="target" type="text" {...register("target")} error={errors.target?.message} placeholder="Enter password" required />
              </fieldset>
            )}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Interval</legend>
              <Input id="interval" type="number" {...register("intervalSec")} error={errors.intervalSec?.message} placeholder="Enter password" required />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Timeout</legend>
              <Input id="timeout" type="number" {...register("timeoutMs")} error={errors.timeoutMs?.message} placeholder="Enter password" required />
            </fieldset>
            {Type === "http" && (
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Success Codes</legend>
                <Input id="succes-code" type="text" {...register("successCodes")} error={errors.successCodes?.message} placeholder="Enter password" required />
              </fieldset>
            )}

            <div className="flex justify-end mt-5">
              <button className="btn bg-cyan-500 rounded-2xl w-32 " type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </Card>
  );
}

export default ChecksList;
