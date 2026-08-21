/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Patient_lastModifiedByDeviceId_idx";

-- DropIndex
DROP INDEX "Patient_lastModified_idx";

-- DropIndex
DROP INDEX "Patient_lastName_firstName_idx";

-- DropIndex
DROP INDEX "Patient_originDeviceId_idx";

-- DropIndex
DROP INDEX "Patient_syncStatus_idx";

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "syncStatus" SET DEFAULT 'SYNCED';

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE INDEX "Patient_userId_idx" ON "Patient"("userId");

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
