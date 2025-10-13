import { create } from "zustand";
import { addProjectMember, getProjectDetail } from "@/middleware/Member";
import getErrorMessage from "@/middleware/HelperApi";
import { toast } from "sonner";

interface MemberState {
  members: Array<any> | null;
  isLoading: boolean;
  isInviting: boolean;
  error: string | null;
  GetMembers: (projectId: string) => Promise<void>;
  InviteMember: (projectId: string, data: { userId: string; role: string }) => Promise<void>;
}

const useMemberStore = create<MemberState>((set) => ({
  members: null,
  isLoading: false,
  isInviting: false,
  error: null,
  GetMembers: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
  const res = await getProjectDetail(projectId);
  // ProjectDetail may contain members directly; accept fallback shapes defensively
  const anyRes: any = res;
  const members = anyRes?.members ?? anyRes?.data?.members ?? anyRes?.project?.members ?? anyRes?.items ?? anyRes ?? [];
  const items = Array.isArray(members) ? members : members?.items ?? members?.data ?? [];
  set({ members: items, isLoading: false });
    } catch (err) {
      const msg = getErrorMessage(err);
      // eslint-disable-next-line no-console
      console.error("GetMembers error:", err);
      set({ error: msg, isLoading: false });
      try {
        // @ts-ignore
        const status = err?.response?.status;
        if (status) toast.error(`Get members failed: ${status} ${msg}`);
      } catch {}
    }
  },
  InviteMember: async (projectId, data) => {
    set({ isInviting: true, error: null });
    try {
      const req = addProjectMember(projectId, data);
      toast.promise(req, {
        loading: "Inviting member...",
        success: "Invitation sent",
        error: (err) => getErrorMessage(err, "Invite failed"),
      });
      await req;
      set({ isInviting: false });
      // refresh members list if possible
      try {
        // call GetMembers safely
        const getState = useMemberStore.getState();
        if (getState.GetMembers) await getState.GetMembers(projectId);
      } catch (e) {
        // ignore refresh errors, but log for debugging
        // eslint-disable-next-line no-console
        console.error('Failed to refresh members list after invite:', e);
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      // eslint-disable-next-line no-console
      console.error("InviteMember error:", err);
      set({ error: msg, isInviting: false });
      try {
        // @ts-ignore
        const status = err?.response?.status;
        if (status) toast.error(`Invite failed: ${status} ${msg}`);
      } catch {}
    }
  },
}));

export default useMemberStore;
