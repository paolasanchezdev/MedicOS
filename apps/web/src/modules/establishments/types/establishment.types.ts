// apps/web/src/modules/establishments/types/establishment.types.ts

export type EstablishmentType = 'HOSPITAL' | 'CLINIC' | 'HEALTH_CENTER';

export type EstablishmentLevel =
  | 'SPECIALIZED'
  | 'REGIONAL'
  | 'DEPARTMENTAL'
  | 'BASIC';

export type EstablishmentStatus =
  | 'OPERATIONAL'
  | 'FULL_CAPACITY'
  | 'MAINTENANCE'
  | 'INACTIVE';

export type ResourceStockStatus = 'OPTIMAL' | 'MODERATE' | 'CRITICAL';

export type SyncStatus = 'PENDING' | 'SYNCED' | 'CONFLICT';

export interface Establishment {
  id: string;
  code: string;
  name: string;
  type: EstablishmentType;
  level: EstablishmentLevel;
  department: string;
  municipality: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  emergencyPhone?: string | null;
  hasEmergency: boolean;
  totalBeds: number;
  availableBeds: number;
  status: EstablishmentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

  // Metadatos Offline-First
  syncStatus: SyncStatus;
  version: number;
  originDeviceId: string;
  lastModifiedByDeviceId: string;
  lastModified: string;
}

export interface EstablishmentResourceData {
  establishment: Establishment;
  ambulanciasTotales: number;
  ambulanciasDisponibles: number;
  camasUCITotales: number;
  camasUCIDisponibles: number;
  cilindrosOxigeno: number;
  ventiladoresMecanicos: number;
  stockStatus: ResourceStockStatus;
}

export interface CreateEstablishmentInput {
  code: string;
  name: string;
  type: EstablishmentType;
  level: EstablishmentLevel;
  department: string;
  municipality: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  emergencyPhone?: string;
  hasEmergency?: boolean;
  totalBeds: number;
  availableBeds: number;
  status?: EstablishmentStatus;
}

export interface UpdateEstablishmentInput {
  id: string;
  name?: string;
  level?: EstablishmentLevel;
  department?: string;
  municipality?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  emergencyPhone?: string;
  hasEmergency?: boolean;
  totalBeds?: number;
  availableBeds?: number;
  status?: EstablishmentStatus;
}

export interface EstablishmentFilters {
  search?: string;
  department?: string;
  type?: EstablishmentType;
  status?: EstablishmentStatus | 'ALL';
  level?: EstablishmentLevel | 'ALL';
}