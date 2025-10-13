import { create } from "zustand";
import getErrorMessage from "@/middleware/HelperApi";

import type { Project } from "@/types/Project";
import { getAllProject } from "@/middleware/Project";

interface PropsState {
  ProjectList: Project[] | null;
  isLoading: boolean;
  error: string | null;
  getAllProject: (payload?: string) => void;
}

const ProjectStore = create<PropsState>((set) => ({
  ProjectList: null,
  isLoading: false,
  error: null,

  getAllProject: async (payload) => {
    set({ isLoading: true, error: null });
    try {
  const req = await getAllProject(payload);
  set({ isLoading: false, ProjectList: req });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
}));

export default ProjectStore;
