/* ==========================================================================
   aiSectionData.ts
   ========================================================================== */

export interface DataFlowNode {
  id: number;
  stepNumber: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeType: 'neutral' | 'ai' | 'warning' | 'doctor';
  description: string;
  exampleText?: string;
  imageSrc: string; // Ruta directa desde /public
}

export interface AiCapability {
  id: string;
  title: string;
  description: string;
  badge?: string;
  isHighlight?: boolean;
}

export interface AiSectionContent {
  header: {
    eyebrow: string;
    titleMain: string;
    titleHighlight: string;
    description: string;
  };
  pipelineNodes: DataFlowNode[];
  capabilities: AiCapability[];
  humanControlBanner: {
    badge: string;
    title: string;
    description: string;
    quote: string;
  };
}

export const AI_SECTION_DATA: AiSectionContent = {
  header: {
    eyebrow: "INTELIGENCIA QUE APOYA",
    titleMain: "La tecnología ayuda a interpretar la información.",
    titleHighlight: "La decisión sigue siendo humana.",
    description: "MedicOS incorpora inteligencia artificial como una herramienta de apoyo para validar los registros, identificar posibles inconsistencias y facilitar el análisis de la información disponible en campo.",
  },
  pipelineNodes: [
    {
      id: 1,
      stepNumber: "01",
      title: "Datos Registrados",
      subtitle: "Captura Inicial",
      badgeText: "Campo / Físico",
      badgeType: "neutral",
      imageSrc: "/images/flow/step-01.png", // Ubicado en public/images/flow/step-01.png
      description: "El personal de salud o brigadista captura los datos clínicos y signos vitales durante la atención comunitaria.",
      exampleText: "Ej. Lectura de presión arterial ingresada en el expediente digital.",
    },
    {
      id: 2,
      stepNumber: "02",
      title: "Análisis de IA",
      subtitle: "Procesamiento Pasivo",
      badgeText: "Verificación Activa",
      badgeType: "ai",
      imageSrc: "/images/flow/step-02.png", // Ubicado en public/images/flow/step-02.png
      description: "El sistema cruza los valores ingresados con el historial clínico del paciente y guías de referencia para detectar atipicidades.",
      exampleText: "Análisis en segundo plano sin interrumpir la captura.",
    },
    {
      id: 3,
      stepNumber: "03",
      title: "Observación de Apoyo",
      subtitle: "Sugerencia Contextual",
      badgeText: "Alerta Discreta",
      badgeType: "warning",
      imageSrc: "/images/flow/step-03.png", // Ubicado en public/images/flow/step-03.png
      description: "Se genera un aviso neutro destacando elementos que requieren atención especial por parte del profesional.",
      exampleText: '"Se detectó un valor fuera del rango promedio del paciente que requiere revisión."',
    },
    {
      id: 4,
      stepNumber: "04",
      title: "Revisión Profesional",
      subtitle: "Criterio Clínico",
      badgeText: "Validación Final",
      badgeType: "doctor",
      imageSrc: "/images/flow/step-04.png", // Ubicado en public/images/flow/step-04.png
      description: "El profesional de la salud evalúa la observación, consulta el expediente y toma la decisión médica definitiva.",
      exampleText: "Firma y confirmación explícita por el médico a cargo.",
    },
  ],
  capabilities: [
    {
      id: "validation",
      title: "Validación Inteligente",
      description: "Ayuda a identificar posibles inconsistencias, errores de digitación o datos incompletos en los formularios clínicos antes de ser guardados.",
    },
    {
      id: "patterns",
      title: "Detección de Patrones",
      description: "Permite identificar relaciones relevantes o tendencias históricas dentro de los datos acumulados del paciente a lo largo del tiempo.",
    },
    {
      id: "recommendations",
      title: "Observaciones y Recomendaciones",
      description: "Genera información de apoyo orientativa para facilitar la revisión del personal de salud sin imponer conductas clínicas.",
    },
    {
      id: "context",
      title: "Asistencia Contextual",
      description: "Sintetiza la información relevante del expediente digital para que el médico consulte los antecedentes clave en pocos segundos.",
    },
    {
      id: "supervision",
      title: "Supervisión Profesional Permanente",
      description: "Toda sugerencia u observación generada por la IA debe ser obligatoriamente revisada, validada e interpretada por un profesional de salud.",
      badge: "Inviolable",
      isHighlight: true,
    },
  ],
  humanControlBanner: {
    badge: "GARANTÍA ÉTICA Y CLÍNICA",
    title: "Copiloto tecnológico, nunca un reemplazo",
    description: "MedicOS no realiza diagnósticos autónomos ni emite prescripciones automáticas. La inteligencia artificial está diseñada exclusivamente para organizar, alertar y dar contexto. El criterio y la responsabilidad médica residen al 100% en las personas.",
    quote: '"La tecnología procesa datos; el profesional de la salud atiende personas."',
  },
};