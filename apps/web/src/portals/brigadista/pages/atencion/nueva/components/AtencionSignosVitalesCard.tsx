// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/atencion/nueva/components/AtencionSignosVitalesCard.tsx
// DESCRIPCIÓN: Paso 3 (Pestaña 1): Grid 3x2 de Signos Vitales con validación de rangos fisiológicos y detección de errores de digitación.
// =========================================================================

import React, { useMemo } from 'react';
import {
  Heart,
  Activity,
  Thermometer,
  Wind,
  Scale,
  Ruler,
  Info,
  Sparkles,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import type { SignosVitalesFormState } from '../../../../../../modules/atencion/types/atencion.types';

interface AtencionSignosVitalesCardProps {
  signosVitales: SignosVitalesFormState;
  onChangeSigno: (field: keyof SignosVitalesFormState, value: string) => void;
}

interface EstadoValidacion {
  estado: 'normal' | 'alerta' | 'critico' | 'error';
  mensaje: string;
  badgeClass: string;
}

export const AtencionSignosVitalesCard: React.FC<AtencionSignosVitalesCardProps> = ({
  signosVitales,
  onChangeSigno,
}) => {
  // Validación de Parámetros Fisiológicos y Rangos Clínicos
  const validaciones = useMemo(() => {
    const errores: string[] = [];
    const alertas: string[] = [];

    // 1. Presión Arterial
    let pa: EstadoValidacion | null = null;
    let errorSis = false;
    let errorDia = false;
    const sisStr = signosVitales.systolic.trim();
    const diaStr = signosVitales.diastolic.trim();

    if (sisStr !== '' || diaStr !== '') {
      const sis = parseFloat(sisStr);
      const dia = parseFloat(diaStr);

      const sisValida = !isNaN(sis) && sis >= 40 && sis <= 280;
      const diaValida = !isNaN(dia) && dia >= 30 && dia <= 180;

      if (sisStr !== '' && !sisValida) errorSis = true;
      if (diaStr !== '' && !diaValida) errorDia = true;

      if (errorSis || errorDia) {
        pa = {
          estado: 'error',
          mensaje: 'Valor no válido',
          badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
        };
        errores.push('PA fuera de rango (40-280 / 30-180)');
      } else if (sisStr !== '' && diaStr !== '') {
        if (sis <= dia) {
          pa = {
            estado: 'error',
            mensaje: 'Sistólica ≤ Diastólica',
            badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
          };
          errores.push('Sistólica debe ser mayor que Diastólica');
          errorSis = true;
          errorDia = true;
        } else if (sis >= 180 || dia >= 120) {
          pa = {
            estado: 'critico',
            mensaje: 'Crisis Hipertensiva',
            badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          };
          alertas.push('Crisis hipertensiva');
        } else if (sis >= 140 || dia >= 90) {
          pa = {
            estado: 'alerta',
            mensaje: 'HTA Grado 2',
            badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          };
          alertas.push('Presión arterial elevada (HTA 2)');
        } else if (sis >= 130 || dia >= 80) {
          pa = {
            estado: 'alerta',
            mensaje: 'HTA Grado 1',
            badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
          };
        } else if (sis < 90 || dia < 60) {
          pa = {
            estado: 'alerta',
            mensaje: 'Hipotensión',
            badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
          };
          alertas.push('Hipotensión');
        } else {
          pa = {
            estado: 'normal',
            mensaje: 'Normal',
            badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          };
        }
      }
    }

    // 2. Frecuencia Cardíaca
    let fc: EstadoValidacion | null = null;
    let errorFc = false;
    const fcStr = signosVitales.heartRate.trim();

    if (fcStr !== '') {
      const fcVal = parseFloat(fcStr);
      if (isNaN(fcVal) || fcVal < 30 || fcVal > 240) {
        errorFc = true;
        fc = {
          estado: 'error',
          mensaje: 'Valor no válido',
          badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
        };
        errores.push('FC fuera de rango (30 - 240 lpm)');
      } else if (fcVal > 120) {
        fc = {
          estado: 'critico',
          mensaje: 'Taquicardia Severa',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        };
        alertas.push('Taquicardia severa');
      } else if (fcVal > 100) {
        fc = {
          estado: 'alerta',
          mensaje: 'Taquicardia',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      } else if (fcVal < 50) {
        fc = {
          estado: 'critico',
          mensaje: 'Bradicardia Severa',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        };
        alertas.push('Bradicardia severa');
      } else if (fcVal < 60) {
        fc = {
          estado: 'alerta',
          mensaje: 'Bradicardia',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      } else {
        fc = {
          estado: 'normal',
          mensaje: 'Normal',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      }
    }

    // 3. Temperatura
    let temp: EstadoValidacion | null = null;
    let errorTemp = false;
    const tempStr = signosVitales.temperature.trim();

    if (tempStr !== '') {
      const tempVal = parseFloat(tempStr);
      if (isNaN(tempVal) || tempVal < 30.0 || tempVal > 44.0) {
        errorTemp = true;
        temp = {
          estado: 'error',
          mensaje: 'Valor no válido',
          badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
        };
        errores.push('Temp fuera de rango (30.0 - 44.0 °C)');
      } else if (tempVal >= 39.0) {
        temp = {
          estado: 'critico',
          mensaje: 'Fiebre Alta',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        };
        alertas.push('Fiebre alta');
      } else if (tempVal >= 38.0) {
        temp = {
          estado: 'alerta',
          mensaje: 'Fiebre',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        };
        alertas.push('Fiebre');
      } else if (tempVal >= 37.3) {
        temp = {
          estado: 'alerta',
          mensaje: 'Febrícula',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      } else if (tempVal < 35.5) {
        temp = {
          estado: 'critico',
          mensaje: 'Hipotermia',
          badgeClass: 'bg-sky-100 text-sky-800 border-sky-200',
        };
        alertas.push('Hipotermia');
      } else {
        temp = {
          estado: 'normal',
          mensaje: 'Normal',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      }
    }

    // 4. Saturación de Oxígeno
    let spo2: EstadoValidacion | null = null;
    let errorSpo2 = false;
    const spo2Str = signosVitales.oxygenSat.trim();

    if (spo2Str !== '') {
      const spo2Val = parseFloat(spo2Str);
      if (isNaN(spo2Val) || spo2Val < 50 || spo2Val > 100) {
        errorSpo2 = true;
        spo2 = {
          estado: 'error',
          mensaje: 'Valor no válido',
          badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
        };
        errores.push('SpO₂ fuera de rango (50 - 100%)');
      } else if (spo2Val < 90) {
        spo2 = {
          estado: 'critico',
          mensaje: 'Hipoxemia Severa',
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        };
        alertas.push('Desaturación severa');
      } else if (spo2Val < 95) {
        spo2 = {
          estado: 'alerta',
          mensaje: 'Hipoxemia Leve',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      } else {
        spo2 = {
          estado: 'normal',
          mensaje: 'Normal',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      }
    }

    // 5. Peso Corporal
    let peso: EstadoValidacion | null = null;
    let errorPeso = false;
    const pesoStr = signosVitales.weight.trim();

    if (pesoStr !== '') {
      const pesoVal = parseFloat(pesoStr);
      if (isNaN(pesoVal) || pesoVal < 2 || pesoVal > 300) {
        errorPeso = true;
        peso = {
          estado: 'error',
          mensaje: 'Valor no válido',
          badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
        };
        errores.push('Peso fuera de rango (2 - 300 kg)');
      }
    }

    // 6. Talla / Estatura
    let talla: EstadoValidacion | null = null;
    let errorTalla = false;
    const tallaStr = signosVitales.height.trim();

    if (tallaStr !== '') {
      const rawTalla = parseFloat(tallaStr);
      const tallaNorm = rawTalla > 3 ? rawTalla / 100 : rawTalla;
      if (isNaN(rawTalla) || tallaNorm < 0.40 || tallaNorm > 2.50) {
        errorTalla = true;
        talla = {
          estado: 'error',
          mensaje: 'Valor no válido',
          badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
        };
        errores.push('Talla fuera de rango (0.40 - 2.50 m)');
      }
    }

    return {
      pa,
      fc,
      temp,
      spo2,
      peso,
      talla,
      errorSis,
      errorDia,
      errorFc,
      errorTemp,
      errorSpo2,
      errorPeso,
      errorTalla,
      errores,
      alertas,
    };
  }, [
    signosVitales.systolic,
    signosVitales.diastolic,
    signosVitales.heartRate,
    signosVitales.temperature,
    signosVitales.oxygenSat,
    signosVitales.weight,
    signosVitales.height,
  ]);

  // Cálculo de IMC Seguro (solo si Peso y Talla son biológicamente válidos)
  const imcCalculado = useMemo(() => {
    if (validaciones.errorPeso || validaciones.errorTalla) return null;

    const peso = parseFloat(signosVitales.weight);
    let talla = parseFloat(signosVitales.height);
    if (!peso || !talla || isNaN(peso) || isNaN(talla)) return null;

    if (talla > 3) {
      talla = talla / 100;
    }

    if (talla < 0.40 || talla > 2.50 || peso < 2 || peso > 300) return null;

    const imc = peso / (talla * talla);
    if (isNaN(imc) || !isFinite(imc) || imc <= 8 || imc >= 90) return null;

    let estado = 'Normal';
    let colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (imc < 18.5) {
      estado = 'Bajo peso';
      colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (imc >= 25 && imc < 30) {
      estado = 'Sobrepeso';
      colorClass = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (imc >= 30) {
      estado = 'Obesidad';
      colorClass = 'text-rose-700 bg-rose-50 border-rose-200';
    }

    return {
      valor: imc.toFixed(1),
      estado,
      colorClass,
    };
  }, [
    signosVitales.weight,
    signosVitales.height,
    validaciones.errorPeso,
    validaciones.errorTalla,
  ]);

  const getInputClass = (hasError: boolean) => {
    if (hasError) {
      return 'w-full text-center text-base sm:text-lg font-extrabold bg-rose-50/70 border border-rose-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-rose-900 rounded-xl py-1.5 transition-colors';
    }
    return 'w-full text-center text-base sm:text-lg font-extrabold bg-slate-50/90 border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-slate-900 rounded-xl py-1.5 transition-colors';
  };

  return (
    <div className="flex-1 flex flex-col justify-between space-y-3">
      {/* 1. Encabezado de la Sección */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
            Medición de Constantes
          </span>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight">
            Parámetros Fisiológicos en Terreno
          </h3>
        </div>

        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/60">
          Opcionales según instrumental disponible
        </span>
      </div>

      {/* 2. Grid 3x2 de Signos Vitales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 flex-1">
        {/* 1. Presión Arterial */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Heart className="w-3.5 h-3.5" />
              </div>
              Presión Arterial
            </span>
            {validaciones.pa ? (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${validaciones.pa.badgeClass}`}
              >
                {validaciones.pa.mensaje}
              </span>
            ) : (
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">mmHg</span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <div className="flex-1 flex flex-col items-center">
              <input
                type="text"
                placeholder="120"
                value={signosVitales.systolic}
                onChange={(e) => onChangeSigno('systolic', e.target.value)}
                className={`${getInputClass(validaciones.errorSis)} px-1`}
              />
              <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Sistólica</span>
            </div>
            <span className="text-lg text-slate-300 font-bold mb-3">/</span>
            <div className="flex-1 flex flex-col items-center">
              <input
                type="text"
                placeholder="80"
                value={signosVitales.diastolic}
                onChange={(e) => onChangeSigno('diastolic', e.target.value)}
                className={`${getInputClass(validaciones.errorDia)} px-1`}
              />
              <span className="text-[10px] text-slate-400 mt-0.5 font-medium">Diastólica</span>
            </div>
          </div>
        </div>

        {/* 2. Frecuencia Cardíaca */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Activity className="w-3.5 h-3.5" />
              </div>
              Frecuencia Cardíaca
            </span>
            {validaciones.fc ? (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${validaciones.fc.badgeClass}`}
              >
                {validaciones.fc.mensaje}
              </span>
            ) : (
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">lpm</span>
            )}
          </div>

          <div className="pt-0.5">
            <input
              type="text"
              placeholder="75"
              value={signosVitales.heartRate}
              onChange={(e) => onChangeSigno('heartRate', e.target.value)}
              className={`${getInputClass(validaciones.errorFc)} px-3`}
            />
            <p className="text-[10px] text-slate-400 text-center mt-0.5 font-medium">
              Pulsaciones por minuto en reposo
            </p>
          </div>
        </div>

        {/* 3. Temperatura Corporal */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Thermometer className="w-3.5 h-3.5" />
              </div>
              Temperatura
            </span>
            {validaciones.temp ? (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${validaciones.temp.badgeClass}`}
              >
                {validaciones.temp.mensaje}
              </span>
            ) : (
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">°C</span>
            )}
          </div>

          <div className="pt-0.5">
            <input
              type="text"
              placeholder="36.5"
              value={signosVitales.temperature}
              onChange={(e) => onChangeSigno('temperature', e.target.value)}
              className={`${getInputClass(validaciones.errorTemp)} px-3`}
            />
            <p className="text-[10px] text-slate-400 text-center mt-0.5 font-medium">
              Grados Celsius axilar / digital
            </p>
          </div>
        </div>

        {/* 4. Saturación de Oxígeno */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                <Wind className="w-3.5 h-3.5" />
              </div>
              Saturación Oxígeno
            </span>
            {validaciones.spo2 ? (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${validaciones.spo2.badgeClass}`}
              >
                {validaciones.spo2.mensaje}
              </span>
            ) : (
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">% SpO₂</span>
            )}
          </div>

          <div className="pt-0.5">
            <input
              type="text"
              placeholder="98"
              value={signosVitales.oxygenSat}
              onChange={(e) => onChangeSigno('oxygenSat', e.target.value)}
              className={`${getInputClass(validaciones.errorSpo2)} px-3`}
            />
            <p className="text-[10px] text-slate-400 text-center mt-0.5 font-medium">
              Oximetría periférica de pulso
            </p>
          </div>
        </div>

        {/* 5. Peso Corporal */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Scale className="w-3.5 h-3.5" />
              </div>
              Peso Corporal
            </span>
            {validaciones.peso ? (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${validaciones.peso.badgeClass}`}
              >
                {validaciones.peso.mensaje}
              </span>
            ) : (
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">kg</span>
            )}
          </div>

          <div className="pt-0.5">
            <input
              type="text"
              placeholder="68.5"
              value={signosVitales.weight}
              onChange={(e) => onChangeSigno('weight', e.target.value)}
              className={`${getInputClass(validaciones.errorPeso)} px-3`}
            />
            <p className="text-[10px] text-slate-400 text-center mt-0.5 font-medium">
              Balanza comunitaria de terreno
            </p>
          </div>
        </div>

        {/* 6. Talla / Estatura */}
        <div className="p-3 sm:p-3.5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Ruler className="w-3.5 h-3.5" />
              </div>
              Talla / Estatura
            </span>
            {validaciones.talla ? (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${validaciones.talla.badgeClass}`}
              >
                {validaciones.talla.mensaje}
              </span>
            ) : (
              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase">m / cm</span>
            )}
          </div>

          <div className="pt-0.5">
            <input
              type="text"
              placeholder="1.65 o 165"
              value={signosVitales.height}
              onChange={(e) => onChangeSigno('height', e.target.value)}
              className={`${getInputClass(validaciones.errorTalla)} px-3`}
            />
            <p className="text-[10px] text-slate-400 text-center mt-0.5 font-medium">
              Acepta metros (1.70) o cm (170)
            </p>
          </div>
        </div>
      </div>

      {/* 3. Bloque Inferior: Alertas Clínicas y Resumen de IMC */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {validaciones.errores.length > 0 ? (
            <div className="flex items-center gap-1.5 text-rose-800 font-bold bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg truncate">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
              <span className="truncate">Error: {validaciones.errores.join(' • ')}</span>
            </div>
          ) : validaciones.alertas.length > 0 ? (
            <div className="flex items-center gap-1.5 text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg truncate">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span className="truncate">Alerta: {validaciones.alertas.join(' • ')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span className="text-[11px] sm:text-xs truncate">
                Registra únicamente mediciones verificadas con instrumental de la brigada.
              </span>
            </div>
          )}
        </div>

        {imcCalculado ? (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold ${imcCalculado.colorClass} shrink-0 shadow-2xs`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              IMC: {imcCalculado.valor} kg/m² ({imcCalculado.estado})
            </span>
          </div>
        ) : (
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">
            Ingresa Peso y Talla válidos para calcular IMC
          </span>
        )}
      </div>
    </div>
  );
};

export default AtencionSignosVitalesCard;