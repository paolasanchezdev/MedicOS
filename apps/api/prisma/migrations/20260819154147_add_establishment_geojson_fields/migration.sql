-- CreateEnum
CREATE TYPE "EstablishmentOperator" AS ENUM ('MINSAL', 'ISSS', 'FAES', 'PRIVATE', 'OTHER');

-- AlterTable
ALTER TABLE "Establishment" ADD COLUMN     "hasEmergency" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "operator" "EstablishmentOperator" NOT NULL DEFAULT 'MINSAL',
ADD COLUMN     "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Establishment_operator_idx" ON "Establishment"("operator");

-- CreateIndex
CREATE INDEX "Establishment_hasEmergency_idx" ON "Establishment"("hasEmergency");
