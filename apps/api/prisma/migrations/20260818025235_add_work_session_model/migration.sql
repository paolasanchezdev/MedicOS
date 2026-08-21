-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('STARTED', 'ENDED');

-- AlterTable
ALTER TABLE "Consultation" ADD COLUMN     "workSessionId" TEXT;

-- CreateTable
CREATE TABLE "WorkSession" (
    "id" TEXT NOT NULL,
    "brigadistaId" TEXT NOT NULL,
    "brigadeId" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'STARTED',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "syncStatus" "SyncStatus" NOT NULL DEFAULT 'PENDING',
    "version" INTEGER NOT NULL DEFAULT 1,
    "originDeviceId" TEXT NOT NULL,
    "lastModifiedByDeviceId" TEXT NOT NULL,
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkSession_brigadistaId_status_idx" ON "WorkSession"("brigadistaId", "status");

-- CreateIndex
CREATE INDEX "WorkSession_brigadeId_idx" ON "WorkSession"("brigadeId");

-- CreateIndex
CREATE INDEX "WorkSession_syncStatus_idx" ON "WorkSession"("syncStatus");

-- CreateIndex
CREATE INDEX "Consultation_workSessionId_idx" ON "Consultation"("workSessionId");

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_workSessionId_fkey" FOREIGN KEY ("workSessionId") REFERENCES "WorkSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSession" ADD CONSTRAINT "WorkSession_brigadistaId_fkey" FOREIGN KEY ("brigadistaId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSession" ADD CONSTRAINT "WorkSession_brigadeId_fkey" FOREIGN KEY ("brigadeId") REFERENCES "Brigade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
