import useAuthStore from "@/store/auth.store";
import { useState, useEffect } from "react";
import { getProjectDetail } from "@/midleware/Member";
import { createProject, updateProject } from "@/midleware/Project";
import { getNotifySettings, saveEscalation, saveQuietHours } from "@/midleware/Notify";
import type { EscalationPolicy, NotifySettings } from "@/types/Notify";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Settings() {
  const { user, project, setProject } = useAuthStore();
  // project object from auth store only contains activeProjectId/effectiveRole.
  // Fetch full project detail separately to show settings fields (name, slug, owner, timezone, createdAt).
  const [projectDetail, setProjectDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!project?.activeProjectId) return setProjectDetail(null);
      setLoadingDetail(true);
      try {
        const res = await getProjectDetail(project.activeProjectId);
        if (mounted) {
          setProjectDetail(res);
          setUpdateName(res?.name ?? "");
        }
        // also try to prefetch notify settings (ignore errors)
        try {
          const n = await getNotifySettings(project.activeProjectId);
          if (mounted && n) {
            setNotify(n);
            if (n.notification) {
              setQhTimezone(n.notification.timezone ?? "Asia/Jakarta");
              setQhFrom(n.notification.quietFrom ?? "22:00");
              setQhTo(n.notification.quietTo ?? "07:00");
            }
            if (n.escalation && Array.isArray(n.escalation.steps)) {
              setPolicyName(n.escalation.name ?? "Default");
              setPolicyEnabled(!!n.escalation.enabled);
              setSteps(
                n.escalation.steps.map((s) => ({
                  afterMin: s.afterMin,
                  email: s.channels?.includes("email") ?? false,
                  slack: s.channels?.includes("slack") ?? false,
                  telegram: s.channels?.includes("telegram") ?? false,
                }))
              );
            }
          }
        } catch {}
      } catch (e) {
        if (mounted) setProjectDetail(null);
      } finally {
        if (mounted) setLoadingDetail(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [project?.activeProjectId]);
  
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [updateName, setUpdateName] = useState("");

  // Notify settings state (Quiet Hours + Escalation)
  const [, setNotify] = useState<NotifySettings | null>(null);
  const [qhTimezone, setQhTimezone] = useState("Asia/Jakarta");
  const [qhFrom, setQhFrom] = useState("22:00");
  const [qhTo, setQhTo] = useState("07:00");
  const [steps, setSteps] = useState<Array<{ afterMin: number; email: boolean; slack: boolean; telegram: boolean }>>([
    { afterMin: 0, email: true, slack: false, telegram: false },
    { afterMin: 10, email: false, slack: true, telegram: false },
    { afterMin: 30, email: false, slack: false, telegram: true },
  ]);
  const [policyName, setPolicyName] = useState("Default");
  const [policyEnabled, setPolicyEnabled] = useState(true);
  const [savingNotify, setSavingNotify] = useState(false);

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!editName) return toast.error("Project name required");
    try {
      const res = await createProject({ name: editName });
      toast.success("Project created");
      setEditName("");
      // optionally set active project
      // defensive id extraction: handle data.id, projectId, id, project.id
  // middleware now returns ProjectDetail but older backends might nest the id.
  // Use defensive any casts to accept both shapes.
  const anyRes: any = res;
  const newId = anyRes?.id ?? anyRes?.projectId ?? anyRes?.data?.id ?? anyRes?.project?.id;
      if (newId) setProject({ activeProjectId: newId, effectiveRole: "ADMIN" });
    } catch (e) {
      toast.error("Failed to create project");
    }
  }

  function updateStep(idx: number, patch: Partial<{ afterMin: number; email: boolean; slack: boolean; telegram: boolean }>) {
    setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }
  function addStep() {
    setSteps((prev) => [...prev, { afterMin: 60, email: false, slack: false, telegram: false }]);
  }
  function removeStep(idx: number) {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSaveQuietHours() {
    if (!project?.activeProjectId) return toast.error("No active project");
    try {
      setSavingNotify(true);
      await saveQuietHours(project.activeProjectId, {
        timezone: qhTimezone,
        quietFrom: qhFrom,
        quietTo: qhTo,
      });
      toast.success("Quiet Hours saved");
    } catch {
      toast.error("Failed to save Quiet Hours");
    } finally {
      setSavingNotify(false);
    }
  }

  async function handleSaveEscalation() {
    if (!project?.activeProjectId) return toast.error("No active project");
    try {
      setSavingNotify(true);
      const policy: EscalationPolicy = {
        name: policyName,
        enabled: policyEnabled,
        steps: steps.map((s) => ({
          afterMin: Number(s.afterMin) || 0,
          channels: [
            ...(s.email ? ["email" as const] : []),
            ...(s.slack ? ["slack" as const] : []),
            ...(s.telegram ? ["telegram" as const] : []),
          ],
        })),
      };
      await saveEscalation(project.activeProjectId, policy);
      toast.success("Escalation policy saved");
    } catch {
      toast.error("Failed to save escalation policy");
    } finally {
      setSavingNotify(false);
    }
  }

  async function handleSaveSettings() {
    if (!project?.activeProjectId) return toast.error("No active project");
    try {
      setIsSaving(true);
      const nameToSave = updateName?.length ? updateName : projectDetail?.name;
      await updateProject(project.activeProjectId, { name: nameToSave });
      toast.success("Project settings updated");
    } catch (e) {
      toast.error("Failed to update project");
    } finally {
      setIsSaving(false);
    }
  }

  

  return (
    <Card className="glass-card bg-[#00E5FF]/5 border-[#00E5FF]/20 hover-scale transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Settings</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4">
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-[#121A26]/50">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white font-medium">Key</TableHead>
                  <TableHead className="text-white font-medium">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white">Project ID</TableCell>
                  <TableCell className="text-muted-foreground">{project?.activeProjectId ?? "-"}</TableCell>
                </TableRow>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white">Project Name</TableCell>
                  <TableCell className="text-muted-foreground">{projectDetail?.name ?? "-"}</TableCell>
                </TableRow>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white">Slug</TableCell>
                  <TableCell className="text-muted-foreground">{projectDetail?.slug ?? "-"}</TableCell>
                </TableRow>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white">Owner</TableCell>
                  <TableCell className="text-muted-foreground">{projectDetail?.owner?.email ?? projectDetail?.ownerEmail ?? "-"}</TableCell>
                </TableRow>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white">Timezone</TableCell>
                  <TableCell className="text-muted-foreground">{projectDetail?.timezone ?? "-"}</TableCell>
                </TableRow>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white">Created</TableCell>
                  <TableCell className="text-muted-foreground">{projectDetail?.createdAt ? new Date(projectDetail.createdAt).toLocaleString() : "-"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Removed Enter Project ID form as requested */}
            <form onSubmit={handleCreateProject} className="flex gap-2 p-4">
              <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="New project name" className="input input-bordered flex-1" />
              <button className="btn bg-green-500 rounded-2xl px-4" type="submit">Create Project</button>
            </form>
            <div className="p-4">
              <label className="text-sm text-white mb-2 block">Edit Project Name</label>
              <input
                value={updateName}
                onChange={(e) => setUpdateName(e.target.value)}
                placeholder="Project name"
                className="input input-bordered w-full"
                disabled={loadingDetail}
              />
            </div>
            <div className="p-4 flex justify-end">
              <button
                className="btn bg-cyan-500 rounded-2xl px-4"
                onClick={handleSaveSettings}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 overflow-hidden">
            <Table>
              <TableHeader className="bg-[#121A26]/50">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white font-medium">Key</TableHead>
                  <TableHead className="text-white font-medium">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white">Email/Name</TableCell>
                  <TableCell className="text-muted-foreground">{user ? user.email || user.name : "No user"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Quiet Hours */}
          <div className="rounded-xl border border-white/10 overflow-hidden p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Quiet Hours</h3>
              <button className="btn bg-cyan-500 rounded-2xl px-4" onClick={handleSaveQuietHours} disabled={savingNotify}>
                {savingNotify ? "Saving..." : "Save"}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-white mb-2 block">Timezone</label>
                <input value={qhTimezone} onChange={(e) => setQhTimezone(e.target.value)} className="input input-bordered w-full" placeholder="Asia/Jakarta" />
              </div>
              <div>
                <label className="text-sm text-white mb-2 block">Quiet From</label>
                <input value={qhFrom} onChange={(e) => setQhFrom(e.target.value)} className="input input-bordered w-full" placeholder="22:00" />
              </div>
              <div>
                <label className="text-sm text-white mb-2 block">Quiet To</label>
                <input value={qhTo} onChange={(e) => setQhTo(e.target.value)} className="input input-bordered w-full" placeholder="07:00" />
              </div>
            </div>
          </div>

          {/* Escalation Policy */}
          <div className="rounded-xl border border-white/10 overflow-hidden p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Escalation Policy</h3>
              <div className="flex items-center gap-2">
                <label className="text-sm text-white">Enabled</label>
                <input type="checkbox" checked={policyEnabled} onChange={(e) => setPolicyEnabled(e.target.checked)} />
                <button className="btn bg-cyan-500 rounded-2xl px-4 ml-2" onClick={handleSaveEscalation} disabled={savingNotify}>
                  {savingNotify ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-white mb-2 block">Policy Name</label>
              <input value={policyName} onChange={(e) => setPolicyName(e.target.value)} className="input input-bordered w-full md:w-1/2" />
            </div>
            <div className="space-y-3">
              {steps.map((s, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="text-sm text-white mb-2 block">After (min)</label>
                    <input type="number" value={s.afterMin} onChange={(e) => updateStep(idx, { afterMin: Number(e.target.value) })} className="input input-bordered w-full" />
                  </div>
                  <label className="flex items-center gap-2 text-white">
                    <input type="checkbox" checked={s.email} onChange={(e) => updateStep(idx, { email: e.target.checked })} />
                    Email
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input type="checkbox" checked={s.slack} onChange={(e) => updateStep(idx, { slack: e.target.checked })} />
                    Slack
                  </label>
                  <label className="flex items-center gap-2 text-white">
                    <input type="checkbox" checked={s.telegram} onChange={(e) => updateStep(idx, { telegram: e.target.checked })} />
                    Telegram
                  </label>
                  <div className="flex gap-2">
                    <button className="btn bg-red-500 rounded-2xl" onClick={() => removeStep(idx)}>Remove</button>
                  </div>
                </div>
              ))}
              <button className="btn bg-emerald-500 rounded-2xl" onClick={addStep}>Add Step</button>
            </div>
            <p className="text-xs text-muted-foreground">Centang channel untuk mengaktifkan notifikasi via Email/Slack/Telegram pada setiap langkah. Simpan untuk mengirim konfigurasi ke API.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
