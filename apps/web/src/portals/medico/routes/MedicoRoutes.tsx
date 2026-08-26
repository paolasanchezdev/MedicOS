// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/routes/MedicoRoutes.tsx
// DESCRIPCIÓN: Enrutador del Portal Médico con Nueva Consulta conectada.
// =========================================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MedicoLayout } from '../layout/MedicoLayout';
import { ResumenMedicoPage } from '../pages/dashboard/resumen/ResumenMedicoPage';
import { ActividadMedicoPage } from '../pages/dashboard/actividad/ActividadMedicoPage';
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
        {/* Redirección por defecto */}
        <Route index element={<Navigate to="consultas/nueva" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Navigate to="dashboard/resumen" replace />} />
        <Route path="dashboard/resumen" element={<ResumenMedicoPage />} />
        <Route path="dashboard/actividad" element={<ActividadMedicoPage />} />

        {/* Consultas - Vista Real Conectada */}
        <Route path="consultas/nueva" element={<NuevaConsultaPage />} />
        <Route
          path="consultas/agenda"
          element={<PagePlaceholder title="Agenda de Consultas" category="Consultas" />}
        />
        <Route
          path="consultas/historial"
          element={<PagePlaceholder title="Historial de Consultas" category="Consultas" />}
        />
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
        <Route path="*" element={<Navigate to="consultas/nueva" replace />} />
      </Route>
    </Routes>
  );
};

export default MedicoRoutes;