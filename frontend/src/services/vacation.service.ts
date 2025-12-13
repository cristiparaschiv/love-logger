import { apiService } from './api.service';
import {
  Vacation,
  CreateVacationRequest,
  UpdateVacationRequest,
  VacationsResponse,
  VacationResponse,
} from '../types/vacation.types';

class VacationService {
  async getAllVacations(): Promise<Vacation[]> {
    const response = await apiService.get<VacationsResponse>('/vacations');
    return response.vacations;
  }

  async getUpcomingVacations(): Promise<Vacation[]> {
    const response = await apiService.get<VacationsResponse>('/vacations/upcoming');
    return response.vacations;
  }

  async getPastVacations(): Promise<Vacation[]> {
    const response = await apiService.get<VacationsResponse>('/vacations/past');
    return response.vacations;
  }

  async getVacationById(id: string): Promise<Vacation> {
    const response = await apiService.get<VacationResponse>(`/vacations/${id}`);
    return response.vacation;
  }

  async createVacation(data: CreateVacationRequest): Promise<Vacation> {
    const formData = new FormData();
    formData.append('location', data.location);
    formData.append('startDate', data.startDate);
    formData.append('durationDays', data.durationDays.toString());

    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const response = await apiService.post<VacationResponse>('/vacations', formData);
    return response.vacation;
  }

  async updateVacation(id: string, data: UpdateVacationRequest): Promise<Vacation> {
    const formData = new FormData();

    if (data.location !== undefined) {
      formData.append('location', data.location);
    }
    if (data.startDate !== undefined) {
      formData.append('startDate', data.startDate);
    }
    if (data.durationDays !== undefined) {
      formData.append('durationDays', data.durationDays.toString());
    }
    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const response = await apiService.put<VacationResponse>(`/vacations/${id}`, formData);

    return response.vacation;
  }

  async deleteVacation(id: string): Promise<void> {
    await apiService.delete(`/vacations/${id}`);
  }
}

export const vacationService = new VacationService();
