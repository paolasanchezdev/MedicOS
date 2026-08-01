export type RoleId = 'brigadista' | 'paciente' | 'doctor';

export interface ModuleFeature {
  id: string;
  label: string;
  description: string;
}

export interface ModuleData {
  id: RoleId;
  roleBadge: string;
  title: string;
  subtitle: string;
  description: string;
  techIndicator: string;
  features: ModuleFeature[];
  showcase: {
    badgeText: string;
    title: string;
    statusLabel: string;
  };
}

export const MODULES_DATA: Record<RoleId, ModuleData> = {
  brigadista: {
    id: 'brigadista',
    roleBadge: 'OPERACIÓN EN CAMPO',
    title: 'Módulo de Brigadista',
    subtitle: 'Captura ágil y atención en zonas de conectividad nula',
    description:
      'Herramienta táctica para el personal operativo encargado de la recepción, triaje y toma de datos durante las jornadas comunitarias.',
    techIndicator: 'Arquitectura Offline First + Sync Transversal',
    features: [
      {
        id: 'b1',
        label: 'Captura y triaje sin conexión',
        description:
          'Registro inmediato de datos generales, antecedentes y toma de signos vitales en local.',
      },
      {
        id: 'b2',
        label: 'Escaneo QR instantáneo',
        description:
          'Lectura directa de carné físico o digital para vinculación inmediata del paciente.',
      },
      {
        id: 'b3',
        label: 'Sincronización en segundo plano',
        description:
          'Envío automático de la cola de registros acumulados al detectar conectividad.',
      },
    ],
    showcase: {
      badgeText: 'TRIAJE Y CONSULTA',
      title: 'Captura de Signos Vitales',
      statusLabel: 'Local (Sin Red) • 4 pendientes',
    },
  },
  paciente: {
    id: 'paciente',
    roleBadge: 'CONTINUIDAD CLÍNICA',
    title: 'Módulo de Paciente',
    subtitle: 'El eje central alrededor del cual se resguarda la información',
    description:
      'Portabilidad del expediente médico para dar seguimiento continuo en cualquier ubicación o brigada activa.',
    techIndicator: 'Identidad Digital Cifrada',
    features: [
      {
        id: 'p1',
        label: 'Carné Digital & Código QR',
        description:
          'Identificador portable para acceso rápido y seguro al historial en cualquier punto de atención.',
      },
      {
        id: 'p2',
        label: 'Expediente Clínico Unificado',
        description:
          'Historial de diagnósticos, alergias, recetas acumuladas y evolución de consultas.',
      },
      {
        id: 'p3',
        label: 'Continuidad entre brigadas',
        description:
          'Trazabilidad para que distintos equipos accedan al antecedente exacto sin perder información.',
      },
    ],
    showcase: {
      badgeText: 'EXPEDIENTE DIGITAL',
      title: 'Ficha Clínica del Paciente',
      statusLabel: 'QR Activo • Verificado',
    },
  },
  doctor: {
    id: 'doctor',
    roleBadge: 'DECISIÓN CLÍNICA',
    title: 'Módulo de Doctor',
    subtitle: 'Análisis profundo y validación profesional con soporte inteligente',
    description:
      'Entorno optimizado para la evaluación médica, revisión de historial clínico y prescripción asistida.',
    techIndicator: 'IA Copilot Asistencial',
    features: [
      {
        id: 'd1',
        label: 'Evaluación y Prescripción',
        description:
          'Revisión de antecedentes, tendencia de signos vitales, emisión de diagnósticos y recetas.',
      },
      {
        id: 'd2',
        label: 'IA Copilot Asistencial',
        description:
          'Identificación de patrones y alertas contextuales como herramienta estricta de apoyo.',
      },
      {
        id: 'd3',
        label: 'Criterio profesional garantizado',
        description:
          'Validación y firma médica obligatoria; la tecnología asiste, no reemplaza la decisión humana.',
      },
    ],
    showcase: {
      badgeText: 'SOPORTE DE DECISIÓN',
      title: 'Evaluación y Prescripción Médica',
      statusLabel: 'Copilot Activo • Herramienta de Apoyo',
    },
  },
};

export const FUTURE_SCOPE_DATA = {
  badge: 'PRÓXIMA EVOLUCIÓN',
  title: 'Capa de Analítica para Autoridades de Salud',
  description:
    'Proyección para dashboards de analítica agregada, mapas de calor epidemiológicos y gestión comunitaria para la toma de decisiones en salud pública.',
};