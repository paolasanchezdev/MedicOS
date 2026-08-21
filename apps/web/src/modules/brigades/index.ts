// apps/web/src/modules/brigades/index.ts

// Contexto y hook operativo de campo
export * from "./context/BrigadeContext";
export * from "./context/BrigadeProvider";
export * from "./hooks/useBrigade";

// Hook y servicio de administración
export * from "./hooks/useAdminBrigades";
export * from "./services/brigades.service";

// Modales
export * from "./components/CreateBrigadeModal";
export * from "./components/AssignLeaderModal";
export * from "./components/BrigadeStatusModal";
export * from "./components/DeleteBrigadeModal";

// Tipos
export * from "./types/brigade.types";