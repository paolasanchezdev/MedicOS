import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { BrigadeContext } from './BrigadeContext';
import type { 
  ActiveBrigade, 
  ShiftMetrics, 
  RecentPatient, 
  SystemSyncState, 
  SyncDetails 
} from '../types/brigade.types';
import { 
  mockBrigadeInfo, 
  mockMetrics, 
  mockRecentPatients, 
  mockSyncDetails 
} from '../data/mock-brigade';

export interface ExtendedBrigadeContextType {
  brigade: ActiveBrigade;
  metrics: ShiftMetrics;
  recentPatients: RecentPatient[];
  syncStatus: SystemSyncState;
  syncDetails: SyncDetails;
  updateSyncStatus: (status: SystemSyncState) => void;
  triggerSync: () => void;
  isSyncing: boolean;
}

export const BrigadeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [brigade] = useState<ActiveBrigade>(mockBrigadeInfo);
  const [metrics] = useState<ShiftMetrics>(mockMetrics);
  const [recentPatients] = useState<RecentPatient[]>(mockRecentPatients);
  const [syncStatus, setSyncStatus] = useState<SystemSyncState>('SYNCED');
  const [syncDetails, setSyncDetails] = useState<SyncDetails>(mockSyncDetails);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const updateSyncStatus = (status: SystemSyncState) => {
    setSyncStatus(status);
  };

  const triggerSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncStatus('SYNCING');

    setTimeout(() => {
      setSyncDetails((prev) => ({
        ...prev,
        syncedRecords: prev.localRecords,
        pendingRecords: 0,
        lastSync: 'Ahora mismo',
      }));
      setSyncStatus('SYNCED');
      setIsSyncing(false);
    }, 1800);
  };

  const contextValue: ExtendedBrigadeContextType = {
    brigade,
    metrics,
    recentPatients,
    syncStatus,
    syncDetails,
    updateSyncStatus,
    triggerSync,
    isSyncing,
  };

  return (
    <BrigadeContext.Provider value={contextValue as unknown as ExtendedBrigadeContextType}>
      {children}
    </BrigadeContext.Provider>
  );
};