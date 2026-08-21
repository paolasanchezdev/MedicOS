// apps/web/src/modules/brigades/types/brigade.types.ts

// --- Tipos de Contexto Operativo de Campo (Brigadista) ---
export type SystemSyncState = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNCED' | 'ERROR';
export type PatientAttentionStatus = 'IN_WAITING' | 'IN_ATTENTION' | 'COMPLETED';

export interface ShiftMetrics {
  totalAttended: number;
  newPatients: number;
  consultationsRegistered: number;
  followUpPatients: number;
}

export interface ActiveBrigade {
  id: string;
  name: string;
  community: string;
  municipality: string;
  department: string;
  date: string;
  schedule: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'FINISHED';
  team: {
    doctorsCount: number;
    brigadistsCount: number;
    coordinatorsCount: number;
  };
}

export interface RecentPatient {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  visitTime: string;
  careType: string;
  status: PatientAttentionStatus;
}

export interface SyncDetails {
  lastSync: string;
  localRecords: number;
  syncedRecords: number;
  pendingRecords: number;
}

export interface BrigadeContextType {
  brigade: ActiveBrigade;
  metrics: ShiftMetrics;
  recentPatients: RecentPatient[];
  syncStatus: SystemSyncState;
  syncDetails: SyncDetails;
  updateSyncStatus: (status: SystemSyncState) => void;
  triggerSync: () => void;
  isSyncing: boolean;
}

// --- Tipos de Administración y Base de Datos Oficial (Admin Portal) ---
export type BrigadeStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface BrigadeLeader {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
}

export interface BrigadeMemberItem {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
  joinedAt: string;
}

export interface BrigadeItem {
  id: string;
  name: string;
  department: string;
  municipality: string;
  latitude?: number | null;
  longitude?: number | null;
  status: BrigadeStatus;
  startDate: string;
  endDate?: string | null;
  leaderId?: string | null;
  leader?: BrigadeLeader | null;
  membersCount: number;
  members: BrigadeMemberItem[];
  totalConsultations: number;
  totalWorkSessions: number;
  totalSuppliesAssigned: number;
  totalEquipmentAssigned: number;
  totalDevicesAssigned: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrigadeDto {
  name: string;
  department: string;
  municipality: string;
  latitude?: number | null;
  longitude?: number | null;
  startDate: string;
  endDate?: string | null;
  leaderId?: string | null;
  memberIds?: string[];
}

export interface UpdateBrigadeDto {
  name?: string;
  department?: string;
  municipality?: string;
  latitude?: number | null;
  longitude?: number | null;
  startDate?: string;
  endDate?: string | null;
  leaderId?: string | null;
  status?: BrigadeStatus;
}

export interface EligiblePersonnel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: string;
  status: string;
}

export interface BrigadeFiltersState {
  search: string;
  department: string;
  status: BrigadeStatus | 'ALL';
}