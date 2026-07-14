-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DOCTOR', 'BRIGADISTA', 'AUTHORITY');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('PENDING', 'SYNCED', 'CONFLICT');

-- CreateEnum
CREATE TYPE "SyncOperation" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "QueuePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ACTIVE', 'OFFLINE', 'BLOCKED', 'RETIRED');

-- CreateEnum
CREATE TYPE "BrigadeStatus" AS ENUM ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'UNKNOWN');

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "operatingSystem" TEXT NOT NULL,
    "appVersion" TEXT NOT NULL,
    "publicKey" TEXT,
    "location" TEXT,
    "lastSyncAt" TIMESTAMP(3),
    "status" "DeviceStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncQueue" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "operation" "SyncOperation" NOT NULL,
    "payload" JSONB NOT NULL,
    "priority" "QueuePriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "QueueStatus" NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3),

    CONSTRAINT "SyncQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'BRIGADISTA',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brigade" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "BrigadeStatus" NOT NULL DEFAULT 'PLANNED',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "leaderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Brigade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrigadeMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brigadeId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrigadeMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "dui" TEXT,
    "sex" "Sex" NOT NULL DEFAULT 'OTHER',
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "emergencyName" TEXT,
    "emergencyPhone" TEXT,
    "emergencyRelation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicalRecord" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "bloodType" "BloodType" NOT NULL DEFAULT 'UNKNOWN',
    "familyHistory" TEXT,
    "surgicalHistory" TEXT,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "clinicalRecordId" TEXT NOT NULL,
    "brigadeId" TEXT NOT NULL,
    "status" "ConsultationStatus" NOT NULL DEFAULT 'DRAFT',
    "chiefComplaint" TEXT NOT NULL,
    "physicalExam" TEXT NOT NULL,
    "diagnosisCode" TEXT,
    "diagnosisDesc" TEXT NOT NULL,
    "treatmentPlan" TEXT NOT NULL,
    "consultationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followUpDate" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VitalSigns" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "consultationId" TEXT,
    "temperature" DOUBLE PRECISION NOT NULL,
    "heartRate" INTEGER NOT NULL,
    "oxygenSat" INTEGER NOT NULL,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VitalSigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "deviceId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changedFields" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Device_serialNumber_key" ON "Device"("serialNumber");

-- CreateIndex
CREATE INDEX "Device_status_idx" ON "Device"("status");

-- CreateIndex
CREATE INDEX "Device_serialNumber_idx" ON "Device"("serialNumber");

-- CreateIndex
CREATE INDEX "SyncQueue_status_priority_createdAt_idx" ON "SyncQueue"("status", "priority", "createdAt");

-- CreateIndex
CREATE INDEX "SyncQueue_entity_entityId_idx" ON "SyncQueue"("entity", "entityId");

-- CreateIndex
CREATE INDEX "SyncQueue_deviceId_idx" ON "SyncQueue"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_lastName_firstName_idx" ON "User"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "Brigade_status_idx" ON "Brigade"("status");

-- CreateIndex
CREATE INDEX "Brigade_syncStatus_idx" ON "Brigade"("syncStatus");

-- CreateIndex
CREATE INDEX "Brigade_lastModified_idx" ON "Brigade"("lastModified");

-- CreateIndex
CREATE INDEX "Brigade_originDeviceId_idx" ON "Brigade"("originDeviceId");

-- CreateIndex
CREATE INDEX "Brigade_lastModifiedByDeviceId_idx" ON "Brigade"("lastModifiedByDeviceId");

-- CreateIndex
CREATE UNIQUE INDEX "BrigadeMember_userId_brigadeId_key" ON "BrigadeMember"("userId", "brigadeId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_dui_key" ON "Patient"("dui");

-- CreateIndex
CREATE INDEX "Patient_lastName_firstName_idx" ON "Patient"("lastName", "firstName");

-- CreateIndex
CREATE INDEX "Patient_dui_idx" ON "Patient"("dui");

-- CreateIndex
CREATE INDEX "Patient_syncStatus_idx" ON "Patient"("syncStatus");

-- CreateIndex
CREATE INDEX "Patient_lastModified_idx" ON "Patient"("lastModified");

-- CreateIndex
CREATE INDEX "Patient_originDeviceId_idx" ON "Patient"("originDeviceId");

-- CreateIndex
CREATE INDEX "Patient_lastModifiedByDeviceId_idx" ON "Patient"("lastModifiedByDeviceId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalRecord_patientId_key" ON "ClinicalRecord"("patientId");

-- CreateIndex
CREATE INDEX "ClinicalRecord_syncStatus_idx" ON "ClinicalRecord"("syncStatus");

-- CreateIndex
CREATE INDEX "ClinicalRecord_lastModified_idx" ON "ClinicalRecord"("lastModified");

-- CreateIndex
CREATE INDEX "ClinicalRecord_originDeviceId_idx" ON "ClinicalRecord"("originDeviceId");

-- CreateIndex
CREATE INDEX "ClinicalRecord_lastModifiedByDeviceId_idx" ON "ClinicalRecord"("lastModifiedByDeviceId");

-- CreateIndex
CREATE INDEX "Consultation_patientId_idx" ON "Consultation"("patientId");

-- CreateIndex
CREATE INDEX "Consultation_doctorId_idx" ON "Consultation"("doctorId");

-- CreateIndex
CREATE INDEX "Consultation_brigadeId_idx" ON "Consultation"("brigadeId");

-- CreateIndex
CREATE INDEX "Consultation_status_idx" ON "Consultation"("status");

-- CreateIndex
CREATE INDEX "Consultation_syncStatus_idx" ON "Consultation"("syncStatus");

-- CreateIndex
CREATE INDEX "Consultation_lastModified_idx" ON "Consultation"("lastModified");

-- CreateIndex
CREATE INDEX "Consultation_originDeviceId_idx" ON "Consultation"("originDeviceId");

-- CreateIndex
CREATE INDEX "Consultation_lastModifiedByDeviceId_idx" ON "Consultation"("lastModifiedByDeviceId");

-- CreateIndex
CREATE INDEX "VitalSigns_patientId_idx" ON "VitalSigns"("patientId");

-- CreateIndex
CREATE INDEX "VitalSigns_consultationId_idx" ON "VitalSigns"("consultationId");

-- CreateIndex
CREATE INDEX "VitalSigns_syncStatus_idx" ON "VitalSigns"("syncStatus");

-- CreateIndex
CREATE INDEX "VitalSigns_createdAt_idx" ON "VitalSigns"("createdAt");

-- CreateIndex
CREATE INDEX "VitalSigns_originDeviceId_idx" ON "VitalSigns"("originDeviceId");

-- CreateIndex
CREATE INDEX "VitalSigns_lastModifiedByDeviceId_idx" ON "VitalSigns"("lastModifiedByDeviceId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "SyncQueue" ADD CONSTRAINT "SyncQueue_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brigade" ADD CONSTRAINT "Brigade_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrigadeMember" ADD CONSTRAINT "BrigadeMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrigadeMember" ADD CONSTRAINT "BrigadeMember_brigadeId_fkey" FOREIGN KEY ("brigadeId") REFERENCES "Brigade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicalRecord" ADD CONSTRAINT "ClinicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_clinicalRecordId_fkey" FOREIGN KEY ("clinicalRecordId") REFERENCES "ClinicalRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_brigadeId_fkey" FOREIGN KEY ("brigadeId") REFERENCES "Brigade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalSigns" ADD CONSTRAINT "VitalSigns_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalSigns" ADD CONSTRAINT "VitalSigns_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;
