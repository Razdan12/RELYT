import useAuthStore from "@/store/auth.store";
import { useState, useEffect } from "react";
import { getProjectDetail } from "@/midleware/Member";
import { createProject, updateProject } from "@/midleware/Project";
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
        </div>
      </CardContent>
    </Card>
  );
}
