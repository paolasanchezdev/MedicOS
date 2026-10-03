// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/nutricion/components/ModalInscribirSeguimiento.tsx
// DESCRIPCIÓN: Modal para incorporar a una persona del padrón a la vigilancia activa.
// =========================================================================

import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';
import type { PatientRecord } from '../../../../../../modules/patients/types/patient.types';
import type { GrupoEtario, InscribirSeguimientoDto } from '../../../../../../modules/nutrition/types/nutrition.types';

interface ModalInscribirSeguimientoProps {
  isOpen: boolean;
  onClose: () => void;
  pacientesDisponibles: PatientRecord[];
  onInscribir: (dto: InscribirSeguimientoDto) => Promise<boolean>;
}

export const ModalInscribirSeguimiento: React.FC<ModalInscribirSeguimientoProps> = ({
  isOpen,
  onClose,
  pacientesDisponibles,
  onInscribir,
}) => {
  const [pacienteId, setPacienteId] = useState<string>('');
  const [grupoEtario, setGrupoEtario] = useState<GrupoEtario>('ADULTO');
  const [motivoIngreso, setMotivoIngreso] = useState<string>('Bajo peso identificado');
  const [observaciones, setObservaciones] = useState<string>('');
  const [guardando, setGuardando] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pacienteId) return;

    setGuardando(true);
    const ok = await onInscribir({
      pacienteId,
      grupoEtario,
      motivoIngreso,
      observaciones: observaciones.trim() || null,
    });
    setGuardando(false);
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#166E7A]" />
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase">
                Enrolar en Vigilancia Nutricional Activa
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Seguimiento periódico de personas con riesgo nutricional
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Seleccionar Persona del Padrón Comunitario
            </label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
            >
              <option value="">-- Seleccionar Persona del Padrón --</option>
              {pacientesDisponibles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName} • DUI: {p.dui || 'Sin DUI'} • {p.address}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Grupo Poblacional
              </label>
              <select
                value={grupoEtario}
                onChange={(e) => setGrupoEtario(e.target.value as GrupoEtario)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              >
                <option value="LACTANTE">Lactante (&lt; 1 año)</option>
                <option value="PRIMERA_INFANCIA">Primera Infancia (1 a 4 años)</option>
                <option value="ESCOLAR">Escolar (5 a 11 años)</option>
                <option value="ADOLESCENTE">Adolescente (12 a 17 años)</option>
                <option value="ADULTO">Adulto (18 a 59 años)</option>
                <option value="ADULTO_MAYOR">Adulto Mayor (60+ años)</option>
                <option value="GESTANTE">Mujer Gestante</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Motivo de Vigilancia Activa
              </label>
              <select
                value={motivoIngreso}
                onChange={(e) => setMotivoIngreso(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              >
                <option value="Bajo peso identificado">Bajo peso identificado</option>
                <option value="Pérdida de peso reciente">Pérdida de peso reciente</option>
                <option value="Monitoreo de crecimiento y desarrollo">Monitoreo de crecimiento</option>
                <option value="Sobrepeso / Obesidad en seguimiento">Sobrepeso / Obesidad</option>
                <option value="Dificultad de acceso alimentario">Dificultad alimentaria</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Observaciones de Ingreso
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              placeholder="Detalles sobre hábitos o situación familiar..."
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
              <span>{guardando ? 'Guardando...' : 'Inscribir en Vigilancia'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};