export interface Vacation {
  id: string;
  location: string;
  startDate: string;
  durationDays: number;
  photoUrl: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVacationRequest {
  location: string;
  startDate: string;
  durationDays: number;
  photo?: File;
}

export interface UpdateVacationRequest {
  location?: string;
  startDate?: string;
  durationDays?: number;
  photo?: File;
}

export interface VacationsResponse {
  vacations: Vacation[];
}

export interface VacationResponse {
  vacation: Vacation;
}

export interface VacationState {
  vacations: Vacation[];
  upcomingVacations: Vacation[];
  pastVacations: Vacation[];
  selectedVacation: Vacation | null;
  isLoading: boolean;
  error: string | null;
}
