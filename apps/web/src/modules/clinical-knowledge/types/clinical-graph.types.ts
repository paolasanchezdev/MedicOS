// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-knowledge/types/clinical-graph.types.ts
// DESCRIPCIÓN: Contrato tipado integral del Grafo Clínico MedicOS.
// =========================================================================

export type ClinicalNodeType =
  | 'PATIENT'
  | 'CLINICAL_RECORD'
  | 'CONSULTATION'
  | 'PRENATAL_CONTROL'
  | 'VACCINATION'
  | 'DIAGNOSIS'
  | 'VITAL_SIGN'
  | 'PRESCRIPTION'
  | 'MEDICATION'
  | 'LAB_STUDY'
  | 'ANALYTE_RESULT'
  | 'IMAGING_STUDY'
  | 'LIFESTYLE_HABIT'
  | 'CERTIFICATE'
  | 'BRIGADE'
  | 'ESTABLISHMENT'
  | 'ALLERGY';

export type ClinicalEdgeRelation =
  | 'HAS_RECORD'
  | 'HAS_ALLERGY'
  | 'ATTENDED_IN'
  | 'BOOKED_APPOINTMENT'
  | 'DIAGNOSED'
  | 'RECORDED_VITALS'
  | 'STANDALONE_VITAL'
  | 'PRESCRIBED'
  | 'INCLUDES_MEDICINE'
  | 'ORDERED_LAB'
  | 'MEASURED_ANALYTE'
  | 'ORDERED_IMAGING'
  | 'LOGGED_HABIT'
  | 'ISSUED_DOC'
  | 'EXECUTED_IN'
  | 'REFERRED_TO';

export interface ClinicalNodeProvenance {
  model: string;
  recordId: string;
  timestamp: string;
  authorId?: string | null;
  originDeviceId: string;
}

export interface ClinicalGraphNode {
  id: string;
  type: ClinicalNodeType;
  label: string;
  sublabel?: string;
  status?: string;
  category: 'core' | 'encounter' | 'clinical' | 'study' | 'treatment' | 'context';
  provenance: ClinicalNodeProvenance;
  metadata: Record<string, unknown>;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface ClinicalGraphEdge {
  id: string;
  source: string;
  target: string;
  relation: ClinicalEdgeRelation;
  label: string;
  weight?: number;
}

export interface ClinicalGraphMetadata {
  requestedByRole: string;
  totalNodesGenerated: number;
  totalEdgesGenerated: number;
  prunedNodesCount: number;
  hasCriticalAlerts: boolean;
}

export interface ClinicalGraphResponse {
  patientId: string;
  generatedAt: string;
  nodeCount: number;
  edgeCount: number;
  nodes: ClinicalGraphNode[];
  edges: ClinicalGraphEdge[];
  metadata: ClinicalGraphMetadata;
}

export type GraphViewMode = 'network' | 'tree';