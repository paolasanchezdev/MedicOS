// =========================================================================
// ARCHIVO: ModalNuevoSeguimiento.tsx
// DESCRIPCIÓN: Modal para crear una tarea de continuidad conectada al Padrón.
// =========================================================================

import React, { useState } from 'react';
import { X, ClipboardList, CheckCircle2, UserCheck } from 'lucide-react';
import type { PatientRecord } from '../../../../../../modules/patients/types/patient.types';
import type {
  TipoSeguimiento,
  PrioridadSeguimiento,
  CrearSeguimientoDto,
} from '../../../../../../modules/continuity/types/continuity.types';

interface ModalNuevoSeguimientoProps {
  isOpen: boolean;
  onClose: () => void;
  pacientesPadron: PatientRecord[];
  onCrear: (dto: CrearSeguimientoDto) => Promise<boolean>;
}

export const ModalNuevoSeguimiento: React.FC<ModalNuevoSeguimientoProps> = ({
  isOpen,
  onClose,
  pacientesPadron,
  onCrear,
}) => {
  const [pacienteId, setPacienteId] = useState<string>('');
  const [tipo, setTipo] = useState<TipoSeguimiento>('CONTROL_CLINICO');
  const [descripcion, setDescripcion] = useState<string>('');
  const [proximaAccion, setProximaAccion] = useState<string>('');
  const [fechaPrevista, setFechaPrevista] = useState<string>('2026-10-08');
  const [prioridad, setPrioridad] = useState<PrioridadSeguimiento>('NORMAL');
  const [responsable, setResponsable] = useState<string>('Carlos Pérez (Brigadista Territorial)');
  const [guardando, setGuardando] = useState<boolean>(false);

  if (!isOpen) return null;

  const pacienteSeleccionado = pacientesPadron.find((p) => p.id === pacienteId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !descripcion.trim() || !proximaAccion.trim() || !fechaPrevista) return;

    setGuardando(true);
    const ok = await onCrear({
      pacienteId,
      tipo,
      descripcion: descripcion.trim(),
      proximaAccion: proximaAccion.trim(),
      fechaPrevista,
      prioridad,
      responsable,
    });
    setGuardando(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        
        {/* Cabecera */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-[#166E7A] border border-teal-200">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#1A282D] uppercase tracking-tight">
                Crear Tarea de Seguimiento Activo
              </h3>
              <p className="text-[11px] text-medicos-muted font-medium">
                Vincular acción pendiente de continuidad a una persona del padrón
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* 1. Selección de Paciente */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-[#166E7A]" />
              <span>Persona / Paciente del Padrón Comunitario</span>
            </label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
            >
              <option value="">-- Seleccionar Persona --</option>
              {pacientesPadron.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} • DUI: {p.dui || 'Sin DUI'} • {p.address}
                </option>
              ))}
            </select>

            {pacienteSeleccionado && (
              <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
                <span>
                  <strong>{pacienteSeleccionado.firstName} {pacienteSeleccionado.lastName}</strong> ({pacienteSeleccionado.address})
                </span>
                <span className="font-mono text-[10.5px] font-bold text-[#166E7A]">
                  Tel: {pacienteSeleccionado.phone || 'S/N'}
                </span>
              </div>
            )}
          </div>

          {/* 2. Tipo de Seguimiento y Prioridad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tipo de Seguimiento
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoSeguimiento)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              >
                <option value="CONTROL_MATERNO">Control Materno / Prenatal</option>
                <option value="CONTROL_INFANTIL">Control Infantil Pediátrico</option>
                <option value="SEGUIMIENTO_NUTRICIONAL">Seguimiento Nutricional</option>
                <option value="CONTROL_CLINICO">Control Clínico General</option>
                <option value="VISITA_DOMICILIARIA">Visita Domiciliaria</option>
                <option value="SEGUIMIENTO_REFERENCIA">Seguimiento de Referencia</option>
                <option value="TRATAMIENTO_PENDIENTE">Tratamiento Pendiente</option>
                <option value="EDUCACION_PREVENCION">Educación y Prevención</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nivel de Prioridad
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {(['NORMAL', 'ALTA'] as PrioridadSeguimiento[]).map((pr) => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => setPrioridad(pr)}
                    className={`py-2 rounded-xl font-bold border transition cursor-pointer text-center ${
                      prioridad === pr
                        ? pr === 'ALTA'
                          ? 'bg-rose-50 text-rose-700 border-rose-300'
                          : 'bg-teal-50 text-[#166E7A] border-teal-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Motivo y Próxima Acción */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Motivo o Condición que Requiere Continuidad
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej. Control de peso por bajo peso detectado en jornada"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Acción Pendiente a Realizar
            </label>
            <input
              type="text"
              value={proximaAccion}
              onChange={(e) => setProximaAccion(e.target.value)}
              placeholder="Ej. Nueva evaluación antropométrica y verificación de hábitos"
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
            />
          </div>

          {/* 4. Fecha Prevista y Responsable */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Fecha Prevista
              </label>
              <input
                type="date"
                value={fechaPrevista}
                onChange={(e) => setFechaPrevista(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Responsable
              </label>
              <input
                type="text"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              />
            </div>
          </div>

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
              disabled={guardando || !pacienteId}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{guardando ? 'Guardando...' : 'Crear Tarea de Seguimiento'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};