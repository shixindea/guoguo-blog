import { apiGet, apiPost } from "@/lib/http";
import type { CheckinCalendarDTO, CheckinRequest, CheckinResultDTO, CheckinStatusDTO } from "@/api/types";

export const checkinApi = {
  async status(): Promise<CheckinStatusDTO> {
    return apiGet<CheckinStatusDTO>("/api/checkins/status");
  },

  async calendar(params?: { yearMonth?: string }): Promise<CheckinCalendarDTO> {
    return apiGet<CheckinCalendarDTO>("/api/checkins/calendar", { params });
  },

  async checkin(body?: CheckinRequest): Promise<CheckinResultDTO> {
    return apiPost<CheckinResultDTO>("/api/checkins", body || {});
  },
};

