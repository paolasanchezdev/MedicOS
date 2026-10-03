// =========================================================================
// ARCHIVO: ReporteBrigadaFiltros.tsx
// DESCRIPCIÓN: Panel de configuración de parámetros del reporte consolidado.
// =========================================================================

import React from 'react';
import { Calendar, Building, CheckSquare, Square, FileText, ArrowRight } from 'lucide-react';

export interface FiltrosConsolidadoState {
  periodoRapido: 'HOY' | 'JORNADA' | 'SEMANA' | 'MES' | 'PERSONALIZADO';
  fechaDesde: string;
  fechaHasta: string;
  comunidadFiltro: string;
  incluirAtenciones: boolean;
  incluirVisitas: boolean;
  incluirReferencias: boolean;
  incluirVacunacion: boolean;
  observaciones: string;
}

interface ReporteBrigadaFiltrosProps {
  filtros: FiltrosConsolidadoState;
  onChangeFiltros: React.Dispatch<React.SetStateAction<FiltrosConsolidadoState>>;
  onGenerarVistaPrevia: () => void;
  generando: boolean;
}

export const ReporteBrigadaFiltros: React.FC<ReporteBrigadaFiltrosProps> = ({
  filtros,
  onChangeFiltros,
  onGenerarVistaPrevia,
  generando,
}) => {
  const setPeriodoRapido = (tipo: FiltrosConsolidadoState['periodoRapido']) => {
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
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-base font-black text-[#1A282D]">
          Configuración del Reporte Consolidado
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Define el rango temporal y los componentes que se auditarán y consolidarán en el documento PDF oficial.
        </p>
      </div>

      <div className="space-y-4">
        {/* 1. Selector de Período Rápido */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#166E7A]" />
            <span>Período del Reporte</span>
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
                onClick={() => setPeriodoRapido(p.id as FiltrosConsolidadoState['periodoRapido'])}
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
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Fecha Desde:</span>
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
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] font-semibold text-slate-800"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Fecha Hasta:</span>
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
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* 2. Filtro Territorial */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Brigada Activa</label>
            <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#166E7A]" />
              <span>Brigada Territorial San Miguel Tepezontes</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Comunidad / Sector</label>
            <select
              value={filtros.comunidadFiltro}
              onChange={(e) => onChangeFiltros((prev) => ({ ...prev, comunidadFiltro: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
            >
              <option value="TODOS">Todas las comunidades de la brigada</option>
              <option value="Barrio El Centro">Barrio El Centro</option>
              <option value="Barrio El Calvario">Barrio El Calvario</option>
              <option value="Barrio San Jerónimo">Barrio San Jerónimo</option>
              <option value="Barrio La Cruz">Barrio La Cruz</option>
            </select>
          </div>
        </div>

        {/* 3. Módulos y Actividades a Incluir */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
            Módulos a Consolidar en el Documento
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: 'incluirAtenciones', label: 'Atenciones Clínicas', val: filtros.incluirAtenciones },
              { id: 'incluirVisitas', label: 'Visitas Domiciliarias', val: filtros.incluirVisitas },
              { id: 'incluirReferencias', label: 'Referencias F-01', val: filtros.incluirReferencias },
              { id: 'incluirVacunacion', label: 'Vacunación y Prev.', val: filtros.incluirVacunacion },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() =>
                  onChangeFiltros((prev) => ({
                    ...prev,
                    [m.id]: !m.val,
                  }))
                }
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition ${
                  m.val
                    ? 'bg-teal-50/80 border-teal-200 text-[#166E7A] font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                {m.val ? <CheckSquare className="w-4 h-4 text-[#166E7A]" /> : <Square className="w-4 h-4" />}
                <span className="text-[11px] truncate">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Observaciones */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Observaciones o Notas de Cierre de la Brigada (Opcional)
          </label>
          <textarea
            value={filtros.observaciones}
            onChange={(e) => onChangeFiltros((prev) => ({ ...prev, observaciones: e.target.value }))}
            rows={2}
            placeholder="Anotaciones sobre incidencias en terreno, cobertura comunitaria o apoyo recibido..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
          />
        </div>
      </div>

      {/* Botón de Acción Principal */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
        <button
          type="button"
          disabled={generando}
          onClick={onGenerarVistaPrevia}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-black shadow-xs transition active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <FileText className="w-4 h-4" />
          <span>{generando ? 'Consolidando Registros...' : 'Generar Vista Previa del Reporte'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};