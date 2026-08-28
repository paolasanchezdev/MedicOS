// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/routes/MedicoRoutes.tsx
// DESCRIPCIÓN: Enrutador del Portal Médico con vistas reales conectadas.
// =========================================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MedicoLayout } from '../layout/MedicoLayout';
import { ResumenMedicoPage } from '../pages/dashboard/resumen/ResumenMedicoPage';
import { ActividadMedicoPage } from '../pages/dashboard/actividad/ActividadMedicoPage';
import AgendaConsultasPage from '../pages/consultas/agenda/AgendaConsultasPage';
import { NuevaConsultaPage } from '../pages/consultas/nueva/NuevaConsultaPage';

const PagePlaceholder: React.FC<{ title: string; category?: string }> = ({ title, category }) => (
  <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
    {category && (
      <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1 block">
        {category}
      </span>
    )}
    <h1 className="text-xl font-bold text-slate-800">{title}</h1>
    <p className="text-sm text-slate-500 mt-1">
      Esta vista está integrada dentro de la estructura de layout y navegación del Portal Médico.
    </p>
  </div>
);

export const MedicoRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MedicoLayout />}>
        {/* Redirección por defecto hacia la Agenda Médica */}
        <Route index element={<Navigate to="consultas/agenda" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Navigate to="dashboard/resumen" replace />} />
        <Route path="dashboard/resumen" element={<ResumenMedicoPage />} />
        <Route path="dashboard/actividad" element={<ActividadMedicoPage />} />

        {/* Consultas - Vistas Reales Conectadas */}
        <Route path="consultas/agenda" element={<AgendaConsultasPage />} />
        <Route path="consultas/nueva" element={<NuevaConsultaPage />} />

        <Route
          path="consultas/seguimiento"
          element={<PagePlaceholder title="Seguimiento de Consultas" category="Consultas" />}
        />

        {/* Evaluación */}
        <Route
          path="evaluacion/signos-vitales"
          element={<PagePlaceholder title="Signos Vitales" category="Evaluación" />}
        />
        <Route
          path="evaluacion/anamnesis"
          element={<PagePlaceholder title="Anamnesis" category="Evaluación" />}
        />
        <Route
          path="evaluacion/examen-fisico"
          element={<PagePlaceholder title="Examen Físico" category="Evaluación" />}
        />
        <Route
          path="evaluacion/observaciones"
          element={<PagePlaceholder title="Observaciones Clínicas" category="Evaluación" />}
        />

        {/* Diagnósticos */}
        <Route
          path="diagnosticos/nuevo"
          element={<PagePlaceholder title="Nuevo Diagnóstico" category="Diagnósticos" />}
        />
        <Route
          path="diagnosticos/historial"
          element={<PagePlaceholder title="Historial de Diagnósticos" category="Diagnósticos" />}
        />
        <Route
          path="diagnosticos/catalogo"
          element={<PagePlaceholder title="Catálogo ICD" category="Diagnósticos" />}
        />

        {/* Tratamientos */}
        <Route
          path="tratamientos/plan"
          element={<PagePlaceholder title="Plan de Tratamiento" category="Tratamientos" />}
        />
        <Route
          path="tratamientos/medicamentos"
          element={<PagePlaceholder title="Medicamentos" category="Tratamientos" />}
        />
        <Route
          path="tratamientos/seguimiento"
          element={<PagePlaceholder title="Seguimiento de Tratamiento" category="Tratamientos" />}
        />
        <Route
          path="tratamientos/historial"
          element={<PagePlaceholder title="Historial de Tratamientos" category="Tratamientos" />}
        />

        {/* Recetas */}
        <Route
          path="recetas/activas"
          element={<PagePlaceholder title="Recetas Activas" category="Recetas" />}
        />
        <Route
          path="recetas/nueva"
          element={<PagePlaceholder title="Nueva Receta" category="Recetas" />}
        />
        <Route
          path="recetas/historial"
          element={<PagePlaceholder title="Historial de Recetas" category="Recetas" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="consultas/agenda" replace />} />
      </Route>
    </Routes>
  );
};

export default MedicoRoutes;