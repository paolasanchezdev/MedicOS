// =========================================================================
// ARCHIVO: apps/web/src/modules/brigades/index.ts
// DESCRIPCIÓN: Barril de exportaciones completo del módulo Brigadas.
// =========================================================================

// Componentes y Modales
export * from './components/AssignLeaderModal';
export * from './components/BrigadeStatusModal';
export * from './components/CreateBrigadeModal';
export * from './components/DeleteBrigadeModal';

// Tipos
export * from './types/brigade.types';
export * from './types/brigadista-dashboard.types';

// Servicios HTTP
export * from './services/brigades.service';
export * from './services/brigadista-dashboard.service';

// Hooks
export * from './hooks/useBrigade';
export * from './hooks/useAdminBrigades';
export * from './hooks/useBrigadistaDashboard';
export * from './hooks/useBrigadistaActividad';
export * from './hooks/useResumenBrigada';
export * from './hooks/useJornadaBrigada';
export * from './hooks/usePacientesBrigada';

// Contexto
export * from './context/BrigadeContext';
export * from './context/BrigadeProvider';