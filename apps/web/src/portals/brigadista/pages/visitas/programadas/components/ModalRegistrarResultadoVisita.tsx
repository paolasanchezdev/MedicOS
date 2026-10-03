// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/visitas/programadas/components/ModalRegistrarResultadoVisita.tsx
// DESCRIPCIÓN: Registro de resultado de visita domiciliaria en terreno.
//              Cumplimiento estricto de pureza en React 19 y variables en uso.
// =========================================================================

import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import type {
  CommunityVisitRecord,
  ResultadoVisita,
  MotivoNoLocalizado,
  RegistrarResultadoVisitaDTO,
} from '../../../../../../modules/visits/types/visit.types';

interface ModalRegistrarResultadoVisitaProps {
  isOpen: boolean;
  onClose: () => void;
  visita: CommunityVisitRecord | null;
  onGuardar: (dto: RegistrarResultadoVisitaDTO) => Promise<boolean>;
}

export const ModalRegistrarResultadoVisita: React.FC<ModalRegistrarResultadoVisitaProps> = ({
  isOpen,
  onClose,
  visita,
  onGuardar,
}) => {
  const [resultado, setResultado] = useState<ResultadoVisita>('COMPLETADA');
  const [observaciones, setObservaciones] = useState<string>('');
  const [actividades, setActividades] = useState<string[]>([
    'Orientación al paciente y familia',
  ]);
  const [motivoNoLocalizado, setMotivoNoLocalizado] = useState<MotivoNoLocalizado>('NO_ESTABA_EN_VIVIENDA');
  const [reprogramar, setReprogramar] = useState<boolean>(false);
  const [nuevaFecha, setNuevaFecha] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [nuevaHora, setNuevaHora] = useState<string>('09:00');
  const [crearReferencia, setCrearReferencia] = useState<boolean>(false);
  const [guardando, setGuardando] = useState<boolean>(false);

  if (!isOpen || !visita) return null;

  const toggleActividad = (act: string) => {
    setActividades((prev) => (prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]));
  };

  const listaActividades = [
    'Orientación al paciente y familia',
    'Control y verificación de signos',
    'Educación sanitaria / medidas preventivas',
    'Verificación de adherencia a tratamiento',
    'Inspección de condiciones de vivienda y entorno',
    'Coordinación de cita con brigada médica',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const ok = await onGuardar({
      visitId: visita.id,
      resultadoVisita: resultado,
      observaciones: observaciones.trim(),
      actividadesRealizadas: actividades,
      motivoNoLocalizado: resultado === 'NO_LOCALIZADO' ? motivoNoLocalizado : undefined,
      reprogramar: reprogramar || resultado === 'REQUIERE_NUEVA_VISITA',
      nuevaFecha: reprogramar || resultado === 'REQUIERE_NUEVA_VISITA' ? nuevaFecha : undefined,
      nuevaHora: reprogramar || resultado === 'REQUIERE_NUEVA_VISITA' ? nuevaHora : undefined,
      crearReferencia: crearReferencia || resultado === 'REQUIERE_REFERENCIA',
    });
    setGuardando(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div>
            <h3 className="text-sm font-black text-[#1A282D] uppercase tracking-tight">
              Registrar Resultado de Visita
            </h3>
            <p className="text-[11px] text-[#52656C] font-semibold">
              {visita.patientName} {visita.patientExpediente ? `• ${visita.patientExpediente}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Motivo original */}
          <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs text-teal-950 space-y-0.5">
            <span className="text-[10px] font-bold text-[#166E7A] uppercase tracking-wider block">
              Objetivo de la Visita Realizada:
            </span>
            <p className="font-extrabold text-sm">{visita.reason}</p>
            {visita.comunidad && (
              <p className="text-[11px] text-teal-800">
                Lugar: {visita.comunidad} {visita.sector ? `(${visita.sector})` : ''}
              </p>
            )}
          </div>

          {/* Resultado de la visita */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Resultado de la Visita
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'COMPLETADA', label: 'Visita Completada' },
                { id: 'NO_LOCALIZADO', label: 'Paciente No Localizado' },
                { id: 'REQUIERE_NUEVA_VISITA', label: 'Requiere Nueva Visita' },
                { id: 'REQUIERE_REFERENCIA', label: 'Requiere Referencia Médica' },
              ].map((res) => (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => {
                    const val = res.id as ResultadoVisita;
                    setResultado(val);
                    if (val === 'REQUIERE_REFERENCIA') setCrearReferencia(true);
                  }}
                  className={`p-2 rounded-xl border text-center font-bold transition cursor-pointer ${
                    resultado === res.id
                      ? 'bg-[#166E7A] text-white border-[#166E7A]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {res.label}
                </button>
              ))}
            </div>
          </div>

          {/* Si no fue localizado */}
          {resultado === 'NO_LOCALIZADO' && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
              <span className="font-bold text-amber-900 block">
                Motivo de No Localización
              </span>
              <select
                value={motivoNoLocalizado}
                onChange={(e) => setMotivoNoLocalizado(e.target.value as MotivoNoLocalizado)}
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl"
              >
                <option value="NO_ESTABA_EN_VIVIENDA">No se encontraba en la vivienda</option>
                <option value="VIVIENDA_CERRADA">Vivienda cerrada / sin habitantes</option>
                <option value="DIRECCION_INSUFICIENTE">Dirección o referencia insuficiente</option>
                <option value="PACIENTE_SE_TRASLADO">Paciente se trasladó temporalmente</option>
                <option value="OTRO">Otro motivo</option>
              </select>

              <label className="flex items-center gap-2 font-bold text-amber-900 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={reprogramar}
                  onChange={(e) => setReprogramar(e.target.checked)}
                  className="rounded text-[#166E7A] focus:ring-0"
                />
                <span>¿Reprogramar visita para otra fecha?</span>
              </label>
            </div>
          )}

          {/* Actividades realizadas */}
          {resultado !== 'NO_LOCALIZADO' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Actividades Realizadas en Terreno
              </label>
              <div className="space-y-1 text-xs">
                {listaActividades.map((act) => (
                  <label
                    key={act}
                    className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 cursor-pointer text-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={actividades.includes(act)}
                      onChange={() => toggleActividad(act)}
                      className="rounded text-[#166E7A] focus:ring-0"
                    />
                    <span>{act}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Opción de Referencia Médica */}
          {resultado === 'REQUIERE_REFERENCIA' && (
            <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs space-y-1">
              <span className="font-bold text-teal-950 block">Continuidad Asistencial</span>
              <label className="flex items-center gap-2 font-bold text-[#166E7A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={crearReferencia}
                  onChange={(e) => setCrearReferencia(e.target.checked)}
                  className="rounded text-[#166E7A] focus:ring-0"
                />
                <span>Generar solicitud de referencia médica en Continuidad</span>
              </label>
            </div>
          )}

          {/* Observaciones */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Hallazgos y Observaciones de la Visita
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              placeholder="Detalla lo encontrado en la vivienda, acuerdos o condición de la persona..."
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
            />
          </div>

          {/* Reprogramación */}
          {(reprogramar || resultado === 'REQUIERE_NUEVA_VISITA') && (
            <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-teal-900 block mb-0.5">
                  Nueva Fecha de Visita
                </label>
                <input
                  type="date"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-teal-300 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-bold text-teal-900 block mb-0.5">
                  Hora
                </label>
                <input
                  type="time"
                  value={nuevaHora}
                  onChange={(e) => setNuevaHora(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-teal-300 rounded-xl"
                />
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando || !observaciones.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{guardando ? 'Guardando...' : 'Finalizar Visita'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};