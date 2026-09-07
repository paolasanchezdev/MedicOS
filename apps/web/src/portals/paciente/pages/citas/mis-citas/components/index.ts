// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/citas/mis-citas/components/index.ts
// DESCRIPCIÓN: Barril del portal del paciente. Re-exporta componentes visuales
//              de layout propios y conecta los modales del módulo de dominio.
// =========================================================================

export { MisCitasHeader } from './MisCitasHeader';
export { CitasFilters } from './CitasFilters';
export { ProximaCitaCard } from './ProximaCitaCard';
export { CitaCard } from './CitaCard';
export { MisCitasLoading } from './MisCitasLoading';
export { MisCitasEmpty } from './MisCitasEmpty';
export { MisCitasError } from './MisCitasError';

// Re-exportación de componentes de dominio desde modules/appointments
export {
  CitaEstadoBadge,
  DetalleCitaModal,
  CancelarCitaModal,
  ReprogramarCitaModal,
} from '../../../../../../modules/appointments/index.js';