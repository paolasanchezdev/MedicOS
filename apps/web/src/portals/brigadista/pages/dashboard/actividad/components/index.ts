// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/dashboard/actividad/components/index.ts
// DESCRIPCIÓN: Exportación centralizada del módulo de Actividad de Campo.
// =========================================================================

export { EstadoActividadBadge, TipoActividadBadge } from './EstadoActividadBadge';
export type { TipoActividadOperativa, EstadoActividadOperativa } from './EstadoActividadBadge';

export { ActividadHeader } from './ActividadHeader';
export { ActividadResumen } from './ActividadResumen';
export { ActividadFiltros } from './ActividadFiltros';
export { ActividadTimeline } from './ActividadTimeline';
export type { ActividadItemOperativa } from './ActividadTimeline';

export { ProximaActividadCard } from './ProximaActividadCard';
export { ActividadCard } from './ActividadCard';
export { ActividadTabla } from './ActividadTabla';