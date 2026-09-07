// =========================================================================
// ARCHIVO: apps/web/src/modules/appointments/rules/appointmentOrientation.rules.ts
// DESCRIPCIÓN: Catálogo enriquecido y reglas de orientación administrativa
//              hacia Medicina General, Pediatría, Ginecología y Medicina Interna.
// =========================================================================

export type CategoriaSintoma =
  | 'TODOS'
  | 'GENERAL'
  | 'RESPIRATORIO'
  | 'DIGESTIVO'
  | 'FEMENINA'
  | 'PEDIATRICO'
  | 'CRONICO';

export interface SintomaClinico {
  id: string;
  categoria: CategoriaSintoma;
  label: string;
  descripcion: string;
  especialidadDestino: 'Medicina General' | 'Pediatría' | 'Ginecología' | 'Medicina Interna';
  icono: 'termometro' | 'pulmon' | 'estomago' | 'corazon' | 'bebe' | 'mujer' | 'cerebro' | 'piel' | 'prevencion';
}

export interface OrientacionMotivoResult {
  areaSugerida: 'Medicina General' | 'Pediatría' | 'Ginecología' | 'Medicina Interna';
  tituloBadge: string;
  mensaje: string;
  esPrioritario: boolean;
}

export const CATEGORIAS_SINTOMAS: { id: CategoriaSintoma; label: string }[] = [
  { id: 'TODOS', label: 'Todas las molestias' },
  { id: 'GENERAL', label: 'Salud General' },
  { id: 'RESPIRATORIO', label: 'Respiratorio' },
  { id: 'DIGESTIVO', label: 'Digestivo' },
  { id: 'FEMENINA', label: 'Salud Femenina' },
  { id: 'PEDIATRICO', label: 'Atención Infantil' },
  { id: 'CRONICO', label: 'Control Crónico' },
];

export const CATALOGO_SINTOMAS: SintomaClinico[] = [
  // Generales
  {
    id: 'fiebre_persistente',
    categoria: 'GENERAL',
    label: 'Fiebre o escalofríos',
    descripcion: 'Temperatura alta de más de 24 horas',
    especialidadDestino: 'Medicina General',
    icono: 'termometro',
  },
  {
    id: 'cefalea_intensa',
    categoria: 'GENERAL',
    label: 'Cefalea o dolor de cabeza',
    descripcion: 'Pulsaciones, migraña o tensión craneal',
    especialidadDestino: 'Medicina General',
    icono: 'cerebro',
  },
  {
    id: 'dolor_muscular',
    categoria: 'GENERAL',
    label: 'Dolor muscular o articular leve',
    descripcion: 'Cansancio físico, rigidez o fatiga',
    especialidadDestino: 'Medicina General',
    icono: 'termometro',
  },
  {
    id: 'alergia_cutanea',
    categoria: 'GENERAL',
    label: 'Erupción o picazón en piel',
    descripcion: 'Alergias cutáneas o manchas recientes',
    especialidadDestino: 'Medicina General',
    icono: 'piel',
  },
  {
    id: 'chequeo_preventivo',
    categoria: 'GENERAL',
    label: 'Chequeo preventivo de rutina',
    descripcion: 'Evaluación periódica o certificado de salud',
    especialidadDestino: 'Medicina General',
    icono: 'prevencion',
  },

  // Respiratorio
  {
    id: 'tos_congestiva',
    categoria: 'RESPIRATORIO',
    label: 'Tos persistente o dolor de garganta',
    descripcion: 'Molestia al tragar, flemas o carraspeo',
    especialidadDestino: 'Medicina General',
    icono: 'pulmon',
  },
  {
    id: 'dificultad_respirar',
    categoria: 'RESPIRATORIO',
    label: 'Dificultad o fatiga para respirar',
    descripcion: 'Falta de aire o silbidos en el pecho',
    especialidadDestino: 'Medicina General',
    icono: 'pulmon',
  },

  // Digestivo
  {
    id: 'dolor_abdominal',
    categoria: 'DIGESTIVO',
    label: 'Dolor abdominal o cólico estomacal',
    descripcion: 'Espasmos, ardor o inflamación gástrica',
    especialidadDestino: 'Medicina General',
    icono: 'estomago',
  },
  {
    id: 'nauseas_vomito',
    categoria: 'DIGESTIVO',
    label: 'Náuseas, mareos o vómitos',
    descripcion: 'Indisposición digestiva recurrente',
    especialidadDestino: 'Medicina General',
    icono: 'estomago',
  },

  // Salud Femenina -> Ginecología
  {
    id: 'control_prenatal',
    categoria: 'FEMENINA',
    label: 'Control de embarazo / Prenatal',
    descripcion: 'Monitoreo gestacional o chequeo materno',
    especialidadDestino: 'Ginecología',
    icono: 'mujer',
  },
  {
    id: 'colicos_menstruales',
    categoria: 'FEMENINA',
    label: 'Dolor pélvico o cólicos agudos',
    descripcion: 'Dolores menstruales intensos o pélvicos',
    especialidadDestino: 'Ginecología',
    icono: 'mujer',
  },
  {
    id: 'alteracion_ciclo',
    categoria: 'FEMENINA',
    label: 'Irregularidad en ciclo menstrual',
    descripcion: 'Retrasos o sangrado anormal',
    especialidadDestino: 'Ginecología',
    icono: 'mujer',
  },
  {
    id: 'chequeo_ginecologico',
    categoria: 'FEMENINA',
    label: 'Consulta preventiva ginecológica',
    descripcion: 'Citología, asesoría o control anual',
    especialidadDestino: 'Ginecología',
    icono: 'mujer',
  },

  // Atención Infantil -> Pediatría
  {
    id: 'pediatria_control',
    categoria: 'PEDIATRICO',
    label: 'Control de niño sano / Crecimiento',
    descripcion: 'Evaluación de peso, talla y desarrollo infantil',
    especialidadDestino: 'Pediatría',
    icono: 'bebe',
  },
  {
    id: 'pediatria_fiebre',
    categoria: 'PEDIATRICO',
    label: 'Fiebre o malestar en bebé / infante',
    descripcion: 'Cuadros febriles en lactantes o niños',
    especialidadDestino: 'Pediatría',
    icono: 'bebe',
  },
  {
    id: 'pediatria_vacunas',
    categoria: 'PEDIATRICO',
    label: 'Esquema de vacunación infantil',
    descripcion: 'Revisión y aplicación de vacunas para niños',
    especialidadDestino: 'Pediatría',
    icono: 'bebe',
  },

  // Control Crónico -> Medicina Interna
  {
    id: 'hipertension_presion',
    categoria: 'CRONICO',
    label: 'Control de presión arterial / Hipertensión',
    descripcion: 'Presión alta, mareos vasculares o seguimiento',
    especialidadDestino: 'Medicina Interna',
    icono: 'corazon',
  },
  {
    id: 'diabetes_glucosa',
    categoria: 'CRONICO',
    label: 'Control de glucosa / Diabetes',
    descripcion: 'Seguimiento de diabetes o niveles alterados',
    especialidadDestino: 'Medicina Interna',
    icono: 'corazon',
  },
  {
    id: 'palpitaciones_pecho',
    categoria: 'CRONICO',
    label: 'Palpitaciones o pesadez en el pecho',
    descripcion: 'Monitoreo cardiovascular de adultos',
    especialidadDestino: 'Medicina Interna',
    icono: 'corazon',
  },
];

export function obtenerOrientacionConsulta(sintomasIds: string[]): OrientacionMotivoResult {
  if (sintomasIds.length === 0) {
    return {
      areaSugerida: 'Medicina General',
      tituloBadge: 'Consulta Primaria',
      mensaje: 'Selecciona una o más molestias para guiar tu atención médica.',
      esPrioritario: false,
    };
  }

  const sintomasSeleccionados = CATALOGO_SINTOMAS.filter((s) => sintomasIds.includes(s.id));

  // Prioridad 1: Alerta respiratoria severa
  if (sintomasIds.includes('dificultad_respirar')) {
    return {
      areaSugerida: 'Medicina General',
      tituloBadge: 'Atención Prioritaria',
      mensaje: 'Has reportado dificultad respiratoria. Te orientamos al primer turno disponible. Si presentas asfixia grave, acude de inmediato a urgencias.',
      esPrioritario: true,
    };
  }

  // Prioridad 2: Salud Pediátrica
  const tienePediatrico = sintomasSeleccionados.some((s) => s.especialidadDestino === 'Pediatría');
  if (tienePediatrico) {
    return {
      areaSugerida: 'Pediatría',
      tituloBadge: 'Atención Pediátrica',
      mensaje: 'Los motivos seleccionados corresponden a salud y desarrollo infantil. Te orientamos con los profesionales de Pediatría.',
      esPrioritario: false,
    };
  }

  // Prioridad 3: Salud Femenina
  const tieneGinecologia = sintomasSeleccionados.some((s) => s.especialidadDestino === 'Ginecología');
  if (tieneGinecologia) {
    return {
      areaSugerida: 'Ginecología',
      tituloBadge: 'Salud de la Mujer',
      mensaje: 'Tus síntomas están relacionados con salud femenina o control prenatal. Te orientamos con especialistas en Ginecología.',
      esPrioritario: false,
    };
  }

  // Prioridad 4: Control Crónico / Adulto
  const tieneInterna = sintomasSeleccionados.some((s) => s.especialidadDestino === 'Medicina Interna');
  if (tieneInterna) {
    return {
      areaSugerida: 'Medicina Interna',
      tituloBadge: 'Medicina Especializada',
      mensaje: 'Tus motivos corresponden al seguimiento de patologías crónicas o cardiovasculares. Te orientamos con Medicina Interna.',
      esPrioritario: false,
    };
  }

  return {
    areaSugerida: 'Medicina General',
    tituloBadge: 'Medicina General',
    mensaje: 'Tus molestias son compatibles con atención primaria. Los médicos generales podrán evaluarte de forma integral.',
    esPrioritario: false,
  };
}