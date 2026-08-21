// apps/api/src/modules/resources/services/equipment.service.ts
import prisma from '../../../config/prisma.js';
import { EquipmentStatus, SyncStatus, Prisma } from '@prisma/client';

export interface EquipmentFiltersInput {
  status?: EquipmentStatus | 'ALL' | undefined;
  search?: string | undefined;
}

export interface CreateEquipmentDto {
  code: string;
  name: string;
  model?: string | null | undefined;
  serialNumber?: string | null | undefined;
  status?: EquipmentStatus | undefined;
}

export class EquipmentService {
  async getEquipments(filters: EquipmentFiltersInput) {
    const where: Prisma.MedicalEquipmentWhereInput = {
      deletedAt: null,
    };

    if (filters.status && filters.status !== 'ALL') {
      where.status = filters.status as EquipmentStatus;
    }

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
        { serialNumber: { contains: q, mode: 'insensitive' } },
      ];
    }

    return prisma.medicalEquipment.findMany({
      where,
      orderBy: { code: 'asc' },
    });
  }

  async getEquipmentById(id: string) {
    return prisma.medicalEquipment.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async createEquipment(data: CreateEquipmentDto, deviceId: string) {
    const code = data.code.trim().toUpperCase();
    const existingCode = await prisma.medicalEquipment.findUnique({
      where: { code },
    });

    if (existingCode && !existingCode.deletedAt) {
      throw new Error(`Ya existe un equipo registrado con el código "${code}".`);
    }

    if (data.serialNumber?.trim()) {
      const existingSerial = await prisma.medicalEquipment.findUnique({
        where: { serialNumber: data.serialNumber.trim() },
      });

      if (existingSerial && !existingSerial.deletedAt) {
        throw new Error(`Ya existe un equipo registrado con el número de serie "${data.serialNumber.trim()}".`);
      }
    }

    return prisma.medicalEquipment.create({
      data: {
        code,
        name: data.name.trim(),
        model: data.model ? data.model.trim() : null,
        serialNumber: data.serialNumber ? data.serialNumber.trim() : null,
        status: data.status ?? EquipmentStatus.OPERATIONAL,
        syncStatus: SyncStatus.SYNCED,
        version: 1,
        originDeviceId: deviceId,
        lastModifiedByDeviceId: deviceId,
      },
    });
  }

  async updateEquipment(id: string, data: Partial<CreateEquipmentDto>, deviceId: string) {
    if (data.serialNumber?.trim()) {
      const existingSerial = await prisma.medicalEquipment.findFirst({
        where: {
          serialNumber: data.serialNumber.trim(),
          NOT: { id },
          deletedAt: null,
        },
      });

      if (existingSerial) {
        throw new Error(`El número de serie "${data.serialNumber.trim()}" ya pertenece a otro equipo.`);
      }
    }

    const updateData: Prisma.MedicalEquipmentUpdateInput = {
      ...(data.name ? { name: data.name.trim() } : {}),
      ...(data.model !== undefined ? { model: data.model ? data.model.trim() : null } : {}),
      ...(data.serialNumber !== undefined ? { serialNumber: data.serialNumber ? data.serialNumber.trim() : null } : {}),
      ...(data.status ? { status: data.status } : {}),
      version: { increment: 1 },
      lastModifiedByDeviceId: deviceId,
    };

    return prisma.medicalEquipment.update({
      where: { id },
      data: updateData,
    });
  }

  async updateEquipmentStatus(id: string, status: EquipmentStatus, deviceId: string) {
    return prisma.medicalEquipment.update({
      where: { id },
      data: {
        status,
        version: { increment: 1 },
        lastModifiedByDeviceId: deviceId,
      },
    });
  }

  async deleteEquipment(id: string, deviceId: string) {
    return prisma.medicalEquipment.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: EquipmentStatus.DECOMMISSIONED,
        version: { increment: 1 },
        lastModifiedByDeviceId: deviceId,
      },
    });
  }
}

export const equipmentService = new EquipmentService();