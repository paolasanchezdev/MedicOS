// apps/api/src/modules/resources/services/devices.service.ts
import prisma from '../../../config/prisma.js';
import { DeviceStatus, Prisma } from '@prisma/client';

export interface DeviceFiltersInput {
  status?: DeviceStatus | 'ALL' | undefined;
  search?: string | undefined;
}

export interface CreateDeviceDto {
  name: string;
  serialNumber: string;
  operatingSystem: string;
  appVersion: string;
  publicKey?: string | null | undefined;
  location?: string | null | undefined;
  status?: DeviceStatus | undefined;
}

export class DevicesService {
  async getDevices(filters: DeviceFiltersInput) {
    const where: Prisma.DeviceWhereInput = {
      deletedAt: null,
    };

    if (filters.status && filters.status !== 'ALL') {
      where.status = filters.status as DeviceStatus;
    }

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { serialNumber: { contains: q, mode: 'insensitive' } },
        { operatingSystem: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
      ];
    }

    return prisma.device.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        brigadeAssignments: {
          where: { returnedAt: null },
          include: {
            brigade: {
              select: { name: true, department: true, municipality: true },
            },
          },
        },
      },
    });
  }

  async getDeviceById(id: string) {
    return prisma.device.findFirst({
      where: { id, deletedAt: null },
      include: {
        brigadeAssignments: {
          include: {
            brigade: true,
          },
        },
      },
    });
  }

  async createDevice(data: CreateDeviceDto) {
    const serialNumber = data.serialNumber.trim();
    const existing = await prisma.device.findUnique({
      where: { serialNumber },
    });

    if (existing && !existing.deletedAt) {
      throw new Error(`Ya existe un dispositivo registrado con el número de serie "${serialNumber}".`);
    }

    return prisma.device.create({
      data: {
        name: data.name.trim(),
        serialNumber,
        operatingSystem: data.operatingSystem.trim(),
        appVersion: data.appVersion.trim() || 'v1.0.0',
        publicKey: data.publicKey ? data.publicKey.trim() : null,
        location: data.location ? data.location.trim() : null,
        status: data.status ?? DeviceStatus.ACTIVE,
      },
    });
  }

  async updateDevice(id: string, data: Partial<CreateDeviceDto>) {
    if (data.serialNumber?.trim()) {
      const existing = await prisma.device.findFirst({
        where: {
          serialNumber: data.serialNumber.trim(),
          NOT: { id },
          deletedAt: null,
        },
      });

      if (existing) {
        throw new Error(`El número de serie "${data.serialNumber.trim()}" ya está asignado a otro dispositivo.`);
      }
    }

    const updateData: Prisma.DeviceUpdateInput = {
      ...(data.name ? { name: data.name.trim() } : {}),
      ...(data.serialNumber ? { serialNumber: data.serialNumber.trim() } : {}),
      ...(data.operatingSystem ? { operatingSystem: data.operatingSystem.trim() } : {}),
      ...(data.appVersion ? { appVersion: data.appVersion.trim() } : {}),
      ...(data.publicKey !== undefined ? { publicKey: data.publicKey ? data.publicKey.trim() : null } : {}),
      ...(data.location !== undefined ? { location: data.location ? data.location.trim() : null } : {}),
      ...(data.status ? { status: data.status } : {}),
    };

    return prisma.device.update({
      where: { id },
      data: updateData,
    });
  }

  async updateDeviceStatus(id: string, status: DeviceStatus) {
    return prisma.device.update({
      where: { id },
      data: { status },
    });
  }

  async deleteDevice(id: string) {
    return prisma.device.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: DeviceStatus.RETIRED,
      },
    });
  }
}

export const devicesService = new DevicesService();