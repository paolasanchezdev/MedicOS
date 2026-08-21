// apps/api/src/modules/resources/services/resources.service.ts
import prisma from '../../../config/prisma.js';
import { ResourceCategory, StockStatus, SyncStatus, Prisma } from '@prisma/client';

export interface ResourceFiltersInput {
  category?: ResourceCategory | 'ALL' | undefined;
  search?: string | undefined;
  stockStatus?: 'ALL' | 'AVAILABLE' | 'LOW_STOCK' | 'EXPIRING' | 'DEPLETED' | undefined;
  isActive?: boolean | undefined;
}

export interface CreateResourceDto {
  code: string;
  name: string;
  genericName?: string | null | undefined;
  category?: ResourceCategory | undefined;
  unit: string;
  isConsumable?: boolean | undefined;
  minThreshold?: number | undefined;
  isActive?: boolean | undefined;
}

export interface CreateResourceStockDto {
  resourceId: string;
  lotNumber: string;
  expirationDate: string;
  quantityAvailable: number;
}

export class ResourcesService {
  async getResources(filters: ResourceFiltersInput) {
    const where: Prisma.ResourceWhereInput = {
      deletedAt: null,
    };

    if (filters.category && filters.category !== 'ALL') {
      where.category = filters.category as ResourceCategory;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.search) {
      const q = filters.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { genericName: { contains: q, mode: 'insensitive' } },
      ];
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        stocks: {
          where: { deletedAt: null },
          orderBy: { expirationDate: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    const now = new Date();
    const ninetyDaysFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

    const itemsWithMetrics = resources.map((res) => {
      const activeStocks = res.stocks.filter((s) => s.status === StockStatus.AVAILABLE);
      const totalAvailableStock = activeStocks.reduce((sum, s) => sum + s.quantityAvailable, 0);
      const totalReservedStock = res.stocks.reduce((sum, s) => sum + s.quantityReserved, 0);
      const activeLotsCount = activeStocks.length;

      const hasExpiringLots = res.stocks.some(
        (s) =>
          s.status === StockStatus.AVAILABLE &&
          s.expirationDate <= ninetyDaysFromNow &&
          s.expirationDate >= now
      );

      return {
        ...res,
        totalAvailableStock,
        totalReservedStock,
        activeLotsCount,
        hasExpiringLots,
      };
    });

    if (filters.stockStatus && filters.stockStatus !== 'ALL') {
      return itemsWithMetrics.filter((item) => {
        if (filters.stockStatus === 'AVAILABLE') return item.totalAvailableStock > 0;
        if (filters.stockStatus === 'DEPLETED') return item.totalAvailableStock === 0;
        if (filters.stockStatus === 'LOW_STOCK') {
          return item.totalAvailableStock > 0 && item.totalAvailableStock <= item.minThreshold;
        }
        if (filters.stockStatus === 'EXPIRING') return item.hasExpiringLots;
        return true;
      });
    }

    return itemsWithMetrics;
  }

  async getResourceById(id: string) {
    return prisma.resource.findFirst({
      where: { id, deletedAt: null },
      include: {
        stocks: {
          where: { deletedAt: null },
          orderBy: { expirationDate: 'asc' },
        },
      },
    });
  }

  async createResource(data: CreateResourceDto, deviceId: string) {
    const existing = await prisma.resource.findUnique({
      where: { code: data.code.trim().toUpperCase() },
    });

    if (existing && !existing.deletedAt) {
      throw new Error(`Ya existe un recurso registrado con el código "${data.code}".`);
    }

    return prisma.resource.create({
      data: {
        code: data.code.trim().toUpperCase(),
        name: data.name.trim(),
        genericName: data.genericName ? data.genericName.trim() : null,
        category: data.category ?? ResourceCategory.MEDICINE,
        unit: data.unit.trim(),
        isConsumable: data.isConsumable ?? true,
        minThreshold: data.minThreshold ?? 10,
        isActive: data.isActive ?? true,
        syncStatus: SyncStatus.SYNCED,
        version: 1,
        originDeviceId: deviceId,
        lastModifiedByDeviceId: deviceId,
      },
    });
  }

  async updateResource(id: string, data: Partial<CreateResourceDto>, deviceId: string) {
    const updateData: Prisma.ResourceUpdateInput = {
      ...(data.name ? { name: data.name.trim() } : {}),
      ...(data.genericName !== undefined ? { genericName: data.genericName ? data.genericName.trim() : null } : {}),
      ...(data.category ? { category: data.category } : {}),
      ...(data.unit ? { unit: data.unit.trim() } : {}),
      ...(data.isConsumable !== undefined ? { isConsumable: data.isConsumable } : {}),
      ...(data.minThreshold !== undefined ? { minThreshold: data.minThreshold } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      version: { increment: 1 },
      lastModifiedByDeviceId: deviceId,
    };

    return prisma.resource.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteResource(id: string, deviceId: string) {
    const activeStock = await prisma.resourceStock.findFirst({
      where: {
        resourceId: id,
        deletedAt: null,
        quantityAvailable: { gt: 0 },
      },
    });

    if (activeStock) {
      throw new Error('No se puede dar de baja el recurso porque cuenta con lotes de stock disponibles.');
    }

    return prisma.resource.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
        version: { increment: 1 },
        lastModifiedByDeviceId: deviceId,
      },
    });
  }

  async createResourceStock(data: CreateResourceStockDto, deviceId: string) {
    const resource = await prisma.resource.findUnique({
      where: { id: data.resourceId },
    });

    if (!resource || resource.deletedAt) {
      throw new Error('El recurso especificado no existe o fue dado de baja.');
    }

    const lotNumber = data.lotNumber.trim().toUpperCase();
    const existingLot = await prisma.resourceStock.findUnique({
      where: {
        resourceId_lotNumber: {
          resourceId: data.resourceId,
          lotNumber,
        },
      },
    });

    if (existingLot && !existingLot.deletedAt) {
      throw new Error(`El número de lote "${lotNumber}" ya se encuentra registrado para este fármaco.`);
    }

    return prisma.resourceStock.create({
      data: {
        resourceId: data.resourceId,
        lotNumber,
        expirationDate: new Date(data.expirationDate),
        quantityAvailable: data.quantityAvailable,
        quantityReserved: 0,
        status: StockStatus.AVAILABLE,
        syncStatus: SyncStatus.SYNCED,
        version: 1,
        originDeviceId: deviceId,
        lastModifiedByDeviceId: deviceId,
      },
    });
  }

  async getResourceStocks(resourceId: string) {
    return prisma.resourceStock.findMany({
      where: {
        resourceId,
        deletedAt: null,
      },
      orderBy: { expirationDate: 'asc' },
    });
  }
}

export const resourcesService = new ResourcesService();