// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/actividad/components/index.ts
// DESCRIPCIÓN: Exportación centralizada del módulo de Actividad de Campo.
// =========================================================================

export { EstadoActividadBadge, TipoActividadBadge } from './EstadoActividadBadge';
export { ActividadHeader } from './ActividadHeader';
export { ActividadResumen } from './ActividadResumen';
export { ActividadFiltros } from './ActividadFiltros';
export { ActividadTimeline } from './ActividadTimeline';
export { ProximaActividadCard } from './ProximaActividadCard';
export { ActividadCard } from './ActividadCard';
export { ActividadTabla } from './ActividadTabla';

// Exportación directa de tipos desde la capa de dominio de brigadas
export type {
  TipoActividadOperativa,
  EstadoActividadOperativa,
  ActividadItemOperativa,
} from '../../../../../../modules/brigades';