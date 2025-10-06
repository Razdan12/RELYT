import { create } from "zustand";
import getErrorMessage from "@/midleware/HelperApi";

import { getIncident, getIncidentPerDay, getLatency, getRecentRun, getStatus, getSummary, getUptime } from "@/midleware/Metrics";
import type { Incident, IncidentDay, KPICardProps, Latency, RecentRun, StatusCheck, Uptime } from "@/types/Metrics";

interface PropsState {
  summaryList: KPICardProps[] | null;
  uptimeList: Uptime[] | null
  latencyList: Latency[] | null
  incidentDayList: IncidentDay[] | null
  recentRunList: RecentRun[] | null
  incidentList: Incident[] | null
  checkList: StatusCheck[] | null
  isLoading: boolean;
  error: string | null;
  GetSummary: (id: string) => void;
  GetUptime: (id: string, payload: string) => void;
  GetLatency: (id: string, payload: string) => void;
  GetIncidentDay: (id: string, payload: string) => void;
  GetRecentRun: (id: string, payload: string) => void;
  GetIncident: (id: string, payload?: string) => void;
  GetStatusCheck: (id: string) => void;
}


const MetricsStore = create<PropsState>((set) => ({
  summaryList: null,
  uptimeList: null,
  latencyList:null,
  incidentDayList: null,
  recentRunList: null,
  incidentList: null,
  checkList: null,
  isLoading: false,
  error: null,

  GetSummary: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const req = await getSummary(id);
      set({ isLoading: false, summaryList: req.kpis });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
  GetUptime: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const req = await getUptime(id, payload);
      set({ isLoading: false, uptimeList: req });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
  GetLatency: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const req = await getLatency(id, payload);
      set({ isLoading: false, latencyList: req });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
  GetIncidentDay: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const req = await getIncidentPerDay(id, payload);
      set({ isLoading: false, incidentDayList: req });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
  GetRecentRun: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const req = await getRecentRun(id, payload);
      set({ isLoading: false, recentRunList: req });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
  GetIncident: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const req = await getIncident(id, payload);
      set({ isLoading: false, incidentList: req });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
  GetStatusCheck: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const req = await getStatus(id);
      set({ isLoading: false, checkList: req });
    } catch (err) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },
}));

export default MetricsStore;
