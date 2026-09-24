// =========================================================================
// ARCHIVO: apps/api/src/modules/patients/patients.service.ts
// DESCRIPCIÓN: Servicio de gestión de pacientes con normalización de DUI,
//              administración de Contactos de Emergencia y resolución segura
//              y auditada de Carnet QR en base de datos PostgreSQL.
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import { AppError } from '../../middleware/error.middleware.js';
import {
  BloodType,
  Role,
  UserStatus,
  SyncStatus,
  Prisma,
  EmergencyRelationship,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface CreatePatientDTO {
  firstName: string;
  lastName: string;
  dateOfBirth: string | Date;
  dui?: string | null;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  email: string;
  password: string;
  phone?: string | null;
  address: string;
  municipality?: string | null;
  department?: string | null;
  bloodType?: BloodType | string;
  allergies?: string | null;
  chronicDiseases?: string | null;
  disabilities?: string | null;
  familyHistory?: string | null;
  surgicalHistory?: string | null;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  emergencyRelation?: string | null;
  originDeviceId?: string;
}

export interface UpdatePatientProfileDTO {
  dateOfBirth: string | Date;
  dui?: string | null;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string | null;
  address: string;
  municipality?: string | null;
  department?: string | null;
  bloodType?: BloodType | string;
  allergies?: string | null;
  chronicDiseases?: string | null;
  medication?: string | null;
  observations?: string | null;
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  emergencyRelation?: string | null;
}

export interface CreateVitalSignsDTO {
  patientId?: string;
  consultationId?: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  oxygenSat: number;
  weight?: number | null;
  height?: number | null;
  originDeviceId?: string;
}

export interface CreateEmergencyContactDTO {
  firstName: string;
  lastName: string;
  relationship?: EmergencyRelationship;
  customRelation?: string | null;
  primaryPhone: string;
  secondaryPhone?: string | null;
  email?: string | null;
  isPrimary?: boolean;
  isActive?: boolean;
  originDeviceId?: string;
}

export interface UpdateEmergencyContactDTO {
  firstName?: string;
  lastName?: string;
  relationship?: EmergencyRelationship;
  customRelation?: string | null;
  primaryPhone?: string;
  secondaryPhone?: string | null;
  email?: string | null;
  isPrimary?: boolean;
  isActive?: boolean;
  originDeviceId?: string;
}

export interface ResolvePatientQROptions {
  qrPayload: string;
  clientIp?: string;
  scannerUser: {
    id: string;
    role: string | Role;
    firstName?: string;
    lastName?: string;
  };
}

/**
 * Normaliza y valida un número de DUI al formato oficial salvadoreño ########-#
 */
function normalizarDui(rawDui?: string | null): string | null {
  if (!rawDui) return null;
  const digits = rawDui.replace(/\D/g, '');
  if (digits.length === 9) {
    return `${digits.slice(0, 8)}-${digits.slice(8)}`;
  }
  if (rawDui.trim().length > 0 && /^\d{8}-\d{1}$/.test(rawDui.trim())) {
    return rawDui.trim();
  }
  return null;
}

/**
 * Mapea cualquier entrada de grupo sanguíneo al Enum BloodType estricto de Prisma.
 */
function normalizarBloodType(raw?: string | null): BloodType {
  if (!raw) return BloodType.UNKNOWN;
  const clean = raw.trim().toUpperCase().replace(/[\s\(\)]/g, '_');

  const map: Record<string, BloodType> = {
    O_POSITIVE: BloodType.O_POSITIVE,
    'O+': BloodType.O_POSITIVE,
    OPOSITIVE: BloodType.O_POSITIVE,
    O_POSITIVO: BloodType.O_POSITIVE,

    O_NEGATIVE: BloodType.O_NEGATIVE,
    'O-': BloodType.O_NEGATIVE,
    ONEGATIVE: BloodType.O_NEGATIVE,
    O_NEGATIVO: BloodType.O_NEGATIVE,

    A_POSITIVE: BloodType.A_POSITIVE,
    'A+': BloodType.A_POSITIVE,
    APOSITIVE: BloodType.A_POSITIVE,
    A_POSITIVO: BloodType.A_POSITIVE,

    A_NEGATIVE: BloodType.A_NEGATIVE,
    'A-': BloodType.A_NEGATIVE,
    ANEGATIVE: BloodType.A_NEGATIVE,
    A_NEGATIVO: BloodType.A_NEGATIVE,

    B_POSITIVE: BloodType.B_POSITIVE,
    'B+': BloodType.B_POSITIVE,
    BPOSITIVE: BloodType.B_POSITIVE,
    B_POSITIVO: BloodType.B_POSITIVE,

    B_NEGATIVE: BloodType.B_NEGATIVE,
    'B-': BloodType.B_NEGATIVE,
    BNEGATIVE: BloodType.B_NEGATIVE,
    B_NEGATIVO: BloodType.B_NEGATIVE,

    AB_POSITIVE: BloodType.AB_POSITIVE,
    'AB+': BloodType.AB_POSITIVE,
    ABPOSITIVE: BloodType.AB_POSITIVE,
    AB_POSITIVO: BloodType.AB_POSITIVE,

    AB_NEGATIVE: BloodType.AB_NEGATIVE,
    'AB-': BloodType.AB_NEGATIVE,
    ABNEGATIVE: BloodType.AB_NEGATIVE,
    AB_NEGATIVO: BloodType.AB_NEGATIVE,

    UNKNOWN: BloodType.UNKNOWN,
  };

  return map[clean] || BloodType.UNKNOWN;
}

function normalizarTexto(texto: string | null | undefined): string {
  if (!texto) return '';
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function normalizarAlfanumerico(texto: string | null | undefined): string {
  if (!texto) return '';
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Traduce el enum a formato legible en español para el expediente y carnet del paciente
 */
function formatRelationLabel(rel: EmergencyRelationship, custom?: string | null): string {
  if (rel === EmergencyRelationship.OTRO && custom?.trim()) {
    return custom.trim();
  }
  const map: Record<EmergencyRelationship, string> = {
    MADRE: 'Madre',
    PADRE: 'Padre',
    HIJO_A: 'Hijo/a',
    HERMANO_A: 'Hermano/a',
    CONYUGE: 'Cónyuge',
    PAREJA: 'Pareja',
    ABUELO_A: 'Abuelo/a',
    TUTOR_A: 'Tutor/a',
    FAMILIAR: 'Familiar',
    AMIGO_A: 'Amigo/a',
    OTRO: 'Otro',
  };
  return map[rel] || 'Familiar';
}

/**
 * Interpreta relaciones textuales heredadas (ej. "Madre", "Esposo", "Hermana") y las mapea al enum
 */
function parseLegacyRelationship(relationStr?: string | null): {
  relationship: EmergencyRelationship;
  customRelation: string | null;
} {
  if (!relationStr || !relationStr.trim()) {
    return { relationship: EmergencyRelationship.FAMILIAR, customRelation: null };
  }
  const clean = normalizarTexto(relationStr);
  if (clean.includes('madr') || clean.includes('mama')) {
    return { relationship: EmergencyRelationship.MADRE, customRelation: null };
  }
  if (clean.includes('padr') || clean.includes('papa')) {
    return { relationship: EmergencyRelationship.PADRE, customRelation: null };
  }
  if (clean.includes('hij')) {
    return { relationship: EmergencyRelationship.HIJO_A, customRelation: null };
  }
  if (clean.includes('herman')) {
    return { relationship: EmergencyRelationship.HERMANO_A, customRelation: null };
  }
  if (clean.includes('conyug') || clean.includes('espos')) {
    return { relationship: EmergencyRelationship.CONYUGE, customRelation: null };
  }
  if (clean.includes('parej')) {
    return { relationship: EmergencyRelationship.PAREJA, customRelation: null };
  }
  if (clean.includes('abuel')) {
    return { relationship: EmergencyRelationship.ABUELO_A, customRelation: null };
  }
  if (clean.includes('tutor')) {
    return { relationship: EmergencyRelationship.TUTOR_A, customRelation: null };
  }
  if (clean.includes('amig')) {
    return { relationship: EmergencyRelationship.AMIGO_A, customRelation: null };
  }
  if (clean.includes('familiar')) {
    return { relationship: EmergencyRelationship.FAMILIAR, customRelation: null };
  }
  return { relationship: EmergencyRelationship.OTRO, customRelation: relationStr.trim() };
}

export class PatientsService extends BaseService {
  private async resolvePatientId(identifier?: string): Promise<string | null> {
    if (!identifier) return null;

    const patientById = await prisma.patient.findFirst({
      where: { 
        id: identifier, 
        deletedAt: null,
      },
    });
    if (patientById) return patientById.id;

    const patientByUserId = await prisma.patient.findFirst({
      where: { 
        userId: identifier, 
        deletedAt: null,
      },
    });
    if (patientByUserId) return patientByUserId.id;

    const user = await prisma.user.findFirst({
      where: { id: identifier, deletedAt: null },
    });
    if (!user) return null;

    const patientByUser = await prisma.patient.findFirst({
      where: {
        deletedAt: null,
        OR: [
          { userId: user.id },
          ...(user.phone ? [{ phone: user.phone }] : []),
          {
            firstName: { equals: user.firstName, mode: 'insensitive' },
            lastName: { equals: user.lastName, mode: 'insensitive' },
          },
        ],
      },
    });

    return patientByUser ? patientByUser.id : null;
  }

  async checkDuiAvailability(dui: string): Promise<{ available: boolean; patientName?: string }> {
    const cleanDui = normalizarDui(dui);
    if (!cleanDui) return { available: true };

    const existing = await prisma.patient.findFirst({
      where: {
        dui: cleanDui,
        deletedAt: null,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (existing) {
      return {
        available: false,
        patientName: `${existing.firstName} ${existing.lastName}`,
      };
    }

    return { available: true };
  }

  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return { available: true };

    const existing = await prisma.user.findFirst({
      where: {
        email: cleanEmail,
        deletedAt: null,
      },
      select: { id: true },
    });

    return { available: !existing };
  }

  async createPatient(data: CreatePatientDTO) {
    const deviceId = data.originDeviceId || 'SERVER_CENTRAL';
    const emailNormalizado = data.email.trim().toLowerCase();
    const cleanDui = normalizarDui(data.dui);
    const validBloodType = normalizarBloodType(data.bloodType as string);

    const emailExistente = await prisma.user.findFirst({
      where: { email: emailNormalizado, deletedAt: null },
    });
    if (emailExistente) {
      throw new Error('El correo electrónico ya se encuentra registrado en MedicOS.');
    }

    if (cleanDui) {
      const duiExistente = await prisma.patient.findFirst({
        where: { dui: cleanDui, deletedAt: null },
      });
      if (duiExistente) {
        throw new Error(`El DUI ${cleanDui} ya está asociado al paciente ${duiExistente.firstName} ${duiExistente.lastName}.`);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const partesDireccion = [
      data.address.trim(),
      data.municipality?.trim(),
      data.department?.trim(),
    ].filter(Boolean);
    const direccionCompleta = partesDireccion.join(', ');

    const healthMetadata = JSON.stringify({
      allergies: data.allergies?.trim() || null,
      chronicDiseases: data.chronicDiseases?.trim() || null,
      disabilities: data.disabilities?.trim() || null,
    });

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: emailNormalizado,
          passwordHash,
          role: Role.PATIENT,
          status: UserStatus.ACTIVE,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          phone: data.phone?.trim() || null,
        },
      });

      const patient = await tx.patient.create({
        data: {
          userId: user.id,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          dateOfBirth: new Date(data.dateOfBirth),
          dui: cleanDui,
          sex: data.sex || 'OTHER',
          phone: data.phone?.trim() || null,
          address: direccionCompleta,
          emergencyName: data.emergencyName?.trim() || null,
          emergencyPhone: data.emergencyPhone?.trim() || null,
          emergencyRelation: data.emergencyRelation?.trim() || null,
          syncStatus: SyncStatus.SYNCED,
          version: 1,
          originDeviceId: deviceId,
          lastModifiedByDeviceId: deviceId,
        },
      });

      const clinicalRecord = await tx.clinicalRecord.create({
        data: {
          patientId: patient.id,
          bloodType: validBloodType,
          familyHistory: data.familyHistory?.trim() || null,
          surgicalHistory: data.surgicalHistory?.trim() || null,
          observations: healthMetadata,
          syncStatus: SyncStatus.SYNCED,
          version: 1,
          originDeviceId: deviceId,
          lastModifiedByDeviceId: deviceId,
        },
      });

      if (data.emergencyName?.trim() && data.emergencyPhone?.trim()) {
        const partsName = data.emergencyName.trim().split(/\s+/);
        const contactFirst = partsName[0] || 'Contacto';
        const contactLast = partsName.slice(1).join(' ') || 'Emergencia';
        const { relationship, customRelation } = parseLegacyRelationship(data.emergencyRelation);

        await tx.emergencyContact.create({
          data: {
            patientId: patient.id,
            firstName: contactFirst,
            lastName: contactLast,
            relationship,
            customRelation,
            primaryPhone: data.emergencyPhone.trim(),
            isPrimary: true,
            isActive: true,
            syncStatus: SyncStatus.SYNCED,
            version: 1,
            originDeviceId: deviceId,
            lastModifiedByDeviceId: deviceId,
          },
        });
      }

      return {
        id: patient.id,
        dui: patient.dui,
        firstName: patient.firstName,
        lastName: patient.lastName,
        fullName: `${patient.firstName} ${patient.lastName}`,
        dateOfBirth: patient.dateOfBirth.toISOString(),
        sex: patient.sex,
        phone: patient.phone,
        address: patient.address,
        emergencyName: patient.emergencyName,
        emergencyPhone: patient.emergencyPhone,
        emergencyRelation: patient.emergencyRelation,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        clinicalRecord: {
          id: clinicalRecord.id,
          bloodType: clinicalRecord.bloodType,
          observations: clinicalRecord.observations,
        },
        createdAt: patient.createdAt.toISOString(),
      };
    });
  }

  async updatePatientProfile(identifier: string, data: UpdatePatientProfileDTO) {
    let resolvedId = await this.resolvePatientId(identifier);
    const userObj = await prisma.user.findFirst({
      where: { id: identifier, deletedAt: null },
    });

    if (!resolvedId && userObj) {
      const existingByUserId = await prisma.patient.findFirst({
        where: { userId: userObj.id, deletedAt: null },
      });
      if (existingByUserId) {
        resolvedId = existingByUserId.id;
      } else if (userObj.phone) {
        const orphanByPhone = await prisma.patient.findFirst({
          where: { phone: userObj.phone, userId: null, deletedAt: null },
        });
        if (orphanByPhone) {
          resolvedId = orphanByPhone.id;
          await prisma.patient.update({
            where: { id: orphanByPhone.id },
            data: { userId: userObj.id },
          });
        }
      }
    }

    const cleanDui = normalizarDui(data.dui);
    const validBloodType = normalizarBloodType(data.bloodType as string);

    if (cleanDui) {
      const duiExistente = await prisma.patient.findFirst({
        where: {
          dui: cleanDui,
          ...(resolvedId ? { id: { not: resolvedId } } : {}),
          deletedAt: null,
        },
      });
      if (duiExistente) {
        throw new Error(`El DUI ${cleanDui} ya está asociado a otro expediente.`);
      }
    }

    const partesDireccion = [
      data.address.trim(),
      data.municipality?.trim(),
      data.department?.trim(),
    ].filter(Boolean);
    const direccionCompleta = partesDireccion.join(', ');

    const healthObservations = JSON.stringify({
      allergies: data.allergies?.trim() || 'Ninguna reportada',
      chronicDiseases: data.chronicDiseases?.trim() || 'Ninguna registrada',
      medication: data.medication?.trim() || 'Ninguna activa',
      notes: data.observations?.trim() || 'Sin observaciones adicionales',
    });

    // Caso 1: Aprovisionamiento inicial del paciente
    if (!resolvedId) {
      if (!userObj) {
        throw new Error('No se encontró un usuario ni expediente asociado a esta cuenta.');
      }

      return prisma.$transaction(async (tx) => {
        const newPatient = await tx.patient.create({
          data: {
            userId: userObj.id,
            firstName: userObj.firstName,
            lastName: userObj.lastName,
            dateOfBirth: new Date(data.dateOfBirth),
            dui: cleanDui,
            sex: data.sex || 'OTHER',
            phone: data.phone?.trim() || userObj.phone || null,
            address: direccionCompleta,
            emergencyName: data.emergencyName?.trim() || null,
            emergencyPhone: data.emergencyPhone?.trim() || null,
            emergencyRelation: data.emergencyRelation?.trim() || null,
            syncStatus: SyncStatus.SYNCED,
            version: 1,
            originDeviceId: 'WEB_PORTAL',
            lastModifiedByDeviceId: 'WEB_PORTAL',
          },
        });

        if (data.phone?.trim() && data.phone.trim() !== userObj.phone) {
          await tx.user.update({
            where: { id: userObj.id },
            data: { phone: data.phone.trim() },
          });
        }

        await tx.clinicalRecord.create({
          data: {
            patientId: newPatient.id,
            bloodType: validBloodType,
            observations: healthObservations,
            syncStatus: SyncStatus.SYNCED,
            version: 1,
            originDeviceId: 'WEB_PORTAL',
            lastModifiedByDeviceId: 'WEB_PORTAL',
          },
        });

        if (data.emergencyName?.trim() && data.emergencyPhone?.trim()) {
          const partsName = data.emergencyName.trim().split(/\s+/);
          const { relationship, customRelation } = parseLegacyRelationship(data.emergencyRelation);
          await tx.emergencyContact.create({
            data: {
              patientId: newPatient.id,
              firstName: partsName[0] || 'Contacto',
              lastName: partsName.slice(1).join(' ') || 'Emergencia',
              relationship,
              customRelation,
              primaryPhone: data.emergencyPhone.trim(),
              isPrimary: true,
              isActive: true,
              syncStatus: SyncStatus.SYNCED,
              version: 1,
              originDeviceId: 'WEB_PORTAL',
              lastModifiedByDeviceId: 'WEB_PORTAL',
            },
          });
        }

        return tx.patient.findUnique({
          where: { id: newPatient.id },
          include: {
            clinicalRecord: true,
            user: {
              select: { id: true, email: true, role: true, firstName: true, lastName: true },
            },
          },
        });
      });
    }

    // Caso 2: Actualización de expediente existente
    return prisma.$transaction(async (tx) => {
      const updateData: Prisma.PatientUpdateInput = {
        dateOfBirth: new Date(data.dateOfBirth),
        sex: data.sex || 'OTHER',
        phone: data.phone?.trim() || null,
        address: direccionCompleta,
        emergencyName: data.emergencyName?.trim() || null,
        emergencyPhone: data.emergencyPhone?.trim() || null,
        emergencyRelation: data.emergencyRelation?.trim() || null,
        version: { increment: 1 },
        lastModifiedByDeviceId: 'WEB_PORTAL',
      };

      if (cleanDui) {
        updateData.dui = cleanDui;
      }

      const updatedPatient = await tx.patient.update({
        where: { id: resolvedId },
        data: updateData,
      });

      if (updatedPatient.userId && data.phone?.trim()) {
        await tx.user.update({
          where: { id: updatedPatient.userId },
          data: { phone: data.phone.trim() },
        });
      }

      const clinicalRecordUpdateData: Prisma.ClinicalRecordUpdateInput = {
        observations: healthObservations,
        version: { increment: 1 },
        lastModifiedByDeviceId: 'WEB_PORTAL',
      };

      if (validBloodType !== BloodType.UNKNOWN) {
        clinicalRecordUpdateData.bloodType = validBloodType;
      }

      await tx.clinicalRecord.upsert({
        where: { patientId: resolvedId },
        create: {
          patientId: resolvedId,
          bloodType: validBloodType,
          observations: healthObservations,
          syncStatus: SyncStatus.SYNCED,
          version: 1,
          originDeviceId: 'WEB_PORTAL',
          lastModifiedByDeviceId: 'WEB_PORTAL',
        },
        update: clinicalRecordUpdateData,
      });

      if (data.emergencyName?.trim() && data.emergencyPhone?.trim()) {
        const partsName = data.emergencyName.trim().split(/\s+/);
        const contactFirst = partsName[0] || 'Contacto';
        const contactLast = partsName.slice(1).join(' ') || 'Emergencia';
        const { relationship, customRelation } = parseLegacyRelationship(data.emergencyRelation);

        const primaryExists = await tx.emergencyContact.findFirst({
          where: { patientId: resolvedId, isPrimary: true, deletedAt: null },
        });

        if (primaryExists) {
          await tx.emergencyContact.update({
            where: { id: primaryExists.id },
            data: {
              firstName: contactFirst,
              lastName: contactLast,
              primaryPhone: data.emergencyPhone.trim(),
              relationship,
              customRelation,
              isActive: true,
              version: { increment: 1 },
              lastModifiedByDeviceId: 'WEB_PORTAL',
            },
          });
        } else {
          await tx.emergencyContact.create({
            data: {
              patientId: resolvedId,
              firstName: contactFirst,
              lastName: contactLast,
              primaryPhone: data.emergencyPhone.trim(),
              relationship,
              customRelation,
              isPrimary: true,
              isActive: true,
              syncStatus: SyncStatus.SYNCED,
              version: 1,
              originDeviceId: 'WEB_PORTAL',
              lastModifiedByDeviceId: 'WEB_PORTAL',
            },
          });
        }
      }

      return tx.patient.findUnique({
        where: { id: updatedPatient.id },
        include: {
          clinicalRecord: true,
          user: {
            select: { id: true, email: true, role: true, firstName: true, lastName: true },
          },
        },
      });
    });
  }

  // =========================================================================
  // RESOLUCIÓN Y AUDITORÍA DE CARNET QR DE PACIENTE
  // =========================================================================

  /**
   * Resuelve el payload de un código QR o token, valida los permisos de quien escanea,
   * registra la auditoría inmutable en PostgreSQL y entrega la información clínica autorizada.
   */
  async resolvePatientQR(options: ResolvePatientQROptions) {
    const { qrPayload, clientIp, scannerUser } = options;

    if (!qrPayload || !qrPayload.trim()) {
      throw new AppError('El código o token QR a verificar es obligatorio.', 400);
    }

    // Regla de Seguridad estricta: Pacientes no pueden auditar ni escanear a otros
    if (scannerUser.role === Role.PATIENT) {
      throw new AppError('Acceso denegado: El perfil de paciente no tiene autorización para escanear credenciales clínicas.', 403);
    }

    let searchId: string | null = null;
    let searchDui: string | null = null;
    const cleanPayload = qrPayload.trim();

    // 1. Detección de formato JSON estructurado
    if (cleanPayload.startsWith('{')) {
      try {
        const parsed = JSON.parse(cleanPayload);
        if (parsed && typeof parsed === 'object') {
          if (parsed.id && typeof parsed.id === 'string') searchId = parsed.id.trim();
          if (parsed.patientId && typeof parsed.patientId === 'string') searchId = parsed.patientId.trim();
          if (parsed.dui && typeof parsed.dui === 'string') searchDui = normalizarDui(parsed.dui);
        }
      } catch {
        // Fallback a texto plano
      }
    }

    // 2. Detección de URL institucional o Identificador directo
    if (!searchId && !searchDui) {
      const urlExpMatch = cleanPayload.match(/\/expediente\/([^\/\s\?]+)/i);
      const urlPacMatch = cleanPayload.match(/\/paciente\/([^\/\s\?]+)/i);
      const segment = urlExpMatch?.[1] || urlPacMatch?.[1];

      if (segment) {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) {
          searchId = segment;
        } else {
          searchDui = normalizarDui(segment);
          if (!searchDui && segment.startsWith('EXP-')) {
            const lastPart = segment.split('-').pop();
            if (lastPart && /^\d{4}$/.test(lastPart)) {
              searchDui = lastPart; // Búsqueda por terminación de DUI
            }
          }
        }
      } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanPayload)) {
        searchId = cleanPayload;
      } else {
        searchDui = normalizarDui(cleanPayload);
      }
    }

    // 3. Consulta del expediente en PostgreSQL
    let patient = null;

    if (searchId) {
      patient = await prisma.patient.findFirst({
        where: { id: searchId, deletedAt: null },
        include: {
          clinicalRecord: true,
          emergencyContacts: {
            where: { deletedAt: null, isActive: true },
            orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
          },
          vitalSigns: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
    }

    if (!patient && searchDui) {
      patient = await prisma.patient.findFirst({
        where: {
          deletedAt: null,
          OR: [
            { dui: searchDui },
            { dui: { endsWith: searchDui } },
          ],
        },
        include: {
          clinicalRecord: true,
          emergencyContacts: {
            where: { deletedAt: null, isActive: true },
            orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
          },
          vitalSigns: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
    }

    if (!patient) {
      throw new AppError('No se encontró ningún expediente clínico activo para el carnet escaneado.', 404);
    }

    // 4. Registro de Auditoría Inmutable en PostgreSQL
    try {
      await prisma.auditLog.create({
        data: {
          userId: scannerUser.id,
          action: 'SCAN_PATIENT_QR',
          entity: 'Patient',
          entityId: patient.id,
          ipAddress: clientIp || null,
          changedFields: {
            scannerRole: scannerUser.role,
            patientName: `${patient.firstName} ${patient.lastName}`,
            patientDui: patient.dui,
            resolvedAt: new Date().toISOString(),
          },
        },
      });
    } catch {
      // No bloquea la atención médica si la inserción de auditoría falla
    }

    // 5. Normalización de Metadatos de Salud
    let alergias = 'Ninguna registrada';
    let cronicas = 'Ninguna registrada';
    let medicacion = 'Ninguna activa';
    let observaciones = 'Sin observaciones adicionales';

    if (patient.clinicalRecord?.observations) {
      try {
        const obs = JSON.parse(patient.clinicalRecord.observations);
        if (obs && typeof obs === 'object') {
          alergias = obs.allergies || alergias;
          cronicas = obs.chronicDiseases || cronicas;
          medicacion = obs.medication || medicacion;
          observaciones = obs.notes || observaciones;
        }
      } catch {
        alergias = patient.clinicalRecord.observations;
      }
    }

    const cleanDuiDigits = (patient.dui || '').replace(/\D/g, '');
    const numExpediente = cleanDuiDigits.length >= 4
      ? `EXP-2026-${cleanDuiDigits.slice(-4)}`
      : `EXP-${patient.id.slice(0, 8).toUpperCase()}`;

    const primaryContact = patient.emergencyContacts[0] || null;
    const latestVitals = patient.vitalSigns[0] || null;

    // 6. Entrega de Información Autorizada según el Rol
    const isDoctorOrAdmin = scannerUser.role === Role.DOCTOR || scannerUser.role === Role.ADMIN;

    return {
      matchType: 'QR_VALIDATED',
      scannerRole: scannerUser.role,
      patient: {
        id: patient.id,
        expediente: numExpediente,
        dui: patient.dui,
        firstName: patient.firstName,
        lastName: patient.lastName,
        fullName: `${patient.firstName} ${patient.lastName}`,
        dateOfBirth: patient.dateOfBirth.toISOString(),
        sex: patient.sex,
        phone: patient.phone,
        address: patient.address,
        bloodType: patient.clinicalRecord?.bloodType || BloodType.UNKNOWN,
        emergencyContact: primaryContact ? {
          name: `${primaryContact.firstName} ${primaryContact.lastName}`.trim(),
          phone: primaryContact.primaryPhone,
          relationship: formatRelationLabel(primaryContact.relationship, primaryContact.customRelation),
        } : (patient.emergencyName ? {
          name: patient.emergencyName,
          phone: patient.emergencyPhone || 'Sin número',
          relationship: patient.emergencyRelation || 'Familiar',
        } : null),
        healthSummary: {
          allergies: alergias,
          chronicDiseases: cronicas,
          ...(isDoctorOrAdmin ? { medication: medicacion, observations: observaciones } : {}),
        },
        clinicalRecordId: patient.clinicalRecord?.id || null,
        lastVitalSigns: latestVitals ? {
          systolic: latestVitals.systolic,
          diastolic: latestVitals.diastolic,
          heartRate: latestVitals.heartRate,
          temperature: latestVitals.temperature,
          oxygenSat: latestVitals.oxygenSat,
          createdAt: latestVitals.createdAt.toISOString(),
        } : null,
      },
    };
  }

  // =========================================================================
  // GESTIÓN DE CONTACTOS DE EMERGENCIA DEL PACIENTE
  // =========================================================================

  /**
   * Obtiene la lista de contactos de emergencia del paciente autenticado.
   * Si la tabla está vacía pero el paciente tiene datos de emergencia en su expediente,
   * realiza una auto-migración transparente al vuelo para conservar su contacto.
   */
  async getEmergencyContacts(identifier: string) {
    const patientId = await this.resolvePatientId(identifier);
    if (!patientId) return [];

    const existingContacts = await prisma.emergencyContact.findMany({
      where: {
        patientId,
        deletedAt: null,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' },
      ],
    });

    if (existingContacts.length > 0) {
      return existingContacts;
    }

    // AUTO-MIGRACIÓN AL VUELO: Si no hay filas pero Patient tiene emergencyName y emergencyPhone
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        emergencyName: true,
        emergencyPhone: true,
        emergencyRelation: true,
      },
    });

    if (patient?.emergencyName?.trim() && patient?.emergencyPhone?.trim()) {
      const parts = patient.emergencyName.trim().split(/\s+/);
      const firstName = parts[0] || 'Contacto';
      const lastName = parts.slice(1).join(' ') || 'Emergencia';
      const { relationship, customRelation } = parseLegacyRelationship(patient.emergencyRelation);

      const migratedContact = await prisma.emergencyContact.create({
        data: {
          patientId: patient.id,
          firstName,
          lastName,
          relationship,
          customRelation,
          primaryPhone: patient.emergencyPhone.trim(),
          isPrimary: true,
          isActive: true,
          syncStatus: SyncStatus.SYNCED,
          version: 1,
          originDeviceId: 'WEB_PORTAL',
          lastModifiedByDeviceId: 'WEB_PORTAL',
        },
      });

      return [migratedContact];
    }

    return [];
  }

  /**
   * Registra un nuevo contacto de emergencia.
   * Regla de negocio: Si se marca como Principal o es el primer contacto registrado,
   * se asegura la unicidad y se sincroniza con el modelo Patient.
   */
  async createEmergencyContact(identifier: string, data: CreateEmergencyContactDTO) {
    const patientId = await this.resolvePatientId(identifier);
    if (!patientId) {
      throw new Error('No se encontró el expediente del paciente para registrar el contacto.');
    }

    const deviceId = data.originDeviceId || 'WEB_PORTAL';
    const activeContactsCount = await prisma.emergencyContact.count({
      where: { patientId, deletedAt: null },
    });

    const shouldBePrimary = activeContactsCount === 0 ? true : Boolean(data.isPrimary);
    const relationEnum = data.relationship || EmergencyRelationship.FAMILIAR;
    const customRel = relationEnum === EmergencyRelationship.OTRO ? (data.customRelation?.trim() || null) : null;

    return prisma.$transaction(async (tx) => {
      if (shouldBePrimary) {
        await tx.emergencyContact.updateMany({
          where: { patientId, deletedAt: null },
          data: { isPrimary: false },
        });
      }

      const newContact = await tx.emergencyContact.create({
        data: {
          patientId,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          relationship: relationEnum,
          customRelation: customRel,
          primaryPhone: data.primaryPhone.trim(),
          secondaryPhone: data.secondaryPhone?.trim() || null,
          email: data.email?.trim().toLowerCase() || null,
          isPrimary: shouldBePrimary,
          isActive: data.isActive !== undefined ? data.isActive : true,
          syncStatus: SyncStatus.SYNCED,
          version: 1,
          originDeviceId: deviceId,
          lastModifiedByDeviceId: deviceId,
        },
      });

      if (shouldBePrimary) {
        await tx.patient.update({
          where: { id: patientId },
          data: {
            emergencyName: `${newContact.firstName} ${newContact.lastName}`.trim(),
            emergencyPhone: newContact.primaryPhone,
            emergencyRelation: formatRelationLabel(relationEnum, customRel),
            lastModifiedByDeviceId: deviceId,
          },
        });
      }

      return newContact;
    });
  }

  /**
   * Actualiza los datos de un contacto de emergencia existente.
   */
  async updateEmergencyContact(identifier: string, contactId: string, data: UpdateEmergencyContactDTO) {
    const patientId = await this.resolvePatientId(identifier);
    if (!patientId) {
      throw new Error('Expediente del paciente no encontrado.');
    }

    const existingContact = await prisma.emergencyContact.findFirst({
      where: { id: contactId, patientId, deletedAt: null },
    });
    if (!existingContact) {
      throw new Error('El contacto de emergencia no existe o ya ha sido removido.');
    }

    const deviceId = data.originDeviceId || 'WEB_PORTAL';

    return prisma.$transaction(async (tx) => {
      if (data.isPrimary === true) {
        await tx.emergencyContact.updateMany({
          where: { patientId, id: { not: contactId }, deletedAt: null },
          data: { isPrimary: false },
        });
      }

      const updatePayload: Prisma.EmergencyContactUpdateInput = {
        version: { increment: 1 },
        lastModifiedByDeviceId: deviceId,
      };

      if (data.firstName !== undefined) updatePayload.firstName = data.firstName.trim();
      if (data.lastName !== undefined) updatePayload.lastName = data.lastName.trim();
      if (data.relationship !== undefined) updatePayload.relationship = data.relationship;

      if (data.relationship === EmergencyRelationship.OTRO) {
        updatePayload.customRelation = data.customRelation?.trim() || null;
      } else if (data.relationship) {
        updatePayload.customRelation = null;
      } else if (data.customRelation !== undefined) {
        updatePayload.customRelation = data.customRelation?.trim() || null;
      }

      if (data.primaryPhone !== undefined) updatePayload.primaryPhone = data.primaryPhone.trim();
      if (data.secondaryPhone !== undefined) {
        updatePayload.secondaryPhone = data.secondaryPhone?.trim() || null;
      }
      if (data.email !== undefined) {
        updatePayload.email = data.email?.trim().toLowerCase() || null;
      }
      if (data.isPrimary !== undefined) updatePayload.isPrimary = data.isPrimary;
      if (data.isActive !== undefined) updatePayload.isActive = data.isActive;

      const updated = await tx.emergencyContact.update({
        where: { id: contactId },
        data: updatePayload,
      });

      if (updated.isPrimary && updated.isActive) {
        await tx.patient.update({
          where: { id: patientId },
          data: {
            emergencyName: `${updated.firstName} ${updated.lastName}`.trim(),
            emergencyPhone: updated.primaryPhone,
            emergencyRelation: formatRelationLabel(updated.relationship, updated.customRelation),
            lastModifiedByDeviceId: deviceId,
          },
        });
      } else if (existingContact.isPrimary && (!updated.isPrimary || !updated.isActive)) {
        const fallback = await tx.emergencyContact.findFirst({
          where: { patientId, id: { not: contactId }, deletedAt: null, isActive: true },
          orderBy: { createdAt: 'asc' },
        });

        if (fallback) {
          await tx.emergencyContact.update({
            where: { id: fallback.id },
            data: { isPrimary: true },
          });
          await tx.patient.update({
            where: { id: patientId },
            data: {
              emergencyName: `${fallback.firstName} ${fallback.lastName}`.trim(),
              emergencyPhone: fallback.primaryPhone,
              emergencyRelation: formatRelationLabel(fallback.relationship, fallback.customRelation),
              lastModifiedByDeviceId: deviceId,
            },
          });
        } else {
          await tx.patient.update({
            where: { id: patientId },
            data: {
              emergencyName: null,
              emergencyPhone: null,
              emergencyRelation: null,
              lastModifiedByDeviceId: deviceId,
            },
          });
        }
      }

      return updated;
    });
  }

  /**
   * Elimina suavemente (soft delete) un contacto de emergencia.
   * Si era el principal, transfiere automáticamente el rango al siguiente contacto activo.
   */
  async deleteEmergencyContact(identifier: string, contactId: string) {
    const patientId = await this.resolvePatientId(identifier);
    if (!patientId) {
      throw new Error('Expediente del paciente no encontrado.');
    }

    const contact = await prisma.emergencyContact.findFirst({
      where: { id: contactId, patientId, deletedAt: null },
    });
    if (!contact) {
      throw new Error('El contacto a eliminar no fue encontrado.');
    }

    return prisma.$transaction(async (tx) => {
      await tx.emergencyContact.update({
        where: { id: contactId },
        data: {
          deletedAt: new Date(),
          isPrimary: false,
          isActive: false,
          version: { increment: 1 },
          lastModifiedByDeviceId: 'WEB_PORTAL',
        },
      });

      if (contact.isPrimary) {
        const nextPrimary = await tx.emergencyContact.findFirst({
          where: { patientId, deletedAt: null, isActive: true },
          orderBy: { createdAt: 'asc' },
        });

        if (nextPrimary) {
          await tx.emergencyContact.update({
            where: { id: nextPrimary.id },
            data: { isPrimary: true },
          });
          await tx.patient.update({
            where: { id: patientId },
            data: {
              emergencyName: `${nextPrimary.firstName} ${nextPrimary.lastName}`.trim(),
              emergencyPhone: nextPrimary.primaryPhone,
              emergencyRelation: formatRelationLabel(nextPrimary.relationship, nextPrimary.customRelation),
              lastModifiedByDeviceId: 'WEB_PORTAL',
            },
          });
        } else {
          await tx.patient.update({
            where: { id: patientId },
            data: {
              emergencyName: null,
              emergencyPhone: null,
              emergencyRelation: null,
              lastModifiedByDeviceId: 'WEB_PORTAL',
            },
          });
        }
      }

      return { success: true, message: 'Contacto de emergencia eliminado exitosamente.' };
    });
  }

  /**
   * Establece explícitamente un contacto como Principal.
   */
  async setPrimaryEmergencyContact(identifier: string, contactId: string) {
    const patientId = await this.resolvePatientId(identifier);
    if (!patientId) {
      throw new Error('Expediente del paciente no encontrado.');
    }

    const targetContact = await prisma.emergencyContact.findFirst({
      where: { id: contactId, patientId, deletedAt: null },
    });
    if (!targetContact) {
      throw new Error('Contacto no encontrado.');
    }

    return prisma.$transaction(async (tx) => {
      await tx.emergencyContact.updateMany({
        where: { patientId, deletedAt: null },
        data: { isPrimary: false },
      });

      const updated = await tx.emergencyContact.update({
        where: { id: contactId },
        data: {
          isPrimary: true,
          isActive: true,
          version: { increment: 1 },
          lastModifiedByDeviceId: 'WEB_PORTAL',
        },
      });

      await tx.patient.update({
        where: { id: patientId },
        data: {
          emergencyName: `${updated.firstName} ${updated.lastName}`.trim(),
          emergencyPhone: updated.primaryPhone,
          emergencyRelation: formatRelationLabel(updated.relationship, updated.customRelation),
          lastModifiedByDeviceId: 'WEB_PORTAL',
        },
      });

      return updated;
    });
  }

  // =========================================================================
  // CONSULTAS GENERALES Y EXPEDIENTES
  // =========================================================================

  async getAllPatients(search?: string) {
    const todosLosPacientes = await prisma.patient.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        clinicalRecord: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!search || !search.trim()) {
      return todosLosPacientes;
    }

    const queryTexto = normalizarTexto(search);
    const queryAlfa = normalizarAlfanumerico(search);
    const palabrasQuery = queryTexto.split(/\s+/).filter(Boolean);

    return todosLosPacientes.filter((p) => {
      const nombreCompleto = normalizarTexto(`${p.firstName} ${p.lastName}`);
      const primerNombre = normalizarTexto(p.firstName);
      const primerApellido = normalizarTexto(p.lastName);
      const duiNormalizado = normalizarTexto(p.dui);
      const duiAlfa = normalizarAlfanumerico(p.dui);
      const telefonoNormalizado = normalizarAlfanumerico(p.phone);
      const idAlfa = normalizarAlfanumerico(p.id);

      if (queryAlfa) {
        if (duiAlfa && duiAlfa.includes(queryAlfa)) return true;
        if (telefonoNormalizado && telefonoNormalizado.includes(queryAlfa)) return true;
        if (idAlfa.startsWith(queryAlfa) || idAlfa.includes(queryAlfa)) return true;
      }

      if (nombreCompleto.includes(queryTexto)) return true;
      if (primerNombre.includes(queryTexto)) return true;
      if (primerApellido.includes(queryTexto)) return true;
      if (duiNormalizado.includes(queryTexto)) return true;

      const coincideTodasLasPalabras = palabrasQuery.every(
        (palabra) => nombreCompleto.includes(palabra) || duiNormalizado.includes(palabra)
      );

      return coincideTodasLasPalabras;
    });
  }

  async getPatientById(id: string) {
    const resolvedId = await this.resolvePatientId(id);
    const searchId = resolvedId || id;

    let patient = await prisma.patient.findFirst({
      where: { 
        id: searchId, 
        deletedAt: null,
      },
      include: {
        clinicalRecord: true,
        vitalSigns: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!patient) {
      const user = await prisma.user.findFirst({
        where: { id, deletedAt: null },
      });

      if (user) {
        patient = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          dateOfBirth: new Date(),
          dui: null,
          sex: 'OTHER',
          phone: user.phone || null,
          address: 'No registrada',
          emergencyName: null,
          emergencyPhone: null,
          emergencyRelation: null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: null,
          syncStatus: 'SYNCED',
          version: 1,
          originDeviceId: 'SERVER_CENTRAL',
          lastModifiedByDeviceId: 'SERVER_CENTRAL',
          lastModified: user.updatedAt,
          clinicalRecord: null,
          vitalSigns: [],
        } as unknown as typeof patient;
      }
    }

    return patient;
  }

  async getPatientHistory(id: string) {
    const resolvedId = await this.resolvePatientId(id);
    const searchId = resolvedId || id;

    let patient = await prisma.patient.findFirst({
      where: { 
        id: searchId, 
        deletedAt: null,
      },
      include: {
        clinicalRecord: true,
      },
    });

    let userFallback = null;
    if (!patient) {
      userFallback = await prisma.user.findFirst({
        where: { id, deletedAt: null },
      });
    }

    if (!patient && userFallback) {
      return {
        patient: {
          id: userFallback.id,
          firstName: userFallback.firstName,
          lastName: userFallback.lastName,
          dateOfBirth: new Date(),
          dui: null,
          sex: 'OTHER',
          phone: userFallback.phone || null,
          address: 'No registrada',
          emergencyName: null,
          emergencyPhone: null,
          emergencyRelation: null,
          createdAt: userFallback.createdAt,
          updatedAt: userFallback.updatedAt,
          deletedAt: null,
          syncStatus: 'SYNCED',
          version: 1,
          originDeviceId: 'SERVER_CENTRAL',
          lastModifiedByDeviceId: 'SERVER_CENTRAL',
          lastModified: userFallback.updatedAt,
          clinicalRecord: null,
        },
        consultations: [],
        standaloneVitalSigns: [],
      };
    }

    if (!patient) return null;

    const consultations = await prisma.consultation.findMany({
      where: { patientId: patient.id, deletedAt: null },
      include: {
        doctor: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
        brigade: {
          select: { id: true, name: true, department: true, municipality: true },
        },
        vitalSigns: true,
      },
      orderBy: { consultationDate: 'desc' },
    });

    const standaloneVitalSigns = await prisma.vitalSigns.findMany({
      where: { patientId: patient.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return {
      patient,
      consultations,
      standaloneVitalSigns,
    };
  }

  async createVitalSigns(patientIdentifier: string, data: CreateVitalSignsDTO) {
    const resolvedId = await this.resolvePatientId(patientIdentifier);
    const patientId = resolvedId || patientIdentifier;

    const patientExists = await prisma.patient.findFirst({
      where: { 
        id: patientId, 
        deletedAt: null,
      },
    });

    if (!patientExists) {
      throw new Error('El paciente especificado no existe o no tiene expediente clínico activo.');
    }

    const deviceId = data.originDeviceId || 'SERVER_CENTRAL';

    return prisma.vitalSigns.create({
      data: {
        patientId,
        consultationId: data.consultationId || null,
        systolic: Math.round(data.systolic),
        diastolic: Math.round(data.diastolic),
        heartRate: Math.round(data.heartRate),
        temperature: Number(data.temperature),
        oxygenSat: Math.round(data.oxygenSat),
        weight: data.weight ? Number(data.weight) : null,
        height: data.height ? Number(data.height) : null,
        originDeviceId: deviceId,
        lastModifiedByDeviceId: deviceId,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dui: true,
          },
        },
      },
    });
  }

  async getTodayVitalSigns() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return prisma.vitalSigns.findMany({
      where: {
        deletedAt: null,
        createdAt: { gte: startOfDay },
        patient: {
          deletedAt: null,
        },
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dui: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}

export const patientsService = new PatientsService();