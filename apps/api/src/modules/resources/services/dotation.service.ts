// apps/api/src/modules/resources/services/dotation.service.ts
import prisma from '../../../config/prisma.js';
import { ItemCondition, SyncStatus, Prisma } from '@prisma/client';

export interface DotationFiltersInput {
  search?: string | undefined;
  status?: string | 'ALL' | undefined;
  department?: string | 'ALL' | undefined;
}

export interface SupplyDispatchItemDto {
  stockId: string;
  quantitySupplied: number;
  notes?: string | null | undefined;
}

export interface EquipmentDispatchItemDto {
  equipmentId: string;
  conditionOut?: ItemCondition | undefined;
  notes?: string | null | undefined;
}

export interface DeviceDispatchItemDto {
  deviceId: string;
  roleInBrigade?: string | null | undefined;
}

export interface CreateDotationDto {
  brigadeId: string;
  supplies: SupplyDispatchItemDto[];
  equipments: EquipmentDispatchItemDto[];
  devices: DeviceDispatchItemDto[];
}

export interface SupplyLiquidationItemDto {
  id: string;
  quantityDispensed: number;
  quantityReturned: number;
  quantityWasted?: number | undefined;
  notes?: string | null | undefined;
}

export interface EquipmentLiquidationItemDto {
  id: string;
  conditionIn: ItemCondition;
  notes?: string | null | undefined;
}

export interface LiquidateDotationDto {
  supplies: SupplyLiquidationItemDto[];
  equipments: EquipmentLiquidationItemDto[];
}

export class DotationService {
  async getDotations(filters: DotationFiltersInput) {
    const where: Prisma.BrigadeWhereInput = {
      deletedAt: null,
    };

    if (filters.department && filters.department !== 'ALL') {
      where.department = { equals: filters.department, mode: 'insensitive' };
    }

    if (filters.status && filters.status !== 'ALL') {
      where.status = filters.status as Prisma.EnumBrigadeStatusFilter<'Brigade'>;
    }

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { department: { contains: q, mode: 'insensitive' } },
        { municipality: { contains: q, mode: 'insensitive' } },
      ];
    }

    const brigades = await prisma.brigade.findMany({
      where,
      include: {
        leader: {
          select: { firstName: true, lastName: true, email: true },
        },
        supplyItems: {
          where: { deletedAt: null },
        },
        equipmentItems: {
          where: { deletedAt: null },
        },
        devices: {
          where: { deletedAt: null },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return brigades.map((b) => ({
      id: b.id,
      brigadeId: b.id,
      brigadeCode: `BRG-${b.id.slice(0, 6).toUpperCase()}`,
      brigadeName: b.name,
      department: b.department,
      municipality: b.municipality,
      responsibleName: b.leader ? `${b.leader.firstName} ${b.leader.lastName}` : 'Sin Asignar',
      status: b.status,
      dispatchedAt: b.startDate.toISOString(),
      returnedAt: b.endDate ? b.endDate.toISOString() : null,
      totalSuppliesCount: b.supplyItems.length,
      totalEquipmentCount: b.equipmentItems.length,
      totalDevicesCount: b.devices.length,
    }));
  }

  async getDotationDetails(brigadeId: string) {
    const brigade = await prisma.brigade.findUnique({
      where: { id: brigadeId },
      include: {
        leader: true,
        supplyItems: {
          where: { deletedAt: null },
          include: {
            stock: {
              include: {
                resource: true,
              },
            },
          },
        },
        equipmentItems: {
          where: { deletedAt: null },
          include: {
            equipment: true,
          },
        },
        devices: {
          where: { deletedAt: null },
          include: {
            device: true,
          },
        },
      },
    });

    if (!brigade || brigade.deletedAt) {
      throw new Error('La brigada no existe o fue dada de baja.');
    }

    return brigade;
  }

  async createDotation(data: CreateDotationDto, deviceId: string) {
    return prisma.$transaction(async (tx) => {
      const brigade = await tx.brigade.findUnique({
        where: { id: data.brigadeId },
      });

      if (!brigade || brigade.deletedAt) {
        throw new Error('La brigada especificada no existe.');
      }

      // 1. Asignar Insumos / Medicamentos por Lote
      for (const item of data.supplies) {
        const stock = await tx.resourceStock.findUnique({
          where: { id: item.stockId },
        });

        if (!stock || stock.deletedAt) {
          throw new Error(`El lote de stock ${item.stockId} no existe.`);
        }

        if (stock.quantityAvailable < item.quantitySupplied) {
          throw new Error(
            `Stock insuficiente en el lote ${stock.lotNumber}. Disponible: ${stock.quantityAvailable}, Solicitado: ${item.quantitySupplied}`
          );
        }

        // Reservar stock
        await tx.resourceStock.update({
          where: { id: item.stockId },
          data: {
            quantityAvailable: { decrement: item.quantitySupplied },
            quantityReserved: { increment: item.quantitySupplied },
            version: { increment: 1 },
            lastModifiedByDeviceId: deviceId,
          },
        });

        await tx.brigadeSupplyItem.create({
          data: {
            brigadeId: data.brigadeId,
            stockId: item.stockId,
            quantitySupplied: item.quantitySupplied,
            quantityDispensed: 0,
            quantityReturned: 0,
            quantityWasted: 0,
            notes: item.notes ? item.notes.trim() : null,
            syncStatus: SyncStatus.SYNCED,
            version: 1,
            originDeviceId: deviceId,
            lastModifiedByDeviceId: deviceId,
          },
        });
      }

      // 2. Asignar Equipos Médicos
      for (const eq of data.equipments) {
        await tx.brigadeEquipmentItem.create({
          data: {
            brigadeId: data.brigadeId,
            equipmentId: eq.equipmentId,
            conditionOut: eq.conditionOut ?? ItemCondition.OPTIMAL,
            notes: eq.notes ? eq.notes.trim() : null,
            syncStatus: SyncStatus.SYNCED,
            version: 1,
            originDeviceId: deviceId,
            lastModifiedByDeviceId: deviceId,
          },
        });
      }

      // 3. Asignar Dispositivos y Hardware
      for (const dev of data.devices) {
        await tx.brigadeDevice.create({
          data: {
            brigadeId: data.brigadeId,
            deviceId: dev.deviceId,
            roleInBrigade: dev.roleInBrigade ? dev.roleInBrigade.trim() : 'Estación Principal',
            syncStatus: SyncStatus.SYNCED,
            version: 1,
            originDeviceId: deviceId,
            lastModifiedByDeviceId: deviceId,
          },
        });
      }

      return { success: true, message: 'Dotación despachada exitosamente.' };
    });
  }

  async liquidateDotation(brigadeId: string, data: LiquidateDotationDto, deviceId: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Conciliar Insumos y devolver sobrante a bodega
      for (const supply of data.supplies) {
        const supplyItem = await tx.brigadeSupplyItem.findUnique({
          where: { id: supply.id },
        });

        if (supplyItem) {
          await tx.brigadeSupplyItem.update({
            where: { id: supply.id },
            data: {
              quantityDispensed: supply.quantityDispensed,
              quantityReturned: supply.quantityReturned,
              quantityWasted: supply.quantityWasted ?? 0,
              notes: supply.notes ? supply.notes.trim() : null,
              version: { increment: 1 },
              lastModifiedByDeviceId: deviceId,
            },
          });

          // Devolver el stock retornado y liberar el reservado
          await tx.resourceStock.update({
            where: { id: supplyItem.stockId },
            data: {
              quantityAvailable: { increment: supply.quantityReturned },
              quantityReserved: { decrement: supplyItem.quantitySupplied },
              version: { increment: 1 },
              lastModifiedByDeviceId: deviceId,
            },
          });
        }
      }

      // 2. Registrar condición de retorno de equipos
      for (const eq of data.equipments) {
        await tx.brigadeEquipmentItem.update({
          where: { id: eq.id },
          data: {
            conditionIn: eq.conditionIn,
            returnedAt: new Date(),
            notes: eq.notes ? eq.notes.trim() : null,
            version: { increment: 1 },
            lastModifiedByDeviceId: deviceId,
          },
        });
      }

      // 3. Marcar dispositivos como devueltos
      await tx.brigadeDevice.updateMany({
        where: { brigadeId, returnedAt: null },
        data: {
          returnedAt: new Date(),
          version: { increment: 1 },
          lastModifiedByDeviceId: deviceId,
        },
      });

      return { success: true, message: 'Liquidación de dotación cerrada exitosamente.' };
    });
  }
}

export const dotationService = new DotationService();