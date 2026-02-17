import { apiService } from './api.service';
import { CheckinTodayResponse, CheckinHistoryEntry, CheckinConfig } from '../types/checkin.types';

class CheckinApiService {
  async getToday(): Promise<CheckinTodayResponse> {
    return apiService.get<CheckinTodayResponse>('/checkin/today');
  }

  async submit(mood: number, answer: string): Promise<CheckinTodayResponse> {
    return apiService.post<CheckinTodayResponse>('/checkin/submit', { mood, answer });
  }

  async getHistory(days: number = 30): Promise<{ entries: CheckinHistoryEntry[] }> {
    return apiService.get<{ entries: CheckinHistoryEntry[] }>(`/checkin/history?days=${days}`);
  }

  async getConfig(): Promise<CheckinConfig> {
    return apiService.get<CheckinConfig>('/checkin/config');
  }

  async updateConfig(notificationHour: number): Promise<CheckinConfig> {
    return apiService.put<CheckinConfig>('/checkin/config', { notificationHour });
  }
}

export const checkinApiService = new CheckinApiService();
