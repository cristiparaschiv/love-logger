import { Vacation } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateVacationData {
  location: string;
  startDate: Date;
  durationDays: number;
  photoUrl?: string | null;
  createdById: string;
}

export interface UpdateVacationData {
  location?: string;
  startDate?: Date;
  durationDays?: number;
  photoUrl?: string | null;
}

export class VacationRepository {
  async findAll(): Promise<Vacation[]> {
    return prisma.vacation.findMany({
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Vacation | null> {
    return prisma.vacation.findUnique({
      where: { id },
    });
  }

  async findUpcoming(): Promise<Vacation[]> {
    const now = new Date();
    return prisma.vacation.findMany({
      where: {
        startDate: {
          gte: now,
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
  }

  async findPast(): Promise<Vacation[]> {
    const now = new Date();
    return prisma.vacation.findMany({
      where: {
        startDate: {
          lt: now,
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findByUserId(userId: string): Promise<Vacation[]> {
    return prisma.vacation.findMany({
      where: {
        createdById: userId,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async create(data: CreateVacationData): Promise<Vacation> {
    return prisma.vacation.create({
      data: {
        location: data.location,
        startDate: data.startDate,
        durationDays: data.durationDays,
        photoUrl: data.photoUrl,
        createdBy: {
          connect: { id: data.createdById },
        },
      },
    });
  }

  async update(id: string, data: UpdateVacationData): Promise<Vacation> {
    return prisma.vacation.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Vacation> {
    return prisma.vacation.delete({
      where: { id },
    });
  }
}

export const vacationRepository = new VacationRepository();
