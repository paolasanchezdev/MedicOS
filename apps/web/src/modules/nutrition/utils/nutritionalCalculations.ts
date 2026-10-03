// =========================================================================
// ARCHIVO: apps/web/src/modules/nutrition/utils/nutritionalCalculations.ts
// DESCRIPCIÓN: Funciones puras de cálculo antropométrico e interpretación
//              orientativa basada en estándares comunitarios MINSAL / OMS.
// =========================================================================

import type {
  GrupoEtario,
  ClasificacionNutricional,
} from '../types/nutrition.types';

export function calcularEdadAnios(fechaNac?: string | Date | null): number | null {
  if (!fechaNac) return null;
  const nac = new Date(fechaNac);
  if (isNaN(nac.getTime())) return null;
  const hoy = new Date();
  if (nac.getFullYear() < 1900 || nac > hoy) return null;
  let anios = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) {
    anios--;
  }
  return anios >= 0 ? anios : null;
}

export function calcularEdadMeses(fechaNac?: string | Date | null): number | null {
  if (!fechaNac) return null;
  const nac = new Date(fechaNac);
  if (isNaN(nac.getTime())) return null;
  const hoy = new Date();
  let meses = (hoy.getFullYear() - nac.getFullYear()) * 12;
  meses += hoy.getMonth() - nac.getMonth();
  if (hoy.getDate() < nac.getDate()) {
    meses--;
  }
  return meses >= 0 ? meses : null;
}

export function determinarGrupoEtario(
  edadAnios: number,
  edadMeses: number,
  esGestante = false
): GrupoEtario {
  if (esGestante) return 'GESTANTE';
  if (edadMeses < 12) return 'LACTANTE';
  if (edadAnios < 5) return 'PRIMERA_INFANCIA';
  if (edadAnios < 12) return 'ESCOLAR';
  if (edadAnios < 18) return 'ADOLESCENTE';
  if (edadAnios >= 60) return 'ADULTO_MAYOR';
  return 'ADULTO';
}

export function calcularIMC(pesoKg: number, tallaM: number): number | null {
  if (!pesoKg || !tallaM || tallaM <= 0) return null;
  const valor = pesoKg / (tallaM * tallaM);
  return Math.round(valor * 10) / 10;
}

export interface InterpretacionNutricional {
  clasificacion: ClasificacionNutricional;
  etiqueta: string;
  colorTexto: string;
  colorBg: string;
  colorBorde: string;
  esAlerta: boolean;
  orientacion: string;
}

export function interpretarEstadoNutricional(
  grupoEtario: GrupoEtario,
  imc: number | null
): InterpretacionNutricional {
  if (!imc) {
    return {
      clasificacion: 'EVALUACION_PENDIENTE',
      etiqueta: 'Pendiente de Medidas',
      colorTexto: 'text-slate-600',
      colorBg: 'bg-slate-100',
      colorBorde: 'border-slate-200',
      esAlerta: false,
      orientacion: 'Registre peso y talla para obtener el indicador.',
    };
  }

  // Interpretación para Adultos y Adultos Mayores
  if (grupoEtario === 'ADULTO' || grupoEtario === 'ADULTO_MAYOR' || grupoEtario === 'GESTANTE') {
    if (imc < 18.5) {
      return {
        clasificacion: 'BAJO_PESO',
        etiqueta: 'Bajo Peso',
        colorTexto: 'text-rose-700',
        colorBg: 'bg-rose-50',
        colorBorde: 'border-rose-200',
        esAlerta: true,
        orientacion: 'Ingesta calórica insuficiente. Requiere consejería nutricional y seguimiento.',
      };
    }
    if (imc >= 18.5 && imc <= 24.9) {
      return {
        clasificacion: 'PESO_ADECUADO',
        etiqueta: 'Peso Adecuado',
        colorTexto: 'text-emerald-700',
        colorBg: 'bg-emerald-50',
        colorBorde: 'border-emerald-200',
        esAlerta: false,
        orientacion: 'Estado nutricional en rango óptimo para su talla. Mantener hábitos activos.',
      };
    }
    if (imc >= 25.0 && imc <= 29.9) {
      return {
        clasificacion: 'SOBREPESO',
        etiqueta: 'Sobrepeso',
        colorTexto: 'text-amber-800',
        colorBg: 'bg-amber-50',
        colorBorde: 'border-amber-200',
        esAlerta: false,
        orientacion: 'Promover reducción de azúcares, hidratación con agua y actividad física.',
      };
    }
    return {
      clasificacion: 'OBESIDAD',
      etiqueta: 'Obesidad',
      colorTexto: 'text-rose-700',
      colorBg: 'bg-rose-50',
      colorBorde: 'border-rose-200',
      esAlerta: true,
      orientacion: 'Riesgo cardiovascular elevado. Requiere valoración médica y plan de alimentación.',
    };
  }

  // Interpretación pediátrica orientativa (Lactante, Primera Infancia, Escolar, Adolescente)
  if (imc < 14.0) {
    return {
      clasificacion: 'BAJO_PESO',
      etiqueta: 'Bajo Peso Infantil',
      colorTexto: 'text-rose-700',
      colorBg: 'bg-rose-50',
      colorBorde: 'border-rose-200',
      esAlerta: true,
      orientacion: 'Vigilar ganancia de peso según curva de crecimiento y consumo de micronutrientes.',
    };
  }
  if (imc >= 14.0 && imc <= 18.0) {
    return {
      clasificacion: 'PESO_ADECUADO',
      etiqueta: 'Crecimiento Adecuado',
      colorTexto: 'text-emerald-700',
      colorBg: 'bg-emerald-50',
      colorBorde: 'border-emerald-200',
      esAlerta: false,
      orientacion: 'Desarrollo antropométrico esperado para su etapa infantil.',
    };
  }
  return {
    clasificacion: 'SOBREPESO',
    etiqueta: 'Sobrepeso Infantil',
    colorTexto: 'text-amber-800',
    colorBg: 'bg-amber-50',
    colorBorde: 'border-amber-200',
    esAlerta: false,
    orientacion: 'Orientar a los tutores sobre refrigerios escolares saludables y limitar ultraprocesados.',
  };
}