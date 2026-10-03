
// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/routes/BrigadistaRoutes.tsx
// DESCRIPCIÓN: Enrutador del Portal Brigadista con Dashboard principal,
//              módulos funcionales y rutas de secciones en construcción.
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

import { ResumenMaternoInfantilPage } from '../pages/promocion-prevencion/materno-infantil/ResumenMaternoInfantilPage';
import { ResumenNutricionPage } from '../pages/promocion-prevencion/nutricion/ResumenNutricionPage';
import { ResumenEducacionPrevencionPage } from '../pages/promocion-prevencion/educacion-prevencion/ResumenEducacionPrevencionPage';

import { SeguimientoPacientesPage } from '../pages/seguimiento/pacientes/SeguimientoPacientesPage';

import { VisitasProgramadasPage } from '../pages/visitas/programadas/VisitasProgramadasPage';

import { ReferenciasPendientesPage } from '../pages/referencias/pendientes/ReferenciasPendientesPage';
import { NuevaReferenciaPage } from '../pages/referencias/nueva/NuevaReferenciaPage';
import { HistorialReferenciasPage } from '../pages/referencias/historial/HistorialReferenciasPage';

import { UbicacionPage } from '../pages/mapa/ubicacion/UbicacionPage';
import { MapaEstablecimientosPage } from '../pages/mapa/establecimientos/MapaEstablecimientosPage';

import { ReportesBrigadaPage } from '../pages/reportes/brigada/ReportesBrigadaPage';
import { ReportesPacientesPage } from '../pages/reportes/pacientes/ReportesPacientesPage';
import { ReportesAtencionPage } from '../pages/reportes/atencion/ReportesAtencionPage';

// -------------------------------------------------------------------------
// Componente reutilizable para las secciones que todavía están en
// preparación.
// -------------------------------------------------------------------------
//
// IMPORTANTE:
// Ajustar esta ruta únicamente si UnderConstruction.tsx se encuentra
// en otra ubicación dentro del proyecto.
//
// Ejemplo esperado:
// apps/web/src/components/UnderConstruction.tsx
//
import { UnderConstruction } from '../../../shared/components/UnderConstruction';

// =========================================================================
// RUTAS DEL PORTAL BRIGADISTA
// =========================================================================

export const BrigadistaRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<BrigadistaLayout />}>

        {/* ================================================================
            Entrada principal al Dashboard del Brigadista
            ================================================================ */}

        <Route
          index
          element={
            <Navigate
              to="/brigadista/dashboard/resumen"
              replace
            />
          }
        />

        {/* ================================================================
            1. DASHBOARD PRINCIPAL
            ================================================================ */}

        <Route
          path="dashboard"
          element={
            <Navigate
              to="/brigadista/dashboard/resumen"
              replace
            />
          }
        />

        <Route
          path="dashboard/resumen"
          element={<ResumenBrigadistaPage />}
        />

        <Route
          path="dashboard/actividad"
          element={<ActividadBrigadistaPage />}
        />

        {/* ================================================================
            2. MI JORNADA
            ================================================================ */}

        <Route
          path="brigada/jornada"
          element={<JornadaBrigadaPage />}
        />

        <Route
          path="brigada/pacientes"
          element={<PacientesBrigadaPage />}
        />

        {/* ================================================================
            3. BRIGADA
            ================================================================ */}

        <Route
          path="brigada"
          element={
            <Navigate
              to="/brigadista/brigada/resumen"
              replace
            />
          }
        />

        <Route
          path="brigada/resumen"
          element={<ResumenBrigadaPage />}
        />

        {/* ================================================================
            4. PADRÓN COMUNITARIO
            ================================================================ */}

        <Route
          path="pacientes"
          element={
            <Navigate
              to="/brigadista/pacientes/buscar"
              replace
            />
          }
        />

        <Route
          path="pacientes/buscar"
          element={<BuscarPacientePage />}
        />

        <Route
          path="pacientes/registrar"
          element={<RegistrarPacientePage />}
        />

        <Route
          path="pacientes/escanear"
          element={<EscanearPacientePage />}
        />

        <Route
          path="pacientes/expediente"
          element={<ExpedientePacientePage />}
        />

        {/* ================================================================
            5. ATENCIÓN
            ================================================================ */}

        <Route
          path="atencion"
          element={
            <Navigate
              to="/brigadista/atencion/nueva"
              replace
            />
          }
        />

        <Route
          path="atencion/nueva"
          element={<NuevaAtencionPage />}
        />

        <Route
          path="atencion/historial"
          element={<HistorialAtencionesPage />}
        />

        <Route
          path="atencion/pendientes"
          element={<AtencionesPendientesPage />}
        />

        {/* ================================================================
            6. PROMOCIÓN Y PREVENCIÓN
            ================================================================ */}

        <Route
          path="promocion-prevencion"
          element={
            <Navigate
              to="/brigadista/promocion-prevencion/vacunacion/resumen"
              replace
            />
          }
        />

        <Route
          path="promocion-prevencion/vacunacion"
          element={
            <Navigate
              to="/brigadista/promocion-prevencion/vacunacion/resumen"
              replace
            />
          }
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
          element={<ResumenMaternoInfantilPage />}
        />

        <Route
          path="promocion-prevencion/nutricion"
          element={<ResumenNutricionPage />}
        />

        <Route
          path="promocion-prevencion/educacion-prevencion"
          element={<ResumenEducacionPrevencionPage />}
        />

        {/* ================================================================
            7. CONTINUIDAD
            ================================================================ */}

        <Route
          path="seguimiento"
          element={
            <Navigate
              to="/brigadista/seguimiento/pacientes"
              replace
            />
          }
        />

        <Route
          path="seguimiento/pacientes"
          element={<SeguimientoPacientesPage />}
        />

        <Route
          path="visitas"
          element={
            <Navigate
              to="/brigadista/visitas/programadas"
              replace
            />
          }
        />

        <Route
          path="visitas/programadas"
          element={<VisitasProgramadasPage />}
        />

        {/* Visita domiciliaria — EN CONSTRUCCIÓN */}
        <Route
          path="visitas/nueva"
          element={
            <UnderConstruction
              title="Registro de Visita Domiciliaria"
              category="Continuidad"
              description="Esta funcionalidad estará disponible próximamente en MedicOS."
            />
          }
        />

        {/* Historial de visitas — EN CONSTRUCCIÓN */}
        <Route
          path="visitas/realizadas"
          element={
            <UnderConstruction
              title="Historial de Visitas Domiciliarias"
              category="Continuidad"
              description="Esta funcionalidad estará disponible próximamente en MedicOS."
            />
          }
        />

        <Route
          path="referencias"
          element={
            <Navigate
              to="/brigadista/referencias/pendientes"
              replace
            />
          }
        />

        <Route
          path="referencias/pendientes"
          element={<ReferenciasPendientesPage />}
        />

        <Route
          path="referencias/nueva"
          element={<NuevaReferenciaPage />}
        />

        <Route
          path="referencias/historial"
          element={<HistorialReferenciasPage />}
        />

        {/* ================================================================
            8. HERRAMIENTAS
            ================================================================ */}

        <Route
          path="mapa"
          element={
            <Navigate
              to="/brigadista/mapa/ubicacion"
              replace
            />
          }
        />

        <Route
          path="mapa/ubicacion"
          element={<UbicacionPage />}
        />

        <Route
          path="mapa/establecimientos"
          element={<MapaEstablecimientosPage />}
        />

        {/* Geolocalización de pacientes — EN CONSTRUCCIÓN */}
        <Route
          path="mapa/pacientes"
          element={
            <UnderConstruction
              title="Geolocalización de Pacientes"
              category="Herramientas"
              description="Esta funcionalidad estará disponible próximamente en MedicOS."
            />
          }
        />

        {/* ================================================================
            9. REPORTES
            ================================================================ */}

        <Route
          path="reportes"
          element={
            <Navigate
              to="/brigadista/reportes/brigada"
              replace
            />
          }
        />

        <Route
          path="reportes/brigada"
          element={<ReportesBrigadaPage />}
        />

        <Route
          path="reportes/pacientes"
          element={<ReportesPacientesPage />}
        />

        <Route
          path="reportes/atencion"
          element={<ReportesAtencionPage />}
        />

        {/* Reporte de seguimiento — EN CONSTRUCCIÓN */}
        <Route
          path="reportes/seguimiento"
          element={
            <UnderConstruction
              title="Reporte de Cobertura de Seguimiento"
              category="Reportes"
              description="Este reporte estará disponible próximamente en MedicOS."
            />
          }
        />

        {/* Reporte de visitas — EN CONSTRUCCIÓN */}
        <Route
          path="reportes/visitas"
          element={
            <UnderConstruction
              title="Reporte de Visitas Domiciliarias Realizadas"
              category="Reportes"
              description="Este reporte estará disponible próximamente en MedicOS."
            />
          }
        />

        {/* ================================================================
            SERVICIOS TRANSVERSALES
            ================================================================ */}

        <Route
          path="sincronizacion/estado"
          element={
            <Navigate
              to="/brigadista/atencion/pendientes"
              replace
            />
          }
        />

        {/* Centro de notificaciones — EN CONSTRUCCIÓN */}
        <Route
          path="notificaciones/centro"
          element={
            <UnderConstruction
              title="Centro de Notificaciones"
              category="Sistema"
              description="El centro de notificaciones estará disponible próximamente en MedicOS."
            />
          }
        />

        {/* ================================================================
            PERFIL
            ================================================================ */}

        {/* Datos del brigadista — EN CONSTRUCCIÓN */}
        <Route
          path="perfil/datos"
          element={
            <UnderConstruction
              title="Datos del Brigadista"
              category="Perfil"
              description="La gestión de los datos del perfil estará disponible próximamente."
            />
          }
        />

        {/* Preferencias — EN CONSTRUCCIÓN */}
        <Route
          path="perfil/preferencias"
          element={
            <UnderConstruction
              title="Preferencias"
              category="Perfil"
              description="La configuración de preferencias estará disponible próximamente en MedicOS."
            />
          }
        />

        {/* Seguridad — EN CONSTRUCCIÓN */}
        <Route
          path="perfil/seguridad"
          element={
            <UnderConstruction
              title="Seguridad de la Cuenta"
              category="Perfil"
              description="Las opciones adicionales de seguridad estarán disponibles próximamente."
            />
          }
        />

        {/* ================================================================
            FALLBACK GENERAL
            ================================================================ */}

        <Route
          path="*"
          element={
            <Navigate
              to="/brigadista/dashboard/resumen"
              replace
            />
          }
        />

      </Route>
    </Routes>
  );
};

export default BrigadistaRoutes;

