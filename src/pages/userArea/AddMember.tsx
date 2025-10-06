import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import useMemberStore from "@/store/member.store";
import useAuthStore from "@/store/auth.store";

export default function AddMember() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");

  function validateEmail(e: string) {
    try {
      return /\S+@\S+\.\S+/.test(e);
    } catch {
      return false;
    }
  }

  const InviteMember = useMemberStore((s) => s.InviteMember);
  const { project } = useAuthStore();
  const { members, isLoading, GetMembers } = useMemberStore();

  useEffect(() => {
    if (project?.activeProjectId) GetMembers(project.activeProjectId);
  }, [project?.activeProjectId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Alamat email tidak valid");
      return;
    }
    if (!project?.activeProjectId) {
      toast.error("Tidak ada project yang dipilih");
      return;
    }

    await InviteMember(project.activeProjectId, { email, role });
    // if no error, assume success: clear form
    setEmail("");
    setRole("viewer");
    // refresh list
    GetMembers(project.activeProjectId);
  }

  return (
    <Card className="glass-card bg-[#00E5FF]/5 border-[#00E5FF]/20 hover-scale transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Members</CardTitle>
          <Button
            className="bg-[#00E5FF] text-black hover:bg-[#00E5FF]/90 rounded-xl cursor-pointer"
            onClick={() => openModal("invite-member")}
          >
            Invite Member
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#121A26]/50">
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white font-medium">Email</TableHead>
                <TableHead className="text-white font-medium">Role</TableHead>
                <TableHead className="text-white font-medium">Status</TableHead>
                <TableHead className="text-white font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && members && members.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No members yet.
                  </TableCell>
                </TableRow>
              )}

              {members?.map((m: any) => (
                <TableRow key={m.email} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white">{m.email}</TableCell>
                  <TableCell className="text-muted-foreground">{m.role}</TableCell>
                  <TableCell className="text-muted-foreground">{m.status ?? "active"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => toast("Not implemented")}>Action</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Modal id="invite-member">
        <div className="text-white flex flex-col items-center">
          <span>Invite Member</span>
          <form className="mt-5 space-y-1 w-full" onSubmit={handleSubmit}>
            <div className="fieldset">
              <label className="fieldset-legend">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="input input-bordered w-full mt-1"
              />
            </div>

            <div className="fieldset">
              <label className="fieldset-legend">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="select select-bordered w-full mt-1">
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-end mt-5">
              <button className="btn bg-cyan-500 rounded-2xl w-32" type="submit">
                Invite
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </Card>
  );
}
