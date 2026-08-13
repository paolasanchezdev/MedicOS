// =========================================================================
// ARCHIVO: apps/api/prisma/seed.ts
// DESCRIPCIÓN: Sembrado de datos iniciales completo para el dashboard de MedicOS.
// =========================================================================

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  Role,
  Sex,
  BloodType,
  BrigadeStatus,
  ConsultationStatus,
  UserStatus,
  DeviceStatus,
  SyncOperation,
  QueueStatus,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

// Cargar variables de entorno del paquete API
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL no se encuentra definida en el archivo .env');
}

// Configurar el driver adapter de PostgreSQL para Prisma v7
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando sembrado de datos iniciales para MedicOS...');

  const now = new Date();

  // 1. Registrar Dispositivos del Sistema (Infraestructura y Red)
  const centralDevice = await prisma.device.upsert({
    where: { serialNumber: 'DEV-CENTRAL-01' },
    update: { status: DeviceStatus.ACTIVE },
    create: {
      name: 'Servidor Central - MedicOS',
      serialNumber: 'DEV-CENTRAL-01',
      operatingSystem: 'Ubuntu 24.04 LTS',
      appVersion: '1.0.0',
      location: 'Sede Central San Salvador',
      status: DeviceStatus.ACTIVE,
    },
  });

  const mobileDevice1 = await prisma.device.upsert({
    where: { serialNumber: 'DEV-MOB-MORAZAN-01' },
    update: { status: DeviceStatus.ACTIVE },
    create: {
      name: 'Tablet Brigada Morazán #1',
      serialNumber: 'DEV-MOB-MORAZAN-01',
      operatingSystem: 'Android 14 / MedicOS Mobile',
      appVersion: '1.0.0',
      location: 'Morazán',
      status: DeviceStatus.ACTIVE,
    },
  });

  const mobileDevice2 = await prisma.device.upsert({
    where: { serialNumber: 'DEV-MOB-CABANAS-01' },
    update: { status: DeviceStatus.OFFLINE },
    create: {
      name: 'Tablet Brigada Cabañas #1',
      serialNumber: 'DEV-MOB-CABANAS-01',
      operatingSystem: 'Android 14 / MedicOS Mobile',
      appVersion: '1.0.0',
      location: 'Cabañas',
      status: DeviceStatus.OFFLINE,
    },
  });

  console.log('✅ Nodos de red/dispositivos registrados (Activos y Offline)');

  // 2. Generar usuarios del sistema
  const adminPasswordHash = await bcrypt.hash('Admin2026!Medicos', 10);
  const patientPasswordHash = await bcrypt.hash('Paciente2026!Medicos', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@medicos.org' },
    update: {},
    create: {
      email: 'admin@medicos.org',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      firstName: 'Administrador',
      lastName: 'Central',
      phone: '+503 7000-0001',
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctora.martinez@medicos.org' },
    update: {},
    create: {
      email: 'doctora.martinez@medicos.org',
      passwordHash: adminPasswordHash,
      role: Role.DOCTOR,
      status: UserStatus.ACTIVE,
      firstName: 'Elena',
      lastName: 'Martínez',
      phone: '+503 7000-0002',
    },
  });

  const brigadistaUser = await prisma.user.upsert({
    where: { email: 'brigadista.perez@medicos.org' },
    update: {},
    create: {
      email: 'brigadista.perez@medicos.org',
      passwordHash: adminPasswordHash,
      role: Role.BRIGADISTA,
      status: UserStatus.ACTIVE,
      firstName: 'Carlos',
      lastName: 'Pérez',
      phone: '+503 7000-0003',
    },
  });

  const patientUser = await prisma.user.upsert({
    where: { email: 'maria.gonzalez@paciente.medicos.org' },
    update: {},
    create: {
      email: 'maria.gonzalez@paciente.medicos.org',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      status: UserStatus.ACTIVE,
      firstName: 'María',
      lastName: 'González',
      phone: '+503 7123-4567',
    },
  });

  console.log('✅ Usuarios del sistema creados (ADMIN, DOCTOR, BRIGADISTA, PATIENT)');

  // 3. Crear Brigada Médica de prueba
  let brigade = await prisma.brigade.findFirst({
    where: { name: 'Brigada Médica Morazán 2026' },
  });

  if (!brigade) {
    brigade = await prisma.brigade.create({
      data: {
        name: 'Brigada Médica Morazán 2026',
        department: 'Morazán',
        municipality: 'San Francisco Gotera',
        latitude: 13.6942,
        longitude: -88.1072,
        status: BrigadeStatus.ACTIVE,
        startDate: new Date('2026-08-01T08:00:00Z'),
        endDate: new Date('2026-08-30T17:00:00Z'),
        leaderId: adminUser.id,
        originDeviceId: centralDevice.id,
        lastModifiedByDeviceId: centralDevice.id,
        members: {
          create: [
            { userId: doctorUser.id },
            { userId: brigadistaUser.id },
          ],
        },
      },
    });
  }
  console.log(`✅ Brigada registrada: ${brigade.name}`);

  // 4. Crear o Actualizar Paciente y Expediente Clínico
  let patient = await prisma.patient.findFirst({
    where: { 
      OR: [
        { dui: '01234567-8' },
        { userId: patientUser.id }
      ]
    },
    include: { clinicalRecord: true },
  });

  if (!patient) {
    patient = await prisma.patient.create({
      data: {
        userId: patientUser.id,
        firstName: 'María',
        lastName: 'González',
        dateOfBirth: new Date('1985-05-15T00:00:00Z'),
        dui: '01234567-8',
        sex: Sex.FEMALE,
        phone: '+503 7123-4567',
        address: 'Caserío El Centro, Cantón El Jocote, Morazán',
        emergencyName: 'José González',
        emergencyPhone: '+503 7234-5678',
        emergencyRelation: 'Esposo',
        originDeviceId: mobileDevice1.id,
        lastModifiedByDeviceId: mobileDevice1.id,
        createdAt: now,
        clinicalRecord: {
          create: {
            bloodType: BloodType.O_POSITIVE,
            familyHistory: 'Diabetes Mellitus Tipo 2 (Madre)',
            surgicalHistory: 'Apendicectomía (2015)',
            observations: 'Paciente no reporta alergias medicamentosas.',
            originDeviceId: mobileDevice1.id,
            lastModifiedByDeviceId: mobileDevice1.id,
            createdAt: now,
          },
        },
      },
      include: { clinicalRecord: true },
    });
  } else {
    patient = await prisma.patient.update({
      where: { id: patient.id },
      data: {
        userId: patientUser.id,
        firstName: 'María',
        lastName: 'González',
        phone: '+503 7123-4567',
        lastModifiedByDeviceId: mobileDevice1.id,
        createdAt: now,
      },
      include: { clinicalRecord: true },
    });
  }

  let clinicalRecord = patient.clinicalRecord;
  if (!clinicalRecord) {
    clinicalRecord = await prisma.clinicalRecord.create({
      data: {
        patientId: patient.id,
        bloodType: BloodType.O_POSITIVE,
        familyHistory: 'Diabetes Mellitus Tipo 2 (Madre)',
        surgicalHistory: 'Apendicectomía (2015)',
        observations: 'Paciente no reporta alergias medicamentosas.',
        originDeviceId: mobileDevice1.id,
        lastModifiedByDeviceId: mobileDevice1.id,
        createdAt: now,
      },
    });
  }

  console.log(`✅ Paciente y expediente clínico vinculados para ${patient.firstName} ${patient.lastName}`);

  // 5. Crear o Actualizar Consulta Médica
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  let consultation = await prisma.consultation.findFirst({
    where: {
      patientId: patient.id,
      doctorId: doctorUser.id,
    },
  });

  if (!consultation) {
    consultation = await prisma.consultation.create({
      data: {
        patientId: patient.id,
        doctorId: doctorUser.id,
        clinicalRecordId: clinicalRecord.id,
        brigadeId: brigade.id,
        status: ConsultationStatus.COMPLETED,
        chiefComplaint: 'Cefalea frontal pulsátil de 3 días de evolución acompañada de fatiga.',
        physicalExam: 'Paciente normotensa, consciente, orientada en tiempo y espacio. Sin signos de focalización neurológica.',
        diagnosisCode: 'R51',
        diagnosisDesc: 'Cefalea tensional primaria',
        treatmentPlan: 'Paracetamol 500mg cada 8 horas por 3 días. Reposo relativo e hidratación adecuada.',
        consultationDate: now,
        followUpDate: futureDate,
        startedAt: now,
        completedAt: now,
        originDeviceId: mobileDevice1.id,
        lastModifiedByDeviceId: mobileDevice1.id,
        createdAt: now,
      },
    });
  } else {
    consultation = await prisma.consultation.update({
      where: { id: consultation.id },
      data: {
        followUpDate: futureDate,
        lastModifiedByDeviceId: mobileDevice1.id,
        createdAt: now,
      },
    });
  }

  // 6. Registrar Signos Vitales
  const existingVitalSigns = await prisma.vitalSigns.findFirst({
    where: { consultationId: consultation.id },
  });

  if (!existingVitalSigns) {
    await prisma.vitalSigns.create({
      data: {
        patientId: patient.id,
        consultationId: consultation.id,
        temperature: 36.6,
        heartRate: 75,
        oxygenSat: 98,
        systolic: 120,
        diastolic: 80,
        weight: 62.5,
        height: 1.60,
        originDeviceId: mobileDevice1.id,
        lastModifiedByDeviceId: mobileDevice1.id,
        createdAt: now,
      },
    });
  }

  // 7. Eventos de Auditoría (Bitácora de Actividad Reciente - Últimas 24 Horas)
  await prisma.auditLog.deleteMany({});

  const auditLogsData = [
    {
      user: { connect: { id: adminUser.id } },
      device: { connect: { id: centralDevice.id } },
      action: 'LOGIN',
      entity: 'User',
      entityId: adminUser.id,
      changedFields: { message: 'Inicio de sesión exitoso en el portal administrativo' },
      ipAddress: '127.0.0.1',
      createdAt: new Date(now.getTime() - 15 * 60 * 1000), // Hace 15 min
    },
    {
      user: { connect: { id: brigadistaUser.id } },
      device: { connect: { id: mobileDevice1.id } },
      action: 'PATIENT_CREATE',
      entity: 'Patient',
      entityId: patient.id,
      changedFields: { message: 'Registro de expediente clínico para paciente María González' },
      ipAddress: '192.168.1.45',
      createdAt: new Date(now.getTime() - 45 * 60 * 1000), // Hace 45 min
    },
    {
      user: { connect: { id: doctorUser.id } },
      device: { connect: { id: mobileDevice1.id } },
      action: 'CONSULTATION_CREATE',
      entity: 'Consultation',
      entityId: consultation.id,
      changedFields: { message: 'Registro de consulta médica y prescripción de tratamiento' },
      ipAddress: '192.168.1.45',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Hace 2 hrs
    },
    {
      user: { connect: { id: adminUser.id } },
      device: { connect: { id: centralDevice.id } },
      action: 'BRIGADE_CREATE',
      entity: 'Brigade',
      entityId: brigade.id,
      changedFields: { message: 'Programación de Brigada Médica Morazán 2026' },
      ipAddress: '127.0.0.1',
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000), // Hace 5 hrs
    },
    {
      user: { connect: { id: brigadistaUser.id } },
      device: { connect: { id: mobileDevice1.id } },
      action: 'SYNC_EXECUTE',
      entity: 'SyncQueue',
      entityId: mobileDevice1.id,
      changedFields: { message: 'Sincronización de datos locales ejecutada con éxito' },
      ipAddress: '192.168.1.45',
      createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000), // Hace 8 hrs
    },
  ];

  for (const log of auditLogsData) {
    await prisma.auditLog.create({ data: log });
  }

  console.log(`✅ ${auditLogsData.length} eventos de auditoría insertados (Actividad Reciente en 24h)`);

  // 8. Cola Outbox (Sincronización Offline-First)
  await prisma.syncQueue.deleteMany({});

  const syncQueueData = [
    {
      entity: 'Patient',
      entityId: patient.id,
      operation: SyncOperation.CREATE,
      payload: JSON.stringify({ patientId: patient.id, name: 'María González' }),
      status: QueueStatus.PENDING,
      retryCount: 0,
      device: { connect: { id: mobileDevice1.id } },
      createdAt: new Date(now.getTime() - 10 * 60 * 1000),
    },
    {
      entity: 'VitalSigns',
      entityId: consultation.id,
      operation: SyncOperation.CREATE,
      payload: JSON.stringify({ consultationId: consultation.id }),
      status: QueueStatus.PENDING,
      retryCount: 0,
      device: { connect: { id: mobileDevice1.id } },
      createdAt: new Date(now.getTime() - 5 * 60 * 1000),
    },
    {
      entity: 'Consultation',
      entityId: consultation.id,
      operation: SyncOperation.UPDATE,
      payload: JSON.stringify({ consultationId: consultation.id }),
      status: QueueStatus.PROCESSING,
      retryCount: 1,
      device: { connect: { id: mobileDevice2.id } },
      createdAt: new Date(now.getTime() - 20 * 60 * 1000),
    },
    {
      entity: 'ClinicalRecord',
      entityId: clinicalRecord.id,
      operation: SyncOperation.UPDATE,
      payload: JSON.stringify({ recordId: clinicalRecord.id }),
      status: QueueStatus.FAILED,
      retryCount: 3,
      errorMessage: 'Tiempo de espera agotado al intentar conectar con la API central.',
      device: { connect: { id: mobileDevice2.id } },
      createdAt: new Date(now.getTime() - 30 * 60 * 1000),
    },
    {
      entity: 'User',
      entityId: patientUser.id,
      operation: SyncOperation.CREATE,
      payload: JSON.stringify({ userId: patientUser.id }),
      status: QueueStatus.COMPLETED,
      retryCount: 1,
      device: { connect: { id: centralDevice.id } },
      createdAt: new Date(now.getTime() - 60 * 60 * 1000),
    },
    {
      entity: 'Brigade',
      entityId: brigade.id,
      operation: SyncOperation.CREATE,
      payload: JSON.stringify({ brigadeId: brigade.id }),
      status: QueueStatus.COMPLETED,
      retryCount: 1,
      device: { connect: { id: centralDevice.id } },
      createdAt: new Date(now.getTime() - 120 * 60 * 1000),
    },
  ];

  for (const item of syncQueueData) {
    await prisma.syncQueue.create({ data: item });
  }

  console.log('✅ Cola Outbox poblada con estados PENDING, PROCESSING, FAILED y COMPLETED');

  console.log('🎉 Sembrado completo y exitoso para todas las tarjetas del dashboard.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el sembrado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });