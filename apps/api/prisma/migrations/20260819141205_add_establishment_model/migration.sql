-- CreateEnum
CREATE TYPE "EstablishmentType" AS ENUM ('HOSPITAL', 'CLINIC', 'HEALTH_CENTER');

-- CreateEnum
CREATE TYPE "EstablishmentLevel" AS ENUM ('SPECIALIZED', 'REGIONAL', 'DEPARTMENTAL', 'BASIC');

-- CreateEnum
CREATE TYPE "EstablishmentStatus" AS ENUM ('OPERATIONAL', 'FULL_CAPACITY', 'MAINTENANCE', 'INACTIVE');

-- CreateTable
CREATE TABLE "Establishment" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EstablishmentType" NOT NULL DEFAULT 'HOSPITAL',
    "level" "EstablishmentLevel" NOT NULL DEFAULT 'DEPARTMENTAL',
    "department" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phone" TEXT,
    "emergencyPhone" TEXT,
    "totalBeds" INTEGER NOT NULL DEFAULT 0,
    "availableBeds" INTEGER NOT NULL DEFAULT 0,
    "status" "EstablishmentStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Establishment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Establishment_code_key" ON "Establishment"("code");

-- CreateIndex
CREATE INDEX "Establishment_type_idx" ON "Establishment"("type");

-- CreateIndex
CREATE INDEX "Establishment_status_idx" ON "Establishment"("status");

-- CreateIndex
CREATE INDEX "Establishment_department_municipality_idx" ON "Establishment"("department", "municipality");

-- CreateIndex
CREATE INDEX "Establishment_syncStatus_idx" ON "Establishment"("syncStatus");

-- CreateIndex
CREATE INDEX "Establishment_lastModified_idx" ON "Establishment"("lastModified");

-- CreateIndex
CREATE INDEX "Establishment_originDeviceId_idx" ON "Establishment"("originDeviceId");

-- CreateIndex
CREATE INDEX "Establishment_lastModifiedByDeviceId_idx" ON "Establishment"("lastModifiedByDeviceId");
