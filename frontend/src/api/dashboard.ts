import { apiGet } from "@/lib/http";
import type { DashboardOverviewDTO } from "@/api/types";

export const dashboardApi = {
  async overview(): Promise<DashboardOverviewDTO> {
    return apiGet<DashboardOverviewDTO>("/api/dashboard/overview");
  },
};

