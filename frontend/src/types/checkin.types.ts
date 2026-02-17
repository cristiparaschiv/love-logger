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
