import type { ActiveBrigade, ShiftMetrics, RecentPatient, SyncDetails } from '../types/brigade.types';

export const mockBrigadeInfo: ActiveBrigade = {
  id: 'brg-001',
  name: 'Brigada San Salvador Norte',
  community: 'Caserío El Rosario',
  municipality: 'Apopa',
  department: 'San Salvador',
  date: '2026-07-29',
  schedule: '08:00 AM - 04:00 PM',
  status: 'ACTIVE',
  team: {
    doctorsCount: 3,
    brigadistsCount: 6,
    coordinatorsCount: 1,
  },
};

export const mockMetrics: ShiftMetrics = {
  totalAttended: 42,
  newPatients: 15,
  consultationsRegistered: 38,
  followUpPatients: 27,
};

export const mockRecentPatients: RecentPatient[] = [
  {
    id: 'p-01',
    fullName: 'María Carmen López',
    age: 45,
    gender: 'Femenino',
    visitTime: '09:15 AM',
    careType: 'General',
    status: 'COMPLETED',
  },
];

export const mockSyncDetails: SyncDetails = {
  lastSync: 'Hoy, 10:30 AM',
  localRecords: 48,
  syncedRecords: 42,
  pendingRecords: 6,
};