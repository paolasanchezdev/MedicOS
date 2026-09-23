// =========================================================================
// ARCHIVO: apps/web/src/modules/medical-imaging/types/medical-imaging.types.ts
// DESCRIPCIÓN: Tipos TypeScript frontend para estudios de imagen médica.
// =========================================================================

export type ImagingType =
  | 'XRAY'
  | 'ULTRASOUND'
  | 'TOMOGRAPHY'
  | 'RESONANCE'
  | 'MAMMOGRAPHY'
  | 'DENSITOMETRY'
  | 'OTHER';

export type ImagingStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface MedicalImagingStudy {
  id: string;
  code: string;
  patientId: string;
  name: string;
  type: ImagingType;
  bodyRegion: string;
  establishmentName: string;
  status: ImagingStatus;
  performedAt: string;
  findings?: string | null;
  conclusion?: string | null;
  documentUrl?: string | null;
  imageUrl?: string | null;
  hasReport: boolean;
  hasImage: boolean;
}

export interface MedicalImagingFilters {
  type?: string;
  status?: string;
  search?: string;
  sort?: 'recent' | 'oldest' | 'az';
}