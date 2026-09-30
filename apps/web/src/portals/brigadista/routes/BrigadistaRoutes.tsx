// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/routes/BrigadistaRoutes.tsx
// DESCRIPCIÓN: Enrutador del Portal Brigadista con Dashboard principal y 8 familias completas.
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
import { EscanearPacientePage } from '../pages/pacientes/escanear/EscanearPacientePage';
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
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B7A78] block">
        {category}
      </span>
    )}
    <h1 className="text-lg font-bold text-slate-900">{title}</h1>
    <p className="text-xs text-slate-500 font-medium">
      Módulo en desarrollo para sustitución de registro en papel.
    </p>
  </div>
);

export const BrigadistaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<BrigadistaLayout />}>
        {/* Entrada principal al Dashboard del Brigadista */}
        <Route index element={<Navigate to="/brigadista/dashboard/resumen" replace />} />

        {/* 1. Dashboard Principal */}
        <Route path="dashboard" element={<Navigate to="/brigadista/dashboard/resumen" replace />} />
        <Route path="dashboard/resumen" element={<ResumenBrigadistaPage />} />
        <Route path="dashboard/actividad" element={<ActividadBrigadistaPage />} />

        {/* 2. Mi Jornada */}
        <Route path="brigada/jornada" element={<JornadaBrigadaPage />} />
        <Route path="brigada/pacientes" element={<PacientesBrigadaPage />} />

        {/* 3. Brigada */}
        <Route path="brigada" element={<Navigate to="/brigadista/brigada/resumen" replace />} />
        <Route path="brigada/resumen" element={<ResumenBrigadaPage />} />

        {/* 4. Padrón Comunitario */}
        <Route path="pacientes" element={<Navigate to="/brigadista/pacientes/buscar" replace />} />
        <Route path="pacientes/buscar" element={<BuscarPacientePage />} />
        <Route path="pacientes/registrar" element={<RegistrarPacientePage />} />
        <Route path="pacientes/escanear" element={<EscanearPacientePage />} />
        <Route path="pacientes/expediente" element={<ExpedientePacientePage />} />

        {/* 5. Atención */}
        <Route path="atencion" element={<Navigate to="/brigadista/atencion/nueva" replace />} />
        <Route path="atencion/nueva" element={<NuevaAtencionPage />} />
        <Route path="atencion/historial" element={<HistorialAtencionesPage />} />
        <Route path="atencion/pendientes" element={<AtencionesPendientesPage />} />

        {/* 6. Promoción y Prevención */}
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
          element={<PagePlaceholder title="Control Materno-Infantil" category="Promoción y Prevención" />}
        />
        <Route
          path="promocion-prevencion/nutricion"
          element={<PagePlaceholder title="Vigilancia Nutricional Comunitaria" category="Promoción y Prevención" />}
        />
        <Route
          path="promocion-prevencion/educacion-prevencion"
          element={<PagePlaceholder title="Educación Sanitaria y Control de Vectores" category="Promoción y Prevención" />}
        />

        {/* 7. Continuidad */}
        <Route path="seguimiento" element={<Navigate to="/brigadista/seguimiento/pacientes" replace />} />
        <Route
          path="seguimiento/pacientes"
          element={<PagePlaceholder title="Pacientes en Seguimiento Activo" category="Continuidad" />}
        />
        <Route
          path="visitas"
          element={<Navigate to="/brigadista/visitas/programadas" replace />}
        />
        <Route
          path="visitas/programadas"
          element={<PagePlaceholder title="Visitas Domiciliarias Programadas" category="Continuidad" />}
        />
        <Route
          path="visitas/nueva"
          element={<PagePlaceholder title="Registro de Visita Domiciliaria" category="Continuidad" />}
        />
        <Route
          path="visitas/realizadas"
          element={<PagePlaceholder title="Historial de Visitas Domiciliarias" category="Continuidad" />}
        />
        <Route
          path="referencias"
          element={<Navigate to="/brigadista/referencias/pendientes" replace />}
        />
        <Route
          path="referencias/pendientes"
          element={<PagePlaceholder title="Referencias a la Red de Salud (F-01)" category="Continuidad" />}
        />
        <Route
          path="referencias/historial"
          element={<PagePlaceholder title="Historial de Referencias Emitidas" category="Continuidad" />}
        />
        <Route
          path="referencias/nueva"
          element={<PagePlaceholder title="Nueva Referencia Médica" category="Continuidad" />}
        />

        {/* 8. Herramientas */}
        <Route path="mapa" element={<Navigate to="/brigadista/mapa/ubicacion" replace />} />
        <Route
          path="mapa/ubicacion"
          element={<PagePlaceholder title="Mapa Territorial y Georreferenciación" category="Herramientas" />}
        />
        <Route
          path="mapa/establecimientos"
          element={<PagePlaceholder title="Directorio de Establecimientos de Salud" category="Herramientas" />}
        />
        <Route
          path="mapa/pacientes"
          element={<PagePlaceholder title="Geolocalización de Pacientes" category="Herramientas" />}
        />

        {/* 9. Reportes */}
        <Route path="reportes" element={<Navigate to="/brigadista/reportes/brigada" replace />} />
        <Route
          path="reportes/brigada"
          element={<PagePlaceholder title="Reporte Consolidado de Brigada" category="Reportes" />}
        />
        <Route
          path="reportes/pacientes"
          element={<PagePlaceholder title="Reporte Poblacional y Censo" category="Reportes" />}
        />
        <Route
          path="reportes/atencion"
          element={<PagePlaceholder title="Reporte de Morbilidad y Atenciones SOAP" category="Reportes" />}
        />
        <Route
          path="reportes/seguimiento"
          element={<PagePlaceholder title="Reporte de Cobertura de Seguimiento" category="Reportes" />}
        />
        <Route
          path="reportes/visitas"
          element={<PagePlaceholder title="Reporte de Visitas Domiciliarias Realizadas" category="Reportes" />}
        />

        {/* Servicios Transversales */}
        <Route
          path="sincronizacion/estado"
          element={<Navigate to="/brigadista/atencion/pendientes" replace />}
        />
        <Route
          path="notificaciones/centro"
          element={<PagePlaceholder title="Centro de Notificaciones" category="Sistema" />}
        />
        <Route
          path="perfil/datos"
          element={<PagePlaceholder title="Datos del Brigadista" category="Perfil" />}
        />
        <Route
          path="perfil/preferencias"
          element={<PagePlaceholder title="Preferencias" category="Perfil" />}
        />
        <Route
          path="perfil/seguridad"
          element={<PagePlaceholder title="Seguridad de la Cuenta" category="Perfil" />}
        />

        {/* Fallback general */}
        <Route path="*" element={<Navigate to="/brigadista/dashboard/resumen" replace />} />
      </Route>
    </Routes>
  );
};

export default BrigadistaRoutes;