// =========================================================================
// ARCHIVO: ReportePoblacionalFiltros.tsx
// DESCRIPCIÓN: Panel de configuración de parámetros para el Censo Poblacional.
// =========================================================================

import React from 'react';
import { Calendar, MapPin, FileText, ArrowRight } from 'lucide-react';

export interface FiltrosCensoState {
  fechaCorte: string;
  comunidad: string;
  sexo: 'TODOS' | 'FEMALE' | 'MALE';
  grupoEtario: 'TODOS' | 'MENORES' | 'ADULTOS' | 'MAYORES';
  condicionContinuidad: 'TODOS' | 'EN_SEGUIMIENTO' | 'CON_VISITA' | 'CON_REFERENCIA';
  observaciones: string;
}

interface ReportePoblacionalFiltrosProps {
  filtros: FiltrosCensoState;
  comunidadesDisponibles: string[];
  onChangeFiltros: React.Dispatch<React.SetStateAction<FiltrosCensoState>>;
  onGenerarVistaPrevia: () => void;
  generando: boolean;
}

export const ReportePoblacionalFiltros: React.FC<ReportePoblacionalFiltrosProps> = ({
  filtros,
  comunidadesDisponibles,
  onChangeFiltros,
  onGenerarVistaPrevia,
  generando,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#D3E8EC] p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-[#1A282D]">
            Configuración del Censo y Padrón Poblacional
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Define la fecha de corte y la delimitación territorial para consolidar el reporte oficial.
          </p>
        </div>
        <span className="text-[11px] font-bold text-[#166E7A] bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200 shrink-0 hidden sm:inline">
          Padrón Nominal Territorial
        </span>
      </div>

      <div className="space-y-4 text-xs">
        {/* 1. Fecha de Corte Censal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#166E7A]" />
              <span>Fecha de Corte del Censo</span>
            </label>
            <input
              type="date"
              value={filtros.fechaCorte}
              onChange={(e) =>
                onChangeFiltros((prev) => ({ ...prev, fechaCorte: e.target.value }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] font-bold text-slate-800"
            />
            <span className="text-[10.5px] text-slate-400 mt-1 block">
              Consolida la población acumulada y registrada hasta esta fecha.
            </span>
          </div>

          <div>
            <label className="font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#166E7A]" />
              <span>Comunidad / Sector Territorial</span>
            </label>
            <select
              value={filtros.comunidad}
              onChange={(e) =>
                onChangeFiltros((prev) => ({ ...prev, comunidad: e.target.value }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            >
              <option value="TODOS">Todas las comunidades de la jurisdicción</option>
              {comunidadesDisponibles.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span className="text-[10.5px] text-slate-400 mt-1 block">
              Filtra por cantón, barrio o sector comunitario del padrón.
            </span>
          </div>
        </div>

        {/* 2. Filtros Demográficos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Sexo Biológico</label>
            <select
              value={filtros.sexo}
              onChange={(e) =>
                onChangeFiltros((prev) => ({
                  ...prev,
                  sexo: e.target.value as FiltrosCensoState['sexo'],
                }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
            >
              <option value="TODOS">Todos los sexos</option>
              <option value="FEMALE">Femenino</option>
              <option value="MALE">Masculino</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Grupo Etario</label>
            <select
              value={filtros.grupoEtario}
              onChange={(e) =>
                onChangeFiltros((prev) => ({
                  ...prev,
                  grupoEtario: e.target.value as FiltrosCensoState['grupoEtario'],
                }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
            >
              <option value="TODOS">Todos los grupos de edad</option>
              <option value="MENORES">Menores de edad (&lt; 18 años)</option>
              <option value="ADULTOS">Adultos (18 a 59 años)</option>
              <option value="MAYORES">Adultos mayores (60+ años)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Condición de Continuidad</label>
            <select
              value={filtros.condicionContinuidad}
              onChange={(e) =>
                onChangeFiltros((prev) => ({
                  ...prev,
                  condicionContinuidad: e.target.value as FiltrosCensoState['condicionContinuidad'],
                }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
            >
              <option value="TODOS">Toda la población registrada</option>
              <option value="EN_SEGUIMIENTO">Personas en seguimiento activo</option>
              <option value="CON_VISITA">Con visita domiciliaria pendiente</option>
              <option value="CON_REFERENCIA">Con referencia F-01 activa</option>
            </select>
          </div>
        </div>

        {/* 3. Observaciones del Censo */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">
            Notas y Observaciones de Levantamiento Censal (Opcional)
          </label>
          <textarea
            value={filtros.observaciones}
            onChange={(e) =>
              onChangeFiltros((prev) => ({ ...prev, observaciones: e.target.value }))
            }
            rows={2}
            placeholder="Anotaciones sobre familias no censadas, accesibilidad a cantones o sectores en actualización..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
          />
        </div>
      </div>

      {/* Botón de Generar Vista Previa */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
        <button
          type="button"
          disabled={generando}
          onClick={onGenerarVistaPrevia}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-black shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <FileText className="w-4 h-4" />
          <span>{generando ? 'Consolidando Padrón...' : 'Generar Vista Previa del Censo'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};