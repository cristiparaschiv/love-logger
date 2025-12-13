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
    // DEBUG: Log incoming data
    console.log('=== VACATION SERVICE CREATE DEBUG ===');
    console.log('Incoming data:', data);
    console.log('Data has photo?', !!data.photo);
    if (data.photo) {
      console.log('Photo details:', {
        name: data.photo.name,
        type: data.photo.type,
        size: data.photo.size,
      });
    }

    const formData = new FormData();
    formData.append('location', data.location);
    formData.append('startDate', data.startDate);
    formData.append('durationDays', data.durationDays.toString());

    if (data.photo) {
      console.log('Appending photo to FormData...');
      formData.append('photo', data.photo);
      console.log('Photo appended successfully');
    } else {
      console.log('WARNING: No photo in data, skipping photo append');
    }

    // DEBUG: Log FormData contents
    console.log('FormData entries:');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, {
          type: 'File',
          name: value.name,
          size: value.size,
          mimeType: value.type,
        });
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    console.log('Sending POST request to /vacations...');
    alert('DEBUG: About to make API call...');

    let response;
    try {
      response = await apiService.post<VacationResponse>('/vacations', formData);
      alert(`DEBUG: API call completed!\n\nResponse: ${JSON.stringify(response, null, 2).substring(0, 500)}`);
    } catch (apiError: any) {
      alert(`DEBUG: API CALL FAILED!\n\nError: ${apiError.message}\n\n${JSON.stringify(apiError.response?.data || apiError, null, 2).substring(0, 500)}`);
      throw apiError;
    }

    console.log('Response received:', response);
    console.log('Response vacation photoUrl:', response.vacation?.photoUrl);

    // Show alert with response status
    const photoUrl = response.vacation?.photoUrl || 'NULL - No photo saved!';
    alert(`API RESPONSE\n\nPhotoUrl: ${photoUrl}\n\nLocation: ${response.vacation?.location}`);

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
