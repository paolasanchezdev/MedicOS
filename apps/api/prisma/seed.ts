// =========================================================================
// ARCHIVO: apps/api/prisma/seed.ts
// DESCRIPCIÓN: Sembrado de datos operativos para MedicOS (IAM, Brigadas,
//              Pacientes, Consultas, Auditoría y Sincronización Outbox).
// =========================================================================

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  Prisma,
  Role,
  Sex,
  BloodType,
  BrigadeStatus,
  ConsultationStatus,
  UserStatus,
  DeviceStatus,
  SyncOperation,
  QueueStatus,
  SessionStatus,
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

// Configurar el driver adapter de PostgreSQL para Prisma v7 / v8
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Tipos auxiliares para garantizar tipado estricto sin implicit 'any'
interface PacienteSeedData {
  userId: string;
  firstName: string;
  lastName: string;
  dui: string;
  dob: Date;
  sex: Sex;
  phone: string;
  address: string;
  bloodType: BloodType;
  familyHistory: string;
  createdAt: Date;
}

type PatientWithClinicalRecord = Prisma.PatientGetPayload<{
  include: { clinicalRecord: true };
}>;

async function main() {
  console.log('🌱 Iniciando sembrado de datos operativos para MedicOS...');

  const now = new Date();

  // Helpers para generar fechas relativas al momento actual
  const fechaHaceMinutos = (minutos: number): Date => new Date(now.getTime() - minutos * 60 * 1000);
  const fechaHaceHoras = (horas: number): Date => new Date(now.getTime() - horas * 60 * 60 * 1000);

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
    where: { serialNumber: 'DEV-MOB-TEPEZONTES-01' },
    update: { status: DeviceStatus.ACTIVE },
    create: {
      name: 'Tablet Brigada Tepezontes #1',
      serialNumber: 'DEV-MOB-TEPEZONTES-01',
      operatingSystem: 'Android 14 / MedicOS Mobile',
      appVersion: '1.0.0',
      location: 'San Miguel Tepezontes, La Paz',
      status: DeviceStatus.ACTIVE,
    },
  });

  await prisma.device.upsert({
    where: { serialNumber: 'DEV-MOB-LAPAZ-01' },
    update: { status: DeviceStatus.OFFLINE },
    create: {
      name: 'Tablet Brigada La Paz #1',
      serialNumber: 'DEV-MOB-LAPAZ-01',
      operatingSystem: 'Android 14 / MedicOS Mobile',
      appVersion: '1.0.0',
      location: 'La Paz',
      status: DeviceStatus.OFFLINE,
    },
  });

  console.log('✅ Nodos de red/dispositivos registrados (Activos y Offline)');

  // 2. Verificación de catálogo de establecimientos oficiales existente
  const totalEstablecimientos = await prisma.establishment.count();
  console.log(`ℹ️ Catálogo oficial de establecimientos conservado: ${totalEstablecimientos} registrados`);

  // 3. Generar usuarios del sistema
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

  const authorityUser = await prisma.user.upsert({
    where: { email: 'autoridad.salud@minsal.gob.sv' },
    update: {},
    create: {
      email: 'autoridad.salud@minsal.gob.sv',
      passwordHash: adminPasswordHash,
      role: Role.AUTHORITY,
      status: UserStatus.ACTIVE,
      firstName: 'Patricia',
      lastName: 'Rivas',
      phone: '+503 7000-0004',
    },
  });

  const patientUser1 = await prisma.user.upsert({
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

  const patientUser2 = await prisma.user.upsert({
    where: { email: 'carlos.ruiz@paciente.medicos.org' },
    update: {},
    create: {
      email: 'carlos.ruiz@paciente.medicos.org',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      status: UserStatus.ACTIVE,
      firstName: 'Carlos',
      lastName: 'Ruiz',
      phone: '+503 7234-8899',
    },
  });

  const patientUser3 = await prisma.user.upsert({
    where: { email: 'ana.rodriguez@paciente.medicos.org' },
    update: {},
    create: {
      email: 'ana.rodriguez@paciente.medicos.org',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      status: UserStatus.ACTIVE,
      firstName: 'Ana',
      lastName: 'Rodríguez',
      phone: '+503 7888-1122',
    },
  });

  const patientUser4 = await prisma.user.upsert({
    where: { email: 'jorge.martinez@paciente.medicos.org' },
    update: {},
    create: {
      email: 'jorge.martinez@paciente.medicos.org',
      passwordHash: patientPasswordHash,
      role: Role.PATIENT,
      status: UserStatus.ACTIVE,
      firstName: 'Jorge',
      lastName: 'Martínez',
      phone: '+503 7555-9900',
    },
  });

  console.log('✅ Usuarios del sistema creados (ADMIN, DOCTOR, BRIGADISTA, AUTHORITY, PATIENTS)');

  // 4. Crear o Actualizar Brigada Médica
  let brigade = await prisma.brigade.findFirst({
    where: { name: 'Brigada Médica San Miguel Tepezontes 2026' },
  });

  if (!brigade) {
    brigade = await prisma.brigade.create({
      data: {
        name: 'Brigada Médica San Miguel Tepezontes 2026',
        department: 'La Paz',
        municipality: 'San Miguel Tepezontes',
        latitude: 13.6236,
        longitude: -89.0142,
        status: BrigadeStatus.ACTIVE,
        startDate: fechaHaceHoras(24),
        endDate: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000),
        leaderId: adminUser.id,
        originDeviceId: centralDevice.id,
        lastModifiedByDeviceId: centralDevice.id,
        members: {
          create: [{ userId: doctorUser.id }, { userId: brigadistaUser.id }],
        },
      },
    });
  } else {
    brigade = await prisma.brigade.update({
      where: { id: brigade.id },
      data: {
        status: BrigadeStatus.ACTIVE,
        startDate: fechaHaceHoras(24),
        endDate: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000),
      },
    });
  }
  console.log(`✅ Brigada activa para hoy: ${brigade.name}`);

  // 5. Crear o Actualizar Pacientes y Expedientes
  const pacientesData: PacienteSeedData[] = [
    {
      userId: patientUser1.id,
      firstName: 'María',
      lastName: 'González',
      dui: '01234567-8',
      dob: new Date('1985-05-15T00:00:00Z'),
      sex: Sex.FEMALE,
      phone: '+503 7123-4567',
      address: 'Barrio El Centro, Calle Principal, San Miguel Tepezontes',
      bloodType: BloodType.O_POSITIVE,
      familyHistory: 'Diabetes Mellitus Tipo 2 (Madre)',
      createdAt: fechaHaceMinutos(180),
    },
    {
      userId: patientUser2.id,
      firstName: 'Carlos',
      lastName: 'Ruiz',
      dui: '02345678-9',
      dob: new Date('1978-09-20T00:00:00Z'),
      sex: Sex.MALE,
      phone: '+503 7234-8899',
      address: 'Caserío El Calvario, San Miguel Tepezontes',
      bloodType: BloodType.A_POSITIVE,
      familyHistory: 'Hipertensión Arterial (Padre)',
      createdAt: fechaHaceMinutos(120),
    },
    {
      userId: patientUser3.id,
      firstName: 'Ana',
      lastName: 'Rodríguez',
      dui: '03456789-0',
      dob: new Date('1992-11-10T00:00:00Z'),
      sex: Sex.FEMALE,
      phone: '+503 7888-1122',
      address: 'Cantón La Cruz, San Miguel Tepezontes',
      bloodType: BloodType.O_POSITIVE,
      familyHistory: 'Sin antecedentes relevantes',
      createdAt: fechaHaceMinutos(60),
    },
    {
      userId: patientUser4.id,
      firstName: 'Jorge',
      lastName: 'Martínez',
      dui: '04567890-1',
      dob: new Date('1965-03-04T00:00:00Z'),
      sex: Sex.MALE,
      phone: '+503 7555-9900',
      address: 'Barrio San José, San Miguel Tepezontes',
      bloodType: BloodType.O_NEGATIVE,
      familyHistory: 'Cardiopatía isquémica (Abuelo)',
      createdAt: fechaHaceMinutos(30),
    },
  ];

  const patientsList: PatientWithClinicalRecord[] = [];

  for (const p of pacientesData) {
    let patient = await prisma.patient.findFirst({
      where: { dui: p.dui },
      include: { clinicalRecord: true },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          userId: p.userId,
          firstName: p.firstName,
          lastName: p.lastName,
          dateOfBirth: p.dob,
          dui: p.dui,
          sex: p.sex,
          phone: p.phone,
          address: p.address,
          originDeviceId: mobileDevice1.id,
          lastModifiedByDeviceId: mobileDevice1.id,
          createdAt: p.createdAt,
          updatedAt: p.createdAt,
          clinicalRecord: {
            create: {
              bloodType: p.bloodType,
              familyHistory: p.familyHistory,
              originDeviceId: mobileDevice1.id,
              lastModifiedByDeviceId: mobileDevice1.id,
              createdAt: p.createdAt,
              updatedAt: p.createdAt,
            },
          },
        },
        include: { clinicalRecord: true },
      });
    } else {
      patient = await prisma.patient.update({
        where: { id: patient.id },
        data: {
          createdAt: p.createdAt,
          updatedAt: p.createdAt,
        },
        include: { clinicalRecord: true },
      });
    }

    patientsList.push(patient);
  }

  console.log('✅ Pacientes y expedientes clínicos preparados');

  // 6. Reconstruir Consultas del día de HOY para el médico
  await prisma.consultation.deleteMany({});

  const followUpIn7Days = new Date(now);
  followUpIn7Days.setDate(followUpIn7Days.getDate() + 7);

  // Consulta 1: COMPLETADA (María González)
  const c1 = await prisma.consultation.create({
    data: {
      patientId: patientsList[0].id,
      doctorId: doctorUser.id,
      clinicalRecordId: patientsList[0].clinicalRecord!.id,
      brigadeId: brigade.id,
      status: ConsultationStatus.COMPLETED,
      chiefComplaint: 'Cefalea frontal pulsátil de 3 días de evolución acompañada de fatiga.',
      physicalExam: 'Paciente normotensa, consciente y orientada. Sin focalización neurológica.',
      diagnosisCode: 'R51',
      diagnosisDesc: 'Cefalea tensional primaria',
      treatmentPlan: 'Paracetamol 500mg c/8h por 3 días. Hidratación adecuada.',
      consultationDate: fechaHaceMinutos(150),
      followUpDate: followUpIn7Days,
      startedAt: fechaHaceMinutos(150),
      completedAt: fechaHaceMinutos(125),
      originDeviceId: mobileDevice1.id,
      lastModifiedByDeviceId: mobileDevice1.id,
      createdAt: fechaHaceMinutos(150),
      updatedAt: fechaHaceMinutos(125),
    },
  });

  // Consulta 2: EN PROGRESO (Carlos Ruiz)
  const c2 = await prisma.consultation.create({
    data: {
      patientId: patientsList[1].id,
      doctorId: doctorUser.id,
      clinicalRecordId: patientsList[1].clinicalRecord!.id,
      brigadeId: brigade.id,
      status: ConsultationStatus.IN_PROGRESS,
      chiefComplaint: 'Fiebre persistente, escalofríos y presión arterial elevada.',
      physicalExam: 'Facies febril, diaforético, campos pulmonares limpios.',
      diagnosisDesc: '',
      treatmentPlan: '',
      consultationDate: fechaHaceMinutos(90),
      startedAt: fechaHaceMinutos(90),
      originDeviceId: mobileDevice1.id,
      lastModifiedByDeviceId: mobileDevice1.id,
      createdAt: fechaHaceMinutos(90),
      updatedAt: fechaHaceMinutos(90),
    },
  });

  // Consulta 3: DRAFT (Ana Rodríguez)
  await prisma.consultation.create({
    data: {
      patientId: patientsList[2].id,
      doctorId: doctorUser.id,
      clinicalRecordId: patientsList[2].clinicalRecord!.id,
      brigadeId: brigade.id,
      status: ConsultationStatus.DRAFT,
      chiefComplaint: 'Evaluación general y control de signos vitales.',
      physicalExam: '',
      diagnosisDesc: '',
      treatmentPlan: '',
      consultationDate: fechaHaceMinutos(45),
      originDeviceId: mobileDevice1.id,
      lastModifiedByDeviceId: mobileDevice1.id,
      createdAt: fechaHaceMinutos(45),
      updatedAt: fechaHaceMinutos(45),
    },
  });

  // Consulta 4: CANCELADA (Jorge Martínez)
  await prisma.consultation.create({
    data: {
      patientId: patientsList[3].id,
      doctorId: doctorUser.id,
      clinicalRecordId: patientsList[3].clinicalRecord!.id,
      brigadeId: brigade.id,
      status: ConsultationStatus.CANCELLED,
      chiefComplaint: 'Control de rutina.',
      physicalExam: '',
      diagnosisDesc: '',
      treatmentPlan: '',
      consultationDate: fechaHaceMinutos(20),
      originDeviceId: mobileDevice1.id,
      lastModifiedByDeviceId: mobileDevice1.id,
      createdAt: fechaHaceMinutos(20),
      updatedAt: fechaHaceMinutos(20),
    },
  });

  console.log('✅ Consultas del día generadas');

  // 7. Signos Vitales
  await prisma.vitalSigns.deleteMany({});

  await prisma.vitalSigns.create({
    data: {
      patientId: patientsList[0].id,
      consultationId: c1.id,
      temperature: 36.6,
      heartRate: 75,
      oxygenSat: 98,
      systolic: 120,
      diastolic: 80,
      weight: 62.5,
      height: 1.6,
      originDeviceId: mobileDevice1.id,
      lastModifiedByDeviceId: mobileDevice1.id,
      createdAt: fechaHaceMinutos(160),
    },
  });

  await prisma.vitalSigns.create({
    data: {
      patientId: patientsList[1].id,
      consultationId: c2.id,
      temperature: 38.6,
      heartRate: 102,
      oxygenSat: 88,
      systolic: 150,
      diastolic: 95,
      weight: 78.0,
      height: 1.72,
      originDeviceId: mobileDevice1.id,
      lastModifiedByDeviceId: mobileDevice1.id,
      createdAt: fechaHaceMinutos(100),
    },
  });

  console.log('✅ Signos vitales insertados');

  // 8. Eventos de Auditoría
  await prisma.auditLog.deleteMany({});

  const auditLogsData = [
    {
      userId: adminUser.id,
      deviceId: centralDevice.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: adminUser.id,
      changedFields: { message: 'Inicio de sesión exitoso en el portal administrativo' },
      ipAddress: '127.0.0.1',
      createdAt: fechaHaceMinutos(15),
    },
    {
      userId: authorityUser.id,
      deviceId: centralDevice.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: authorityUser.id,
      changedFields: { message: 'Inicio de sesión exitoso en el portal de autoridad sanitaria' },
      ipAddress: '127.0.0.1',
      createdAt: fechaHaceMinutos(10),
    },
    {
      userId: brigadistaUser.id,
      deviceId: mobileDevice1.id,
      action: 'PATIENT_CREATE',
      entity: 'Patient',
      entityId: patientsList[0].id,
      changedFields: { message: 'Registro de expediente clínico para paciente María González' },
      ipAddress: '192.168.1.45',
      createdAt: fechaHaceMinutos(45),
    },
    {
      userId: doctorUser.id,
      deviceId: mobileDevice1.id,
      action: 'CONSULTATION_CREATE',
      entity: 'Consultation',
      entityId: c1.id,
      changedFields: { message: 'Registro de consulta médica y prescripción de tratamiento' },
      ipAddress: '192.168.1.45',
      createdAt: fechaHaceMinutos(120),
    },
  ];

  for (const log of auditLogsData) {
    await prisma.auditLog.create({ data: log });
  }

  // 9. Cola Outbox (Sincronización Offline-First)
  await prisma.syncQueue.deleteMany({});

  const syncQueueData = [
    {
      deviceId: mobileDevice1.id,
      entity: 'Patient',
      entityId: patientsList[0].id,
      operation: SyncOperation.CREATE,
      payload: JSON.stringify({ patientId: patientsList[0].id, name: 'María González' }),
      status: QueueStatus.PENDING,
      retryCount: 0,
      createdAt: fechaHaceMinutos(10),
    },
    {
      deviceId: centralDevice.id,
      entity: 'Consultation',
      entityId: c1.id,
      operation: SyncOperation.UPDATE,
      payload: JSON.stringify({ consultationId: c1.id }),
      status: QueueStatus.COMPLETED,
      retryCount: 1,
      createdAt: fechaHaceMinutos(60),
    },
  ];

  for (const item of syncQueueData) {
    await prisma.syncQueue.create({ data: item });
  }

  // 10. Reconstruir Jornada Activa
  await prisma.workSession.deleteMany({});

  await prisma.workSession.create({
    data: {
      brigadistaId: brigadistaUser.id,
      brigadeId: brigade.id,
      status: SessionStatus.STARTED,
      startedAt: fechaHaceHoras(2),
      originDeviceId: mobileDevice1.id,
      lastModifiedByDeviceId: mobileDevice1.id,
    },
  });

  console.log('✅ Jornada de trabajo iniciada correctamente');
  console.log('🎉 Sembrado dinámico completo y exitoso para MedicOS.');
}

main()
  .catch((e: unknown) => {
    console.error('❌ Error ejecutando el sembrado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });