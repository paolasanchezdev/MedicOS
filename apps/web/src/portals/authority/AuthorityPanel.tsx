import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthorityLayout } from './layout/AuthorityLayout';

const renderPlaceholder = (title: string) => (
  <div className="p-8 bg-white rounded-2xl shadow-sm border border-medicos-soft-border max-w-4xl space-y-3">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medicos-light-bg text-medicos-teal text-xs font-semibold">
      <span className="w-2 h-2 rounded-full bg-medicos-teal animate-pulse" />
      Módulo en construcción
    </div>
    <h1 className="text-2xl font-bold text-medicos-dark-blue">{title}</h1>
    <p className="text-medicos-muted text-sm leading-relaxed">
      Esta sección se encuentra en desarrollo para el monitoreo y seguimiento epidemiológico de la Red Nacional de Salud.
    </p>
  </div>
);

export const AuthorityPanel: React.FC = () => {
  return (
    <Routes>
      <Route element={<AuthorityLayout />}>
        <Route index element={<Navigate to="/autoridad/dashboard/resumen" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Navigate to="/autoridad/dashboard/resumen" replace />} />
        <Route path="dashboard/resumen" element={renderPlaceholder('Resumen General Epidemiológico')} />
        <Route path="dashboard/salud-sistema" element={renderPlaceholder('Salud del Sistema')} />

        {/* Epidemiología */}
        <Route path="epidemiologia" element={<Navigate to="/autoridad/epidemiologia/alertas" replace />} />
        <Route path="epidemiologia/alertas" element={renderPlaceholder('Alertas Epidemiológicas')} />
        <Route path="epidemiologia/vigilancia" element={renderPlaceholder('Vigilancia Epidemiológica')} />
        <Route path="epidemiologia/brotes" element={renderPlaceholder('Brotes Detectados')} />
        <Route path="epidemiologia/tendencias" element={renderPlaceholder('Tendencias y Curvas')} />
        <Route path="epidemiologia/factores-riesgo" element={renderPlaceholder('Factores de Riesgo')} />

        {/* Estadísticas Sanitarias */}
        <Route path="estadisticas" element={<Navigate to="/autoridad/estadisticas/enfermedades" replace />} />
        <Route path="estadisticas/enfermedades" element={renderPlaceholder('Enfermedades y Morbilidad')} />
        <Route path="estadisticas/cobertura" element={renderPlaceholder('Cobertura Sanitaria')} />
        <Route path="estadisticas/demografia" element={renderPlaceholder('Demografía de Pacientes')} />
        <Route path="estadisticas/brigadas" element={renderPlaceholder('Rendimiento de Brigadas')} />
        <Route path="estadisticas/materno-infantil" element={renderPlaceholder('Salud Materno-Infantil')} />
        <Route path="estadisticas/vacunacion" element={renderPlaceholder('Inmunización y Vacunación')} />
        <Route path="estadisticas/comunidades" element={renderPlaceholder('Estadísticas de Comunidades')} />

        {/* Mapas e Inteligencia Territorial */}
        <Route path="mapas" element={<Navigate to="/autoridad/mapas/calor" replace />} />
        <Route path="mapas/calor" element={renderPlaceholder('Mapa de Calor Epidemiológico')} />
        <Route path="mapas/cobertura" element={renderPlaceholder('Mapa de Cobertura')} />
        <Route path="mapas/brigadas" element={renderPlaceholder('Ubicación de Brigadas')} />
        <Route path="mapas/geolocalizacion" element={renderPlaceholder('Geolocalización Comunitaria')} />
        <Route path="mapas/zonas-prioritarias" element={renderPlaceholder('Zonas Prioritarias')} />

        {/* Gestión de Brigadas */}
        <Route path="brigadas" element={<Navigate to="/autoridad/brigadas/cobertura" replace />} />
        <Route path="brigadas/cobertura" element={renderPlaceholder('Cobertura Terrenal')} />
        <Route path="brigadas/programadas" element={renderPlaceholder('Brigadas Programadas')} />
        <Route path="brigadas/historial" element={renderPlaceholder('Historial de Brigadas')} />
        <Route path="brigadas/resultados" element={renderPlaceholder('Resultados y Métricas')} />

        {/* Campañas de Salud */}
        <Route path="campanas" element={<Navigate to="/autoridad/campanas/activas" replace />} />
        <Route path="campanas/activas" element={renderPlaceholder('Campañas Activas')} />
        <Route path="campanas/planificacion" element={renderPlaceholder('Planificación Estratégica')} />
        <Route path="campanas/seguimiento" element={renderPlaceholder('Seguimiento de Avance')} />
        <Route path="campanas/resultados" element={renderPlaceholder('Resultados e Impacto')} />

        {/* Establecimientos de Salud */}
        <Route path="establecimientos" element={<Navigate to="/autoridad/establecimientos/hospitales" replace />} />
        <Route path="establecimientos/hospitales" element={renderPlaceholder('Hospitales de Red')} />
        <Route path="establecimientos/unidades" element={renderPlaceholder('Unidades de Salud')} />
        <Route path="establecimientos/clinicas" element={renderPlaceholder('Clínicas Comunitarias')} />
        <Route path="establecimientos/recursos" element={renderPlaceholder('Capacidad y Recursos')} />

        {/* Inteligencia Artificial */}
        <Route path="ia" element={<Navigate to="/autoridad/ia/predicciones" replace />} />
        <Route path="ia/predicciones" element={renderPlaceholder('Predicciones de Brotes')} />
        <Route path="ia/recomendaciones" element={renderPlaceholder('Recomendaciones IA')} />
        <Route path="ia/tendencias" element={renderPlaceholder('Análisis de Tendencias IA')} />
        <Route path="ia/resumenes" element={renderPlaceholder('Resúmenes Automatizados')} />
        <Route path="ia/consultas" element={renderPlaceholder('Consultas Asistidas')} />

        {/* Reportes e Informes */}
        <Route path="reportes" element={<Navigate to="/autoridad/reportes/ejecutivos" replace />} />
        <Route path="reportes/ejecutivos" element={renderPlaceholder('Informes Ejecutivos')} />
        <Route path="reportes/epidemiologicos" element={renderPlaceholder('Reportes Epidemiológicos')} />
        <Route path="reportes/brigadas" element={renderPlaceholder('Reportes de Brigadas')} />
        <Route path="reportes/personalizados" element={renderPlaceholder('Reportes Personalizados')} />
        <Route path="reportes/exportaciones" element={renderPlaceholder('Centro de Exportaciones')} />

        {/* Configuración y Auditoría */}
        <Route path="configuracion" element={<Navigate to="/autoridad/configuracion/preferencias" replace />} />
        <Route path="configuracion/preferencias" element={renderPlaceholder('Preferencias del Portal')} />
        <Route path="configuracion/accesos" element={renderPlaceholder('Control de Accesos')} />
        <Route path="configuracion/notificaciones" element={renderPlaceholder('Notificaciones y Alertas')} />
        <Route path="configuracion/auditoria" element={renderPlaceholder('Auditoría Institucional')} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/autoridad/dashboard/resumen" replace />} />
      </Route>
    </Routes>
  );
};

export default AuthorityPanel;