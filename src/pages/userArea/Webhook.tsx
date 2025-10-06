import { useEffect, useState } from "react";
import useWebhookStore from "@/store/webhook.store";
import { toast } from "sonner";
import Swal from "sweetalert2";
import useAuthStore from "@/store/auth.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal, { openModal } from "@/components/ui/Modal";

export default function Webhook() {
  const { project } = useAuthStore();
  const { list, isLoading, GetWebhooks, CreateWebhook, ToggleWebhook, DeleteWebhook } = useWebhookStore();

  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    if (project?.activeProjectId) {
      GetWebhooks(project.activeProjectId);
    }
  }, [project, GetWebhooks]);

  async function addWebhook(e: React.FormEvent) {
    e.preventDefault();
    if (!newUrl) return;
    if (!project?.activeProjectId) {
      toast.error("No project selected");
      return;
    }
    // Validate URL
    try {
      const normalized = newUrl.match(/^https?:\/\//) ? newUrl : `https://${newUrl}`;
      new URL(normalized);
      setNewUrl("");
      await CreateWebhook(project.activeProjectId, { url: normalized });
      await GetWebhooks(project.activeProjectId);
    } catch (err) {
      toast.error("Invalid URL");
      return;
    }
  }

  async function toggleHook(id: string) {
    if (!project?.activeProjectId) return;
    await ToggleWebhook(project.activeProjectId, id);
  }

  async function removeHook(id: string) {
    if (!project?.activeProjectId) return;
    const result = await Swal.fire({
      title: "Delete webhook?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      await DeleteWebhook(project.activeProjectId, id);
    }
  }

  return (
    <Card className="glass-card bg-[#00E5FF]/5 border-[#00E5FF]/20 hover-scale transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Webhook</CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Project: {project?.activeProjectId ?? "-"}</div>
            <Button className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90 rounded-xl" onClick={() => openModal("add-webhook")}>Add</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#121A26]/50">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white font-medium">URL</TableHead>
                <TableHead className="text-white font-medium">ID</TableHead>
                <TableHead className="text-white font-medium">Status</TableHead>
                <TableHead className="text-white font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">Loading...</TableCell>
                </TableRow>
              )}

              {!isLoading && list && list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">No webhooks configured.</TableCell>
                </TableRow>
              )}

              {list?.map((w: any) => (
                <TableRow key={w.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="break-words max-w-xs text-white">{w.url}</TableCell>
                  <TableCell className="text-muted-foreground">{w.id}</TableCell>
                  <TableCell className="text-muted-foreground">{w.enabled ? "Enabled" : "Disabled"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant={w.enabled ? "ghost" : "outline"} onClick={() => toggleHook(w.id)}>{w.enabled ? "Disable" : "Enable"}</Button>
                      <Button size="sm" variant="destructive" onClick={() => removeHook(w.id)}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Modal id="add-webhook">
        <div className="text-white flex flex-col items-center">
          <span>Add Webhook</span>
          <form className="mt-5 space-y-1 w-full" onSubmit={addWebhook}>
            <div className="fieldset">
              <label className="fieldset-legend">URL</label>
              <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://your-webhook.url/path" className="input input-bordered w-full mt-1" />
            </div>
            <div className="flex justify-end mt-5">
              <button className="btn bg-cyan-500 rounded-2xl w-32" type="submit">Add</button>
            </div>
          </form>
        </div>
      </Modal>
    </Card>
  );
}
