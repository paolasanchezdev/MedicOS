// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/nutricion/components/ModalRegistrarControlNutricional.tsx
// DESCRIPCIÓN: Toma clínica de datos nutricionales: Antropometría pediátrica/adulta,
//              MUAC, descarte de edema, cálculo en vivo y consejería territorial.
//              Cumplimiento estricto de reglas de hooks de React y tipos TypeScript.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  X,
  Scale,
  CheckCircle2,
  ArrowRight,
  Activity,
  Baby,
} from 'lucide-react';
import type {
  DesenlaceNutricional,
  RegistrarControlNutricionalDto,
} from '../../../../../../modules/nutrition/types/nutrition.types';
import {
  calcularIMC,
  interpretarEstadoNutricional,
} from '../../../../../../modules/nutrition/utils/nutritionalCalculations';

type GrupoEtarioParam = Parameters<typeof interpretarEstadoNutricional>[0];

interface ModalRegistrarControlNutricionalProps {
  isOpen: boolean;
  onClose: () => void;
  pacienteId: string;
  pacienteNombre: string;
  expediente?: string;
  pesoAnteriorKg?: number | null;
  grupoEtario?: string;
  edadTexto?: string;
  onGuardar: (dto: RegistrarControlNutricionalDto) => Promise<boolean>;
}

interface ModalRegistrarControlNutricionalDialogProps {
  onClose: () => void;
  pacienteId: string;
  pacienteNombre: string;
  expediente: string;
  pesoAnteriorKg: number | null;
  grupoEtario: string;
  edadTexto: string;
  onGuardar: (dto: RegistrarControlNutricionalDto) => Promise<boolean>;
}

const ModalRegistrarControlNutricionalDialog: React.FC<ModalRegistrarControlNutricionalDialogProps> = ({
  onClose,
  pacienteId,
  pacienteNombre,
  expediente,
  pesoAnteriorKg,
  grupoEtario,
  edadTexto,
  onGuardar,
}) => {
  const [paso, setPaso] = useState<number>(1);
  const [peso, setPeso] = useState<string>('');
  const [tallaInput, setTallaInput] = useState<string>('');
  const [cintura, setCintura] = useState<string>('');
  const [muacCm, setMuacCm] = useState<string>('');
  const [edemaBilateral, setEdemaBilateral] = useState<boolean>(false);

  const [situaciones, setSituaciones] = useState<string[]>([]);
  const [educacion, setEducacion] = useState<string[]>([
    'Pautas de plato saludable y porciones adecuadas',
  ]);
  const [desenlace, setDesenlace] = useState<DesenlaceNutricional>('SEGUIMIENTO_NORMAL');
  const [proximaFecha, setProximaFecha] = useState<string>('2026-10-15');
  const [inscribirSeguimiento, setInscribirSeguimiento] = useState<boolean>(true);
  const [observaciones, setObservaciones] = useState<string>('');
  const [guardando, setGuardando] = useState<boolean>(false);

  // Detección si es menor/pediátrico
  const esPediatrico =
    grupoEtario.toUpperCase().includes('INFAN') ||
    grupoEtario.toUpperCase().includes('NIÑ') ||
    grupoEtario.toUpperCase().includes('LACT') ||
    (edadTexto.includes('año') && parseInt(edadTexto, 10) < 12) ||
    edadTexto.includes('mes');

  // Conversión inteligente de talla: si escribe 86 (cm) -> 0.86m
  const rawTallaNum = tallaInput ? parseFloat(tallaInput) : 0;
  const tallaM = rawTallaNum > 3 ? Math.round((rawTallaNum / 100) * 100) / 100 : rawTallaNum;
  const tallaCmDisplay = tallaM > 0 ? Math.round(tallaM * 100) : null;

  const pesoNum = peso ? parseFloat(peso) : 0;
  const imcCalculado = calcularIMC(pesoNum, tallaM);

  const interpretacion = useMemo(() => {
    if (!imcCalculado) return null;
    const grupo: GrupoEtarioParam = (esPediatrico ? 'NINEZ' : 'ADULTO') as GrupoEtarioParam;
    return interpretarEstadoNutricional(grupo, imcCalculado);
  }, [imcCalculado, esPediatrico]);

  // Clasificación de MUAC (Perímetro Braquial) infantil
  const muacNum = muacCm ? parseFloat(muacCm) : null;
  const clasificacionMuac = useMemo(() => {
    if (!muacNum) return null;
    if (muacNum < 11.5) {
      return {
        label: 'Desnutrición Aguda Severa (Alerta Roja)',
        color: 'bg-rose-100 text-rose-800 border-rose-300',
      };
    }
    if (muacNum < 12.5) {
      return {
        label: 'Desnutrición Aguda Moderada (Alerta Amarilla)',
        color: 'bg-amber-100 text-amber-900 border-amber-300',
      };
    }
    return {
      label: 'Adecuado / Normal (Verde)',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
  }, [muacNum]);

  const deltaPeso = pesoAnteriorKg && pesoNum > 0 ? Math.round((pesoNum - pesoAnteriorKg) * 10) / 10 : null;

  const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  const handleCompletar = async () => {
    if (!pesoNum || !tallaM) return;

    let obsExtra = observaciones.trim();
    if (esPediatrico && muacNum) {
      obsExtra += ` [PB/MUAC: ${muacNum} cm (${clasificacionMuac?.label || 'Medido'}) | Edema bilateral: ${
        edemaBilateral ? 'PRESENTE' : 'AUSENTE'
      }]`;
    }

    setGuardando(true);
    const ok = await onGuardar({
      pacienteId,
      pesoKg: pesoNum,
      tallaM,
      circunferenciaCinturaCm: cintura ? parseFloat(cintura) : null,
      situacionesIdentificadas: situaciones,
      temasEducacion: educacion,
      desenlace,
      fechaProximoSeguimiento: proximaFecha,
      observaciones: obsExtra.trim() || null,
      inscribirEnSeguimiento: inscribirSeguimiento,
    });
    setGuardando(false);
    if (ok) {
      setPaso(1);
      onClose();
    }
  };

  const opcionesSituaciones = [
    'Dificultades de alimentación o falta de apetito',
    'Pérdida de peso involuntaria reportada',
    'Ganancia excesiva de peso reportada',
    'Dificultad de acceso a alimentos en el hogar',
    'Consumo elevado de bebidas azucaradas o frituras',
    'Intolerancia o rechazo de alimentos',
  ];

  const opcionesEducacion = [
    'Pautas de plato saludable y porciones adecuadas',
    'Importancia de la lactancia materna exclusiva / complementaria',
    'Higiene en manipulación y lavado de alimentos',
    'Consumo diario de agua segura (hidratación)',
    'Alimentos ricos en hierro para prevención de anemia',
    'Orientación nutricional a la familia',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl h-155 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Cabecera Fija */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-[#166E7A] border border-teal-200">
              {esPediatrico ? <Baby className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-[#1A282D] uppercase tracking-tight">
                  {esPediatrico ? 'Control Nutricional Pediátrico' : 'Control de Vigilancia Nutricional'}
                </h3>
                <span className="font-mono text-[10px] font-bold text-[#166E7A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {expediente}
                </span>
              </div>
              <p className="text-[11px] text-medicos-muted font-semibold mt-0.5">
                {pacienteNombre} {edadTexto ? `• ${edadTexto}` : ''} ({grupoEtario})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Compacto Fijo */}
        <div className="px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-2 shrink-0 text-xs font-bold">
          {[
            { num: 1, label: 'Antropometría' },
            { num: 2, label: 'Situaciones y Consejería' },
            { num: 3, label: 'Desenlace' },
          ].map((st) => (
            <div
              key={st.num}
              onClick={() => {
                if (st.num === 1) setPaso(1);
                if (st.num === 2 && pesoNum && tallaM) setPaso(2);
                if (st.num === 3 && pesoNum && tallaM) setPaso(3);
              }}
              className={`flex items-center gap-1.5 cursor-pointer ${
                paso === st.num ? 'text-[#166E7A]' : paso > st.num ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] ${
                  paso === st.num
                    ? 'bg-[#166E7A] text-white'
                    : paso > st.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {st.num}
              </span>
              <span>{st.label}</span>
            </div>
          ))}
        </div>

        {/* Cuerpo Flexible */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* PASO 1: MEDIDAS ANTROPOMÉTRICAS */}
          {paso === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Peso Corporal (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    placeholder="Ej. 12.4"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] font-bold text-slate-900"
                  />
                  {pesoAnteriorKg && (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Peso anterior: {pesoAnteriorKg} kg
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Talla (cm o m)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={tallaInput}
                    onChange={(e) => setTallaInput(e.target.value)}
                    placeholder={esPediatrico ? 'Ej. 86 o 0.86' : 'Ej. 165 o 1.65'}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] font-bold text-slate-900"
                  />
                  {tallaM > 0 && (
                    <span className="text-[10.5px] font-bold text-[#166E7A] mt-1 block">
                      Registrada: {tallaM} m ({tallaCmDisplay} cm)
                    </span>
                  )}
                </div>
              </div>

              {/* SECCIÓN ESPECIAL PEDIÁTRICA (MUAC + EDEMA BILATERAL) */}
              {esPediatrico ? (
                <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#166E7A] flex items-center gap-1.5">
                      <Baby className="w-4 h-4" />
                      <span>Tamizaje Nutricional Pediátrico (MINSAL / OMS)</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Perímetro Braquial - MUAC (cm)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={muacCm}
                        onChange={(e) => setMuacCm(e.target.value)}
                        placeholder="Ej. 13.5"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-teal-300 rounded-xl"
                      />
                      {clasificacionMuac && (
                        <span className={`text-[9.5px] font-black px-2 py-0.5 rounded mt-1 inline-block border ${clasificacionMuac.color}`}>
                          {clasificacionMuac.label}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        Edema Bilateral en Pies
                      </label>
                      <button
                        type="button"
                        onClick={() => setEdemaBilateral((prev) => !prev)}
                        className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold border transition text-center ${
                          edemaBilateral
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-white text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {edemaBilateral ? '⚠️ PRESENTE (Alerta)' : '✓ Ausente (Normal)'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Circunferencia de Cintura (cm) • Adultos
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={cintura}
                    onChange={(e) => setCintura(e.target.value)}
                    placeholder="Ej. 78.5"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                  />
                </div>
              )}

              {/* Indicador Calculado en Vivo */}
              {imcCalculado && interpretacion && (
                <div className={`p-3.5 rounded-2xl border ${interpretacion.colorBorde} ${interpretacion.colorBg} space-y-1.5 shadow-2xs`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black flex items-center gap-1.5 text-slate-900">
                      <Activity className="w-4 h-4 text-[#166E7A]" />
                      <span>IMC: <strong>{imcCalculado} kg/m²</strong></span>
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border bg-white ${interpretacion.colorTexto} ${interpretacion.colorBorde}`}>
                      {interpretacion.etiqueta}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug">{interpretacion.orientacion}</p>
                  {deltaPeso !== null && (
                    <p className="text-[11px] font-bold text-slate-800 pt-1 border-t border-slate-200/60">
                      Variación de peso: {deltaPeso > 0 ? `+${deltaPeso} kg` : `${deltaPeso} kg`} respecto a la medición anterior.
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Observaciones Antropométricas
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={2}
                  placeholder="Detalles de la medición, balanza de campo utilizada..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                />
              </div>
            </div>
          )}

          {/* PASO 2: SITUACIONES Y CONSEJERÍA */}
          {paso === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#166E7A] mb-1.5">
                  Situaciones Socio-Alimentarias Identificadas
                </h4>
                <div className="space-y-1.5">
                  {opcionesSituaciones.map((sit) => (
                    <label
                      key={sit}
                      className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={situaciones.includes(sit)}
                        onChange={() => toggleArrayItem(setSituaciones, sit)}
                        className="rounded text-[#166E7A] focus:ring-0"
                      />
                      <span>{sit}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#166E7A] mb-1.5">
                  Consejería Nutricional Brindada
                </h4>
                <div className="space-y-1.5">
                  {opcionesEducacion.map((edu) => (
                    <label
                      key={edu}
                      className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 cursor-pointer text-xs text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={educacion.includes(edu)}
                        onChange={() => toggleArrayItem(setEducacion, edu)}
                        className="rounded text-[#166E7A] focus:ring-0"
                      />
                      <span>{edu}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: DESENLACE */}
          {paso === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#166E7A]">
                Desenlace y Próximo Control Territorial
              </h4>

              <div className="space-y-2 text-xs">
                {[
                  { id: 'SEGUIMIENTO_NORMAL', label: 'Seguimiento habitual en comunidad' },
                  { id: 'PROXIMO_CONTROL', label: 'Próximo control territorial programado' },
                  { id: 'REQUIERE_VALORACION_MEDICA', label: 'Requiere valoración por médico de brigada' },
                  { id: 'REFERENCIA_NUTRICION_RED', label: 'Referencia a Unidad de Salud / Nutricionista de la Red' },
                ].map((d) => (
                  <label
                    key={d.id}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 cursor-pointer font-semibold text-slate-800"
                  >
                    <input
                      type="radio"
                      name="desenlace"
                      value={d.id}
                      checked={desenlace === d.id}
                      onChange={(e) => setDesenlace(e.target.value as DesenlaceNutricional)}
                      className="text-[#166E7A] focus:ring-0"
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Fecha Propuesta para Próximo Control
                </label>
                <input
                  type="date"
                  value={proximaFecha}
                  onChange={(e) => setProximaFecha(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                />
              </div>

              <label className="flex items-center gap-2 p-3 rounded-2xl border border-teal-200 bg-teal-50/60 text-xs text-[#166E7A] font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={inscribirSeguimiento}
                  onChange={(e) => setInscribirSeguimiento(e.target.checked)}
                  className="rounded text-[#166E7A] focus:ring-0"
                />
                <span>Mantener a la persona en seguimiento nutricional activo</span>
              </label>
            </div>
          )}
        </div>

        {/* Pie Fijo */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between shrink-0">
          {paso > 1 ? (
            <button
              type="button"
              onClick={() => setPaso((p) => p - 1)}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Atrás
            </button>
          ) : (
            <div />
          )}

          {paso < 3 ? (
            <button
              type="button"
              disabled={!pesoNum || !tallaM}
              onClick={() => setPaso((p) => p + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-40"
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={guardando}
              onClick={() => void handleCompletar()}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{guardando ? 'Guardando...' : 'Guardar Control'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ModalRegistrarControlNutricional: React.FC<ModalRegistrarControlNutricionalProps> = ({
  isOpen,
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <ModalRegistrarControlNutricionalDialog
      key={props.pacienteId}
      onClose={props.onClose}
      pacienteId={props.pacienteId}
      pacienteNombre={props.pacienteNombre}
      expediente={props.expediente || 'EXP-NUT'}
      pesoAnteriorKg={props.pesoAnteriorKg ?? null}
      grupoEtario={props.grupoEtario || 'ADULTO'}
      edadTexto={props.edadTexto || ''}
      onGuardar={props.onGuardar}
    />
  );
};

export default ModalRegistrarControlNutricional;