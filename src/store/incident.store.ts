import { create } from "zustand";
import getErrorMessage from "@/midleware/HelperApi";
import { listIncidents, closeIncident } from "@/midleware/Incident";
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
      const res = await listIncidents(projectId, status === "open" ? { where: "status:open" } : { status });
      set({ list: res.items ?? [], isLoading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
  CloseIncident: async (projectId, id, summary = "Closed from UI") => {
    try {
      await closeIncident(projectId, id, summary);
      toast.success("Incident closed");
      // refresh open list optimistically
      const state = get();
      set({ list: state.list.filter((i) => i.id !== id) });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  },
}));

export default useIncidentStore;
