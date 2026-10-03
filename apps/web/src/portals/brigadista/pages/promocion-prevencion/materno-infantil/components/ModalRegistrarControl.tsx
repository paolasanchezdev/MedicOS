// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/materno-infantil/components/ModalRegistrarControl.tsx
// DESCRIPCIÓN: Registro preventivo estructurado para el control materno e infantil.
// =========================================================================

import React, { useState } from 'react';
import { X, HeartPulse, CheckCircle2, ArrowRight } from 'lucide-react';
import type {
  TipoControlMaternoInfantil,
  DesenlaceControl,
  RegistrarControlDto,
} from '../../../../../../modules/maternal-health/types/materno-infantil.types';

interface ModalRegistrarControlProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: TipoControlMaternoInfantil;
  pacienteId: string;
  pacienteNombre: string;
  expediente?: string;
  semanasActuales?: number;
  onGuardar: (dto: RegistrarControlDto) => Promise<boolean>;
}

export const ModalRegistrarControl: React.FC<ModalRegistrarControlProps> = ({
  isOpen,
  onClose,
  tipo,
  pacienteId,
  pacienteNombre,
  expediente = 'EXP-2026',
  semanasActuales = 14,
  onGuardar,
}) => {
  const [paso, setPaso] = useState<number>(1);
  const [semanas, setSemanas] = useState<number>(semanasActuales);
  const [peso, setPeso] = useState<string>('');
  const [presion, setPresion] = useState<string>('');
  const [talla, setTalla] = useState<string>('');
  const [educacion, setEducacion] = useState<string[]>([]);
  const [desenlace, setDesenlace] = useState<DesenlaceControl>('SEGUIMIENTO_NORMAL');
  const [proximaFecha, setProximaFecha] = useState<string>('2026-10-15');
  const [observaciones, setObservaciones] = useState<string>('');
  const [guardando, setGuardando] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleEducacion = (tema: string) => {
    setEducacion((prev) =>
      prev.includes(tema) ? prev.filter((t) => t !== tema) : [...prev, tema]
    );
  };

  const handleCompletar = async () => {
    setGuardando(true);
    const exito = await onGuardar({
      pacienteId,
      tipo,
      semanasGestacion: tipo === 'materno' ? semanas : null,
      peso: peso ? parseFloat(peso) : null,
      presionArterial: tipo === 'materno' && presion ? presion.trim() : null,
      tallaLongitud: tipo === 'infantil' && talla ? parseFloat(talla) : null,
      temasEducacion: educacion,
      desenlace,
      fechaProximoSeguimiento: proximaFecha,
      observaciones: observaciones.trim() || null,
    });
    setGuardando(false);
    if (exito) {
      setPaso(1);
      onClose();
    }
  };

  const opcionesEducacion =
    tipo === 'materno'
      ? [
          'Identificación de signos de alarma obstétricos (sangrado, cefalea, edema)',
          'Alimentación saludable y suplementación (hierro y ácido fólico)',
          'Importancia de asistencia regular a controles prenatales',
          'Elaboración del plan de parto y transporte oportuno',
          'Técnicas y beneficios de lactancia materna exclusiva',
          'Salud emocional y red de apoyo familiar',
        ]
      : [
          'Lactancia materna exclusiva o alimentación complementaria oportuna',
          'Signos de alarma pediátricos (fiebre alta, dificultad respiratoria, deshidratación)',
          'Revisión y cumplimiento del esquema nacional de vacunación',
          'Higiene en el hogar y lavado correcto de manos',
          'Pautas de estimulación temprana según edad',
        ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#166E7A]" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 uppercase">
                  {tipo === 'materno' ? 'Nuevo Control Prenatal' : 'Nuevo Control Infantil'}
                </h3>
                <span className="font-mono text-[10px] font-bold text-[#166E7A] bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                  {expediente}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold">{pacienteNombre}</p>
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

        <div className="p-5 overflow-y-auto space-y-4">
          {paso === 1 && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#166E7A]">
                1. Evaluación Antropométrica y Signos en Comunidad
              </h4>

              {tipo === 'materno' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    Semanas de Gestación al Día de Hoy
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="42"
                    value={semanas}
                    onChange={(e) => setSemanas(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    placeholder="Ej. 62.5"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                  />
                </div>
                {tipo === 'materno' ? (
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Presión Arterial (mmHg)
                    </label>
                    <input
                      type="text"
                      value={presion}
                      onChange={(e) => setPresion(e.target.value)}
                      placeholder="Ej. 110/70"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      Longitud / Talla (cm)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={talla}
                      onChange={(e) => setTalla(e.target.value)}
                      placeholder="Ej. 75"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Observaciones Generales o Situaciones Reportadas
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={2}
                  placeholder="Comportamiento, tolerancia alimentaria o aspectos observados..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                />
              </div>
            </div>
          )}

          {paso === 2 && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#166E7A]">
                2. Educación y Consejería Preventiva
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Marca los aspectos orientados al paciente o responsable durante la visita:
              </p>
              <div className="space-y-2">
                {opcionesEducacion.map((tema) => (
                  <label
                    key={tema}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={educacion.includes(tema)}
                      onChange={() => toggleEducacion(tema)}
                      className="rounded text-[#166E7A] focus:ring-0"
                    />
                    <span>{tema}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {paso === 3 && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#166E7A]">
                3. Desenlace y Próximo Seguimiento
              </h4>
              <div className="space-y-2 text-xs">
                {[
                  { id: 'SEGUIMIENTO_NORMAL', label: 'Seguimiento normal en comunidad' },
                  { id: 'PROXIMO_CONTROL', label: 'Próximo control territorial programado' },
                  { id: 'REQUIERE_VALORACION', label: 'Requiere valoración médica por médico de brigada' },
                  { id: 'REFERIDO_RED', label: 'Referido a Unidad de Salud / Hospital de la red' },
                ].map((d) => (
                  <label
                    key={d.id}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 cursor-pointer font-semibold text-slate-800"
                  >
                    <input
                      type="radio"
                      name="desenlace"
                      value={d.id}
                      checked={desenlace === d.id}
                      onChange={(e) => setDesenlace(e.target.value as DesenlaceControl)}
                      className="text-[#166E7A] focus:ring-0"
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Fecha del Próximo Control Territorial
                </label>
                <input
                  type="date"
                  value={proximaFecha}
                  onChange={(e) => setProximaFecha(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
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
              onClick={() => setPaso((p) => p + 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={guardando}
              onClick={() => void handleCompletar()}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{guardando ? 'Guardando...' : 'Guardar Atención en Expediente'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};