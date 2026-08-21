// apps/web/src/modules/resources/types/resource.types.ts

// ======================================================
// ENUMS MAESTROS (Alineados con PostgreSQL / schema.prisma)
// ======================================================

export type ResourceCategory = 'MEDICINE' | 'CLINICAL_SUPPLY' | 'OTHER';

export type StockStatus = 'AVAILABLE' | 'QUARANTINE' | 'DEPLETED' | 'EXPIRED';

export type EquipmentStatus = 'OPERATIONAL' | 'IN_MAINTENANCE' | 'DAMAGED' | 'DECOMMISSIONED';

export type ItemCondition = 'OPTIMAL' | 'GOOD' | 'DAMAGED' | 'UNUSABLE';

export type DeviceStatus = 'ACTIVE' | 'OFFLINE' | 'BLOCKED' | 'RETIRED';

export type DotationStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

// ======================================================
// 1. CATÁLOGO MAESTRO (Resource)
// ======================================================

export interface Resource {
  id: string;
  code: string;
  name: string;
  genericName?: string | null;
  category: ResourceCategory;
  unit: string;
  isConsumable: boolean;
  minThreshold: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  stocks?: ResourceStock[];
}

export interface ResourceWithMetrics extends Resource {
  totalAvailableStock: number;
  totalReservedStock: number;
  activeLotsCount: number;
  hasExpiringLots: boolean;
}

// ======================================================
// 2. EXISTENCIA FÍSICA Y LOTES (ResourceStock)
// ======================================================

export interface ResourceStock {
  id: string;
  resourceId: string;
  lotNumber: string;
  expirationDate: string;
  quantityAvailable: number;
  quantityReserved: number;
  status: StockStatus;
  createdAt: string;
  updatedAt: string;
  resource?: Resource;
}

// ======================================================
// 3. INSTRUMENTAL Y EQUIPAMIENTO MÉDICO (MedicalEquipment)
// ======================================================

export interface MedicalEquipment {
  id: string;
  code: string;
  name: string;
  model?: string | null;
  serialNumber?: string | null;
  status: EquipmentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ======================================================
// 4. DISPOSITIVOS TECNOLÓGICOS Y HARDWARE (Device)
// ======================================================

export interface DeviceItem {
  id: string;
  name: string;
  serialNumber: string;
  operatingSystem: string;
  appVersion: string;
  publicKey?: string | null;
  location?: string | null;
  lastSyncAt?: string | null;
  status: DeviceStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  brigadeAssignments?: Array<{
    id: string;
    brigade: {
      name: string;
      department: string;
      municipality: string;
    };
  }>;
}

// ======================================================
// 5. DOTACIÓN DE BRIGADAS
// ======================================================

export interface BrigadeDotationSummary {
  id: string;
  brigadeId: string;
  brigadeCode: string;
  brigadeName: string;
  department: string;
  municipality: string;
  responsibleName: string;
  status: DotationStatus;
  dispatchedAt: string;
  returnedAt?: string | null;
  totalSuppliesCount: number;
  totalEquipmentCount: number;
  totalDevicesCount: number;
}

export interface BrigadeSupplyDetail {
  id: string;
  brigadeId: string;
  stockId: string;
  quantitySupplied: number;
  quantityDispensed: number;
  quantityReturned: number;
  quantityWasted: number;
  notes?: string | null;
  stock: ResourceStock & {
    resource: Resource;
  };
}

export interface BrigadeEquipmentDetail {
  id: string;
  brigadeId: string;
  equipmentId: string;
  conditionOut: ItemCondition;
  conditionIn?: ItemCondition | null;
  dispatchedAt: string;
  returnedAt?: string | null;
  notes?: string | null;
  equipment: MedicalEquipment;
}

export interface BrigadeDeviceDetail {
  id: string;
  brigadeId: string;
  deviceId: string;
  assignedAt: string;
  returnedAt?: string | null;
  roleInBrigade?: string | null;
  device: DeviceItem;
}

export interface FullBrigadeDotation {
  id: string;
  name: string;
  department: string;
  municipality: string;
  status: DotationStatus;
  startDate: string;
  endDate?: string | null;
  leader?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  supplyItems: BrigadeSupplyDetail[];
  equipmentItems: BrigadeEquipmentDetail[];
  devices: BrigadeDeviceDetail[];
}

// ======================================================
// FILTROS Y DTOs
// ======================================================

export interface ResourceFilters {
  category?: ResourceCategory | 'ALL';
  search?: string;
  stockStatus?: 'ALL' | 'AVAILABLE' | 'LOW_STOCK' | 'EXPIRING' | 'DEPLETED';
  isActive?: boolean;
}

export interface MedicalEquipmentFilters {
  status?: EquipmentStatus | 'ALL';
  search?: string;
}

export interface DeviceFilters {
  status?: DeviceStatus | 'ALL';
  search?: string;
}

export interface DotacionFilters {
  search?: string;
  status?: DotationStatus | 'ALL';
  department?: string | 'ALL';
}

export interface CreateResourceDto {
  code: string;
  name: string;
  genericName?: string | null;
  category?: ResourceCategory;
  unit: string;
  isConsumable?: boolean;
  minThreshold?: number;
  isActive?: boolean;
}

export interface CreateResourceStockDto {
  resourceId: string;
  lotNumber: string;
  expirationDate: string;
  quantityAvailable: number;
}

export interface CreateMedicalEquipmentDto {
  code: string;
  name: string;
  model?: string;
  serialNumber?: string;
  status?: EquipmentStatus;
}

export interface CreateDeviceDto {
  name: string;
  serialNumber: string;
  operatingSystem: string;
  appVersion: string;
  publicKey?: string;
  location?: string;
  status?: DeviceStatus;
}

export interface SupplyDispatchItemDto {
  stockId: string;
  quantitySupplied: number;
  notes?: string | null;
}

export interface EquipmentDispatchItemDto {
  equipmentId: string;
  conditionOut?: ItemCondition;
  notes?: string | null;
}

export interface DeviceDispatchItemDto {
  deviceId: string;
  roleInBrigade?: string | null;
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
  quantityWasted?: number;
  notes?: string | null;
}

export interface EquipmentLiquidationItemDto {
  id: string;
  conditionIn: ItemCondition;
  notes?: string | null;
}

export interface LiquidateDotationDto {
  supplies: SupplyLiquidationItemDto[];
  equipments: EquipmentLiquidationItemDto[];
}