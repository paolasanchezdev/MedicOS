// =========================================================================
// ARCHIVO: ReporteAtencionFiltros.tsx
// DESCRIPCIÓN: Panel de configuración de parámetros del reporte de morbilidad.
//              Sin importaciones no utilizadas y con clases canónicas Tailwind.
// =========================================================================

import React from 'react';
import { Calendar, MapPin, Activity, Stethoscope, FileText, ArrowRight } from 'lucide-react';

export interface FiltrosMorbilidadState {
  periodoRapido: 'HOY' | 'JORNADA' | 'SEMANA' | 'MES' | 'PERSONALIZADO';
  fechaDesde: string;
  fechaHasta: string;
  comunidad: string;
  categoriaMotivo: string;
  desenlace: string;
  soloConAlertasVitales: boolean;
  observaciones: string;
}

interface ReporteAtencionFiltrosProps {
  filtros: FiltrosMorbilidadState;
  comunidadesDisponibles: string[];
  onChangeFiltros: React.Dispatch<React.SetStateAction<FiltrosMorbilidadState>>;
  onGenerarVistaPrevia: () => void;
  generando: boolean;
}

export const ReporteAtencionFiltros: React.FC<ReporteAtencionFiltrosProps> = ({
  filtros,
  comunidadesDisponibles,
  onChangeFiltros,
  onGenerarVistaPrevia,
  generando,
}) => {
  const setPeriodoRapido = (tipo: FiltrosMorbilidadState['periodoRapido']) => {
    const hoy = new Date();
    const hoyStr = hoy.toISOString().slice(0, 10);
    let desde = hoyStr;
    const hasta = hoyStr;

    if (tipo === 'SEMANA') {
      const d = new Date();
      d.setDate(hoy.getDate() - 7);
      desde = d.toISOString().slice(0, 10);
    } else if (tipo === 'MES') {
      const d = new Date();
      d.setDate(hoy.getDate() - 30);
      desde = d.toISOString().slice(0, 10);
    }

    onChangeFiltros((prev) => ({
      ...prev,
      periodoRapido: tipo,
      fechaDesde: desde,
      fechaHasta: hasta,
    }));
  };

  return (
    <div className="bg-white rounded-3xl border border-[#D3E8EC] p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-black text-[#1A282D]">
            Configuración del Reporte de Morbilidad y Atenciones SOAP
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Define el período y los parámetros clínicos para consolidar motivos de consulta y evaluaciones.
          </p>
        </div>
        <span className="text-[11px] font-bold text-[#166E7A] bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200 shrink-0 hidden sm:inline">
          Atención Territorial Comunitaria
        </span>
      </div>

      <div className="space-y-4 text-xs">
        {/* 1. Período y Fechas */}
        <div className="space-y-2">
          <label className="font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#166E7A]" />
            <span>Período de las Atenciones</span>
          </label>

          <div className="flex items-center gap-1.5 flex-wrap text-xs font-bold">
            {[
              { id: 'HOY', label: 'Hoy' },
              { id: 'JORNADA', label: 'Esta Jornada' },
              { id: 'SEMANA', label: 'Últimos 7 Días' },
              { id: 'MES', label: 'Este Mes' },
              { id: 'PERSONALIZADO', label: 'Personalizado' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriodoRapido(p.id as FiltrosMorbilidadState['periodoRapido'])}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  filtros.periodoRapido === p.id
                    ? 'bg-[#166E7A] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Fecha Inicial:</span>
              <input
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) =>
                  onChangeFiltros((prev) => ({
                    ...prev,
                    fechaDesde: e.target.value,
                    periodoRapido: 'PERSONALIZADO',
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] font-bold text-slate-800"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Fecha Final:</span>
              <input
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) =>
                  onChangeFiltros((prev) => ({
                    ...prev,
                    fechaHasta: e.target.value,
                    periodoRapido: 'PERSONALIZADO',
                  }))
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] font-bold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* 2. Filtros Territoriales y Clínicos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="flex items-center gap-1 font-bold text-slate-700 mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#166E7A]" />
              <span>Comunidad / Sector</span>
            </label>
            <select
              value={filtros.comunidad}
              onChange={(e) =>
                onChangeFiltros((prev) => ({ ...prev, comunidad: e.target.value }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            >
              <option value="TODOS">Todas las comunidades</option>
              {comunidadesDisponibles.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1 font-bold text-slate-700 mb-1">
              <Activity className="w-3.5 h-3.5 text-[#166E7A]" />
              <span>Categoría del Motivo</span>
            </label>
            <select
              value={filtros.categoriaMotivo}
              onChange={(e) =>
                onChangeFiltros((prev) => ({ ...prev, categoriaMotivo: e.target.value }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
            >
              <option value="TODOS">Todos los motivos registrados</option>
              <option value="MALESTAR_SINTOMAS">Malestar / Síntomas agudos</option>
              <option value="CONTROL_RUTINA">Control de rutina</option>
              <option value="SEGUIMIENTO">Seguimiento de condición</option>
              <option value="PREVENCION">Prevención de salud</option>
              <option value="MATERNO_INFANTIL">Salud Materno-Infantil</option>
              <option value="PRIMEROS_AUXILIOS">Primeros auxilios</option>
              <option value="OTRO">Otro motivo</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1 font-bold text-slate-700 mb-1">
              <Stethoscope className="w-3.5 h-3.5 text-[#166E7A]" />
              <span>Desenlace / Plan Clínico</span>
            </label>
            <select
              value={filtros.desenlace}
              onChange={(e) =>
                onChangeFiltros((prev) => ({ ...prev, desenlace: e.target.value }))
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
            >
              <option value="TODOS">Todos los desenlaces</option>
              <option value="RESUELTO">Atención resuelta en terreno</option>
              <option value="PASE_MEDICO">Derivada a valoración médica</option>
              <option value="SEGUIMIENTO">Requiere seguimiento territorial</option>
              <option value="REFERENCIA">Referencia a la red (F-01)</option>
            </select>
          </div>
        </div>

        {/* 3. Observaciones del Reporte */}
        <div>
          <label className="font-bold text-slate-700 block mb-1">
            Observaciones o Notas de Cierre Clínico (Opcional)
          </label>
          <textarea
            value={filtros.observaciones}
            onChange={(e) =>
              onChangeFiltros((prev) => ({ ...prev, observaciones: e.target.value }))
            }
            rows={2}
            placeholder="Anotaciones sobre brotes sospechosos, sintomáticos respiratorios o condiciones del terreno..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
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
          <span>{generando ? 'Consolidando Atenciones...' : 'Generar Vista Previa del Reporte SOAP'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};