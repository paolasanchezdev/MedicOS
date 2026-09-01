// =========================================================================
// ARCHIVO: apps/api/src/modules/patients/patients.service.ts[cite: 1]
// DESCRIPCIÓN: Servicio de gestión de pacientes con exclusión de cuentas inhabilitadas o inactivas
// =========================================================================

import { prisma } from '../../config/prisma.js';
import { BaseService } from '../../services/base.service.js';
import { BloodType, Role, UserStatus, SyncStatus, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface CreatePatientDTO {
  // Identificación
  firstName: string;
  lastName: string;
  dateOfBirth: string | Date;
  dui?: string | null;
  sex?: 'MALE' | 'FEMALE' | 'OTHER';

  // Cuenta de Acceso MedicOS
  email: string;
  password: string;

  // Contacto
  phone?: string | null;
  address: string;
  municipality?: string | null;
  department?: string | null;

  // Información Médica Inicial
  bloodType?: BloodType;
  allergies?: string | null;
  chronicDiseases?: string | null;
  disabilities?: string | null;
  familyHistory?: string | null;
  surgicalHistory?: string | null;

  // Contacto de Emergencia
  emergencyName?: string | null;
  emergencyPhone?: string | null;
  emergencyRelation?: string | null;

  // Metadatos de Dispositivo
  originDeviceId?: string;
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

export class PatientsService extends BaseService {
  private async resolvePatientId(identifier?: string): Promise<string | null> {
    if (!identifier) return null;

    const patientById = await prisma.patient.findFirst({
      where: { 
        id: identifier, 
        deletedAt: null,
        user: { status: UserStatus.ACTIVE, deletedAt: null }
      },
    });
    if (patientById) return patientById.id;

    const patientByUserId = await prisma.patient.findFirst({
      where: { 
        userId: identifier, 
        deletedAt: null,
        user: { status: UserStatus.ACTIVE, deletedAt: null }
      },
    });
    if (patientByUserId) return patientByUserId.id;

    const user = await prisma.user.findFirst({
      where: { id: identifier, deletedAt: null, status: UserStatus.ACTIVE },
    });
    if (!user) return null;

    const patientByUser = await prisma.patient.findFirst({
      where: {
        deletedAt: null,
        user: { status: UserStatus.ACTIVE, deletedAt: null },
        OR: [
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

  /**
   * Verifica si un DUI ya se encuentra registrado en el sistema
   */
  async checkDuiAvailability(dui: string): Promise<{ available: boolean; patientName?: string }> {
    const cleanDui = dui.trim();
    if (!cleanDui) return { available: true };

    const existing = await prisma.patient.findFirst({
      where: {
        dui: cleanDui,
        deletedAt: null,
        user: { status: UserStatus.ACTIVE, deletedAt: null },
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

  /**
   * Verifica si un correo electrónico ya está registrado como usuario activo
   */
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

  /**
   * Registra atómicamente un nuevo Paciente junto a su Cuenta de Usuario y su Expediente Clínico inicial
   */
  async createPatient(data: CreatePatientDTO) {
    const deviceId = data.originDeviceId || 'SERVER_CENTRAL';
    const emailNormalizado = data.email.trim().toLowerCase();

    const emailExistente = await prisma.user.findFirst({
      where: { email: emailNormalizado, deletedAt: null },
    });
    if (emailExistente) {
      throw new Error('El correo electrónico ya se encuentra registrado en MedicOS.');
    }

    if (data.dui?.trim()) {
      const duiExistente = await prisma.patient.findFirst({
        where: { dui: data.dui.trim(), deletedAt: null },
      });
      if (duiExistente) {
        throw new Error(`El DUI ${data.dui} ya está asociado al paciente ${duiExistente.firstName} ${duiExistente.lastName}.`);
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

    const detallesMedicos = [
      data.allergies?.trim() ? `Alergias: ${data.allergies.trim()}` : null,
      data.chronicDiseases?.trim() ? `Enfermedades crónicas: ${data.chronicDiseases.trim()}` : null,
      data.disabilities?.trim() ? `Discapacidad: ${data.disabilities.trim()}` : null,
    ].filter(Boolean);
    const observacionesIniciales = detallesMedicos.length > 0 ? detallesMedicos.join(' | ') : null;

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
          dui: data.dui?.trim() || null,
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
          bloodType: data.bloodType || BloodType.UNKNOWN,
          familyHistory: data.familyHistory?.trim() || null,
          surgicalHistory: data.surgicalHistory?.trim() || null,
          observations: observacionesIniciales,
          syncStatus: SyncStatus.SYNCED,
          version: 1,
          originDeviceId: deviceId,
          lastModifiedByDeviceId: deviceId,
        },
      });

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

  /**
   * Búsqueda integral de pacientes excluyendo aquellos cuyas cuentas estén inhabilitadas o inactivas
   */
  async getAllPatients(search?: string) {
    const todosLosPacientes = await prisma.patient.findMany({
      where: {
        deletedAt: null,
        user: {
          status: UserStatus.ACTIVE,
          deletedAt: null,
        },
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
        user: {
          status: UserStatus.ACTIVE,
          deletedAt: null,
        }
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
        where: { id, deletedAt: null, status: UserStatus.ACTIVE },
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
        user: {
          status: UserStatus.ACTIVE,
          deletedAt: null,
        }
      },
      include: {
        clinicalRecord: true,
      },
    });

    let userFallback = null;
    if (!patient) {
      userFallback = await prisma.user.findFirst({
        where: { id, deletedAt: null, status: UserStatus.ACTIVE },
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
        user: {
          status: UserStatus.ACTIVE,
          deletedAt: null,
        }
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
          user: {
            status: UserStatus.ACTIVE,
            deletedAt: null,
          }
        }
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