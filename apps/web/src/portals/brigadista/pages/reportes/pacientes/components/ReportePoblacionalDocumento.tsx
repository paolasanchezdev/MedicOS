// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/reportes/pacientes/components/ReportePoblacionalDocumento.tsx
// DESCRIPCIÓN: Hoja oficial imprimible del Reporte Poblacional y Censo.
//              Identidad propia MedicOS y Padrón Comunitario Territorial.
//              Optimizado para impresión nativa sin desbordes ni barras de scroll.
// =========================================================================

import React from 'react';
import {
  Printer,
  ArrowLeft,
  Users,
  MapPin,
  Calendar,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import type { ReportePoblacionalCensoData } from '../../../../../../modules/reports/types/reports.types';

interface ReportePoblacionalDocumentoProps {
  reporte: ReportePoblacionalCensoData;
  onVolver: () => void;
}

export const ReportePoblacionalDocumento: React.FC<ReportePoblacionalDocumentoProps> = ({
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
            <span>Volver a Delimitación</span>
          </button>
          <div className="hidden sm:block h-6 w-px bg-slate-200" />
          <span className="text-xs font-bold text-slate-600 hidden sm:inline">
            Censo consolidado listo para auditoría y archivo comunitario
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

      {/* Reglas de impresión directa */}
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
          #reporte-poblacional-imprimible,
          #reporte-poblacional-imprimible * {
            visibility: visible;
          }
          #reporte-poblacional-imprimible {
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

      {/* 2. HOJA OFICIAL DEL CENSO POBLACIONAL */}
      <div
        id="reporte-poblacional-imprimible"
        className="bg-white text-slate-900 border border-slate-300 rounded-3xl p-6 sm:p-9 shadow-lg space-y-5 max-w-4xl mx-auto font-sans text-xs leading-normal"
      >
        {/* Encabezado Propio MedicOS */}
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
                Padrón Comunitario Territorial • Registro Nominal
              </h2>
              <span className="text-xs font-bold text-slate-600 block tracking-wide">
                REPORTE POBLACIONAL Y CENSO DE SALUD TERRITORIAL
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
                Corte: <strong className="text-slate-800">{reporte.fechaCorte}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Metadatos del Censo */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10.5px]">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#166E7A]" />
              <span>Municipio / Departamento</span>
            </span>
            <strong className="text-slate-950 block truncate">
              {reporte.territorio.municipio}, {reporte.territorio.departamento}
            </strong>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
              <Users className="w-3 h-3 text-[#166E7A]" />
              <span>Delimitación Censal</span>
            </span>
            <strong className="text-slate-950 block truncate">
              {reporte.territorio.comunidadFiltro === 'TODOS'
                ? 'Jurisdicción Territorial Completa'
                : reporte.territorio.comunidadFiltro}
            </strong>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#166E7A]" />
              <span>Fecha de Emisión</span>
            </span>
            <strong className="text-slate-950 block font-mono">
              {reporte.generadoPor.fechaGeneracion} • {reporte.generadoPor.horaGeneracion}
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

        {/* 1. Resumen Demográfico Cuantitativo */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#166E7A]" />
              <span>1. Resumen General de Población Censada</span>
            </h3>
            <span className="text-[9.5px] font-bold text-slate-500">
              Datos consolidados acumulados al corte
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200">
              <span className="text-[9px] font-black text-[#166E7A] uppercase block">
                Total Registrados
              </span>
              <strong className="text-xl font-black text-slate-950">
                {reporte.resumen.totalPersonas}
              </strong>
              <span className="text-[9px] text-teal-800 font-semibold block">Habitantes Censados</span>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200">
              <span className="text-[9px] font-black text-rose-800 uppercase block">
                Mujeres
              </span>
              <strong className="text-xl font-black text-rose-950">
                {reporte.resumen.totalMujeres}
              </strong>
              <span className="text-[9px] text-rose-700 font-semibold block">
                {reporte.resumen.totalPersonas > 0
                  ? ((reporte.resumen.totalMujeres / reporte.resumen.totalPersonas) * 100).toFixed(1)
                  : 0}% del padrón
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200">
              <span className="text-[9px] font-black text-sky-800 uppercase block">
                Hombres
              </span>
              <strong className="text-xl font-black text-sky-950">
                {reporte.resumen.totalHombres}
              </strong>
              <span className="text-[9px] text-sky-700 font-semibold block">
                {reporte.resumen.totalPersonas > 0
                  ? ((reporte.resumen.totalHombres / reporte.resumen.totalPersonas) * 100).toFixed(1)
                  : 0}% del padrón
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-[9px] font-black text-amber-800 uppercase block">
                En Seguimiento
              </span>
              <strong className="text-xl font-black text-amber-950">
                {reporte.resumen.enSeguimiento}
              </strong>
              <span className="text-[9px] text-amber-700 font-semibold block">Continuidad Activa</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Menores (&lt; 18 años)</span>
              <strong className="text-sm font-black text-slate-900">{reporte.resumen.menoresEdad}</strong>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Adultos (18–59 años)</span>
              <strong className="text-sm font-black text-slate-900">{reporte.resumen.adultos}</strong>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Adultos Mayores (60+)</span>
              <strong className="text-sm font-black text-slate-900">{reporte.resumen.adultosMayores}</strong>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Con Visita Pendiente</span>
              <strong className="text-sm font-black text-slate-900">{reporte.resumen.conVisitasPendientes}</strong>
            </div>
          </div>
        </div>

        {/* 2. Distribución por Grupos Etarios */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D] border-b border-slate-200 pb-1">
            2. Estructura Poblacional por Grupos Etarios
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
            {reporte.distribucionEtaria.map((g, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[9px] font-bold text-slate-500 block">{g.rango}</span>
                <strong className="text-sm font-black text-slate-950 block">{g.cantidad}</strong>
                <span className="text-[8.5px] text-[#166E7A] font-bold block">{g.porcentaje}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Distribución Territorial por Comunidades */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D] border-b border-slate-200 pb-1">
            3. Distribución Territorial por Comunidades y Sectores
          </h3>

          <div className="rounded-xl border border-slate-300 overflow-hidden print-no-overflow">
            <table className="w-full text-left text-[10.5px] border-collapse bg-white table-fixed print-table">
              <thead className="bg-slate-100 text-[9.5px] font-black uppercase text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-1.5 px-3 w-[40%]">Comunidad / Sector</th>
                  <th className="py-1.5 px-3 text-right w-[15%]">Personas</th>
                  <th className="py-1.5 px-3 text-right w-[15%]">Mujeres</th>
                  <th className="py-1.5 px-3 text-right w-[15%]">Hombres</th>
                  <th className="py-1.5 px-3 text-right w-[15%]">Proporción (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {reporte.distribucionTerritorial.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80">
                    <td className="py-1.5 px-3 font-bold text-slate-900 truncate">{c.comunidad}</td>
                    <td className="py-1.5 px-3 text-right font-black text-slate-950">{c.personas}</td>
                    <td className="py-1.5 px-3 text-right text-rose-800 font-semibold">{c.hombres}</td>
                    <td className="py-1.5 px-3 text-right text-sky-800 font-semibold">{c.mujeres}</td>
                    <td className="py-1.5 px-3 text-right font-bold text-[#166E7A]">{c.porcentaje}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Padrón Censal Nominal Detallado */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D]">
              4. Padrón Nominal Censado ({reporte.padronCensal.length})
            </h3>
            <span className="text-[9.5px] text-slate-500 font-bold">
              Listado nominativo oficial del territorio
            </span>
          </div>

          <div className="rounded-xl border border-slate-300 overflow-hidden print-no-overflow">
            <table className="w-full text-left text-[10px] border-collapse bg-white table-fixed print-table">
              <thead className="bg-slate-100 text-[9px] font-black uppercase text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-1.5 px-2.5 w-[15%]">DUI</th>
                  <th className="py-1.5 px-2.5 w-[32%]">Persona / Paciente</th>
                  <th className="py-1.5 px-2.5 text-center w-[10%]">Edad</th>
                  <th className="py-1.5 px-2.5 text-center w-[8%]">Sexo</th>
                  <th className="py-1.5 px-2.5 w-[23%]">Comunidad</th>
                  <th className="py-1.5 px-2.5 text-right w-[12%]">Continuidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {reporte.padronCensal.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-1.5 px-2.5 font-mono font-bold text-[#166E7A] truncate">{p.dui}</td>
                    <td className="py-1.5 px-2.5 font-bold text-slate-900 truncate">{p.nombreCompleto}</td>
                    <td className="py-1.5 px-2.5 text-center font-bold text-slate-800">{p.edad}a</td>
                    <td className="py-1.5 px-2.5 text-center">
                      <span className="px-1 py-0.2 rounded text-[8.5px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {p.sexo === 'FEMALE' ? 'F' : p.sexo === 'MALE' ? 'M' : 'O'}
                      </span>
                    </td>
                    <td className="py-1.5 px-2.5 text-slate-600 truncate">{p.comunidad}</td>
                    <td className="py-1.5 px-2.5 text-right">
                      {p.enSeguimiento ? (
                        <span className="px-1 py-0.5 rounded text-[8.5px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                          Seguimiento
                        </span>
                      ) : p.tieneVisitaPendiente ? (
                        <span className="px-1 py-0.5 rounded text-[8.5px] font-bold bg-teal-50 text-[#166E7A] border border-teal-200 uppercase">
                          Visita
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400">Regular</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Observaciones */}
        {reporte.observaciones && (
          <div className="space-y-1 pt-1 border-t border-slate-200">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-500 block">
              5. Observaciones y Notas Territoriales de Campo:
            </span>
            <p className="text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed text-[10.5px]">
              {reporte.observaciones}
            </p>
          </div>
        )}

        {/* 6. Espacios de Firma y Sello */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 text-center text-[10px]">
          <div className="space-y-6">
            <div className="h-8 flex items-end justify-center">
              <span className="font-mono text-[8.5px] text-slate-400 italic">
                [Firma / Responsable de Censo Territorial]
              </span>
            </div>
            <div className="border-t border-slate-900 pt-1">
              <strong className="text-slate-950 block text-[11px]">{reporte.generadoPor.nombre}</strong>
              <span className="text-slate-500 text-[9px] font-medium">Responsable de Censo Territorial</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-8 flex items-end justify-center">
              <span className="font-mono text-[8.5px] text-slate-400 italic">
                [Sello de Recepción / Coordinación de Brigada]
              </span>
            </div>
            <div className="border-t border-slate-900 pt-1">
              <strong className="text-slate-950 block text-[11px]">Coordinación de Salud Territorial</strong>
              <span className="text-slate-500 text-[9px] font-medium">Supervisión de Padrón Comunitario</span>
            </div>
          </div>
        </div>

        {/* 7. Pie de Documento y Trazabilidad */}
        <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#166E7A]" />
            <span>Documento generado por MedicOS • Sistema Integrado para Brigadas Médicas Comunitarias</span>
          </span>
          <span className="font-mono">Padrón Oficial y Censo Comunitario</span>
        </div>
      </div>
    </div>
  );
};