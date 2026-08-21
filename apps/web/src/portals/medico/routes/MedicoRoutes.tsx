// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/routes/MedicoRoutes.tsx
// DESCRIPCIÓN: Definición de rutas del Portal Médico alineada a la navegación simplificada.
// =========================================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MedicoLayout } from '../layout/MedicoLayout';
import { ResumenMedicoPage } from '../pages/dashboard/resumen/ResumenMedicoPage';
import { ActividadMedicoPage } from '../pages/dashboard/actividad/ActividadMedicoPage';

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
        <Route index element={<Navigate to="dashboard/resumen" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Navigate to="dashboard/resumen" replace />} />
        <Route path="dashboard/resumen" element={<ResumenMedicoPage />} />
        <Route path="dashboard/actividad" element={<ActividadMedicoPage />} />

        {/* Consultas */}
        <Route
          path="consultas/nueva"
          element={<PagePlaceholder title="Nueva Consulta" category="Consultas" />}
        />
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

        {/* Estudios */}
        <Route
          path="estudios/solicitar"
          element={<PagePlaceholder title="Solicitar Estudio" category="Estudios" />}
        />
        <Route
          path="estudios/resultados"
          element={<PagePlaceholder title="Resultados de Estudios" category="Estudios" />}
        />
        <Route
          path="estudios/laboratorio"
          element={<PagePlaceholder title="Laboratorio" category="Estudios" />}
        />
        <Route
          path="estudios/imagen"
          element={<PagePlaceholder title="Imagenología" category="Estudios" />}
        />

        {/* Expediente */}
        <Route
          path="expediente/consultas"
          element={<PagePlaceholder title="Consultas de Expediente" category="Expediente" />}
        />
        <Route
          path="expediente/diagnosticos"
          element={<PagePlaceholder title="Diagnósticos de Expediente" category="Expediente" />}
        />
        <Route
          path="expediente/medicamentos"
          element={<PagePlaceholder title="Medicamentos de Expediente" category="Expediente" />}
        />
        <Route
          path="expediente/signos-vitales"
          element={<PagePlaceholder title="Signos Vitales de Expediente" category="Expediente" />}
        />
        <Route
          path="expediente/antecedentes"
          element={<PagePlaceholder title="Antecedentes y Alergias" category="Expediente" />}
        />
        <Route
          path="expediente/vacunas"
          element={<PagePlaceholder title="Vacunas del Paciente" category="Expediente" />}
        />

        {/* Salud Materna */}
        <Route
          path="salud-materna/embarazo"
          element={<PagePlaceholder title="Control de Embarazo" category="Salud Materna" />}
        />
        <Route
          path="salud-materna/controles-prenatales"
          element={<PagePlaceholder title="Controles Prenatales" category="Salud Materna" />}
        />
        <Route
          path="salud-materna/seguimiento"
          element={<PagePlaceholder title="Seguimiento Materno" category="Salud Materna" />}
        />

        {/* Pacientes */}
        <Route
          path="pacientes/listado"
          element={<PagePlaceholder title="Listado de Pacientes" category="Pacientes" />}
        />
        <Route
          path="pacientes/buscar"
          element={<PagePlaceholder title="Buscar Paciente" category="Pacientes" />}
        />
        <Route
          path="pacientes/qr"
          element={<PagePlaceholder title="Lector QR" category="Pacientes" />}
        />
        <Route
          path="pacientes/detalle"
          element={<PagePlaceholder title="Detalle del Paciente" category="Pacientes" />}
        />
        <Route
          path="pacientes/detalle/:id"
          element={<PagePlaceholder title="Detalle del Paciente" category="Pacientes" />}
        />

        {/* Reportes */}
        <Route
          path="reportes/consultas"
          element={<PagePlaceholder title="Reporte de Consultas" category="Reportes" />}
        />
        <Route
          path="reportes/pacientes"
          element={<PagePlaceholder title="Reporte de Pacientes" category="Reportes" />}
        />
        <Route
          path="reportes/clinicos"
          element={<PagePlaceholder title="Reportes Clínicos" category="Reportes" />}
        />
        <Route
          path="reportes/brigadas"
          element={<PagePlaceholder title="Reporte de Brigadas" category="Reportes" />}
        />

        {/* Asistencia Clínica (IA) */}
        <Route
          path="ia/asistente"
          element={<PagePlaceholder title="Asistente Clínico IA" category="Asistencia Clínica" />}
        />
        <Route
          path="ia/analisis"
          element={<PagePlaceholder title="Análisis IA" category="Asistencia Clínica" />}
        />
        <Route
          path="ia/alertas"
          element={<PagePlaceholder title="Alertas IA" category="Asistencia Clínica" />}
        />
        <Route
          path="ia/historial"
          element={<PagePlaceholder title="Historial de Análisis IA" category="Asistencia Clínica" />}
        />

        {/* Notificaciones */}
        <Route
          path="notificaciones/centro"
          element={<PagePlaceholder title="Centro de Notificaciones" category="Notificaciones" />}
        />
        <Route
          path="notificaciones/alertas"
          element={<PagePlaceholder title="Alertas de Notificación" category="Notificaciones" />}
        />
        <Route
          path="notificaciones/mensajes"
          element={<PagePlaceholder title="Mensajes" category="Notificaciones" />}
        />

        {/* Perfil */}
        <Route
          path="perfil/datos-profesionales"
          element={<PagePlaceholder title="Datos Profesionales" category="Perfil" />}
        />
        <Route
          path="perfil/especialidad"
          element={<PagePlaceholder title="Especialidad" category="Perfil" />}
        />
        <Route
          path="perfil/preferencias"
          element={<PagePlaceholder title="Preferencias del Médico" category="Perfil" />}
        />
        <Route
          path="perfil/seguridad"
          element={<PagePlaceholder title="Seguridad de la Cuenta" category="Perfil" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="dashboard/resumen" replace />} />
      </Route>
    </Routes>
  );
};

export default MedicoRoutes;