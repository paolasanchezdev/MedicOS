export interface NavigationChild {
  title: string;
  path: string;
}

export interface NavigationItem {
  title: string;
  path: string;
  children?: NavigationChild[];
}

export const AUTHORITY_NAVIGATION: NavigationItem[] = [
  {
    title: 'Dashboard',
    path: '/autoridad/dashboard',
    children: [
      { title: 'Resumen General', path: '/autoridad/dashboard/resumen' },
      { title: 'Salud del Sistema', path: '/autoridad/dashboard/salud-sistema' },
    ],
  },
  {
    title: 'Epidemiología',
    path: '/autoridad/epidemiologia',
    children: [
      { title: 'Alertas Epidemiológicas', path: '/autoridad/epidemiologia/alertas' },
      { title: 'Vigilancia Epidemiológica', path: '/autoridad/epidemiologia/vigilancia' },
      { title: 'Brotes Detectados', path: '/autoridad/epidemiologia/brotes' },
      { title: 'Tendencias y Curvas', path: '/autoridad/epidemiologia/tendencias' },
      { title: 'Factores de Riesgo', path: '/autoridad/epidemiologia/factores-riesgo' },
    ],
  },
  {
    title: 'Estadísticas Sanitarias',
    path: '/autoridad/estadisticas',
    children: [
      { title: 'Enfermedades y Morbilidad', path: '/autoridad/estadisticas/enfermedades' },
      { title: 'Cobertura Sanitaria', path: '/autoridad/estadisticas/cobertura' },
      { title: 'Demografía de Pacientes', path: '/autoridad/estadisticas/demografia' },
      { title: 'Rendimiento de Brigadas', path: '/autoridad/estadisticas/brigadas' },
      { title: 'Salud Materno-Infantil', path: '/autoridad/estadisticas/materno-infantil' },
      { title: 'Inmunización y Vacunación', path: '/autoridad/estadisticas/vacunacion' },
      { title: 'Estadísticas de Comunidades', path: '/autoridad/estadisticas/comunidades' },
    ],
  },
  {
    title: 'Mapas e Inteligencia Territorial',
    path: '/autoridad/mapas',
    children: [
      { title: 'Mapa de Calor Epidemiológico', path: '/autoridad/mapas/calor' },
      { title: 'Mapa de Cobertura', path: '/autoridad/mapas/cobertura' },
      { title: 'Ubicación de Brigadas', path: '/autoridad/mapas/brigadas' },
      { title: 'Geolocalización Comunitaria', path: '/autoridad/mapas/geolocalizacion' },
      { title: 'Zonas Prioritarias', path: '/autoridad/mapas/zonas-prioritarias' },
    ],
  },
  {
    title: 'Gestión de Brigadas',
    path: '/autoridad/brigadas',
    children: [
      { title: 'Cobertura Terrenal', path: '/autoridad/brigadas/cobertura' },
      { title: 'Brigadas Programadas', path: '/autoridad/brigadas/programadas' },
      { title: 'Historial de Brigadas', path: '/autoridad/brigadas/historial' },
      { title: 'Resultados y Métricas', path: '/autoridad/brigadas/resultados' },
    ],
  },
  {
    title: 'Campañas de Salud',
    path: '/autoridad/campanas',
    children: [
      { title: 'Campañas Activas', path: '/autoridad/campanas/activas' },
      { title: 'Planificación Estratégica', path: '/autoridad/campanas/planificacion' },
      { title: 'Seguimiento de Avance', path: '/autoridad/campanas/seguimiento' },
      { title: 'Resultados e Impacto', path: '/autoridad/campanas/resultados' },
    ],
  },
  {
    title: 'Establecimientos de Salud',
    path: '/autoridad/establecimientos',
    children: [
      { title: 'Hospitales de Red', path: '/autoridad/establecimientos/hospitales' },
      { title: 'Unidades de Salud', path: '/autoridad/establecimientos/unidades' },
      { title: 'Clínicas Comunitarias', path: '/autoridad/establecimientos/clinicas' },
      { title: 'Capacidad y Recursos', path: '/autoridad/establecimientos/recursos' },
    ],
  },
  {
    title: 'Inteligencia Artificial',
    path: '/autoridad/ia',
    children: [
      { title: 'Predicciones de Brotes', path: '/autoridad/ia/predicciones' },
      { title: 'Recomendaciones IA', path: '/autoridad/ia/recomendaciones' },
      { title: 'Análisis de Tendencias IA', path: '/autoridad/ia/tendencias' },
      { title: 'Resúmenes Automatizados', path: '/autoridad/ia/resumenes' },
      { title: 'Consultas Asistidas', path: '/autoridad/ia/consultas' },
    ],
  },
  {
    title: 'Reportes e Informes',
    path: '/autoridad/reportes',
    children: [
      { title: 'Informes Ejecutivos', path: '/autoridad/reportes/ejecutivos' },
      { title: 'Reportes Epidemiológicos', path: '/autoridad/reportes/epidemiologicos' },
      { title: 'Reportes de Brigadas', path: '/autoridad/reportes/brigadas' },
      { title: 'Reportes Personalizados', path: '/autoridad/reportes/personalizados' },
      { title: 'Centro de Exportaciones', path: '/autoridad/reportes/exportaciones' },
    ],
  },
  {
    title: 'Configuración y Auditoría',
    path: '/autoridad/configuracion',
    children: [
      { title: 'Preferencias del Portal', path: '/autoridad/configuracion/preferencias' },
      { title: 'Control de Accesos', path: '/autoridad/configuracion/accesos' },
      { title: 'Notificaciones y Alertas', path: '/autoridad/configuracion/notificaciones' },
      { title: 'Auditoría Institucional', path: '/autoridad/configuracion/auditoria' },
    ],
  },
];