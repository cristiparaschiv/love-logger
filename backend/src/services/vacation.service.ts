import { Vacation } from '@prisma/client';
import { vacationRepository } from '../repositories/vacation.repository';
import { fileService } from './file.service';
import { logger } from '../utils/logger';

export interface CreateVacationData {
  location: string;
  startDate: Date;
  durationDays: number;
  createdById: string;
}

export interface UpdateVacationData {
  location?: string;
  startDate?: Date;
  durationDays?: number;
}

export class VacationService {
  async getAllVacations(): Promise<Vacation[]> {
    return vacationRepository.findAll();
  }

  async getUpcomingVacations(): Promise<Vacation[]> {
    return vacationRepository.findUpcoming();
  }

  async getPastVacations(): Promise<Vacation[]> {
    return vacationRepository.findPast();
  }

  async getVacationById(id: string): Promise<Vacation | null> {
    return vacationRepository.findById(id);
  }

  async createVacation(data: CreateVacationData, photoFile?: Express.Multer.File): Promise<Vacation> {
    let photoUrl: string | null = null;

    // Process photo if provided
    if (photoFile) {
      // Validate file
      if (!fileService.validateImageFile(photoFile)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      }

      if (!fileService.validateFileSize(photoFile)) {
        throw new Error('File size exceeds maximum allowed size (10MB).');
      }

      // Process and save image
      photoUrl = await fileService.processAndSaveImage(photoFile, 'vacations', 1920, 85);
    }

    const vacation = await vacationRepository.create({
      ...data,
      photoUrl,
    });

    logger.info(`Vacation created: ${vacation.id}`);
    return vacation;
  }

  async updateVacation(
    id: string,
    data: UpdateVacationData,
    photoFile?: Express.Multer.File
  ): Promise<Vacation> {
    const existingVacation = await vacationRepository.findById(id);
    if (!existingVacation) {
      throw new Error('Vacation not found');
    }

    let photoUrl: string | undefined = undefined;

    // Process new photo if provided
    if (photoFile) {
      // Validate file
      if (!fileService.validateImageFile(photoFile)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      }

      if (!fileService.validateFileSize(photoFile)) {
        throw new Error('File size exceeds maximum allowed size (10MB).');
      }

      // Delete old photo if it exists
      if (existingVacation.photoUrl) {
        try {
          await fileService.deleteFile(existingVacation.photoUrl);
        } catch (error) {
          logger.warn('Failed to delete old vacation photo:', error);
        }
      }

      // Process and save new image
      photoUrl = await fileService.processAndSaveImage(photoFile, 'vacations', 1920, 85);
    }

    const updateData = {
      ...data,
      ...(photoUrl !== undefined && { photoUrl }),
    };

    const vacation = await vacationRepository.update(id, updateData);
    logger.info(`Vacation updated: ${vacation.id}`);
    return vacation;
  }

  async deleteVacation(id: string): Promise<Vacation> {
    const vacation = await vacationRepository.findById(id);
    if (!vacation) {
      throw new Error('Vacation not found');
    }

    // Delete associated photo if it exists
    if (vacation.photoUrl) {
      try {
        await fileService.deleteFile(vacation.photoUrl);
      } catch (error) {
        logger.warn('Failed to delete vacation photo:', error);
      }
    }

    const deleted = await vacationRepository.delete(id);
    logger.info(`Vacation deleted: ${id}`);
    return deleted;
  }

  async getVacationsByUserId(userId: string): Promise<Vacation[]> {
    return vacationRepository.findByUserId(userId);
  }
}

export const vacationService = new VacationService();
