// =========================================================================
// ARCHIVO: ModalRegistrarAccionSeguimiento.tsx
// DESCRIPCIÓN: Registro de qué se hizo en terreno, su resultado y el próximo paso.
// =========================================================================

import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import type {
  SeguimientoItem,
  ResultadoAccion,
  ProximoPasoAccion,
  RegistrarAccionDto,
} from '../../../../../../modules/continuity/types/continuity.types';

interface ModalRegistrarAccionSeguimientoProps {
  isOpen: boolean;
  onClose: () => void;
  seguimiento: SeguimientoItem | null;
  onRegistrar: (dto: RegistrarAccionDto) => Promise<boolean>;
}

export const ModalRegistrarAccionSeguimiento: React.FC<ModalRegistrarAccionSeguimientoProps> = ({
  isOpen,
  onClose,
  seguimiento,
  onRegistrar,
}) => {
  const [fecha, setFecha] = useState<string>('01/10/2026');
  const [tipoAccion, setTipoAccion] = useState<string>('Visita domiciliaria');
  const [resultado, setResultado] = useState<ResultadoAccion>('COMPLETADA');
  const [observaciones, setObservaciones] = useState<string>('');
  const [proximoPaso, setProximoPaso] = useState<ProximoPasoAccion>('MANTENER_ACTIVO');
  const [nuevaFechaPropuesta, setNuevaFechaPropuesta] = useState<string>('2026-10-15');
  const [motivoNuevaAccion, setMotivoNuevaAccion] = useState<string>('');
  const [guardando, setGuardando] = useState<boolean>(false);

  if (!isOpen || !seguimiento) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    const ok = await onRegistrar({
      seguimientoId: seguimiento.id,
      fecha,
      tipoAccion,
      resultado,
      observaciones,
      proximoPaso,
      nuevaFechaPropuesta: proximoPaso !== 'CERRAR' ? nuevaFechaPropuesta : undefined,
      motivoNuevaAccion: proximoPaso === 'REPROGRAMAR' ? motivoNuevaAccion : undefined,
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
              Registrar Acción de Seguimiento
            </h3>
            <p className="text-[11px] text-medicos-muted font-semibold">
              {seguimiento.pacienteNombre} • {seguimiento.pacienteExpediente}
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
          {/* Datos del seguimiento a intervenir */}
          <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-200 text-xs text-teal-950 space-y-1">
            <span className="text-[10px] font-bold text-[#166E7A] uppercase tracking-wider block">
              Acción Pendiente a Resolver:
            </span>
            <p className="font-extrabold text-sm">{seguimiento.proximaAccion}</p>
            <p className="text-[11px] text-teal-800">{seguimiento.descripcion}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Fecha de Acción</label>
              <input
                type="text"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tipo de Acción</label>
              <select
                value={tipoAccion}
                onChange={(e) => setTipoAccion(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
              >
                <option value="Visita domiciliaria">Visita Domiciliaria</option>
                <option value="Control en jornada">Control en Jornada</option>
                <option value="Llamada / Contacto telefónico">Contacto Telefónico</option>
                <option value="Entrega de orientación">Entrega de Orientación</option>
                <option value="Verificación de referencia">Verificación de Referencia</option>
              </select>
            </div>
          </div>

          {/* Resultado de la acción */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Resultado de la Acción
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'COMPLETADA', label: 'Acción Completada' },
                { id: 'NO_LOCALIZADO', label: 'No Localizado' },
                { id: 'REQUIERE_NUEVA_ACCION', label: 'Requiere Nueva Acción' },
                { id: 'REQUIERE_REFERENCIA', label: 'Requiere Referencia' },
              ].map((res) => (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => setResultado(res.id as ResultadoAccion)}
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

          {/* Observaciones */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Observaciones del Resultado
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              placeholder="Detalles sobre lo encontrado, signos evaluados o acuerdos..."
              required
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
            />
          </div>

          {/* Próximo Paso */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-800 block">
              ¿Cuál es el próximo paso para este seguimiento?
            </label>

            <div className="space-y-1.5 text-xs">
              {[
                { id: 'MANTENER_ACTIVO', label: 'Mantener activo para próxima fecha' },
                { id: 'REPROGRAMAR', label: 'Reprogramar para nueva fecha' },
                { id: 'CREAR_REFERENCIA', label: 'Derivar / Crear referencia a la red' },
                { id: 'CERRAR', label: 'Cerrar seguimiento (Objetivo cumplido)' },
              ].map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer font-medium text-slate-800"
                >
                  <input
                    type="radio"
                    name="proximoPaso"
                    value={p.id}
                    checked={proximoPaso === p.id}
                    onChange={(e) => setProximoPaso(e.target.value as ProximoPasoAccion)}
                    className="text-[#166E7A] focus:ring-0"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>

            {proximoPaso !== 'CERRAR' && (
              <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">
                    Próxima Fecha
                  </label>
                  <input
                    type="date"
                    value={nuevaFechaPropuesta}
                    onChange={(e) => setNuevaFechaPropuesta(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                {proximoPaso === 'REPROGRAMAR' && (
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-600 block mb-0.5">
                      Nueva Acción
                    </label>
                    <input
                      type="text"
                      value={motivoNuevaAccion}
                      onChange={(e) => setMotivoNuevaAccion(e.target.value)}
                      placeholder="Ej. Segundo control de peso"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                )}
              </div>
            )}
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
              disabled={guardando || !observaciones.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{guardando ? 'Guardando...' : 'Guardar Acción'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};