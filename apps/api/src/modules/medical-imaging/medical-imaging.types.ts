// =========================================================================
// ARCHIVO: apps/api/src/modules/medical-imaging/medical-imaging.types.ts
// DESCRIPCIÓN: Tipos y DTOs para el historial de estudios de imagen médica.
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

export interface MedicalImagingStudyDTO {
  id: string;
  code: string;
  patientId: string;
  name: string;
  type: ImagingType;
  bodyRegion: string;
  establishmentName: string;
  status: ImagingStatus;
  performedAt: string | Date;
  findings?: string | null | undefined;
  conclusion?: string | null | undefined;
  documentUrl?: string | null | undefined;
  imageUrl?: string | null | undefined;
  hasReport: boolean;
  hasImage: boolean;
}

export interface MedicalImagingFilters {
  type?: string | undefined;
  status?: string | undefined;
  search?: string | undefined;
  sort?: 'recent' | 'oldest' | 'az' | undefined;
}