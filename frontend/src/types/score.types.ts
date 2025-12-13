export interface Score {
  id: string;
  heScore: number;
  sheScore: number;
  updatedAt: string;
}

export interface ScoreResponse {
  score: Score;
}
