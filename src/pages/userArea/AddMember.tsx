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
import { changeProjectMemberRole, removeProjectMember } from "@/middleware/Member";
import Swal from "sweetalert2";
import useAuthStore from "@/store/auth.store";

export default function AddMember() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("MEMBER");

  const InviteMember = useMemberStore((s) => s.InviteMember);
  const { project } = useAuthStore();
  const { members, isLoading, GetMembers } = useMemberStore();

  useEffect(() => {
    if (project?.activeProjectId) GetMembers(project.activeProjectId);
  }, [project?.activeProjectId]);

  function validateUserId(id: string) {
    return /^[0-9a-fA-F-]{36}$/.test(id);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateUserId(userId)) {
      toast.error("UserId tidak valid (harus UUID)");
      return;
    }
    if (!project?.activeProjectId) {
      toast.error("Tidak ada project yang dipilih");
      return;
    }

    await InviteMember(project.activeProjectId, { userId, role });
    setUserId("");
    setRole("MEMBER");
    GetMembers(project.activeProjectId);
  }

  async function handleChangeRole(userId: string) {
    if (!project?.activeProjectId) return;
    const { value: newRole } = await Swal.fire({
      title: 'Change role',
      input: 'select',
      inputOptions: { MEMBER: 'Member', ADMIN: 'Admin' },
      inputValue: 'MEMBER',
      showCancelButton: true,
    });
    if (!newRole) return;
    try {
      await changeProjectMemberRole(project.activeProjectId, { userId, role: newRole });
      toast.success('Role updated');
      if (GetMembers) GetMembers(project.activeProjectId);
    } catch (e) {
      toast.error('Failed to change role');
    }
  }

  async function handleRemove(userId: string) {
    if (!project?.activeProjectId) return;
    const result = await Swal.fire({
      title: 'Remove member?',
      text: 'This will remove the member from the project.',
      icon: 'warning',
      showCancelButton: true,
    });
    if (!result.isConfirmed) return;
    try {
      await removeProjectMember(project.activeProjectId, { userId });
      toast.success('Member removed');
      if (GetMembers) GetMembers(project.activeProjectId);
    } catch (e) {
      toast.error('Failed to remove member');
    }
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
                <TableHead className="text-white font-medium">User ID</TableHead>
                <TableHead className="text-white font-medium">Name</TableHead>
                <TableHead className="text-white font-medium">Email</TableHead>
                <TableHead className="text-white font-medium">Role</TableHead>
                <TableHead className="text-white font-medium">Joined</TableHead>
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
                <TableRow key={m.userId ?? m.email ?? m.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white">{m.userId ?? m.id ?? "-"}</TableCell>
                  <TableCell className="text-white">{m.name ?? m.fullName ?? "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{m.email ?? "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{m.role ?? m.effectiveRole ?? "MEMBER"}</TableCell>
                  <TableCell className="text-muted-foreground">{m.joinedAt ? new Date(m.joinedAt).toLocaleString() : m.createdAt ? new Date(m.createdAt).toLocaleString() : "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleChangeRole(m.userId ?? m.id)}>Change Role</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleRemove(m.userId ?? m.id)}>Remove</Button>
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
              <label className="block text-sm font-medium text-muted-foreground">User ID (UUID)</label>
              <input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="7581901a-bd9d-49a2-8220-dcf845041eef"
                className="input input-bordered w-full mt-1"
              />
            </div>

            <div className="fieldset">
              <label className="fieldset-legend">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="select select-bordered w-full mt-1">
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div className="flex justify-end mt-5">
              <button className="btn btn-primary" type="submit">
                Invite Member
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </Card>
  );
}
