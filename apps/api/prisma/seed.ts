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

  // 1. Registrar dispositivo central (Obligatorio para campos de trazabilidad offline)
  const centralDevice = await prisma.device.upsert({
    where: { serialNumber: 'DEV-CENTRAL-01' },
    update: {},
    create: {
      name: 'Servidor Central - MedicOS',
      serialNumber: 'DEV-CENTRAL-01',
      operatingSystem: 'Ubuntu 24.04 LTS',
      appVersion: '1.0.0',
      location: 'Sede Central',
      status: DeviceStatus.ACTIVE,
    },
  });
  console.log(`✅ Dispositivo central configurado: ${centralDevice.serialNumber}`);

  const deviceId = centralDevice.id;

  // 2. Generar usuarios del sistema
  const passwordHash = await bcrypt.hash('Admin2026!Medicos', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@medicos.org' },
    update: {},
    create: {
      email: 'admin@medicos.org',
      passwordHash,
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
      passwordHash,
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
      passwordHash,
      role: Role.BRIGADISTA,
      status: UserStatus.ACTIVE,
      firstName: 'Carlos',
      lastName: 'Pérez',
      phone: '+503 7000-0003',
    },
  });

  console.log('✅ Usuarios del sistema creados (ADMIN, DOCTOR, BRIGADISTA)');

  // 3. Crear Brigada Médica de prueba
  const brigade = await prisma.brigade.create({
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
      originDeviceId: deviceId,
      lastModifiedByDeviceId: deviceId,
      members: {
        create: [
          { userId: doctorUser.id },
          { userId: brigadistaUser.id },
        ],
      },
    },
  });
  console.log(`✅ Brigada registrada: ${brigade.name}`);

  // 4. Crear Paciente y Expediente Clínico
  const patient = await prisma.patient.create({
    data: {
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
      originDeviceId: deviceId,
      lastModifiedByDeviceId: deviceId,
      clinicalRecord: {
        create: {
          bloodType: BloodType.O_POSITIVE,
          familyHistory: 'Diabetes Mellitus Tipo 2 (Madre)',
          surgicalHistory: 'Apendicectomía (2015)',
          observations: 'Paciente no reporta alergias medicamentosas.',
          originDeviceId: deviceId,
          lastModifiedByDeviceId: deviceId,
        },
      },
    },
    include: {
      clinicalRecord: true,
    },
  });
  console.log(`✅ Paciente y expediente clínico creados para ${patient.firstName} ${patient.lastName}`);

  if (!patient.clinicalRecord) {
    throw new Error('Error al asociar expediente clínico.');
  }

  // 5. Crear Consulta Médica (Metodología SOAP)
  const consultation = await prisma.consultation.create({
    data: {
      patientId: patient.id,
      doctorId: doctorUser.id,
      clinicalRecordId: patient.clinicalRecord.id,
      brigadeId: brigade.id,
      status: ConsultationStatus.COMPLETED,
      chiefComplaint: 'Cefalea frontal pulsátil de 3 días de evolución acompañada de fatiga.',
      physicalExam: 'Paciente normotensa, consciente, orientada en tiempo y espacio. Sin signos de focalización neurológica.',
      diagnosisCode: 'R51',
      diagnosisDesc: 'Cefalea tensional primaria',
      treatmentPlan: 'Paracetamol 500mg cada 8 horas por 3 días. Reposo relativo e hidratación adecuada.',
      consultationDate: new Date(),
      startedAt: new Date(),
      completedAt: new Date(),
      originDeviceId: deviceId,
      lastModifiedByDeviceId: deviceId,
    },
  });
  console.log('✅ Consulta médica registrada.');

  // 6. Registrar Signos Vitales
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
      originDeviceId: deviceId,
      lastModifiedByDeviceId: deviceId,
    },
  });
  console.log('✅ Signos vitales vinculados a la consulta.');

  console.log('🎉 Sembrado completado exitosamente.');
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