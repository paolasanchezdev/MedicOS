// =========================================================================
// ARCHIVO: apps/web/src/modules/documents/types/constancias.types.ts
// DESCRIPCIÓN: Tipos e interfaces de dominio para constancias médicas oficiales.
// =========================================================================

export type CertificateType = 'MEDICAL_ATTENTION' | 'CONSULTATION' | 'PRENATAL_CONTROL' | 'OTHER';

export type CertificateStatus = 'ACTIVE' | 'REVOKED';

export interface MedicalCertificateItem {
  id: string;
  code: string; // Ej: CM-2026-000124
  type: CertificateType;
  title: string;
  issuedAt: string; // ISO String
  establishment: string;
  professional: string;
  status: CertificateStatus;
  qrHash: string;
  observations?: string;
  consultationReference?: string;
}