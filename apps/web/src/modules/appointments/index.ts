// =========================================================================
// ARCHIVO: apps/web/src/modules/appointments/index.ts
// DESCRIPCIÓN: Barrel export principal del módulo appointments en el frontend.
//              Centraliza types, servicios, hooks, reglas y componentes de dominio.
// =========================================================================

export * from './types/appointment.types.js';
export * from './services/appointments.service.js';
export * from './hooks/useAppointments.js';
export * from './rules/appointmentOrientation.rules.js';
export * from './components/index.js';