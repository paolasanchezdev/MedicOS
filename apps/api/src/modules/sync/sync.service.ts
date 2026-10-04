// ============================================================================
// MedicOS - Servicio de sincronización Raspberry -> Servidor Central
// Archivo: apps/api/src/modules/sync/sync.service.ts
//
// Procesa operaciones del Transactional Outbox Pattern.
// La identidad del dispositivo ya fue validada por device-auth.middleware.ts.
// ============================================================================

import {
  BloodType,
  EmergencyRelationship,
  Prisma,
  Role,
  Sex,
  SyncOperation,
  SyncStatus,
  UserStatus,
} from '@prisma/client';

import { prisma } from '../../config/prisma.js';
import { AppError } from '../../middleware/error.middleware.js';

export interface SyncPushOperation {
  id: string;
  entity: string;
  entityId: string;
  operation: SyncOperation;
  payload: Record<string, unknown>;
}

export interface SyncPushInput {
  operations: SyncPushOperation[];
}

export interface SyncOperationResult {
  id: string;
  entity: string;
  entityId: string;
  operation: SyncOperation;
  status: 'SYNCED' | 'CONFLICT' | 'FAILED';
  message: string;
}

const SUPPORTED_ENTITIES = new Set([
  'User',
  'Patient',
  'ClinicalRecord',
  'EmergencyContact',
]);

const USER_ROLES = new Set(Object.values(Role));
const USER_STATUSES = new Set(Object.values(UserStatus));
const SEXES = new Set(Object.values(Sex));
const BLOOD_TYPES = new Set(Object.values(BloodType));
const EMERGENCY_RELATIONSHIPS = new Set(
  Object.values(EmergencyRelationship),
);

function requireString(
  value: unknown,
  field: string,
): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new AppError(
      `El campo "${field}" es obligatorio.`,
      400,
    );
  }

  return value;
}

function optionalString(
  value: unknown,
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new AppError(
      'Se recibió un campo de texto con un tipo inválido.',
      400,
    );
  }

  return value;
}

function parseDate(
  value: unknown,
  field: string,
): Date {
  const date = new Date(requireString(value, field));

  if (Number.isNaN(date.getTime())) {
    throw new AppError(
      `La fecha "${field}" no es válida.`,
      400,
    );
  }

  return date;
}

function parseOptionalDate(
  value: unknown,
): Date | null {
  if (value === undefined || value === null) {
    return null;
  }

  const date = new Date(requireString(value, 'fecha'));

  if (Number.isNaN(date.getTime())) {
    throw new AppError(
      'Se recibió una fecha inválida.',
      400,
    );
  }

  return date;
}

function parseEnum<T extends string>(
  value: unknown,
  values: Set<T>,
  field: string,
): T {
  if (
    typeof value !== 'string' ||
    !values.has(value as T)
  ) {
    throw new AppError(
      `El valor de "${field}" no es válido.`,
      400,
    );
  }

  return value as T;
}

function sanitizeSyncPayload(
  payload: Record<string, unknown>,
): Record<string, unknown> {
  return { ...payload };
}

class SyncService {
  async push(
    deviceId: string,
    input: SyncPushInput,
  ): Promise<{
    ok: boolean;
    deviceId: string;
    processed: number;
    synced: number;
    conflicts: number;
    failed: number;
    results: SyncOperationResult[];
    syncedAt: string;
  }> {
    if (!deviceId) {
      throw new AppError(
        'Dispositivo no identificado.',
        401,
      );
    }

    if (
      !input ||
      !Array.isArray(input.operations) ||
      input.operations.length === 0
    ) {
      throw new AppError(
        'Debe enviarse al menos una operación de sincronización.',
        400,
      );
    }

    if (input.operations.length > 100) {
      throw new AppError(
        'El lote de sincronización no puede superar 100 operaciones.',
        400,
      );
    }

    const results: SyncOperationResult[] = [];

    for (const operation of input.operations) {
      try {
        const result = await this.processOperation(
          deviceId,
          operation,
        );

        results.push(result);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Error desconocido al procesar la operación.';

        results.push({
          id: operation.id,
          entity: operation.entity,
          entityId: operation.entityId,
          operation: operation.operation,
          status: 'FAILED',
          message,
        });
      }
    }

    const synced = results.filter(
      (result) => result.status === 'SYNCED',
    ).length;

    const conflicts = results.filter(
      (result) => result.status === 'CONFLICT',
    ).length;

    const failed = results.filter(
      (result) => result.status === 'FAILED',
    ).length;

    const syncedAt = new Date();

    await prisma.device.update({
      where: {
        id: deviceId,
      },
      data: {
        lastSyncAt: syncedAt,
      },
    });

    return {
      ok: failed === 0 && conflicts === 0,
      deviceId,
      processed: results.length,
      synced,
      conflicts,
      failed,
      results,
      syncedAt: syncedAt.toISOString(),
    };
  }

  private async processOperation(
    deviceId: string,
    operation: SyncPushOperation,
  ): Promise<SyncOperationResult> {
    if (!operation || typeof operation !== 'object') {
      throw new AppError(
        'Operación de sincronización inválida.',
        400,
      );
    }

    const id = requireString(operation.id, 'id');
    const entity = requireString(
      operation.entity,
      'entity',
    );
    const entityId = requireString(
      operation.entityId,
      'entityId',
    );

    if (!SUPPORTED_ENTITIES.has(entity)) {
      throw new AppError(
        `La entidad "${entity}" todavía no está habilitada para sincronización.`,
        400,
      );
    }

    if (
      !Object.values(SyncOperation).includes(
        operation.operation,
      )
    ) {
      throw new AppError(
        `La operación "${String(operation.operation)}" no es válida.`,
        400,
      );
    }

    if (
      !operation.payload ||
      typeof operation.payload !== 'object' ||
      Array.isArray(operation.payload)
    ) {
      throw new AppError(
        'El payload de sincronización debe ser un objeto.',
        400,
      );
    }

    const payload = sanitizeSyncPayload(
      operation.payload,
    );

    switch (operation.operation) {
      case SyncOperation.CREATE:
        return this.createEntity(
          deviceId,
          id,
          entity,
          entityId,
          payload,
        );

      case SyncOperation.UPDATE:
        return this.updateEntity(
          deviceId,
          id,
          entity,
          entityId,
          payload,
        );

      case SyncOperation.DELETE:
        return this.deleteEntity(
          deviceId,
          id,
          entity,
          entityId,
          payload,
        );

      default:
        throw new AppError(
          'Operación de sincronización no soportada.',
          400,
        );
    }
  }

  private async createEntity(
    deviceId: string,
    operationId: string,
    entity: string,
    entityId: string,
    payload: Record<string, unknown>,
  ): Promise<SyncOperationResult> {
    return prisma.$transaction(async (tx) => {
      switch (entity) {
        case 'User':
          return this.createUser(
            tx,
            deviceId,
            operationId,
            entityId,
            payload,
          );

        case 'Patient':
          return this.createPatient(
            tx,
            deviceId,
            operationId,
            entityId,
            payload,
          );

        case 'ClinicalRecord':
          return this.createClinicalRecord(
            tx,
            deviceId,
            operationId,
            entityId,
            payload,
          );

        case 'EmergencyContact':
          return this.createEmergencyContact(
            tx,
            deviceId,
            operationId,
            entityId,
            payload,
          );

        default:
          throw new AppError(
            `Entidad "${entity}" no soportada.`,
            400,
          );
      }
    });
  }

  private async createUser(
    tx: Prisma.TransactionClient,
    _deviceId: string,
    operationId: string,
    entityId: string,
    payload: Record<string, unknown>,
  ): Promise<SyncOperationResult> {
    const existing = await tx.user.findUnique({
      where: {
        id: entityId,
      },
    });

    if (existing) {
      if (
        payload.email &&
        existing.email !== payload.email
      ) {
        return {
          id: operationId,
          entity: 'User',
          entityId,
          operation: SyncOperation.CREATE,
          status: 'CONFLICT',
          message:
            'El usuario ya existe con datos incompatibles.',
        };
      }

      return {
        id: operationId,
        entity: 'User',
        entityId,
        operation: SyncOperation.CREATE,
        status: 'SYNCED',
        message:
          'Usuario ya existente; operación considerada sincronizada.',
      };
    }

    const role = parseEnum(
      payload.role,
      USER_ROLES,
      'role',
    );

    const status = parseEnum(
      payload.status,
      USER_STATUSES,
      'status',
    );

    await tx.user.create({
      data: {
        id: entityId,
        email: requireString(
          payload.email,
          'email',
        ),
        passwordHash: requireString(
          payload.passwordHash,
          'passwordHash',
        ),
        role,
        status,
        firstName: requireString(
          payload.firstName,
          'firstName',
        ),
        lastName: requireString(
          payload.lastName,
          'lastName',
        ),
        specialty: optionalString(
          payload.specialty,
        ),
        phone: optionalString(
          payload.phone,
        ),
        createdAt: parseOptionalDate(
          payload.createdAt,
        ) ?? new Date(),
        updatedAt: parseOptionalDate(
          payload.updatedAt,
        ) ?? new Date(),
        deletedAt: parseOptionalDate(
          payload.deletedAt,
        ),
      },
    });

    return {
      id: operationId,
      entity: 'User',
      entityId,
      operation: SyncOperation.CREATE,
      status: 'SYNCED',
      message: 'Usuario sincronizado correctamente.',
    };
  }

  private async createPatient(
    tx: Prisma.TransactionClient,
    deviceId: string,
    operationId: string,
    entityId: string,
    payload: Record<string, unknown>,
  ): Promise<SyncOperationResult> {
    const existing = await tx.patient.findUnique({
      where: {
        id: entityId,
      },
    });

    if (existing) {
      if (
        existing.originDeviceId === deviceId
      ) {
        return {
          id: operationId,
          entity: 'Patient',
          entityId,
          operation: SyncOperation.CREATE,
          status: 'SYNCED',
          message:
            'Paciente ya existente; operación considerada sincronizada.',
        };
      }

      return {
        id: operationId,
        entity: 'Patient',
        entityId,
        operation: SyncOperation.CREATE,
        status: 'CONFLICT',
        message:
          'El paciente ya existe y pertenece a otro origen.',
      };
    }

    const originDeviceId = requireString(
      payload.originDeviceId,
      'originDeviceId',
    );

    if (originDeviceId !== deviceId) {
      throw new AppError(
        'El originDeviceId no coincide con el dispositivo autenticado.',
        403,
      );
    }

    const lastModifiedByDeviceId = requireString(
      payload.lastModifiedByDeviceId,
      'lastModifiedByDeviceId',
    );

    if (lastModifiedByDeviceId !== deviceId) {
      throw new AppError(
        'El lastModifiedByDeviceId no coincide con el dispositivo autenticado.',
        403,
      );
    }

    const userId =
      optionalString(payload.userId) ?? null;

    if (userId) {
      const user = await tx.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      });

      if (!user) {
        throw new AppError(
          `El usuario ${userId} debe sincronizarse antes que el paciente.`,
          409,
        );
      }
    }

    const syncStatus =
      payload.syncStatus &&
      Object.values(SyncStatus).includes(
        payload.syncStatus as SyncStatus,
      )
        ? (payload.syncStatus as SyncStatus)
        : SyncStatus.SYNCED;

    await tx.patient.create({
      data: {
        id: entityId,
        userId,
        firstName: requireString(
          payload.firstName,
          'firstName',
        ),
        lastName: requireString(
          payload.lastName,
          'lastName',
        ),
        dateOfBirth: parseDate(
          payload.dateOfBirth,
          'dateOfBirth',
        ),
        dui: optionalString(payload.dui),
        sex: parseEnum(
          payload.sex,
          SEXES,
          'sex',
        ),
        phone: optionalString(payload.phone),
        address: requireString(
          payload.address,
          'address',
        ),
        emergencyName: optionalString(
          payload.emergencyName,
        ),
        emergencyPhone: optionalString(
          payload.emergencyPhone,
        ),
        emergencyRelation: optionalString(
          payload.emergencyRelation,
        ),
        createdAt:
          parseOptionalDate(payload.createdAt) ??
          new Date(),
        updatedAt:
          parseOptionalDate(payload.updatedAt) ??
          new Date(),
        deletedAt: parseOptionalDate(
          payload.deletedAt,
        ),
        syncStatus,
        version:
          typeof payload.version === 'number'
            ? payload.version
            : 1,
        originDeviceId,
        lastModifiedByDeviceId,
        lastModified:
          parseOptionalDate(payload.lastModified) ??
          new Date(),
      },
    });

    return {
      id: operationId,
      entity: 'Patient',
      entityId,
      operation: SyncOperation.CREATE,
      status: 'SYNCED',
      message: 'Paciente sincronizado correctamente.',
    };
  }

  private async createClinicalRecord(
    tx: Prisma.TransactionClient,
    deviceId: string,
    operationId: string,
    entityId: string,
    payload: Record<string, unknown>,
  ): Promise<SyncOperationResult> {
    const existing = await tx.clinicalRecord.findUnique({
      where: {
        id: entityId,
      },
    });

    if (existing) {
      if (
        existing.originDeviceId === deviceId
      ) {
        return {
          id: operationId,
          entity: 'ClinicalRecord',
          entityId,
          operation: SyncOperation.CREATE,
          status: 'SYNCED',
          message:
            'Expediente clínico ya existente; operación considerada sincronizada.',
        };
      }

      return {
        id: operationId,
        entity: 'ClinicalRecord',
        entityId,
        operation: SyncOperation.CREATE,
        status: 'CONFLICT',
        message:
          'El expediente clínico ya existe con otro origen.',
      };
    }

    const originDeviceId = requireString(
      payload.originDeviceId,
      'originDeviceId',
    );

    if (originDeviceId !== deviceId) {
      throw new AppError(
        'El originDeviceId no coincide con el dispositivo autenticado.',
        403,
      );
    }

    const lastModifiedByDeviceId = requireString(
      payload.lastModifiedByDeviceId,
      'lastModifiedByDeviceId',
    );

    if (lastModifiedByDeviceId !== deviceId) {
      throw new AppError(
        'El lastModifiedByDeviceId no coincide con el dispositivo autenticado.',
        403,
      );
    }

    const patientId = requireString(
      payload.patientId,
      'patientId',
    );

    const patient = await tx.patient.findUnique({
      where: {
        id: patientId,
      },
      select: {
        id: true,
      },
    });

    if (!patient) {
      throw new AppError(
        `El paciente ${patientId} debe sincronizarse antes que ClinicalRecord.`,
        409,
      );
    }

    await tx.clinicalRecord.create({
      data: {
        id: entityId,
        patientId,
        bloodType: parseEnum(
          payload.bloodType,
          BLOOD_TYPES,
          'bloodType',
        ),
        familyHistory: optionalString(
          payload.familyHistory,
        ),
        surgicalHistory: optionalString(
          payload.surgicalHistory,
        ),
        observations: optionalString(
          payload.observations,
        ),
        createdAt:
          parseOptionalDate(payload.createdAt) ??
          new Date(),
        updatedAt:
          parseOptionalDate(payload.updatedAt) ??
          new Date(),
        deletedAt: parseOptionalDate(
          payload.deletedAt,
        ),
        syncStatus: SyncStatus.SYNCED,
        version:
          typeof payload.version === 'number'
            ? payload.version
            : 1,
        originDeviceId,
        lastModifiedByDeviceId,
        lastModified:
          parseOptionalDate(payload.lastModified) ??
          new Date(),
      },
    });

    return {
      id: operationId,
      entity: 'ClinicalRecord',
      entityId,
      operation: SyncOperation.CREATE,
      status: 'SYNCED',
      message:
        'Expediente clínico sincronizado correctamente.',
    };
  }

  private async createEmergencyContact(
    tx: Prisma.TransactionClient,
    deviceId: string,
    operationId: string,
    entityId: string,
    payload: Record<string, unknown>,
  ): Promise<SyncOperationResult> {
    const existing =
      await tx.emergencyContact.findUnique({
        where: {
          id: entityId,
        },
      });

    if (existing) {
      if (
        existing.originDeviceId === deviceId
      ) {
        return {
          id: operationId,
          entity: 'EmergencyContact',
          entityId,
          operation: SyncOperation.CREATE,
          status: 'SYNCED',
          message:
            'Contacto de emergencia ya existente; operación considerada sincronizada.',
        };
      }

      return {
        id: operationId,
        entity: 'EmergencyContact',
        entityId,
        operation: SyncOperation.CREATE,
        status: 'CONFLICT',
        message:
          'El contacto de emergencia ya existe con otro origen.',
      };
    }

    const originDeviceId = requireString(
      payload.originDeviceId,
      'originDeviceId',
    );

    if (originDeviceId !== deviceId) {
      throw new AppError(
        'El originDeviceId no coincide con el dispositivo autenticado.',
        403,
      );
    }

    const lastModifiedByDeviceId = requireString(
      payload.lastModifiedByDeviceId,
      'lastModifiedByDeviceId',
    );

    if (lastModifiedByDeviceId !== deviceId) {
      throw new AppError(
        'El lastModifiedByDeviceId no coincide con el dispositivo autenticado.',
        403,
      );
    }

    const patientId = requireString(
      payload.patientId,
      'patientId',
    );

    const patient = await tx.patient.findUnique({
      where: {
        id: patientId,
      },
      select: {
        id: true,
      },
    });

    if (!patient) {
      throw new AppError(
        `El paciente ${patientId} debe sincronizarse antes que EmergencyContact.`,
        409,
      );
    }

    const relationship = parseEnum(
      payload.relationship,
      EMERGENCY_RELATIONSHIPS,
      'relationship',
    );

    await tx.emergencyContact.create({
      data: {
        id: entityId,
        patientId,
        firstName: requireString(
          payload.firstName,
          'firstName',
        ),
        lastName: requireString(
          payload.lastName,
          'lastName',
        ),
        relationship,
        customRelation: optionalString(
          payload.customRelation,
        ),
        primaryPhone: requireString(
          payload.primaryPhone,
          'primaryPhone',
        ),
        secondaryPhone: optionalString(
          payload.secondaryPhone,
        ),
        email: optionalString(payload.email),
        isPrimary:
          typeof payload.isPrimary === 'boolean'
            ? payload.isPrimary
            : false,
        isActive:
          typeof payload.isActive === 'boolean'
            ? payload.isActive
            : true,
        createdAt:
          parseOptionalDate(payload.createdAt) ??
          new Date(),
        updatedAt:
          parseOptionalDate(payload.updatedAt) ??
          new Date(),
        deletedAt: parseOptionalDate(
          payload.deletedAt,
        ),
        syncStatus: SyncStatus.SYNCED,
        version:
          typeof payload.version === 'number'
            ? payload.version
            : 1,
        originDeviceId,
        lastModifiedByDeviceId,
        lastModified:
          parseOptionalDate(payload.lastModified) ??
          new Date(),
      },
    });

    return {
      id: operationId,
      entity: 'EmergencyContact',
      entityId,
      operation: SyncOperation.CREATE,
      status: 'SYNCED',
      message:
        'Contacto de emergencia sincronizado correctamente.',
    };
  }

  private async updateEntity(
    deviceId: string,
    operationId: string,
    entity: string,
    entityId: string,
    payload: Record<string, unknown>,
  ): Promise<SyncOperationResult> {
    return prisma.$transaction(async (tx) => {
      switch (entity) {
        case 'User':
          await tx.user.update({
            where: { id: entityId },
            data: this.userUpdateData(payload),
          });
          break;

        case 'Patient':
          await tx.patient.update({
            where: { id: entityId },
            data: this.patientUpdateData(
              deviceId,
              payload,
            ),
          });
          break;

        case 'ClinicalRecord':
          await tx.clinicalRecord.update({
            where: { id: entityId },
            data: this.clinicalRecordUpdateData(
              deviceId,
              payload,
            ),
          });
          break;

        case 'EmergencyContact':
          await tx.emergencyContact.update({
            where: { id: entityId },
            data: this.emergencyContactUpdateData(
              deviceId,
              payload,
            ),
          });
          break;

        default:
          throw new AppError(
            `Entidad "${entity}" no soportada.`,
            400,
          );
      }

      return {
        id: operationId,
        entity,
        entityId,
        operation: SyncOperation.UPDATE,
        status: 'SYNCED',
        message: `${entity} actualizado correctamente.`,
      };
    });
  }

  private async deleteEntity(
    deviceId: string,
    operationId: string,
    entity: string,
    entityId: string,
    payload: Record<string, unknown>,
  ): Promise<SyncOperationResult> {
    const deletedAt =
      parseOptionalDate(payload.deletedAt) ??
      new Date();

    return prisma.$transaction(async (tx) => {
      switch (entity) {
        case 'User':
          await tx.user.update({
            where: { id: entityId },
            data: {
              deletedAt,
              status: UserStatus.INACTIVE,
            },
          });
          break;

        case 'Patient':
          await tx.patient.update({
            where: { id: entityId },
            data: {
              deletedAt,
              syncStatus: SyncStatus.SYNCED,
              lastModifiedByDeviceId: deviceId,
              lastModified: deletedAt,
            },
          });
          break;

        case 'ClinicalRecord':
          await tx.clinicalRecord.update({
            where: { id: entityId },
            data: {
              deletedAt,
              syncStatus: SyncStatus.SYNCED,
              lastModifiedByDeviceId: deviceId,
              lastModified: deletedAt,
            },
          });
          break;

        case 'EmergencyContact':
          await tx.emergencyContact.update({
            where: { id: entityId },
            data: {
              deletedAt,
              syncStatus: SyncStatus.SYNCED,
              lastModifiedByDeviceId: deviceId,
              lastModified: deletedAt,
            },
          });
          break;

        default:
          throw new AppError(
            `Entidad "${entity}" no soportada.`,
            400,
          );
      }

      return {
        id: operationId,
        entity,
        entityId,
        operation: SyncOperation.DELETE,
        status: 'SYNCED',
        message: `${entity} eliminado lógicamente correctamente.`,
      };
    });
  }

  private userUpdateData(
    payload: Record<string, unknown>,
  ): Prisma.UserUpdateInput {
    const data: Prisma.UserUpdateInput = {};

    if (payload.email !== undefined) {
      data.email = requireString(
        payload.email,
        'email',
      );
    }

    if (payload.passwordHash !== undefined) {
      data.passwordHash = requireString(
        payload.passwordHash,
        'passwordHash',
      );
    }

    if (payload.firstName !== undefined) {
      data.firstName = requireString(
        payload.firstName,
        'firstName',
      );
    }

    if (payload.lastName !== undefined) {
      data.lastName = requireString(
        payload.lastName,
        'lastName',
      );
    }

    if (payload.phone !== undefined) {
      data.phone = optionalString(payload.phone);
    }

    if (payload.specialty !== undefined) {
      data.specialty = optionalString(
        payload.specialty,
      );
    }

    if (payload.role !== undefined) {
      data.role = parseEnum(
        payload.role,
        USER_ROLES,
        'role',
      );
    }

    if (payload.status !== undefined) {
      data.status = parseEnum(
        payload.status,
        USER_STATUSES,
        'status',
      );
    }

    if (payload.deletedAt !== undefined) {
      data.deletedAt = parseOptionalDate(
        payload.deletedAt,
      );
    }

    return data;
  }

  private patientUpdateData(
    deviceId: string,
    payload: Record<string, unknown>,
  ): Prisma.PatientUpdateInput {
    const data: Prisma.PatientUpdateInput = {
      lastModifiedByDeviceId: deviceId,
      syncStatus: SyncStatus.SYNCED,
    };

    const fields = [
      'firstName',
      'lastName',
      'phone',
      'address',
      'emergencyName',
      'emergencyPhone',
      'emergencyRelation',
      'dui',
    ] as const;

    for (const field of fields) {
      if (payload[field] === undefined) {
        continue;
      }

      const value = payload[field];

      if (value === null) {
        if (
          field === 'phone' ||
          field === 'emergencyName' ||
          field === 'emergencyPhone' ||
          field === 'emergencyRelation' ||
          field === 'dui'
        ) {
          data[field] = null;
        }

        continue;
      }

      if (typeof value !== 'string') {
        throw new AppError(
          `El campo "${field}" debe ser texto o null.`,
          400,
        );
      }

      data[field] = value;
    }

    if (payload.dateOfBirth !== undefined) {
      data.dateOfBirth = parseDate(
        payload.dateOfBirth,
        'dateOfBirth',
      );
    }

    if (payload.deletedAt !== undefined) {
      data.deletedAt = parseOptionalDate(
        payload.deletedAt,
      );
    }

    if (typeof payload.version === 'number') {
      data.version = payload.version;
    }

    if (payload.lastModified !== undefined) {
      data.lastModified = parseDate(
        payload.lastModified,
        'lastModified',
      );
    }

    return data;
  }

  private clinicalRecordUpdateData(
    deviceId: string,
    payload: Record<string, unknown>,
  ): Prisma.ClinicalRecordUpdateInput {
    const data: Prisma.ClinicalRecordUpdateInput = {
      lastModifiedByDeviceId: deviceId,
      syncStatus: SyncStatus.SYNCED,
    };

    const fields = [
      'familyHistory',
      'surgicalHistory',
      'observations',
    ] as const;

    for (const field of fields) {
      if (payload[field] !== undefined) {
        data[field] = optionalString(payload[field]);
      }
    }

    if (payload.deletedAt !== undefined) {
      data.deletedAt = parseOptionalDate(
        payload.deletedAt,
      );
    }

    if (typeof payload.version === 'number') {
      data.version = payload.version;
    }

    if (payload.lastModified !== undefined) {
      data.lastModified = parseDate(
        payload.lastModified,
        'lastModified',
      );
    }

    if (payload.bloodType !== undefined) {
      data.bloodType = parseEnum(
        payload.bloodType,
        BLOOD_TYPES,
        'bloodType',
      );
    }

    return data;
  }

  private emergencyContactUpdateData(
    deviceId: string,
    payload: Record<string, unknown>,
  ): Prisma.EmergencyContactUpdateInput {
    const data: Prisma.EmergencyContactUpdateInput = {
      lastModifiedByDeviceId: deviceId,
      syncStatus: SyncStatus.SYNCED,
    };

    const stringFields = [
      'firstName',
      'lastName',
      'customRelation',
      'primaryPhone',
      'secondaryPhone',
      'email',
    ] as const;

    for (const field of stringFields) {
      if (payload[field] === undefined) {
        continue;
      }

      const value = payload[field];

      if (value === null) {
        if (
          field === 'customRelation' ||
          field === 'secondaryPhone' ||
          field === 'email'
        ) {
          data[field] = null;
        }

        continue;
      }

      if (typeof value !== 'string') {
        throw new AppError(
          `El campo "${field}" debe ser texto o null.`,
          400,
        );
      }

      data[field] = value;
    }

    if (payload.relationship !== undefined) {
      data.relationship = parseEnum(
        payload.relationship,
        EMERGENCY_RELATIONSHIPS,
        'relationship',
      );
    }

    if (typeof payload.isPrimary === 'boolean') {
      data.isPrimary = payload.isPrimary;
    }

    if (typeof payload.isActive === 'boolean') {
      data.isActive = payload.isActive;
    }

    if (payload.deletedAt !== undefined) {
      data.deletedAt = parseOptionalDate(
        payload.deletedAt,
      );
    }

    if (typeof payload.version === 'number') {
      data.version = payload.version;
    }

    if (payload.lastModified !== undefined) {
      data.lastModified = parseDate(
        payload.lastModified,
        'lastModified',
      );
    }

    return data;
  }
}

export const syncService = new SyncService();
