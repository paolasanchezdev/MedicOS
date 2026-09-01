// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/routes/BrigadistaRoutes.tsx
// DESCRIPCIÓN: Enrutador del Portal Brigadista con rutas absolutas y submódulos conectados.
// =========================================================================

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { BrigadistaLayout } from '../layout/BrigadistaLayout';
import { ResumenBrigadistaPage } from '../pages/dashboard/resumen/ResumenBrigadistaPage';
import { ActividadBrigadistaPage } from '../pages/dashboard/actividad/ActividadBrigadistaPage';
import { ResumenBrigadaPage } from '../pages/brigada/resumen/ResumenBrigadaPage';
import { JornadaBrigadaPage } from '../pages/brigada/jornada/JornadaBrigadaPage';
import { PacientesBrigadaPage } from '../pages/brigada/pacientes/PacientesBrigadaPage';
import { BuscarPacientePage } from '../pages/pacientes/buscar/BuscarPacientePage';
import { RegistrarPacientePage } from '../pages/pacientes/registrar/RegistrarPacientePage';
import { ExpedientePacientePage } from '../pages/pacientes/expediente/ExpedientePacientePage';
import { NuevaAtencionPage } from '../pages/atencion/nueva/NuevaAtencionPage';
import { AtencionesPendientesPage } from '../pages/atencion/pendientes/AtencionesPendientesPage';
import { HistorialAtencionesPage } from '../pages/atencion/historial/HistorialAtencionesPage';
import { VacunacionResumenPage } from '../pages/promocion-prevencion/vacunacion/resumen/VacunacionResumenPage';
import { RegistroVacunacionPage } from '../pages/promocion-prevencion/vacunacion/registro/RegistroVacunacionPage';
import { HistorialVacunacionPage } from '../pages/promocion-prevencion/vacunacion/historial/HistorialVacunacionPage';

const PagePlaceholder: React.FC<{ title: string; category?: string }> = ({ title, category }) => (
  <div className="p-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-1">
    {category && (
      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 block">
        {category}
      </span>
    )}
    <h1 className="text-lg font-bold text-slate-900">{title}</h1>
    <p className="text-xs text-slate-500 font-medium">
      Esta vista está integrada dentro del flujo operativo del Portal Brigadista.
    </p>
  </div>
);

export const BrigadistaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<BrigadistaLayout />}>
        {/* Redirección por defecto */}
        <Route index element={<Navigate to="/brigadista/dashboard/resumen" replace />} />

        {/* 1. Dashboard */}
        <Route path="dashboard" element={<Navigate to="/brigadista/dashboard/resumen" replace />} />
        <Route path="dashboard/resumen" element={<ResumenBrigadistaPage />} />
        <Route path="dashboard/actividad" element={<ActividadBrigadistaPage />} />

        {/* 2. Brigada */}
        <Route path="brigada" element={<Navigate to="/brigadista/brigada/resumen" replace />} />
        <Route path="brigada/resumen" element={<ResumenBrigadaPage />} />
        <Route path="brigada/jornada" element={<JornadaBrigadaPage />} />
        <Route path="brigada/pacientes" element={<PacientesBrigadaPage />} />

        {/* 3. Pacientes */}
        <Route path="pacientes" element={<Navigate to="/brigadista/pacientes/buscar" replace />} />
        <Route path="pacientes/buscar" element={<BuscarPacientePage />} />
        <Route path="pacientes/registrar" element={<RegistrarPacientePage />} />
        <Route
          path="pacientes/escanear"
          element={<PagePlaceholder title="Escanear QR / ID" category="Pacientes" />}
        />
        <Route path="pacientes/expediente" element={<ExpedientePacientePage />} />

        {/* 4. Atención */}
        <Route path="atencion" element={<Navigate to="/brigadista/atencion/nueva" replace />} />
        <Route path="atencion/nueva" element={<NuevaAtencionPage />} />
        <Route path="atencion/pendientes" element={<AtencionesPendientesPage />} />
        <Route path="atencion/historial" element={<HistorialAtencionesPage />} />

        {/* 5. Promoción y Prevención: Vacunación */}
        <Route
          path="promocion-prevencion"
          element={<Navigate to="/brigadista/promocion-prevencion/vacunacion/resumen" replace />}
        />
        <Route
          path="promocion-prevencion/vacunacion"
          element={<Navigate to="/brigadista/promocion-prevencion/vacunacion/resumen" replace />}
        />
        <Route
          path="promocion-prevencion/vacunacion/resumen"
          element={<VacunacionResumenPage />}
        />
        <Route
          path="promocion-prevencion/vacunacion/registro"
          element={<RegistroVacunacionPage />}
        />
        <Route
          path="promocion-prevencion/vacunacion/historial"
          element={<HistorialVacunacionPage />}
        />

        <Route
          path="promocion-prevencion/materno-infantil"
          element={<PagePlaceholder title="Materno-Infantil" category="Promoción y Prevención" />}
        />
        <Route
          path="promocion-prevencion/nutricion"
          element={<PagePlaceholder title="Nutrición" category="Promoción y Prevención" />}
        />
        <Route
          path="promocion-prevencion/educacion-prevencion"
          element={<PagePlaceholder title="Educación y Prevención" category="Promoción y Prevención" />}
        />

        {/* 6. Seguimiento */}
        <Route path="seguimiento" element={<Navigate to="/brigadista/seguimiento/pacientes" replace />} />
        <Route
          path="seguimiento/pacientes"
          element={<PagePlaceholder title="Pacientes en Seguimiento" category="Seguimiento" />}
        />
        <Route
          path="seguimiento/controles"
          element={<PagePlaceholder title="Controles" category="Seguimiento" />}
        />
        <Route
          path="seguimiento/alertas"
          element={<PagePlaceholder title="Alertas" category="Seguimiento" />}
        />

        {/* 7. Visitas */}
        <Route path="visitas" element={<Navigate to="/brigadista/visitas/nueva" replace />} />
        <Route
          path="visitas/nueva"
          element={<PagePlaceholder title="Nueva Visita" category="Visitas" />}
        />
        <Route
          path="visitas/programadas"
          element={<PagePlaceholder title="Visitas Programadas" category="Visitas" />}
        />
        <Route
          path="visitas/realizadas"
          element={<PagePlaceholder title="Visitas Realizadas" category="Visitas" />}
        />

        {/* 8. Referencias */}
        <Route path="referencias" element={<Navigate to="/brigadista/referencias/nueva" replace />} />
        <Route
          path="referencias/nueva"
          element={<PagePlaceholder title="Nueva Referencia" category="Referencias" />}
        />
        <Route
          path="referencias/pendientes"
          element={<PagePlaceholder title="Referencias Pendientes" category="Referencias" />}
        />
        <Route
          path="referencias/historial"
          element={<PagePlaceholder title="Historial de Referencias" category="Referencias" />}
        />

        {/* 9. Mapa */}
        <Route path="mapa" element={<Navigate to="/brigadista/mapa/ubicacion" replace />} />
        <Route
          path="mapa/ubicacion"
          element={<PagePlaceholder title="Ubicación" category="Mapa" />}
        />
        <Route
          path="mapa/pacientes"
          element={<PagePlaceholder title="Pacientes" category="Mapa" />}
        />
        <Route
          path="mapa/establecimientos"
          element={<PagePlaceholder title="Establecimientos" category="Mapa" />}
        />

        {/* 10. Sincronización */}
        <Route path="sincronizacion" element={<Navigate to="/brigadista/sincronizacion/estado" replace />} />
        <Route
          path="sincronizacion/estado"
          element={<PagePlaceholder title="Estado" category="Sincronización" />}
        />
        <Route
          path="sincronizacion/pendientes"
          element={<PagePlaceholder title="Pendientes" category="Sincronización" />}
        />
        <Route
          path="sincronizacion/historial"
          element={<PagePlaceholder title="Historial" category="Sincronización" />}
        />

        {/* 11. Notificaciones */}
        <Route path="notificaciones" element={<Navigate to="/brigadista/notificaciones/centro" replace />} />
        <Route
          path="notificaciones/centro"
          element={<PagePlaceholder title="Centro de Notificaciones" category="Notificaciones" />}
        />
        <Route
          path="notificaciones/alertas"
          element={<PagePlaceholder title="Alertas" category="Notificaciones" />}
        />

        {/* 12. Reportes */}
        <Route path="reportes" element={<Navigate to="/brigadista/reportes/brigada" replace />} />
        <Route
          path="reportes/brigada"
          element={<PagePlaceholder title="Reportes de Brigada" category="Reportes" />}
        />
        <Route
          path="reportes/pacientes"
          element={<PagePlaceholder title="Reportes de Pacientes" category="Reportes" />}
        />
        <Route
          path="reportes/atencion"
          element={<PagePlaceholder title="Reportes de Atención" category="Reportes" />}
        />
        <Route
          path="reportes/seguimiento"
          element={<PagePlaceholder title="Reportes de Seguimiento" category="Reportes" />}
        />
        <Route
          path="reportes/visitas"
          element={<PagePlaceholder title="Reportes de Visitas" category="Reportes" />}
        />

        {/* 13. Perfil */}
        <Route path="perfil" element={<Navigate to="/brigadista/perfil/datos" replace />} />
        <Route
          path="perfil/datos"
          element={<PagePlaceholder title="Mis Datos" category="Perfil" />}
        />
        <Route
          path="perfil/preferencias"
          element={<PagePlaceholder title="Preferencias" category="Perfil" />}
        />
        <Route
          path="perfil/seguridad"
          element={<PagePlaceholder title="Seguridad" category="Perfil" />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/brigadista/dashboard/resumen" replace />} />
      </Route>
    </Routes>
  );
};

export default BrigadistaRoutes;