import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../layout/AdminLayout';

// Brigadas
import { EquiposBrigadasPage } from '../pages/brigadas/equipos/EquiposBrigadasPage';
import { EstadoBrigadasPage } from '../pages/brigadas/estado/EstadoBrigadasPage';
import { ResponsablesBrigadasPage } from '../pages/brigadas/responsables/ResponsablesBrigadasPage';
import { BrigadasPage } from '../pages/brigadas/todas/BrigadasPage';

// Configuración
import { ConfiguracionGeneralPage } from '../pages/configuracion/general/ConfiguracionGeneralPage';
import { ConfiguracionNotificacionesPage } from '../pages/configuracion/notificaciones/ConfiguracionNotificacionesPage';
import { PreferenciasPage } from '../pages/configuracion/preferencias/PreferenciasPage';
import { ConfiguracionSeguridadPage } from '../pages/configuracion/seguridad/ConfiguracionSeguridadPage';

// Dashboard
import { ActividadSistemaPage } from '../pages/dashboard/actividad/ActividadSistemaPage';
import { ResumenAdminPage } from '../pages/dashboard/resumen/ResumenAdminPage';

// Datos
import { ExportacionDatosPage } from '../pages/datos/exportacion/ExportacionDatosPage';
import { ImportacionDatosPage } from '../pages/datos/importacion/ImportacionDatosPage';
import { IntegridadDatosPage } from '../pages/datos/integridad/IntegridadDatosPage';
import { SincronizacionPage } from '../pages/datos/sincronizacion/SincronizacionPage';

// Establecimientos
import { ClinicasPage } from '../pages/establecimientos/clinicas/ClinicasPage';
import { HospitalesPage } from '../pages/establecimientos/hospitales/HospitalesPage';
import { RecursosEstablecimientosPage } from '../pages/establecimientos/recursos/RecursosEstablecimientosPage';
import { UnidadesSaludPage } from '../pages/establecimientos/unidades-salud/UnidadesSaludPage';

// Notificaciones
import { CentroNotificacionesPage } from '../pages/notificaciones/centro/CentroNotificacionesPage';
import { HistorialNotificacionesPage } from '../pages/notificaciones/historial/HistorialNotificacionesPage';
import { PlantillasNotificacionesPage } from '../pages/notificaciones/plantillas/PlantillasNotificacionesPage';

// Pacientes
import { EstadoRegistrosPage } from '../pages/pacientes/estado-registros/EstadoRegistrosPage';
import { IdentificacionPacientesPage } from '../pages/pacientes/identificacion/IdentificacionPacientesPage';
import { PacientesPage } from '../pages/pacientes/todos/PacientesPage';

// Reportes
import { ReportesActividadPage } from '../pages/reportes/actividad/ReportesActividadPage';
import { ExportacionesPage } from '../pages/reportes/exportaciones/ExportacionesPage';
import { ReportesSistemaPage } from '../pages/reportes/sistema/ReportesSistemaPage';
import { ReportesUsuariosPage } from '../pages/reportes/usuarios/ReportesUsuariosPage';

// Seguridad
import { AccesosPage } from '../pages/seguridad/accesos/AccesosPage';
import { AuditoriaPage } from '../pages/seguridad/auditoria/AuditoriaPage';
import { EventosSeguridadPage } from '../pages/seguridad/eventos/EventosSeguridadPage';
import { SesionesActivasPage } from '../pages/seguridad/sesiones/SesionesActivasPage';

// Sistema
import { EstadoBaseDatosPage } from '../pages/sistema/base-datos/EstadoBaseDatosPage';
import { SaludSistemaPage } from '../pages/sistema/salud/SaludSistemaPage';
import { ServiciosSistemaPage } from '../pages/sistema/servicios/ServiciosSistemaPage';
import { EstadoSincronizacionPage } from '../pages/sistema/sincronizacion/EstadoSincronizacionPage';

// Usuarios
import { EstadoUsuariosPage } from '../pages/usuarios/estado/EstadoUsuariosPage';
import { PermisosPage } from '../pages/usuarios/permisos/PermisosPage';
import { RolesPage } from '../pages/usuarios/roles/RolesPage';
import { UsuariosPage } from '../pages/usuarios/todos/UsuariosPage';

export const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard/resumen" replace />} />

        {/* Dashboard */}
        <Route path="dashboard/resumen" element={<ResumenAdminPage />} />
        <Route path="dashboard/actividad" element={<ActividadSistemaPage />} />

        {/* Usuarios */}
        <Route path="usuarios/todos" element={<UsuariosPage />} />
        <Route path="usuarios/roles" element={<RolesPage />} />
        <Route path="usuarios/permisos" element={<PermisosPage />} />
        <Route path="usuarios/estado" element={<EstadoUsuariosPage />} />

        {/* Establecimientos */}
        <Route path="establecimientos/hospitales" element={<HospitalesPage />} />
        <Route path="establecimientos/clinicas" element={<ClinicasPage />} />
        <Route path="establecimientos/unidades-salud" element={<UnidadesSaludPage />} />
        <Route path="establecimientos/recursos" element={<RecursosEstablecimientosPage />} />

        {/* Brigadas */}
        <Route path="brigadas/todas" element={<BrigadasPage />} />
        <Route path="brigadas/equipos" element={<EquiposBrigadasPage />} />
        <Route path="brigadas/responsables" element={<ResponsablesBrigadasPage />} />
        <Route path="brigadas/estado" element={<EstadoBrigadasPage />} />

        {/* Pacientes */}
        <Route path="pacientes/todos" element={<PacientesPage />} />
        <Route path="pacientes/identificacion" element={<IdentificacionPacientesPage />} />
        <Route path="pacientes/estado-registros" element={<EstadoRegistrosPage />} />

        {/* Datos */}
        <Route path="datos/exportacion" element={<ExportacionDatosPage />} />
        <Route path="datos/importacion" element={<ImportacionDatosPage />} />
        <Route path="datos/integridad" element={<IntegridadDatosPage />} />
        <Route path="datos/sincronizacion" element={<SincronizacionPage />} />

        {/* Notificaciones */}
        <Route path="notificaciones/centro" element={<CentroNotificacionesPage />} />
        <Route path="notificaciones/historial" element={<HistorialNotificacionesPage />} />
        <Route path="notificaciones/plantillas" element={<PlantillasNotificacionesPage />} />

        {/* Reportes */}
        <Route path="reportes/actividad" element={<ReportesActividadPage />} />
        <Route path="reportes/exportaciones" element={<ExportacionesPage />} />
        <Route path="reportes/sistema" element={<ReportesSistemaPage />} />
        <Route path="reportes/usuarios" element={<ReportesUsuariosPage />} />

        {/* Sistema */}
        <Route path="sistema/salud" element={<SaludSistemaPage />} />
        <Route path="sistema/base-datos" element={<EstadoBaseDatosPage />} />
        <Route path="sistema/servicios" element={<ServiciosSistemaPage />} />
        <Route path="sistema/sincronizacion" element={<EstadoSincronizacionPage />} />

        {/* Seguridad */}
        <Route path="seguridad/accesos" element={<AccesosPage />} />
        <Route path="seguridad/auditoria" element={<AuditoriaPage />} />
        <Route path="seguridad/eventos" element={<EventosSeguridadPage />} />
        <Route path="seguridad/sesiones" element={<SesionesActivasPage />} />

        {/* Configuración */}
        <Route path="configuracion/general" element={<ConfiguracionGeneralPage />} />
        <Route path="configuracion/notificaciones" element={<ConfiguracionNotificacionesPage />} />
        <Route path="configuracion/preferencias" element={<PreferenciasPage />} />
        <Route path="configuracion/seguridad" element={<ConfiguracionSeguridadPage />} />

        <Route path="*" element={<Navigate to="dashboard/resumen" replace />} />
      </Route>
    </Routes>
  );
};