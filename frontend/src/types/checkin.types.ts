export interface DailyQuestion {
  id: number;
  text: string;
  type: 'free_text' | 'options';
  options: string[] | null;
}

export interface CheckinAnswer {
  mood: number;
  answer: string;
}

export interface CheckinTodayResponse {
  question: DailyQuestion;
  myCheckin: CheckinAnswer | null;
  partnerCheckin: CheckinAnswer | null;
  partnerCompleted: boolean;
  bothCompleted: boolean;
}

export interface CheckinHistoryEntry {
  date: string;
  question: { text: string; type: string };
  checkins: {
    userId: string;
    displayName: string;
    mood: number;
    answer: string;
  }[];
}

export interface CheckinConfig {
  notificationHour: number;
}

export interface CheckinStats {
  daily: { date: string; myMood: number | null; partnerMood: number | null }[];
  streak: number;
  avgMood: { my: number; partner: number };
  moodMatchPercent: number;
  perfectDays: number;
  distribution: { my: Record<string, number>; partner: Record<string, number> };
  insights: string[];
}
