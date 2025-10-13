import { create } from "zustand";
import getErrorMessage from "@/middleware/HelperApi";

import type { Paginate } from "@/types/ResponApi";
import type { Check } from "@/types/Check";
import type { CheckItem } from "@/middleware/HttpCheck.api";
import { getAllCheck } from "@/middleware/HttpCheck.api";

interface PropsState {
  checkList: Paginate<Check> | CheckItem[] | null;
  isLoading: boolean;
  error: string | null;
  getAllCheck: (id: string, payload?: string) => void;
}


const CheckStore = create<PropsState>((set) => ({
  checkList: null,
  isLoading: false,
  error: null,

  getAllCheck: async (id: string, payload) => {
    set({ isLoading: true, error: null });
    try {
  const req = await getAllCheck(id, payload);
  set({ isLoading: false, checkList: req as any });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
}));

export default CheckStore;
