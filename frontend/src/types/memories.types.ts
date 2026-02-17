export interface MemoryItem {
  id: string;
  type: 'event' | 'timeline' | 'vacation';
  date: string;
  title: string;
  description: string | null;
  yearsAgo: number;
}

export interface MemoriesResponse {
  memories: MemoryItem[];
}
