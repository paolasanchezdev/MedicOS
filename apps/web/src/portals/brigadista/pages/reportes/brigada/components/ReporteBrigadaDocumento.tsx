// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/reportes/brigada/components/ReporteBrigadaDocumento.tsx
// DESCRIPCIÓN: Hoja ejecutiva imprimible del Reporte Consolidado de Brigada.
//              Identidad propia MedicOS y Brigada Territorial Comunitaria.
//              Optimizado para impresión nativa sin desbordes ni barras de scroll.
// =========================================================================

import React from 'react';
import {
  Printer,
  ArrowLeft,
  Building2,
  Calendar,
  UserCheck,
  MapPin,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import type { ReporteConsolidadoBrigadaData } from '../../../../../../modules/reports/types/reports.types';

interface ReporteBrigadaDocumentoProps {
  reporte: ReporteConsolidadoBrigadaData;
  onVolver: () => void;
}

export const ReporteBrigadaDocumento: React.FC<ReporteBrigadaDocumentoProps> = ({
  reporte,
  onVolver,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* 1. Barra de Herramientas de Vista Previa (No imprimible) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print bg-white p-4 rounded-3xl border border-[#D3E8EC] shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onVolver}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Volver a Parámetros</span>
          </button>
          <div className="hidden sm:block h-6 w-px bg-slate-200" />
          <span className="text-xs font-bold text-slate-600 hidden sm:inline">
            Vista previa oficial para archivo y presentación de la brigada
          </span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="font-mono text-xs font-black text-[#166E7A] bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200">
            {reporte.codigoReporte}
          </span>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-black shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar como PDF</span>
          </button>
        </div>
      </div>

      {/* Reglas de impresión directa para PDF limpio tamaño Carta/A4 */}
      <style>{`
        @page {
          size: letter portrait;
          margin: 10mm 12mm 12mm 12mm;
        }
        @media print {
          html, body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden;
          }
          #reporte-consolidado-imprimible,
          #reporte-consolidado-imprimible * {
            visibility: visible;
          }
          #reporte-consolidado-imprimible {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            font-size: 10px !important;
            line-height: 1.25 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-no-overflow {
            overflow: visible !important;
            border: none !important;
          }
          .print-table {
            width: 100% !important;
            min-width: 0 !important;
            table-layout: fixed !important;
          }
          tr {
            page-break-inside: avoid !important;
          }
          table {
            page-break-inside: auto !important;
          }
        }
      `}</style>

      {/* 2. HOJA OFICIAL CONSOLIDADA FORMATO PAPEL DOCUMENTAL */}
      <div
        id="reporte-consolidado-imprimible"
        className="bg-white text-slate-900 border border-slate-300 rounded-3xl p-6 sm:p-9 shadow-lg space-y-5 max-w-4xl mx-auto font-sans text-xs leading-normal"
      >
        {/* Encabezado Institucional Propio con Logo de MedicOS */}
        <div className="border-b-2 border-slate-900 pb-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/Logo MedicOS Cruz.png"
              alt="Logo MedicOS"
              className="w-14 h-14 object-contain shrink-0"
            />
            <div className="space-y-0.5">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#166E7A] block">
                MedicOS • Sistema Digital para Brigadas Médicas Comunitarias
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-[#1A282D] uppercase leading-none">
                Brigada Médica Territorial • Salud y Atención Primaria
              </h2>
              <span className="text-xs font-bold text-slate-600 block tracking-wide">
                INFORME CONSOLIDADO DE ACTIVIDADES Y RESULTADOS DE CAMPO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-50 rounded-lg border border-slate-300">
                <span className="text-[8.5px] font-bold text-slate-500 uppercase">FOLIO:</span>
                <span className="font-mono text-[11px] font-black text-slate-950">
                  {reporte.codigoReporte}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-semibold block">
                Fecha: <strong className="text-slate-800">{reporte.generadoPor.fechaGeneracion}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Ficha de Metadatos de la Brigada y Período */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10.5px]">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-[#166E7A]" />
              <span>Brigada Responsable</span>
            </span>
            <strong className="text-slate-950 block truncate">
              {reporte.brigada.nombre}
            </strong>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#166E7A]" />
              <span>Jurisdicción Territorial</span>
            </span>
            <strong className="text-slate-950 block truncate">
              {reporte.brigada.municipio}, {reporte.brigada.departamento}
            </strong>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#166E7A]" />
              <span>Período Auditado</span>
            </span>
            <strong className="text-slate-950 block font-mono">
              {reporte.periodo.desde} al {reporte.periodo.hasta}
            </strong>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-[#166E7A]" />
              <span>Responsable de Emisión</span>
            </span>
            <strong className="text-slate-950 block truncate">
              {reporte.generadoPor.nombre}
            </strong>
          </div>
        </div>

        {/* 1. Resumen Cuantitativo Consolidado de Actividad */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#166E7A]" />
              <span>1. Resumen Consolidado de Cobertura y Atención</span>
            </h3>
            <span className="text-[9.5px] font-bold text-slate-500">
              Cómputo automatizado de registros territoriales
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200">
              <span className="text-[9px] font-black text-[#166E7A] uppercase block">
                Pacientes Atendidos
              </span>
              <strong className="text-xl font-black text-slate-950">
                {reporte.resumenActividad.pacientesAtendidos}
              </strong>
              <span className="text-[9px] text-teal-800 font-semibold block">Padrón Nominal</span>
            </div>

            <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200">
              <span className="text-[9px] font-black text-sky-800 uppercase block">
                Atenciones Clínicas
              </span>
              <strong className="text-xl font-black text-sky-950">
                {reporte.resumenActividad.atencionesRealizadas}
              </strong>
              <span className="text-[9px] text-sky-700 font-semibold block">Consultas en Jornada</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[9px] font-black text-emerald-800 uppercase block">
                Visitas Domiciliarias
              </span>
              <strong className="text-xl font-black text-emerald-950">
                {reporte.resumenActividad.visitasDomiciliarias}
              </strong>
              <span className="text-[9px] text-emerald-700 font-semibold block">Viviendas Evaluadas</span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-[9px] font-black text-amber-800 uppercase block">
                Referencias a la Red
              </span>
              <strong className="text-xl font-black text-amber-950">
                {reporte.resumenActividad.referenciasEmitidas}
              </strong>
              <span className="text-[9px] text-amber-700 font-semibold block">Derivaciones Asistenciales</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Dosis Vacunación</span>
              <strong className="text-sm font-black text-slate-900">{reporte.resumenActividad.vacunaciones}</strong>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Seguimientos Activos</span>
              <strong className="text-sm font-black text-slate-900">{reporte.resumenActividad.seguimientosActivos}</strong>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 col-span-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Acciones Comunitarias y Prevención</span>
              <strong className="text-sm font-black text-slate-900">{reporte.resumenActividad.actividadesComunitarias}</strong>
            </div>
          </div>
        </div>

        {/* 2. Jornadas Comunitarias */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D] border-b border-slate-200 pb-1">
            2. Jornadas de Campo Registradas en el Período
          </h3>

          <div className="rounded-xl border border-slate-300 overflow-hidden print-no-overflow">
            <table className="w-full text-left text-[10.5px] border-collapse bg-white table-fixed print-table">
              <thead className="bg-slate-100 text-[9.5px] font-black uppercase text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3 w-[20%]">Fecha</th>
                  <th className="py-2 px-3 w-[40%]">Comunidad / Sector</th>
                  <th className="py-2 px-3 w-[15%]">Estado</th>
                  <th className="py-2 px-3 text-right w-[12%]">Personas</th>
                  <th className="py-2 px-3 text-right w-[13%]">Actividades</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {reporte.jornadas.map((j, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-1.5 px-3 font-mono text-slate-700">{j.fecha}</td>
                    <td className="py-1.5 px-3 font-bold text-slate-900 truncate">{j.comunidad}</td>
                    <td className="py-1.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-teal-50 text-[#166E7A] border border-teal-200 uppercase">
                        {j.estado}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-right font-black text-slate-950">{j.pacientesAtendidos}</td>
                    <td className="py-1.5 px-3 text-right font-semibold text-slate-700">{j.actividadesRealizadas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Visitas Domiciliarias */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D]">
              3. Desglose de Visitas Domiciliarias
            </h3>
            <span className="text-[9.5px] text-slate-500 font-bold">
              Total: {reporte.visitasDetalle.total} • Completadas: {reporte.visitasDetalle.completadas}
            </span>
          </div>

          {reporte.visitasDetalle.lista.length === 0 ? (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-[10.5px]">
              No se registraron visitas domiciliarias programadas o realizadas en el rango auditado.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-300 overflow-hidden print-no-overflow">
              <table className="w-full text-left text-[10.5px] border-collapse bg-white table-fixed print-table">
                <thead className="bg-slate-100 text-[9.5px] font-black uppercase text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-1.5 px-3 w-[15%]">Fecha</th>
                    <th className="py-1.5 px-3 w-[30%]">Persona Usuaria</th>
                    <th className="py-1.5 px-3 w-[25%]">Comunidad</th>
                    <th className="py-1.5 px-3 w-[20%]">Motivo Clínico</th>
                    <th className="py-1.5 px-3 text-right w-[10%]">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {reporte.visitasDetalle.lista.map((v) => (
                    <tr key={v.id}>
                      <td className="py-1.5 px-3 font-mono text-slate-700">{v.fecha}</td>
                      <td className="py-1.5 px-3 font-bold text-slate-900 truncate">{v.paciente}</td>
                      <td className="py-1.5 px-3 text-slate-600 truncate">{v.comunidad}</td>
                      <td className="py-1.5 px-3 text-slate-800 truncate">{v.motivo}</td>
                      <td className="py-1.5 px-3 text-right font-black text-slate-700">{v.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. Referencias a la Red de Salud */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D]">
              4. Derivaciones y Referencias a Centros de Salud
            </h3>
            <span className="text-[9.5px] text-slate-500 font-bold">
              Total Emitidas: {reporte.referenciasDetalle.total}
            </span>
          </div>

          {reporte.referenciasDetalle.lista.length === 0 ? (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-[10.5px]">
              Sin derivaciones ni referencias emitidas durante el período.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-300 overflow-hidden print-no-overflow">
              <table className="w-full text-left text-[10.5px] border-collapse bg-white table-fixed print-table">
                <thead className="bg-slate-100 text-[9.5px] font-black uppercase text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-1.5 px-3 w-[15%]">Folio</th>
                    <th className="py-1.5 px-3 w-[15%]">Fecha</th>
                    <th className="py-1.5 px-3 w-[25%]">Paciente</th>
                    <th className="py-1.5 px-3 w-[25%]">Establecimiento Destino</th>
                    <th className="py-1.5 px-3 w-[10%]">Prioridad</th>
                    <th className="py-1.5 px-3 text-right w-[10%]">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {reporte.referenciasDetalle.lista.map((r, i) => (
                    <tr key={i}>
                      <td className="py-1.5 px-3 font-mono font-black text-[#166E7A]">{r.folio}</td>
                      <td className="py-1.5 px-3 font-mono text-slate-700">{r.fecha}</td>
                      <td className="py-1.5 px-3 font-bold text-slate-900 truncate">{r.paciente}</td>
                      <td className="py-1.5 px-3 text-slate-700 truncate">{r.establecimientoDestino}</td>
                      <td className="py-1.5 px-3 font-black text-slate-800">{r.prioridad}</td>
                      <td className="py-1.5 px-3 text-right font-bold text-slate-700">{r.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 5. Observaciones */}
        {reporte.observaciones && (
          <div className="space-y-1 pt-1 border-t border-slate-200">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-500 block">
              5. Observaciones y Hallazgos Comunitarios de Cierre:
            </span>
            <p className="text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed text-[10.5px]">
              {reporte.observaciones}
            </p>
          </div>
        )}

        {/* 6. Espacios de Firma y Sello Institucional */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 text-center text-[10px]">
          <div className="space-y-6">
            <div className="h-8 flex items-end justify-center">
              <span className="font-mono text-[8.5px] text-slate-400 italic">
                [Firma / Responsable de Brigada]
              </span>
            </div>
            <div className="border-t border-slate-900 pt-1">
              <strong className="text-slate-950 block text-[11px]">{reporte.generadoPor.nombre}</strong>
              <span className="text-slate-500 text-[9px] font-medium">Responsable de Brigada de Salud</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-8 flex items-end justify-center">
              <span className="font-mono text-[8.5px] text-slate-400 italic">
                [Sello de Recepción / Coordinación Territorial]
              </span>
            </div>
            <div className="border-t border-slate-900 pt-1">
              <strong className="text-slate-950 block text-[11px]">Coordinación Territorial de Salud</strong>
              <span className="text-slate-500 text-[9px] font-medium">Supervisión Operativa de Campo</span>
            </div>
          </div>
        </div>

        {/* 7. Pie de Documento y Trazabilidad */}
        <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#166E7A]" />
            <span>Documento generado por MedicOS • Sistema Integrado para Brigadas Médicas Comunitarias</span>
          </span>
          <span className="font-mono">Trazabilidad Territorial Auditable</span>
        </div>
      </div>
    </div>
  );
};