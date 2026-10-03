// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/materno-infantil/components/ModalRegistrarNino.tsx
// DESCRIPCIÓN: Modal para registrar a un niño en la base de datos de MedicOS
//              vinculado obligatoriamente a un adulto tutor autorizado.
// =========================================================================

import React, { useState } from 'react';
import { X, Baby, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import type { PatientRecord } from '../../../../../../modules/patients/types/patient.types';
import type { RegistrarNinoDto } from '../../../../../../modules/maternal-health/types/materno-infantil.types';

interface ModalRegistrarNinoProps {
  isOpen: boolean;
  onClose: () => void;
  tutoresDisponibles: PatientRecord[];
  onRegistrar: (dto: RegistrarNinoDto) => Promise<boolean>;
}

type SexoOpcion = RegistrarNinoDto['sexo'];

export const ModalRegistrarNino: React.FC<ModalRegistrarNinoProps> = ({
  isOpen,
  onClose,
  tutoresDisponibles,
  onRegistrar,
}) => {
  const [tutorPacienteId, setTutorPacienteId] = useState<string>('');
  const [parentesco, setParentesco] = useState<string>('Madre');
  const [nombres, setNombres] = useState<string>('');
  const [apellidos, setApellidos] = useState<string>('');
  const [fechaNacimiento, setFechaNacimiento] = useState<string>('2024-05-15');
  const [sexo, setSexo] = useState<SexoOpcion>('MALE');
  const [observaciones, setObservaciones] = useState<string>('');
  const [guardando, setGuardando] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const tutorSeleccionado = tutoresDisponibles.find((t) => t.id === tutorPacienteId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!tutorPacienteId) {
      setErrorMsg('Debes seleccionar un adulto responsable del padrón comunitario.');
      return;
    }
    if (!nombres.trim() || !apellidos.trim()) {
      setErrorMsg('Los nombres y apellidos del menor son requeridos.');
      return;
    }

    setGuardando(true);
    const ok = await onRegistrar({
      tutorPacienteId,
      nombres: nombres.trim(),
      apellidos: apellidos.trim(),
      fechaNacimiento,
      sexo,
      parentescoTutor: parentesco,
      observaciones: observaciones.trim() || null,
    });
    setGuardando(false);

    if (ok) {
      onClose();
    } else {
      setErrorMsg('No fue posible crear el paciente en el sistema. Revisa la conexión.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Cabecera */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Baby className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase">
                Inscripción de Control Infantil en Padrón
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Crea un expediente clínico pediátrico real vinculado a un adulto tutor
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
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. ADULTO TUTOR AUTORIZADO (DEL PADRÓN REAL) */}
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <UserCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>1. Adulto Tutor Autorizado (Padrón Comunitario)</span>
            </div>

            <div>
              <select
                value={tutorPacienteId}
                onChange={(e) => setTutorPacienteId(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">-- Seleccionar Adulto Responsable del Padrón --</option>
                {tutoresDisponibles.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.firstName} {t.lastName} • DUI: {t.dui || 'Sin DUI'} • Tel: {t.phone || 'S/N'}
                  </option>
                ))}
              </select>
            </div>

            {tutorSeleccionado && (
              <div className="pt-2 text-[11px] text-emerald-900/80 border-t border-emerald-200/60 space-y-0.5">
                <p><strong>Dirección:</strong> {tutorSeleccionado.address}</p>
                <p><strong>Teléfono:</strong> {tutorSeleccionado.phone || 'No registrado'}</p>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-emerald-900 block mb-1">
                Parentesco o Vínculo Legal Autorizado
              </label>
              <select
                value={parentesco}
                onChange={(e) => setParentesco(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-none"
              >
                <option value="Madre">Madre</option>
                <option value="Padre">Padre</option>
                <option value="Tutor/a Legal">Tutor/a Legal</option>
                <option value="Abuelo/a">Abuelo/a</option>
                <option value="Familiar Autorizado">Familiar Autorizado</option>
              </select>
            </div>
          </div>

          {/* 2. DATOS DEL MENOR */}
          <div className="space-y-3 pt-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              2. Datos del Menor (Generación de Expediente Pediátrico)
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombres</label>
                <input
                  type="text"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  placeholder="Ej. Mateo David"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Apellidos</label>
                <input
                  type="text"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  placeholder="Ej. Gómez Ruiz"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Sexo Biológico</label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value as SexoOpcion)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                >
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Femenino</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Observaciones Iniciales
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={2}
                placeholder="Condiciones al nacer, lactancia o antecedentes..."
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
              disabled={guardando || !tutorPacienteId}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{guardando ? 'Guardando en BD...' : 'Crear Paciente Pediátrico'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRegistrarNino;