import { create } from "zustand";
import MetricsStore from "@/store/metrics.store";
import useWebhookStore from "@/store/webhook.store";

import Swal from "sweetalert2";
import {
  loginAPI,
  refreshTokenAPI,
  signupAPI,
  type AuthCredentials,
  type AuthResponse,
  type SignupCredentials,
} from "@/midleware/auth.api";
import getErrorMessage from "@/midleware/HelperApi";
import { toast } from "sonner";

interface AuthStoreState {
  user: any | null;
  project: Project | null;
  token: string | null;
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: any) => void;
  setProject: (Project: any) => void;
  login: (creds: AuthCredentials) => Promise<AuthResponse | void>;
  signup: (creds: SignupCredentials) => Promise<AuthResponse | void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

interface Project {
  activeProjectId: string;
  effectiveRole: string;
}


const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: null,
  project: null,
  token: sessionStorage.getItem("token"),
  isHydrated: false,
  isLoading: false,
  error: null,

  setUser: (user: any) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  setProject: (Project: any) => {
    sessionStorage.setItem("project", JSON.stringify(Project));
    set({ project : Project});
    // after changing active project, trigger refetch in other stores
    try {
      if (Project?.activeProjectId) {
        // fetch incidents and webhooks for the new project
        // use getState() to call store actions outside React component
        try {
          MetricsStore.getState().GetIncident(Project.activeProjectId);
        } catch (e) {
          console.error("MetricsStore refresh error", e);
        }
        try {
          useWebhookStore.getState().GetWebhooks(Project.activeProjectId);
        } catch (e) {
          console.error("WebhookStore refresh error", e);
        }
      }
    } catch (e) {
      // swallow errors here; stores handle their own errors
      console.error("Error triggering store refresh on setProject", e);
    }
  },

  login: async (credentials: AuthCredentials) => {
    set({ isLoading: true, error: null });

    try {
      // 1) Buat promise API
      const req = loginAPI(credentials); // Promise<AuthResponse>

      // 2) Kaitkan toast ke promise (JANGAN di-await)
      toast.promise(req, {
        loading: "Signing you in...",
        success: "Welcome back! 🎉",
        error: (err) => getErrorMessage(err, "Login failed. Please try again."),
      });

      // 3) Ambil hasilnya dari promise asli
      const res = await req; // <- res: AuthResponse

      const { user, token, activeProjectId, effectiveRole } = res.data;
      sessionStorage.setItem("token", token.access_token);
      localStorage.setItem("refresh", token.refresh_token);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem(
        "project",
        JSON.stringify({ activeProjectId, effectiveRole })
      );

      set({
        user,
        token: token.access_token,
        isLoading: false,
        project: { activeProjectId, effectiveRole },
      });
      return res; // match type Promise<void | AuthResponse>
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  signup: async (credentials) => {
    set({ isLoading: true });
    try {
      await signupAPI(credentials);
      toast.success("Account has been created");
      set({ isLoading: false });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: getErrorMessage(err, "failed. Please try again."),
      });
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, token: null });
  },

  refreshToken: async () => {
    const refresh = localStorage.getItem("refresh");
    const project = JSON.parse(sessionStorage.getItem("project") ?? "{}");

    if (!refresh) return get().logout();
    try {
      const data = {
        refresh_token: refresh,
        projectId: project?.activeProjectId,
      };

      const res: AuthResponse = await refreshTokenAPI(data);
      const { user, token, activeProjectId, effectiveRole } = res.data;
      sessionStorage.setItem("token", token.access_token);
      localStorage.setItem("refresh", token.refresh_token);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem(
        "project",
        JSON.stringify({ activeProjectId, effectiveRole })
      );
      set({ user, token: token.access_token, project: { activeProjectId, effectiveRole }, });
    } catch {
      get().logout();
    }
  },
}));

// ✅ hydrate manually in main.ts
export const hydrateAuth = () => {
  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user");
  const project = sessionStorage.getItem("project")
  useAuthStore.setState({
    token: token || null,
    user: user ? JSON.parse(user) : null,
    project: project ? JSON.parse(project) : null,
    isHydrated: true,
  });
};

export default useAuthStore;
