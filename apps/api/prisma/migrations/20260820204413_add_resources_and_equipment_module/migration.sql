/*
  Warnings:

  - The values [FULL_CAPACITY] on the enum `EstablishmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `availableBeds` on the `Establishment` table. All the data in the column will be lost.
  - You are about to drop the column `totalBeds` on the `Establishment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ResourceCategory" AS ENUM ('MEDICINE', 'CLINICAL_SUPPLY', 'OTHER');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('AVAILABLE', 'QUARANTINE', 'DEPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('OPERATIONAL', 'IN_MAINTENANCE', 'DAMAGED', 'DECOMMISSIONED');

-- CreateEnum
CREATE TYPE "ItemCondition" AS ENUM ('OPTIMAL', 'GOOD', 'DAMAGED', 'UNUSABLE');

-- AlterEnum
BEGIN;
CREATE TYPE "EstablishmentStatus_new" AS ENUM ('OPERATIONAL', 'MAINTENANCE', 'INACTIVE');
ALTER TABLE "public"."Establishment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Establishment" ALTER COLUMN "status" TYPE "EstablishmentStatus_new" USING ("status"::text::"EstablishmentStatus_new");
ALTER TYPE "EstablishmentStatus" RENAME TO "EstablishmentStatus_old";
ALTER TYPE "EstablishmentStatus_new" RENAME TO "EstablishmentStatus";
DROP TYPE "public"."EstablishmentStatus_old";
ALTER TABLE "Establishment" ALTER COLUMN "status" SET DEFAULT 'OPERATIONAL';
COMMIT;

-- AlterTable
ALTER TABLE "Establishment" DROP COLUMN "availableBeds",
DROP COLUMN "totalBeds";

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genericName" TEXT,
    "category" "ResourceCategory" NOT NULL DEFAULT 'MEDICINE',
    "unit" TEXT NOT NULL,
    "isConsumable" BOOLEAN NOT NULL DEFAULT true,
    "minThreshold" INTEGER NOT NULL DEFAULT 10,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceStock" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "lotNumber" TEXT NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "quantityAvailable" INTEGER NOT NULL,
    "quantityReserved" INTEGER NOT NULL DEFAULT 0,
    "status" "StockStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalEquipment" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT,
    "serialNumber" TEXT,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicalEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrigadeSupplyItem" (
    "id" TEXT NOT NULL,
    "brigadeId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "quantitySupplied" INTEGER NOT NULL,
    "quantityDispensed" INTEGER NOT NULL DEFAULT 0,
    "quantityReturned" INTEGER NOT NULL DEFAULT 0,
    "quantityWasted" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrigadeSupplyItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrigadeEquipmentItem" (
    "id" TEXT NOT NULL,
    "brigadeId" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "conditionOut" "ItemCondition" NOT NULL DEFAULT 'OPTIMAL',
    "conditionIn" "ItemCondition",
    "dispatchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrigadeEquipmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrigadeDevice" (
    "id" TEXT NOT NULL,
    "brigadeId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(3),
    "roleInBrigade" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrigadeDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resource_code_key" ON "Resource"("code");

-- CreateIndex
CREATE INDEX "Resource_category_idx" ON "Resource"("category");

-- CreateIndex
CREATE INDEX "Resource_isActive_idx" ON "Resource"("isActive");

-- CreateIndex
CREATE INDEX "Resource_isConsumable_idx" ON "Resource"("isConsumable");

-- CreateIndex
CREATE INDEX "Resource_syncStatus_idx" ON "Resource"("syncStatus");

-- CreateIndex
CREATE INDEX "Resource_lastModified_idx" ON "Resource"("lastModified");

-- CreateIndex
CREATE INDEX "ResourceStock_resourceId_idx" ON "ResourceStock"("resourceId");

-- CreateIndex
CREATE INDEX "ResourceStock_expirationDate_idx" ON "ResourceStock"("expirationDate");

-- CreateIndex
CREATE INDEX "ResourceStock_status_idx" ON "ResourceStock"("status");

-- CreateIndex
CREATE INDEX "ResourceStock_syncStatus_idx" ON "ResourceStock"("syncStatus");

-- CreateIndex
CREATE INDEX "ResourceStock_lastModified_idx" ON "ResourceStock"("lastModified");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceStock_resourceId_lotNumber_key" ON "ResourceStock"("resourceId", "lotNumber");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalEquipment_code_key" ON "MedicalEquipment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalEquipment_serialNumber_key" ON "MedicalEquipment"("serialNumber");

-- CreateIndex
CREATE INDEX "MedicalEquipment_status_idx" ON "MedicalEquipment"("status");

-- CreateIndex
CREATE INDEX "MedicalEquipment_syncStatus_idx" ON "MedicalEquipment"("syncStatus");

-- CreateIndex
CREATE INDEX "MedicalEquipment_lastModified_idx" ON "MedicalEquipment"("lastModified");

-- CreateIndex
CREATE INDEX "BrigadeSupplyItem_brigadeId_idx" ON "BrigadeSupplyItem"("brigadeId");

-- CreateIndex
CREATE INDEX "BrigadeSupplyItem_stockId_idx" ON "BrigadeSupplyItem"("stockId");

-- CreateIndex
CREATE INDEX "BrigadeSupplyItem_syncStatus_idx" ON "BrigadeSupplyItem"("syncStatus");

-- CreateIndex
CREATE INDEX "BrigadeSupplyItem_lastModified_idx" ON "BrigadeSupplyItem"("lastModified");

-- CreateIndex
CREATE INDEX "BrigadeEquipmentItem_brigadeId_idx" ON "BrigadeEquipmentItem"("brigadeId");

-- CreateIndex
CREATE INDEX "BrigadeEquipmentItem_equipmentId_idx" ON "BrigadeEquipmentItem"("equipmentId");

-- CreateIndex
CREATE INDEX "BrigadeEquipmentItem_syncStatus_idx" ON "BrigadeEquipmentItem"("syncStatus");

-- CreateIndex
CREATE INDEX "BrigadeEquipmentItem_lastModified_idx" ON "BrigadeEquipmentItem"("lastModified");

-- CreateIndex
CREATE INDEX "BrigadeDevice_brigadeId_idx" ON "BrigadeDevice"("brigadeId");

-- CreateIndex
CREATE INDEX "BrigadeDevice_deviceId_idx" ON "BrigadeDevice"("deviceId");

-- CreateIndex
CREATE INDEX "BrigadeDevice_syncStatus_idx" ON "BrigadeDevice"("syncStatus");

-- CreateIndex
CREATE INDEX "BrigadeDevice_lastModified_idx" ON "BrigadeDevice"("lastModified");

-- AddForeignKey
ALTER TABLE "ResourceStock" ADD CONSTRAINT "ResourceStock_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrigadeSupplyItem" ADD CONSTRAINT "BrigadeSupplyItem_brigadeId_fkey" FOREIGN KEY ("brigadeId") REFERENCES "Brigade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrigadeSupplyItem" ADD CONSTRAINT "BrigadeSupplyItem_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "ResourceStock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrigadeEquipmentItem" ADD CONSTRAINT "BrigadeEquipmentItem_brigadeId_fkey" FOREIGN KEY ("brigadeId") REFERENCES "Brigade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrigadeEquipmentItem" ADD CONSTRAINT "BrigadeEquipmentItem_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "MedicalEquipment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrigadeDevice" ADD CONSTRAINT "BrigadeDevice_brigadeId_fkey" FOREIGN KEY ("brigadeId") REFERENCES "Brigade"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrigadeDevice" ADD CONSTRAINT "BrigadeDevice_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- ======================================================
-- REGLAS DE INTEGRIDAD PERSONALIZADAS MEDICOS
-- ======================================================

-- 1. Evitar inventario negativo y sobre-reserva en bodega central
ALTER TABLE "ResourceStock" 
  ADD CONSTRAINT check_stock_quantities 
  CHECK (
    "quantityAvailable" >= 0 AND 
    "quantityReserved" >= 0 AND 
    "quantityReserved" <= "quantityAvailable"
  );

-- 2. Evitar cantidades negativas y sobre-dispensación en la dotación de brigada
ALTER TABLE "BrigadeSupplyItem" 
  ADD CONSTRAINT check_supply_quantities 
  CHECK (
    "quantitySupplied" > 0 AND 
    "quantityDispensed" >= 0 AND 
    "quantityReturned" >= 0 AND 
    "quantityWasted" >= 0 AND
    "quantityDispensed" <= "quantitySupplied"
  );

-- 3. Validar coherencia temporal entre salida y retorno de instrumental
ALTER TABLE "BrigadeEquipmentItem" 
  ADD CONSTRAINT check_equipment_dates 
  CHECK ("returnedAt" IS NULL OR "returnedAt" >= "dispatchedAt");

-- 4. Impedir que un equipo médico esté asignado a dos brigadas activas simultáneamente
CREATE UNIQUE INDEX unique_active_brigade_equipment 
ON "BrigadeEquipmentItem" ("equipmentId") 
WHERE "returnedAt" IS NULL AND "deletedAt" IS NULL;

-- 5. Impedir que un dispositivo tecnológico esté asignado a dos brigadas activas simultáneamente
CREATE UNIQUE INDEX unique_active_brigade_device 
ON "BrigadeDevice" ("deviceId") 
WHERE "returnedAt" IS NULL AND "deletedAt" IS NULL;


  