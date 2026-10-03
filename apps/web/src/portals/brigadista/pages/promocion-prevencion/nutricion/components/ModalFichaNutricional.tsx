// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/promocion-prevencion/nutricion/components/ModalFichaNutricional.tsx
// DESCRIPCIÓN: Consulta y edición integral de la Ficha Nutricional Territorial.
//              Cumplimiento estricto de ESLint y hooks de React 19.
// =========================================================================

import React, { useState } from 'react';
import {
  X,
  Scale,
  Edit3,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import type { PersonaVigilanciaItem } from '../../../../../../modules/nutrition/types/nutrition.types';

interface ModalFichaNutricionalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: PersonaVigilanciaItem | null;
  onActualizarFicha: (
    pacienteId: string,
    datos: {
      grupoEtario?: string;
      motivoIngreso?: string;
      proximoControl?: string;
      tutorNombre?: string;
      enSeguimientoActivo?: boolean;
    }
  ) => Promise<boolean>;
  onAbrirControl: (
    pacienteId: string,
    nombre: string,
    expediente: string,
    pesoAnterior?: number | null,
    grupoEtario?: string,
    edadTexto?: string
  ) => void;
}

interface ModalFichaNutricionalDialogProps {
  onClose: () => void;
  persona: PersonaVigilanciaItem;
  onActualizarFicha: ModalFichaNutricionalProps['onActualizarFicha'];
  onAbrirControl: ModalFichaNutricionalProps['onAbrirControl'];
}

const ModalFichaNutricionalDialog: React.FC<ModalFichaNutricionalDialogProps> = ({
  onClose,
  persona,
  onActualizarFicha,
  onAbrirControl,
}) => {
  const [modoEdicion, setModoEdicion] = useState<boolean>(false);
  const [grupoEtario, setGrupoEtario] = useState<string>(persona.grupoEtario || 'PRIMERA_INFANCIA');
  const [motivoIngreso, setMotivoIngreso] = useState<string>(
    persona.motivoIngreso || 'Monitoreo de crecimiento y desarrollo'
  );
  const [proximoControl, setProximoControl] = useState<string>(
    persona.proximoControl && persona.proximoControl !== 'Por agendar'
      ? persona.proximoControl
      : '2026-10-15'
  );
  const [tutorNombre, setTutorNombre] = useState<string>(persona.tutorNombre || '');
  const [enSeguimiento, setEnSeguimiento] = useState<boolean>(persona.enSeguimientoActivo);
  const [guardando, setGuardando] = useState<boolean>(false);

  const handleCancelarEdicion = () => {
    setGrupoEtario(persona.grupoEtario || 'PRIMERA_INFANCIA');
    setMotivoIngreso(persona.motivoIngreso || 'Monitoreo de crecimiento y desarrollo');
    setProximoControl(
      persona.proximoControl && persona.proximoControl !== 'Por agendar'
        ? persona.proximoControl
        : '2026-10-15'
    );
    setTutorNombre(persona.tutorNombre || '');
    setEnSeguimiento(persona.enSeguimientoActivo);
    setModoEdicion(false);
  };

  const handleGuardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const ok = await onActualizarFicha(persona.pacienteId, {
      grupoEtario,
      motivoIngreso: motivoIngreso.trim(),
      proximoControl: proximoControl.trim(),
      tutorNombre: tutorNombre.trim(),
      enSeguimientoActivo: enSeguimiento,
    });
    setGuardando(false);
    if (ok) {
      setModoEdicion(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Cabecera */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-[#166E7A] border border-teal-200">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#166E7A] bg-white px-2 py-0.5 rounded border border-teal-200">
                  {persona.expediente}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                    persona.enSeguimientoActivo
                      ? 'bg-teal-50 text-[#166E7A] border-teal-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {persona.enSeguimientoActivo ? 'En Seguimiento Activo' : 'Censo General'}
                </span>
              </div>
              <h3 className="text-base font-black text-[#1A282D] mt-0.5">
                {persona.nombreCompleto}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!modoEdicion ? (
              <button
                type="button"
                onClick={() => setModoEdicion(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#166E7A]" />
                <span>Editar Ficha</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancelarEdicion}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Cancelar Edición
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenido: Vista vs Modo Edición */}
        <div className="p-5 overflow-y-auto space-y-4">
          {modoEdicion ? (
            <form onSubmit={handleGuardarCambios} className="space-y-4">
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-0.5">
                <span className="font-extrabold uppercase tracking-wider block">
                  Edición de Parámetros de Vigilancia
                </span>
                <p>Modifica el motivo, grupo etario o programa el próximo control de seguimiento.</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Grupo Etario Poblacional
                </label>
                <select
                  value={grupoEtario}
                  onChange={(e) => setGrupoEtario(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                >
                  <option value="LACTANTE">Lactante (0 - 11 meses)</option>
                  <option value="PRIMERA_INFANCIA">Primera Infancia (1 - 5 años)</option>
                  <option value="NINEZ">Niñez (6 - 11 años)</option>
                  <option value="ADOLESCENTE">Adolescente (12 - 17 años)</option>
                  <option value="ADULTO">Adulto (18 - 59 años)</option>
                  <option value="ADULTO_MAYOR">Adulto Mayor (60+ años)</option>
                  <option value="GESTANTE">Mujer Gestante</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Motivo de Ingreso o Condición Nutricional
                </label>
                <input
                  type="text"
                  value={motivoIngreso}
                  onChange={(e) => setMotivoIngreso(e.target.value)}
                  placeholder="Ej. Monitoreo de crecimiento y desarrollo, Bajo peso, etc."
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Próximo Control Programado
                  </label>
                  <input
                    type="date"
                    value={proximoControl}
                    onChange={(e) => setProximoControl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tutor o Contacto Responsable
                  </label>
                  <input
                    type="text"
                    value={tutorNombre}
                    onChange={(e) => setTutorNombre(e.target.value)}
                    placeholder="Ej. Madre, Padre o Familiar"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 p-3 rounded-2xl border border-teal-200 bg-teal-50/60 text-xs text-[#166E7A] font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={enSeguimiento}
                  onChange={(e) => setEnSeguimiento(e.target.checked)}
                  className="rounded text-[#166E7A] focus:ring-0"
                />
                <span>Mantener a esta persona en la bandeja de Seguimiento Activo</span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCancelarEdicion}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{guardando ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Bloque Demográfico y Padrón */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Edad y Grupo
                  </span>
                  <span className="font-black text-[#1A282D] text-xs mt-0.5 block">
                    {persona.edadTexto}
                  </span>
                  <span className="text-[11px] font-bold text-[#166E7A]">
                    {persona.grupoEtario}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tutor / Acompañante
                  </span>
                  <span className="font-semibold text-slate-800 text-xs mt-0.5 block truncate">
                    {persona.tutorNombre || 'Titular del expediente'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Próxima Cita
                  </span>
                  <span className="font-black text-[#166E7A] text-xs mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{persona.proximoControl || 'Por programar'}</span>
                  </span>
                </div>
              </div>

              {/* Métricas Antropométricas Actuales */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Estado Antropométrico Actual
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Peso Actual
                    </span>
                    <span className="text-sm font-black text-slate-900 mt-0.5 block">
                      {persona.pesoActualKg ? `${persona.pesoActualKg} kg` : 'Sin registro'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Talla
                    </span>
                    <span className="text-sm font-black text-slate-900 mt-0.5 block">
                      {persona.tallaActualM ? `${persona.tallaActualM} m` : 'Sin registro'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      IMC / Diagnóstico
                    </span>
                    <span className="text-sm font-black text-slate-900 mt-0.5 block">
                      {persona.imcActual ? `${persona.imcActual}` : 'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Condición y Motivo */}
              <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200 text-xs text-slate-800 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#166E7A] block">
                  Motivo de Ingreso a Vigilancia Nutricional
                </span>
                <p className="font-bold text-sm text-[#1A282D]">
                  {persona.motivoIngreso || 'Monitoreo de crecimiento y desarrollo'}
                </p>
                <p className="text-[11px] text-medicos-muted">
                  Último control registrado: <strong>{persona.ultimoControl}</strong>
                </p>
              </div>

              {/* Botón directo para registrar control */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    ¿Deseas registrar una nueva medición?
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Ingresa peso, talla, perímetro braquial y consejería de hoy.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAbrirControl(
                      persona.pacienteId,
                      persona.nombreCompleto,
                      persona.expediente,
                      persona.pesoActualKg,
                      persona.grupoEtario,
                      persona.edadTexto
                    );
                  }}
                  className="px-4 py-2 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                >
                  + Registrar Control
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pie */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};

export const ModalFichaNutricional: React.FC<ModalFichaNutricionalProps> = ({
  isOpen,
  onClose,
  persona,
  onActualizarFicha,
  onAbrirControl,
}) => {
  if (!isOpen || !persona) return null;

  return (
    <ModalFichaNutricionalDialog
      key={persona.pacienteId}
      onClose={onClose}
      persona={persona}
      onActualizarFicha={onActualizarFicha}
      onAbrirControl={onAbrirControl}
    />
  );
};

export default ModalFichaNutricional;