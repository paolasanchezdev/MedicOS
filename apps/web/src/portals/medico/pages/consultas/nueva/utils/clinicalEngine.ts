// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/consultas/nueva/utils/clinicalEngine.ts
// DESCRIPCIÓN:
// Sistema Experto Heurístico con Scoring Ponderado, detección básica de
// negaciones, inferencia multivariable, farmacoseguridad y explicabilidad.
//
// MedicOS — 100% Offline
//
// IMPORTANTE:
// Este motor NO realiza diagnóstico médico ni sustituye el criterio del
// profesional. Genera alertas, hallazgos y niveles de prioridad para
// apoyar la valoración clínica.
// =========================================================================

export type RiskSeverity = 'BAJO' | 'MODERADO' | 'ALTO' | 'CRITICO';

export type VitalStatus =
  | 'NORMAL'
  | 'WARNING'
  | 'ALERT'
  | 'INVALID';

export type FindingSource =
  | 'VITALS'
  | 'ANAMNESIS'
  | 'RX';

export type ScoreSource =
  | 'SIGNOS'
  | 'SINTOMAS'
  | 'FARMACO';

export type PharmacologicalAlertType =
  | 'ALERGIA_MAYOR'
  | 'INTOLERANCIA'
  | 'PRECAUCION';

export interface VitalCheck {
  isValid: boolean;
  status: VitalStatus;
  message: string;
}

export interface VitalsAudit {
  systolic: VitalCheck;
  diastolic: VitalCheck;
  heartRate: VitalCheck;
  respiratoryRate: VitalCheck;
  temperature: VitalCheck;
  oxygenSat: VitalCheck;
  pulsePressure: VitalCheck;
  hasErrors: boolean;
}

export interface ScoreTraceItem {
  rule: string;
  points: number;
  source: ScoreSource;
}

export interface ClinicalFinding {
  label: string;
  detail: string;
  source: FindingSource;
}

export interface PharmacologicalAlert {
  type: PharmacologicalAlertType;
  message: string;
  medicine: string;
}

export interface ClinicalInferenceResult {
  overallRisk: RiskSeverity;
  totalScore: number;
  scoreTrace: ScoreTraceItem[];
  syndromicPattern: string | null;
  findings: ClinicalFinding[];
  recommendation: string;
  criticalOverride: boolean;
  hasPharmacologicalAlert: boolean;
  pharmacologicalAlerts: PharmacologicalAlert[];
}

// =========================================================================
// UTILIDADES INTERNAS
// =========================================================================

const normalizeText = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const splitIntoClauses = (text: string): string[] =>
  normalizeText(text)
    .split(/[.,;:\n\r!?]+/)
    .map((clause) => clause.trim())
    .filter(Boolean);

const NEGATION_PATTERNS: RegExp[] = [
  /\bniega\b/,
  /\bno presenta\b/,
  /\bno refiere\b/,
  /\bno manifiesta\b/,
  /\bno siente\b/,
  /\bsin datos de\b/,
  /\bsin evidencia de\b/,
  /\bausencia de\b/,
  /\bdescarta\b/,
  /\bno hay\b/,
  /\blibre de\b/,
  /\bniega presentar\b/,
];

const isClauseNegated = (clause: string): boolean =>
  NEGATION_PATTERNS.some((pattern) => pattern.test(clause));

export const isSymptomAffirmed = (
  textCorpus: string,
  keywords: string[]
): boolean => {
  if (!textCorpus.trim() || keywords.length === 0) {
    return false;
  }

  const clauses = splitIntoClauses(textCorpus);
  const normalizedKeywords = keywords.map(normalizeText);

  for (const clause of clauses) {
    const matchedKeyword = normalizedKeywords.find((keyword) =>
      clause.includes(keyword)
    );

    if (!matchedKeyword) {
      continue;
    }

    if (!isClauseNegated(clause)) {
      return true;
    }
  }

  return false;
};

// =========================================================================
// 1. AUDITORÍA FISIOLÓGICA DE CONSTANTES VITALES
// =========================================================================

export const validateVitals = (
  sys?: number | '',
  dia?: number | '',
  hr?: number | '',
  rr?: number | '',
  temp?: number | '',
  spo2?: number | ''
): VitalsAudit => {
  const audit: VitalsAudit = {
    systolic: {
      isValid: true,
      status: 'NORMAL',
      message: 'Rango esperado',
    },
    diastolic: {
      isValid: true,
      status: 'NORMAL',
      message: 'Rango esperado',
    },
    heartRate: {
      isValid: true,
      status: 'NORMAL',
      message: 'Rango esperado',
    },
    respiratoryRate: {
      isValid: true,
      status: 'NORMAL',
      message: 'Rango esperado',
    },
    temperature: {
      isValid: true,
      status: 'NORMAL',
      message: 'Rango esperado',
    },
    oxygenSat: {
      isValid: true,
      status: 'NORMAL',
      message: 'Rango esperado',
    },
    pulsePressure: {
      isValid: true,
      status: 'NORMAL',
      message: '',
    },
    hasErrors: false,
  };

  // Presión sistólica
  if (typeof sys === 'number') {
    if (sys < 50 || sys > 260) {
      audit.systolic = {
        isValid: false,
        status: 'INVALID',
        message: 'Lectura no plausible (50 - 260 mmHg). Verificar medición.',
      };
      audit.hasErrors = true;
    } else if (sys >= 180) {
      audit.systolic = {
        isValid: true,
        status: 'ALERT',
        message: 'Cifra sistólica severamente elevada (≥180 mmHg). Requiere correlación clínica.',
      };
    } else if (sys >= 140) {
      audit.systolic = {
        isValid: true,
        status: 'WARNING',
        message: 'Cifra sistólica elevada (≥140 mmHg).',
      };
    } else if (sys < 90) {
      audit.systolic = {
        isValid: true,
        status: 'WARNING',
        message: 'Cifra sistólica baja (<90 mmHg). Correlacionar con síntomas y perfusión.',
      };
    }
  }

  // Presión diastólica
  if (typeof dia === 'number') {
    if (dia < 30 || dia > 150) {
      audit.diastolic = {
        isValid: false,
        status: 'INVALID',
        message: 'Lectura no plausible (30 - 150 mmHg). Verificar medición.',
      };
      audit.hasErrors = true;
    } else if (dia >= 110) {
      audit.diastolic = {
        isValid: true,
        status: 'ALERT',
        message: 'Cifra diastólica severamente elevada (≥110 mmHg). Requiere correlación clínica.',
      };
    } else if (dia >= 90) {
      audit.diastolic = {
        isValid: true,
        status: 'WARNING',
        message: 'Cifra diastólica elevada (≥90 mmHg).',
      };
    } else if (dia < 60) {
      audit.diastolic = {
        isValid: true,
        status: 'WARNING',
        message: 'Cifra diastólica baja (<60 mmHg). Correlacionar con síntomas.',
      };
    }
  }

  // Presión diferencial
  if (typeof sys === 'number' && typeof dia === 'number') {
    if (dia >= sys) {
      audit.pulsePressure = {
        isValid: false,
        status: 'INVALID',
        message: 'Inconsistencia: la presión diastólica no puede ser igual o mayor que la sistólica.',
      };
      audit.hasErrors = true;
    } else if (sys - dia < 20) {
      audit.pulsePressure = {
        isValid: true,
        status: 'WARNING',
        message: 'Presión diferencial estrecha (<20 mmHg). Se recomienda verificar la técnica de medición.',
      };
    }
  }

  // Frecuencia cardíaca
  if (typeof hr === 'number') {
    if (hr < 25 || hr > 240) {
      audit.heartRate = {
        isValid: false,
        status: 'INVALID',
        message: 'Lectura no plausible (25 - 240 lpm). Verificar medición.',
      };
      audit.hasErrors = true;
    } else if (hr >= 120) {
      audit.heartRate = {
        isValid: true,
        status: 'ALERT',
        message: 'Frecuencia cardíaca marcadamente elevada (≥120 lpm).',
      };
    } else if (hr > 100) {
      audit.heartRate = {
        isValid: true,
        status: 'WARNING',
        message: 'Frecuencia cardíaca elevada (>100 lpm).',
      };
    } else if (hr < 50) {
      audit.heartRate = {
        isValid: true,
        status: 'ALERT',
        message: 'Frecuencia cardíaca marcadamente baja (<50 lpm).',
      };
    } else if (hr < 60) {
      audit.heartRate = {
        isValid: true,
        status: 'WARNING',
        message: 'Frecuencia cardíaca baja (<60 lpm).',
      };
    }
  }

  // Frecuencia respiratoria
  if (typeof rr === 'number') {
    if (rr < 6 || rr > 60) {
      audit.respiratoryRate = {
        isValid: false,
        status: 'INVALID',
        message: 'Lectura no plausible (6 - 60 rpm). Verificar medición.',
      };
      audit.hasErrors = true;
    } else if (rr >= 28) {
      audit.respiratoryRate = {
        isValid: true,
        status: 'ALERT',
        message: 'Frecuencia respiratoria marcadamente elevada (≥28 rpm).',
      };
    } else if (rr >= 22) {
      audit.respiratoryRate = {
        isValid: true,
        status: 'WARNING',
        message: 'Frecuencia respiratoria elevada (22 - 27 rpm).',
      };
    } else if (rr < 10) {
      audit.respiratoryRate = {
        isValid: true,
        status: 'ALERT',
        message: 'Frecuencia respiratoria marcadamente baja (<10 rpm).',
      };
    }
  }

  // Temperatura
  if (typeof temp === 'number') {
    if (temp < 32 || temp > 43) {
      audit.temperature = {
        isValid: false,
        status: 'INVALID',
        message: 'Lectura no plausible (32.0 - 43.0 °C). Verificar medición.',
      };
      audit.hasErrors = true;
    } else if (temp >= 39) {
      audit.temperature = {
        isValid: true,
        status: 'ALERT',
        message: 'Temperatura elevada (≥39.0 °C).',
      };
    } else if (temp >= 38) {
      audit.temperature = {
        isValid: true,
        status: 'WARNING',
        message: 'Fiebre (≥38.0 °C).',
      };
    } else if (temp >= 37.5) {
      audit.temperature = {
        isValid: true,
        status: 'WARNING',
        message: 'Temperatura ligeramente elevada (37.5 - 37.9 °C).',
      };
    } else if (temp < 35.5) {
      audit.temperature = {
        isValid: true,
        status: 'WARNING',
        message: 'Temperatura baja (<35.5 °C). Correlacionar clínicamente.',
      };
    }
  }

  // Saturación de oxígeno
  if (typeof spo2 === 'number') {
    if (spo2 < 40 || spo2 > 100) {
      audit.oxygenSat = {
        isValid: false,
        status: 'INVALID',
        message: 'Lectura no plausible (40 - 100 %). Verificar sensor y medición.',
      };
      audit.hasErrors = true;
    } else if (spo2 < 90) {
      audit.oxygenSat = {
        isValid: true,
        status: 'ALERT',
        message: 'Saturación de oxígeno marcadamente reducida (<90%).',
      };
    } else if (spo2 < 94) {
      audit.oxygenSat = {
        isValid: true,
        status: 'WARNING',
        message: 'Saturación de oxígeno reducida (90 - 93%).',
      };
    }
  }

  return audit;
};

// =========================================================================
// 2. MOTOR DE INFERENCIA CLÍNICA
// =========================================================================

export const evaluateClinicalInference = (
  anamnesis: string,
  patientSymptoms: string[],
  vitals?: {
    systolic?: number | '';
    diastolic?: number | '';
    heartRate?: number | '';
    respiratoryRate?: number | '';
    temperature?: number | '';
    oxygenSat?: number | '';
  },
  prescriptions: Array<{ medicine: string }> = [],
  patientAllergies?: string | null
): ClinicalInferenceResult => {
  const findings: ClinicalFinding[] = [];
  const scoreTrace: ScoreTraceItem[] = [];
  const pharmacologicalAlerts: PharmacologicalAlert[] = [];

  const rawCorpus = `${anamnesis} ${patientSymptoms.join(' ')}`;

  // 2.1 Detección de Sintomatología Afirmada (con filtro de negaciones)
  const hasChestPain = isSymptomAffirmed(rawCorpus, [
    'dolor de pecho',
    'dolor toracico',
    'pecho',
    'precordial',
    'opresion toracica',
    'retroesternal',
  ]);

  const hasDyspnea = isSymptomAffirmed(rawCorpus, [
    'dificultad para respirar',
    'disnea',
    'falta de aire',
    'ahogo',
    'asfixia',
  ]);

  const hasSyncope = isSymptomAffirmed(rawCorpus, [
    'desmayo',
    'sincope',
    'desvanecimiento',
    'lipotimia',
  ]);

  const hasSeizure = isSymptomAffirmed(rawCorpus, [
    'convulsion',
    'convulsiones',
    'crisis convulsiva',
  ]);

  const hasBleeding = isSymptomAffirmed(rawCorpus, [
    'sangrado',
    'hemorragia',
    'hematemesis',
    'melena',
    'rectorragia',
  ]);

  const hasFocalNeuro = isSymptomAffirmed(rawCorpus, [
    'paralisis',
    'debilidad facial',
    'perdida de fuerza',
    'afasia',
    'dificultad para hablar',
    'asimetria facial',
  ]);

  if (hasChestPain) {
    findings.push({
      label: 'Dolor torácico',
      detail: 'Sintomatología torácica o precordial afirmada en la anamnesis.',
      source: 'ANAMNESIS',
    });
    scoreTrace.push({
      rule: 'Dolor torácico o precordial referido',
      points: 3,
      source: 'SINTOMAS',
    });
  }

  if (hasDyspnea) {
    findings.push({
      label: 'Disnea',
      detail: 'Dificultad respiratoria afirmada en la anamnesis.',
      source: 'ANAMNESIS',
    });
    scoreTrace.push({
      rule: 'Disnea o dificultad respiratoria activa',
      points: 2,
      source: 'SINTOMAS',
    });
  }

  if (hasSyncope) {
    findings.push({
      label: 'Síncope',
      detail: 'Episodio de pérdida transitoria de conciencia o desvanecimiento.',
      source: 'ANAMNESIS',
    });
    scoreTrace.push({
      rule: 'Síncope o pérdida transitoria de conciencia',
      points: 3,
      source: 'SINTOMAS',
    });
  }

  if (hasSeizure) {
    findings.push({
      label: 'Evento convulsivo',
      detail: 'Antecedente o episodio convulsivo referido en la anamnesis.',
      source: 'ANAMNESIS',
    });
    scoreTrace.push({
      rule: 'Evento convulsivo referido',
      points: 4,
      source: 'SINTOMAS',
    });
  }

  if (hasBleeding) {
    findings.push({
      label: 'Signo hemorrágico',
      detail: 'Sangrado activo o exteriorizado referido en la anamnesis.',
      source: 'ANAMNESIS',
    });
    scoreTrace.push({
      rule: 'Evidencia de sangrado activo',
      points: 3,
      source: 'SINTOMAS',
    });
  }

  if (hasFocalNeuro) {
    findings.push({
      label: 'Déficit neurológico focal',
      detail: 'Signos compatibles con alteración neurológica focal.',
      source: 'ANAMNESIS',
    });
    scoreTrace.push({
      rule: 'Déficit neurológico focal agudo',
      points: 4,
      source: 'SINTOMAS',
    });
  }

  // 2.2 Normalización de Signos Vitales
  const sys = typeof vitals?.systolic === 'number' ? vitals.systolic : null;
  const dia = typeof vitals?.diastolic === 'number' ? vitals.diastolic : null;
  const hr = typeof vitals?.heartRate === 'number' ? vitals.heartRate : null;
  const rr = typeof vitals?.respiratoryRate === 'number' ? vitals.respiratoryRate : null;
  const temp = typeof vitals?.temperature === 'number' ? vitals.temperature : null;
  const spo2 = typeof vitals?.oxygenSat === 'number' ? vitals.oxygenSat : null;

  // SpO2
  if (spo2 !== null) {
    if (spo2 < 90) {
      findings.push({
        label: 'Saturación reducida',
        detail: `SpO₂ registrada: ${spo2}%.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Saturación de oxígeno marcadamente reducida (${spo2}%)`,
        points: 4,
        source: 'SIGNOS',
      });
    } else if (spo2 < 94) {
      findings.push({
        label: 'Desaturación',
        detail: `SpO₂ registrada: ${spo2}%.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Saturación de oxígeno reducida (${spo2}%)`,
        points: 2,
        source: 'SIGNOS',
      });
    }
  }

  // Frecuencia respiratoria
  if (rr !== null) {
    if (rr >= 28) {
      findings.push({
        label: 'Taquipnea marcada',
        detail: `Frecuencia respiratoria: ${rr} rpm.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Frecuencia respiratoria marcadamente elevada (${rr} rpm)`,
        points: 3,
        source: 'SIGNOS',
      });
    } else if (rr >= 22) {
      findings.push({
        label: 'Taquipnea',
        detail: `Frecuencia respiratoria: ${rr} rpm.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Frecuencia respiratoria elevada (${rr} rpm)`,
        points: 2,
        source: 'SIGNOS',
      });
    } else if (rr < 10) {
      findings.push({
        label: 'Bradipnea',
        detail: `Frecuencia respiratoria: ${rr} rpm.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Frecuencia respiratoria reducida (${rr} rpm)`,
        points: 3,
        source: 'SIGNOS',
      });
    }
  }

  // Frecuencia cardíaca
  if (hr !== null) {
    if (hr >= 120) {
      findings.push({
        label: 'Taquicardia marcada',
        detail: `Frecuencia cardíaca: ${hr} lpm.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Frecuencia cardíaca marcadamente elevada (${hr} lpm)`,
        points: 2,
        source: 'SIGNOS',
      });
    } else if (hr > 100) {
      findings.push({
        label: 'Taquicardia',
        detail: `Frecuencia cardíaca: ${hr} lpm.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Frecuencia cardíaca elevada (${hr} lpm)`,
        points: 1,
        source: 'SIGNOS',
      });
    } else if (hr < 50) {
      findings.push({
        label: 'Bradicardia marcada',
        detail: `Frecuencia cardíaca: ${hr} lpm.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Frecuencia cardíaca marcadamente reducida (${hr} lpm)`,
        points: 2,
        source: 'SIGNOS',
      });
    }
  }

  // Temperatura
  if (temp !== null) {
    if (temp >= 39) {
      findings.push({
        label: 'Fiebre elevada',
        detail: `Temperatura registrada: ${temp} °C.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Temperatura elevada (${temp} °C)`,
        points: 2,
        source: 'SIGNOS',
      });
    } else if (temp >= 38) {
      findings.push({
        label: 'Síndrome febril',
        detail: `Temperatura registrada: ${temp} °C.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Fiebre (${temp} °C)`,
        points: 1,
        source: 'SIGNOS',
      });
    }
  }

  // Presión arterial
  if (sys !== null && dia !== null) {
    if (sys >= 180 || dia >= 110) {
      findings.push({
        label: 'Cifra tensional severamente elevada',
        detail: `Presión arterial: ${sys}/${dia} mmHg.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Presión arterial severamente elevada (${sys}/${dia} mmHg)`,
        points: 3,
        source: 'SIGNOS',
      });
    } else if (sys >= 140 || dia >= 90) {
      findings.push({
        label: 'Presión arterial elevada',
        detail: `Presión arterial: ${sys}/${dia} mmHg.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Presión arterial elevada (${sys}/${dia} mmHg)`,
        points: 1,
        source: 'SIGNOS',
      });
    } else if (sys < 90) {
      findings.push({
        label: 'Hipotensión',
        detail: `Presión arterial: ${sys}/${dia} mmHg.`,
        source: 'VITALS',
      });
      scoreTrace.push({
        rule: `Presión sistólica baja (${sys} mmHg)`,
        points: 2,
        source: 'SIGNOS',
      });
    }
  }

  // 2.3 Farmacoseguridad y Alergias
  if (patientAllergies && prescriptions.length > 0) {
    const allergyText = normalizeText(patientAllergies);

    const hasPenicillinAllergy =
      allergyText.includes('alergia a penicilina') ||
      allergyText.includes('alergia penicilina') ||
      allergyText.includes('alergia a amoxicilina') ||
      allergyText.includes('alergia amoxicilina');

    const hasNsaidAllergy =
      allergyText.includes('alergia a aine') ||
      allergyText.includes('alergia aine') ||
      allergyText.includes('alergia a aspirina') ||
      allergyText.includes('alergia aspirina') ||
      allergyText.includes('alergia a ibuprofeno') ||
      allergyText.includes('alergia ibuprofeno');

    const hasNsaidIntolerance =
      allergyText.includes('intolerancia a aine') ||
      allergyText.includes('intolerancia aine') ||
      allergyText.includes('intolerancia a aspirina') ||
      allergyText.includes('intolerancia aspirina') ||
      allergyText.includes('intolerancia a ibuprofeno');

    for (const prescription of prescriptions) {
      const medicine = prescription.medicine.trim();
      if (!medicine) continue;

      const medText = normalizeText(medicine);

      // Penicilinas
      const isPenicillinFamily =
        medText.includes('amoxicilina') ||
        medText.includes('ampicilina') ||
        medText.includes('penicilina') ||
        medText.includes('piperacilina');

      if (hasPenicillinAllergy && isPenicillinFamily) {
        pharmacologicalAlerts.push({
          type: 'ALERGIA_MAYOR',
          medicine,
          message: `Posible conflicto farmacológico: existe una alergia registrada a penicilinas y la prescripción contiene "${medicine}". Revisar antes de cerrar la receta.`,
        });
        scoreTrace.push({
          rule: `Posible conflicto entre alergia a penicilinas y ${medicine}`,
          points: 2,
          source: 'FARMACO',
        });
      }

      // AINEs — Alergia Mayor
      const isNsaid =
        medText.includes('ibuprofeno') ||
        medText.includes('aspirina') ||
        medText.includes('diclofenaco') ||
        medText.includes('ketorolaco') ||
        medText.includes('naproxeno') ||
        medText.includes('meloxicam');

      if (hasNsaidAllergy && isNsaid) {
        pharmacologicalAlerts.push({
          type: 'ALERGIA_MAYOR',
          medicine,
          message: `Posible conflicto farmacológico: existe una alergia registrada a AINEs y la prescripción contiene "${medicine}". Revisar antes de cerrar la receta.`,
        });
        scoreTrace.push({
          rule: `Posible conflicto entre alergia a AINEs y ${medicine}`,
          points: 2,
          source: 'FARMACO',
        });
      }

      // AINEs — Intolerancia
      if (hasNsaidIntolerance && isNsaid) {
        pharmacologicalAlerts.push({
          type: 'INTOLERANCIA',
          medicine,
          message: `Precaución: existe intolerancia registrada a AINEs y la prescripción contiene "${medicine}". Revisar tolerancia y antecedentes antes de confirmar.`,
        });
        scoreTrace.push({
          rule: `Precaución por intolerancia a AINEs (${medicine})`,
          points: 1,
          source: 'FARMACO',
        });
      }
    }
  }

  // 2.4 Score Total
  const totalScore = scoreTrace.reduce((total, item) => total + item.points, 0);

  // 2.5 Critical Overrides (Solo combinaciones de alta severidad)
  const isHypoxemicEmergency =
    spo2 !== null && spo2 < 90 && (hasDyspnea || (rr !== null && rr >= 28));

  const isCardiovascularEmergency =
    hasChestPain &&
    ((sys !== null && sys >= 180) || hasSyncope || (hr !== null && hr >= 120));

  const isNeurologicalEmergency = hasFocalNeuro || hasSeizure;

  const isSevereRespiratoryPattern =
    rr !== null && rr >= 28 && spo2 !== null && spo2 < 90;

  const criticalOverride =
    isHypoxemicEmergency ||
    isCardiovascularEmergency ||
    isNeurologicalEmergency ||
    isSevereRespiratoryPattern;

  // 2.6 Clasificación de Riesgo
  let overallRisk: RiskSeverity = 'BAJO';
  let syndromicPattern: string | null = null;
  let recommendation =
    'Cuadro sin alertas mayores detectadas por el motor. Continuar valoración clínica y plan diagnóstico-terapéutico según criterio del profesional.';

  if (criticalOverride) {
    overallRisk = 'CRITICO';
    if (isHypoxemicEmergency || isSevereRespiratoryPattern) {
      syndromicPattern = 'Patrón de Compromiso Respiratorio Agudo';
      recommendation =
        'Se detectan hallazgos respiratorios de alta prioridad. Requiere valoración médica inmediata, reevaluación de signos vitales y consideración de soporte respiratorio o derivación según criterio clínico.';
    } else if (isCardiovascularEmergency) {
      syndromicPattern = 'Patrón Cardiovascular de Alta Prioridad';
      recommendation =
        'Se detecta combinación de sintomatología torácica y hallazgos cardiovasculares de alta prioridad. Requiere valoración médica inmediata y estudios complementarios según criterio clínico.';
    } else if (isNeurologicalEmergency) {
      syndromicPattern = 'Patrón Neurológico de Alta Prioridad';
      recommendation =
        'Se detectan signos neurológicos de alta prioridad. Requiere valoración médica inmediata y evaluación neurológica según criterio profesional.';
    }
  } else if (totalScore >= 5) {
    overallRisk = 'ALTO';
    if (hasDyspnea || (spo2 !== null && spo2 < 94) || (rr !== null && rr >= 22)) {
      syndromicPattern = 'Patrón de Compromiso Respiratorio';
      recommendation =
        'Se identifican hallazgos respiratorios relevantes. Se recomienda valoración clínica prioritaria, reevaluación de signos vitales y estudios complementarios según criterio médico.';
    } else if (hasChestPain || (sys !== null && sys >= 160)) {
      syndromicPattern = 'Patrón Cardiovascular de Riesgo';
      recommendation =
        'Se identifican síntomas o alteraciones cardiovasculares relevantes. Se recomienda valoración prioritaria y correlación con estudios complementarios según criterio médico.';
    } else if (hasFocalNeuro || hasSeizure) {
      syndromicPattern = 'Patrón Neurológico de Riesgo';
      recommendation =
        'Se identifican hallazgos neurológicos relevantes. Se recomienda valoración médica prioritaria y evaluación complementaria.';
    } else {
      syndromicPattern = 'Alteración Clínica Multivariable';
      recommendation =
        'Se identifican múltiples hallazgos relevantes. Se recomienda priorizar la valoración médica y determinar estudios adicionales según criterio profesional.';
    }
  } else if (totalScore >= 3) {
    overallRisk = 'MODERADO';
    if (temp !== null && temp >= 38) {
      syndromicPattern = 'Síndrome Febril';
      recommendation =
        'Se identifica respuesta febril. Mantener vigilancia clínica, reevaluar signos vitales y establecer pautas de alarma según criterio del profesional.';
    } else if (hasDyspnea || (spo2 !== null && spo2 < 94) || (rr !== null && rr >= 22)) {
      syndromicPattern = 'Alteración Respiratoria Leve-Moderada';
      recommendation =
        'Se identifican hallazgos respiratorios que requieren seguimiento y correlación clínica. Reevaluar según evolución.';
    } else if (hasChestPain) {
      syndromicPattern = 'Sintomatología Torácica';
      recommendation =
        'Se identifica sintomatología torácica. Requiere correlación clínica y seguimiento según valoración profesional.';
    } else {
      syndromicPattern = 'Alteración Fisiológica Leve-Moderada';
      recommendation =
        'Se identifican alteraciones clínicas que requieren seguimiento y correlación con el resto de la valoración.';
    }
  }

  return {
    overallRisk,
    totalScore,
    scoreTrace,
    syndromicPattern,
    findings,
    recommendation,
    criticalOverride,
    hasPharmacologicalAlert: pharmacologicalAlerts.length > 0,
    pharmacologicalAlerts,
  };
};

export default evaluateClinicalInference;