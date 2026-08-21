import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthorityLayout } from '../layout/AuthorityLayout';

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

export const authorityRoutes: RouteObject = {
  path: 'autoridad',
  element: <AuthorityLayout />,
  children: [
    {
      index: true,
      element: <Navigate to="/autoridad/dashboard/resumen" replace />,
    },
    {
      path: 'dashboard',
      children: [
        {
          index: true,
          element: <Navigate to="/autoridad/dashboard/resumen" replace />,
        },
        {
          path: 'resumen',
          element: renderPlaceholder('Resumen General Epidemiológico'),
        },
        {
          path: 'salud-sistema',
          element: renderPlaceholder('Salud del Sistema'),
        },
      ],
    },
    {
      path: 'epidemiologia',
      children: [
        { path: 'alertas', element: renderPlaceholder('Alertas Epidemiológicas') },
        { path: 'vigilancia', element: renderPlaceholder('Vigilancia Epidemiológica') },
        { path: 'brotes', element: renderPlaceholder('Brotes Detectados') },
        { path: 'tendencias', element: renderPlaceholder('Tendencias y Curvas') },
        { path: 'factores-riesgo', element: renderPlaceholder('Factores de Riesgo') },
      ],
    },
    {
      path: 'estadisticas',
      children: [
        { path: 'enfermedades', element: renderPlaceholder('Enfermedades y Morbilidad') },
        { path: 'cobertura', element: renderPlaceholder('Cobertura Sanitaria') },
        { path: 'demografia', element: renderPlaceholder('Demografía de Pacientes') },
        { path: 'brigadas', element: renderPlaceholder('Rendimiento de Brigadas') },
        { path: 'materno-infantil', element: renderPlaceholder('Salud Materno-Infantil') },
        { path: 'vacunacion', element: renderPlaceholder('Inmunización y Vacunación') },
        { path: 'comunidades', element: renderPlaceholder('Estadísticas de Comunidades') },
      ],
    },
    {
      path: 'mapas',
      children: [
        { path: 'calor', element: renderPlaceholder('Mapa de Calor Epidemiológico') },
        { path: 'cobertura', element: renderPlaceholder('Mapa de Cobertura') },
        { path: 'brigadas', element: renderPlaceholder('Ubicación de Brigadas') },
        { path: 'geolocalizacion', element: renderPlaceholder('Geolocalización Comunitaria') },
        { path: 'zonas-prioritarias', element: renderPlaceholder('Zonas Prioritarias') },
      ],
    },
    {
      path: 'brigadas',
      children: [
        { path: 'cobertura', element: renderPlaceholder('Cobertura Terrenal') },
        { path: 'programadas', element: renderPlaceholder('Brigadas Programadas') },
        { path: 'historial', element: renderPlaceholder('Historial de Brigadas') },
        { path: 'resultados', element: renderPlaceholder('Resultados y Métricas') },
      ],
    },
    {
      path: 'campanas',
      children: [
        { path: 'activas', element: renderPlaceholder('Campañas Activas') },
        { path: 'planificacion', element: renderPlaceholder('Planificación Estratégica') },
        { path: 'seguimiento', element: renderPlaceholder('Seguimiento de Avance') },
        { path: 'resultados', element: renderPlaceholder('Resultados e Impacto') },
      ],
    },
    {
      path: 'establecimientos',
      children: [
        { path: 'hospitales', element: renderPlaceholder('Hospitales de Red') },
        { path: 'unidades', element: renderPlaceholder('Unidades de Salud') },
        { path: 'clinicas', element: renderPlaceholder('Clínicas Comunitarias') },
        { path: 'recursos', element: renderPlaceholder('Capacidad y Recursos') },
      ],
    },
    {
      path: 'ia',
      children: [
        { path: 'predicciones', element: renderPlaceholder('Predicciones de Brotes') },
        { path: 'recomendaciones', element: renderPlaceholder('Recomendaciones IA') },
        { path: 'tendencias', element: renderPlaceholder('Análisis de Tendencias IA') },
        { path: 'resumenes', element: renderPlaceholder('Resúmenes Automatizados') },
        { path: 'consultas', element: renderPlaceholder('Consultas Asistidas') },
      ],
    },
    {
      path: 'reportes',
      children: [
        { path: 'ejecutivos', element: renderPlaceholder('Informes Ejecutivos') },
        { path: 'epidemiologicos', element: renderPlaceholder('Reportes Epidemiológicos') },
        { path: 'brigadas', element: renderPlaceholder('Reportes de Brigadas') },
        { path: 'personalizados', element: renderPlaceholder('Reportes Personalizados') },
        { path: 'exportaciones', element: renderPlaceholder('Centro de Exportaciones') },
      ],
    },
    {
      path: 'configuracion',
      children: [
        { path: 'preferencias', element: renderPlaceholder('Preferencias del Portal') },
        { path: 'accesos', element: renderPlaceholder('Control de Accesos') },
        { path: 'notificaciones', element: renderPlaceholder('Notificaciones y Alertas') },
        { path: 'auditoria', element: renderPlaceholder('Auditoría Institucional') },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/autoridad/dashboard/resumen" replace />,
    },
  ],
};

export default authorityRoutes;