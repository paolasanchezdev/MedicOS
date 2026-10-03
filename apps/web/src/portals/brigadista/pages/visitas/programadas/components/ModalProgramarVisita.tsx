// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/visitas/programadas/components/ModalProgramarVisita.tsx
// DESCRIPCIÓN: Asistente guiado de programación territorial de visitas.
//              Sin datos quemados ni fechas fijas. Tipado 100% verificado.
// =========================================================================

import React, { useState } from 'react';
import { X, MapPin, CheckCircle2, UserCheck, Home } from 'lucide-react';
import type { PatientRecord } from '../../../../../../modules/patients/types/patient.types';
import type { ProgramarVisitaDTO, VisitType, VisitPriority } from '../../../../../../modules/visits/types/visit.types';

interface ModalProgramarVisitaProps {
  isOpen: boolean;
  onClose: () => void;
  pacientesPadron: PatientRecord[];
  responsableDefecto?: string;
  onProgramar: (dto: ProgramarVisitaDTO) => Promise<boolean>;
}

export const ModalProgramarVisita: React.FC<ModalProgramarVisitaProps> = ({
  isOpen,
  onClose,
  pacientesPadron,
  responsableDefecto = '',
  onProgramar,
}) => {
  const [pacienteId, setPacienteId] = useState<string>('');
  const [visitType, setVisitType] = useState<VisitType>('CONTROL_SEGUIMIENTO');
  const [reason, setReason] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [scheduledTime, setScheduledTime] = useState<string>('09:00');
  const [duracion, setDuracion] = useState<number>(30);
  const [comunidad, setComunidad] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [referenciaUbicacion, setReferenciaUbicacion] = useState<string>('');
  const [priority, setPriority] = useState<VisitPriority>('MEDIUM');
  const [responsable, setResponsable] = useState<string>(responsableDefecto);
  const [guardando, setGuardando] = useState<boolean>(false);

  if (!isOpen) return null;

  const pacienteSeleccionado = pacientesPadron.find((p) => p.id === pacienteId);

  const handleSelectPac = (id: string) => {
    setPacienteId(id);
    const p = pacientesPadron.find((pac) => pac.id === id);
    if (p && p.address) {
      const partes = p.address.split(',').map((x) => x.trim()).filter(Boolean);
      setComunidad(partes[0] || '');
      setSector(partes[1] || '');
      setReferenciaUbicacion(p.address);
    } else {
      setComunidad('');
      setSector('');
      setReferenciaUbicacion('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId || !reason.trim() || !scheduledDate) return;

    setGuardando(true);
    const ok = await onProgramar({
      patientId: pacienteId,
      visitType,
      reason: reason.trim(),
      scheduledDate,
      scheduledTime: scheduledTime || undefined,
      duracionEstimadaMin: duracion || undefined,
      comunidad: comunidad.trim() || undefined,
      sector: sector.trim() || undefined,
      referenciaUbicacion: referenciaUbicacion.trim() || undefined,
      priority,
      brigadistaName: responsable.trim() || undefined,
    });
    setGuardando(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-[#166E7A] border border-teal-200">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#1A282D] uppercase tracking-tight">
                Programar Visita Domiciliaria
              </h3>
              <p className="text-[11px] text-[#52656C] font-medium">
                Planificación de visita territorial vinculada a la base de datos
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
              <span>Persona / Paciente a Visitar</span>
            </label>
            <select
              value={pacienteId}
              onChange={(e) => handleSelectPac(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
            >
              <option value="">-- Seleccionar Persona del Padrón --</option>
              {pacientesPadron.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} • DUI: {p.dui || 'Sin DUI'} • {p.address || 'Sin dirección registrada'}
                </option>
              ))}
            </select>

            {pacienteSeleccionado && (
              <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
                <span>
                  <strong>{pacienteSeleccionado.firstName} {pacienteSeleccionado.lastName}</strong>
                </span>
                <span className="font-mono text-[10.5px] font-bold text-[#166E7A]">
                  Tel: {pacienteSeleccionado.phone || 'No registrado'}
                </span>
              </div>
            )}
          </div>

          {/* 2. Tipo y Prioridad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tipo de Visita
              </label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as VisitType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              >
                <option value="CONTROL_SEGUIMIENTO">Seguimiento de Paciente</option>
                <option value="MATERNO_INFANTIL">Control Materno-Infantil</option>
                <option value="SEGUIMIENTO_NUTRICIONAL">Seguimiento Nutricional</option>
                <option value="ADHERENCIA_TRATAMIENTO">Adherencia a Tratamiento</option>
                <option value="VERIFICACION_ENTORNO">Verificación de Entorno</option>
                <option value="SEGUIMIENTO_REFERENCIA">Seguimiento de Referencia</option>
                <option value="EDUCACION_SANITARIA">Educación Sanitaria</option>
                <option value="OTRO">Otro Motivo</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as VisitPriority)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              >
                <option value="LOW">Baja</option>
                <option value="MEDIUM">Normal</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Motivo u Objetivo de la Visita
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ingresa el objetivo de la visita..."
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
            />
          </div>

          {/* 3. Programación */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Fecha</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
                className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Hora</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Duración (min)</label>
              <input
                type="number"
                value={duracion}
                onChange={(e) => setDuracion(parseInt(e.target.value, 10) || 30)}
                className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              />
            </div>
          </div>

          {/* 4. Ubicación Territorial */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#166E7A]" />
              <span>Ubicación y Referencia de la Vivienda</span>
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">Comunidad</label>
                <input
                  type="text"
                  value={comunidad}
                  onChange={(e) => setComunidad(e.target.value)}
                  placeholder="Comunidad..."
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">Sector</label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Sector..."
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">
                Referencia Rural de Ubicación
              </label>
              <input
                type="text"
                value={referenciaUbicacion}
                onChange={(e) => setReferenciaUbicacion(e.target.value)}
                placeholder="Punto de referencia, color de casa, etc..."
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Responsable de la Visita
            </label>
            <input
              type="text"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              placeholder="Nombre del brigadista asignado..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
            />
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
              <span>{guardando ? 'Guardando...' : 'Programar Visita'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};