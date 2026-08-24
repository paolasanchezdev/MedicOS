// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/routes/BrigadistaRoutes.tsx
// DESCRIPCIÓN: Definición de rutas del Portal Brigadista con módulo de Signos Vitales conectado.
// =========================================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BrigadistaLayout } from '../layout/BrigadistaLayout';
import { ResumenBrigadistaPage } from '../pages/dashboard/resumen/ResumenBrigadistaPage';
import { ActividadBrigadistaPage } from '../pages/dashboard/actividad/ActividadBrigadistaPage';
import { SignosVitalesPage } from '../pages/evaluacion/signos-vitales/SignosVitalesPage';

const PagePlaceholder: React.FC<{ title: string; category?: string }> = ({ title, category }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
    {category && (
      <span className="text-xs font-semibold uppercase tracking-wider text-[#3f8880] mb-1 block">
        {category}
      </span>
    )}
    <h1 className="text-xl font-bold text-slate-800">{title}</h1>
    <p className="text-sm text-slate-500 mt-1">
      Esta vista está integrada dentro de la estructura de layout y navegación del Portal Brigadista.
    </p>
  </div>
);

export const BrigadistaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<BrigadistaLayout />}>
        {/* Redirección por defecto */}
        <Route index element={<Navigate to="dashboard/resumen" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Navigate to="dashboard/resumen" replace />} />
        <Route path="dashboard/resumen" element={<ResumenBrigadistaPage />} />
        <Route path="dashboard/actividad" element={<ActividadBrigadistaPage />} />

        {/* Brigada */}
        <Route path="brigada" element={<Navigate to="brigada/resumen" replace />} />
        <Route
          path="brigada/resumen"
          element={<PagePlaceholder title="Resumen Brigada" category="Brigada" />}
        />
        <Route
          path="brigada/jornada"
          element={<PagePlaceholder title="Jornada" category="Brigada" />}
        />
        <Route
          path="brigada/pacientes"
          element={<PagePlaceholder title="Pacientes Brigada" category="Brigada" />}
        />

        {/* Pacientes */}
        <Route path="pacientes" element={<Navigate to="pacientes/buscar" replace />} />
        <Route
          path="pacientes/buscar"
          element={<PagePlaceholder title="Buscar Paciente" category="Pacientes" />}
        />
        <Route
          path="pacientes/registrar"
          element={<PagePlaceholder title="Registrar Paciente" category="Pacientes" />}
        />
        <Route
          path="pacientes/escanear"
          element={<PagePlaceholder title="Escanear QR / ID" category="Pacientes" />}
        />
        <Route
          path="pacientes/expediente"
          element={<PagePlaceholder title="Expediente Paciente" category="Pacientes" />}
        />

        {/* Consultas */}
        <Route path="consultas" element={<Navigate to="consultas/nueva" replace />} />
        <Route
          path="consultas/nueva"
          element={<PagePlaceholder title="Nueva Consulta" category="Consultas" />}
        />
        <Route
          path="consultas/pendientes"
          element={<PagePlaceholder title="Consultas Pendientes" category="Consultas" />}
        />
        <Route
          path="consultas/historial"
          element={<PagePlaceholder title="Historial Consultas" category="Consultas" />}
        />

        {/* Evaluación Clínica */}
        <Route path="evaluacion" element={<Navigate to="evaluacion/signos-vitales" replace />} />
        <Route path="evaluacion/signos-vitales" element={<SignosVitalesPage />} />
        <Route
          path="evaluacion/sintomas"
          element={<PagePlaceholder title="Síntomas" category="Evaluación Clínica" />}
        />
        <Route
          path="evaluacion/antecedentes"
          element={<PagePlaceholder title="Antecedentes" category="Evaluación Clínica" />}
        />
        <Route
          path="evaluacion/observaciones"
          element={<PagePlaceholder title="Observaciones" category="Evaluación Clínica" />}
        />

        {/* Tratamientos */}
        <Route path="tratamientos" element={<Navigate to="tratamientos/medicamentos" replace />} />
        <Route
          path="tratamientos/medicamentos"
          element={<PagePlaceholder title="Medicamentos" category="Tratamientos" />}
        />
        <Route
          path="tratamientos/indicaciones"
          element={<PagePlaceholder title="Indicaciones" category="Tratamientos" />}
        />
        <Route
          path="tratamientos/seguimiento"
          element={<PagePlaceholder title="Seguimiento Tratamiento" category="Tratamientos" />}
        />

        {/* Seguimiento */}
        <Route path="seguimiento" element={<Navigate to="seguimiento/pacientes" replace />} />
        <Route
          path="seguimiento/pacientes"
          element={<PagePlaceholder title="Seguimiento Pacientes" category="Seguimiento" />}
        />
        <Route
          path="seguimiento/alertas"
          element={<PagePlaceholder title="Alertas Seguimiento" category="Seguimiento" />}
        />
        <Route
          path="seguimiento/controles"
          element={<PagePlaceholder title="Controles" category="Seguimiento" />}
        />

        {/* Mapa */}
        <Route path="mapa" element={<Navigate to="mapa/ubicacion" replace />} />
        <Route
          path="mapa/ubicacion"
          element={<PagePlaceholder title="Ubicación" category="Mapa" />}
        />
        <Route
          path="mapa/pacientes"
          element={<PagePlaceholder title="Mapa Pacientes" category="Mapa" />}
        />
        <Route
          path="mapa/establecimientos"
          element={<PagePlaceholder title="Mapa Establecimientos" category="Mapa" />}
        />

        {/* Sincronización */}
        <Route path="sincronizacion" element={<Navigate to="sincronizacion/estado" replace />} />
        <Route
          path="sincronizacion/estado"
          element={<PagePlaceholder title="Estado Sincronización" category="Sincronización" />}
        />
        <Route
          path="sincronizacion/pendientes"
          element={<PagePlaceholder title="Pendientes Sincronización" category="Sincronización" />}
        />
        <Route
          path="sincronizacion/historial"
          element={<PagePlaceholder title="Historial Sincronización" category="Sincronización" />}
        />

        {/* Notificaciones */}
        <Route path="notificaciones" element={<Navigate to="notificaciones/centro" replace />} />
        <Route
          path="notificaciones/centro"
          element={<PagePlaceholder title="Centro Notificaciones" category="Notificaciones" />}
        />
        <Route
          path="notificaciones/alertas"
          element={<PagePlaceholder title="Alertas" category="Notificaciones" />}
        />

        {/* Reportes */}
        <Route path="reportes" element={<Navigate to="reportes/brigada" replace />} />
        <Route
          path="reportes/brigada"
          element={<PagePlaceholder title="Reportes Brigada" category="Reportes" />}
        />
        <Route
          path="reportes/consultas"
          element={<PagePlaceholder title="Reportes Consultas" category="Reportes" />}
        />
        <Route
          path="reportes/pacientes"
          element={<PagePlaceholder title="Reportes Pacientes" category="Reportes" />}
        />

        {/* Perfil */}
        <Route path="perfil" element={<Navigate to="perfil/datos" replace />} />
        <Route
          path="perfil/datos"
          element={<PagePlaceholder title="Datos Brigadista" category="Perfil" />}
        />
        <Route
          path="perfil/preferencias"
          element={<PagePlaceholder title="Preferencias Brigadista" category="Perfil" />}
        />
        <Route
          path="perfil/seguridad"
          element={<PagePlaceholder title="Seguridad Brigadista" category="Perfil" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="dashboard/resumen" replace />} />
      </Route>
    </Routes>
  );
};

export default BrigadistaRoutes;