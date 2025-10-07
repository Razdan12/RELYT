import useAuthStore from "@/store/auth.store";
import { useState, useEffect } from "react";
import { getProjectDetail } from "@/midleware/Member";
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
  const [, setLoadingDetail] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!project?.activeProjectId) return setProjectDetail(null);
      setLoadingDetail(true);
      try {
        const res = await getProjectDetail(project.activeProjectId);
        if (mounted) setProjectDetail(res);
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
  const [newProject, setNewProject] = useState("");

  function handleChangeProject(e: React.FormEvent) {
    e.preventDefault();
    if (!newProject) return toast.error("Project id required");
    setProject({ activeProjectId: newProject, effectiveRole: project?.effectiveRole ?? "admin" });
    toast.success("Active project updated");
    setNewProject("");
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

            <form onSubmit={handleChangeProject} className="flex gap-2 p-4">
              <input value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="Enter project id" className="input input-bordered flex-1" />
              <button className="btn bg-cyan-500 rounded-2xl px-4" type="submit">Change</button>
            </form>
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
