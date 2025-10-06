import { create } from "zustand";
import { inviteMember, getMembers } from "@/midleware/Member";
import getErrorMessage from "@/midleware/HelperApi";
import { toast } from "sonner";

interface MemberState {
  members: Array<any> | null;
  isLoading: boolean;
  isInviting: boolean;
  error: string | null;
  GetMembers: (projectId: string) => Promise<void>;
  InviteMember: (projectId: string, data: { email: string; role: string }) => Promise<void>;
}

const useMemberStore = create<MemberState>((set) => ({
  members: null,
  isLoading: false,
  isInviting: false,
  error: null,
  GetMembers: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await getMembers(projectId);
      set({ members: res, isLoading: false });
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
      const req = inviteMember(projectId, data);
      toast.promise(req, {
        loading: "Inviting member...",
        success: "Invitation sent",
        error: (err) => getErrorMessage(err, "Invite failed"),
      });
      await req;
      set({ isInviting: false });
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
