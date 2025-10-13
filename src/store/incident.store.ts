import { create } from "zustand";
import getErrorMessage from "@/middleware/HelperApi";
import { getAllIncident, closeIncident } from "@/middleware/Incident";
import type { IncidentItem } from "@/types/Incident";
import { toast } from "sonner";

interface IncidentState {
  list: IncidentItem[];
  isLoading: boolean;
  error: string | null;
  GetIncidents: (projectId: string, status: "open" | "closed") => Promise<void>;
  CloseIncident: (projectId: string, id: string, summary?: string) => Promise<void>;
}

const useIncidentStore = create<IncidentState>((set, get) => ({
  list: [],
  isLoading: false,
  error: null,
  GetIncidents: async (projectId, status) => {
    set({ isLoading: true, error: null });
    try {
      const res = await getAllIncident(projectId, status === "open" ? { where: "status:open" } : { status });
      set({ list: res.items ?? [], isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
  CloseIncident: async (projectId, id, summary = "Closed from UI") => {
    const previousList = get().list;
    // optimistic remove
    set({ list: previousList.filter((i) => i.id !== id) });
    try {
      await closeIncident(projectId, id, summary);
      toast.success("Incident closed");
    } catch (err) {
      // revert on error
      set({ list: previousList });
      toast.error(getErrorMessage(err));
    }
  },
}));

export default useIncidentStore;
