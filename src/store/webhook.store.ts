import { create } from "zustand";
import getErrorMessage from "@/midleware/HelperApi";
import { getWebhooks, createWebhook, updateWebhook, deleteWebhook } from "@/midleware/Webhook";
import { toast } from "sonner";

interface WebhookItem {
  id: string;
  url: string;
  enabled: boolean;
}

interface WebhookState {
  list: WebhookItem[] | null;
  isLoading: boolean;
  error: string | null;
  GetWebhooks: (projectId: string) => Promise<void>;
  CreateWebhook: (projectId: string, data: { name?: string; url: string; signingSecret?: string }) => Promise<void>;
  ToggleWebhook: (projectId: string, id: string) => Promise<void>;
  DeleteWebhook: (projectId: string, id: string) => Promise<void>;
}

const useWebhookStore = create<WebhookState>((set, get) => ({
  list: null,
  isLoading: false,
  error: null,

  GetWebhooks: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
  const res = await getWebhooks(projectId);
  // middleware returns Webhook[]; accept defensive shapes via any
  const anyRes: any = res;
  const items = Array.isArray(anyRes) ? anyRes : anyRes?.items ?? anyRes?.data ?? [];
      set({ list: items, isLoading: false });
    } catch (err) {
      const msg = getErrorMessage(err);
      // show status for debugging if available
      // eslint-disable-next-line no-console
      console.error("GetWebhooks error:", err);
      set({ error: msg, isLoading: false });
      // show toast with status if axios error
      try {
        // @ts-ignore
        const status = err?.response?.status;
        if (status) toast.error(`Failed to get webhooks: ${status} ${msg}`);
      } catch {}
    }
  },

  CreateWebhook: async (projectId: string, data: { name?: string; url: string; signingSecret?: string }) => {
    set({ isLoading: true, error: null });
    try {
      const req = createWebhook(projectId, data as any);
      toast.promise(req, {
        loading: "Creating webhook...",
        success: "Webhook created",
        error: (err) => getErrorMessage(err, "Create failed"),
      });
  const res = await req;
  const anyRes: any = res;
  const item = Array.isArray(anyRes) ? anyRes[0] : anyRes?.data ?? anyRes;
  set((state) => ({ list: state.list ? [item, ...state.list] : [item], isLoading: false }));
    } catch (err) {
      const msg = getErrorMessage(err);
      // eslint-disable-next-line no-console
      console.error("CreateWebhook error:", err);
      set({ error: msg, isLoading: false });
      try {
        // @ts-ignore
        const status = err?.response?.status;
        if (status) toast.error(`Create failed: ${status} ${msg}`);
      } catch {}
    }
  },

  ToggleWebhook: async (projectId: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
  // use updateWebhook to toggle/enabled state via PUT
  const existing = get().list?.find((w: WebhookItem) => w.id === id);
  const payload = { enabled: !(existing?.enabled ?? false) };
  const req = updateWebhook(projectId, id, payload as any);
      toast.promise(req, {
        loading: "Toggling webhook...",
        success: "Webhook updated",
        error: (err) => getErrorMessage(err, "Update failed"),
      });
  const res = await req;
  const anyRes2: any = res;
  const item = Array.isArray(anyRes2) ? anyRes2[0] : anyRes2?.data ?? anyRes2;
  set((state) => ({ list: state.list ? state.list.map((w) => (w.id === id ? item : w)) : state.list, isLoading: false }));
    } catch (err) {
      const msg = getErrorMessage(err);
      // eslint-disable-next-line no-console
      console.error("ToggleWebhook error:", err);
      set({ error: msg, isLoading: false });
      try {
        // @ts-ignore
        const status = err?.response?.status;
        if (status) toast.error(`Update failed: ${status} ${msg}`);
      } catch {}
    }
  },

  DeleteWebhook: async (projectId: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
      const req = deleteWebhook(projectId, id);
      toast.promise(req, {
        loading: "Deleting webhook...",
        success: "Webhook deleted",
        error: (err) => getErrorMessage(err, "Delete failed"),
      });
      await req;
      set((state) => ({ list: state.list ? state.list.filter((w) => w.id !== id) : state.list, isLoading: false }));
    } catch (err) {
      const msg = getErrorMessage(err);
      // eslint-disable-next-line no-console
      console.error("DeleteWebhook error:", err);
      set({ error: msg, isLoading: false });
      try {
        // @ts-ignore
        const status = err?.response?.status;
        if (status) toast.error(`Delete failed: ${status} ${msg}`);
      } catch {}
    }
  },
}));

export default useWebhookStore;
