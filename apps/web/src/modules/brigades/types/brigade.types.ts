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