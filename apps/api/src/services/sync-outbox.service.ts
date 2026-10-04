import { Prisma, QueuePriority, SyncOperation, SyncStatus } from '@prisma/client';
import { prisma } from '../config/prisma.js';

const DEVICE_ID = process.env.MEDICOS_DEVICE_ID || 'SERVER_CENTRAL';

export interface EnqueueSyncOperationInput {
  entity: string;
  entityId: string;
  operation: SyncOperation;
  payload: Prisma.InputJsonValue;
  priority?: QueuePriority;
  deviceId?: string | null;
}

export interface EnqueueSyncOperationTxInput
  extends EnqueueSyncOperationInput {
  tx: Prisma.TransactionClient;
}

class SyncOutboxService {
  getDeviceId(): string {
    return DEVICE_ID;
  }

  isStation(): boolean {
    return process.env.MEDICOS_SYNC_ROLE === 'station';
  }

  async enqueue(
    input: EnqueueSyncOperationInput,
  ) {
    return prisma.syncQueue.create({
      data: {
        deviceId: input.deviceId ?? DEVICE_ID,
        entity: input.entity,
        entityId: input.entityId,
        operation: input.operation,
        payload: input.payload,
        priority: input.priority ?? QueuePriority.MEDIUM,
      },
    });
  }

  async enqueueInTransaction(
    input: EnqueueSyncOperationTxInput,
  ) {
    return input.tx.syncQueue.create({
      data: {
        deviceId: input.deviceId ?? DEVICE_ID,
        entity: input.entity,
        entityId: input.entityId,
        operation: input.operation,
        payload: input.payload,
        priority: input.priority ?? QueuePriority.MEDIUM,
      },
    });
  }

  async enqueueEntityInTransaction(
    tx: Prisma.TransactionClient,
    entity: string,
    entityId: string,
    operation: SyncOperation,
    payload: Prisma.InputJsonValue,
    priority: QueuePriority = QueuePriority.MEDIUM,
    deviceId?: string | null,
  ) {
    return tx.syncQueue.create({
      data: {
        deviceId: deviceId ?? DEVICE_ID,
        entity,
        entityId,
        operation,
        payload,
        priority,
      },
    });
  }

  shouldQueue(syncStatus: SyncStatus): boolean {
    return this.isStation() && syncStatus !== SyncStatus.SYNCED;
  }
}

export const syncOutboxService = new SyncOutboxService();
