// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/reportes/atencion/components/ReporteAtencionDocumento.tsx
// DESCRIPCIÓN: Hoja oficial imprimible del Reporte de Morbilidad y Atenciones SOAP.
//              Identidad propia MedicOS y Brigada Comunitaria (sin membrete MINSAL).
//              Optimizado para impresión nativa sin barras de scroll ni cortes.
// =========================================================================

import React from 'react';
import {
  Printer,
  ArrowLeft,
  Activity,
  MapPin,
  Calendar,
  UserCheck,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
  AlertTriangle,
} from 'lucide-react';
import type { ReporteMorbilidadSOAPData } from '../../../../../../modules/reports/types/reports.types';

interface ReporteAtencionDocumentoProps {
  reporte: ReporteMorbilidadSOAPData;
  onVolver: () => void;
}

function formatearTextoClinico(texto: string): string {
  if (!texto) return 'Consulta general';

  return texto
    .replace(/Motivo:\s*\[MALESTAR_SINTOMAS\]/gi, 'Malestar general / síntomas agudos')
    .replace(/\[MALESTAR_SINTOMAS\]/gi, 'Malestar general / síntomas agudos')
    .replace(/Motivo:\s*\[CONTROL_RUTINA\]/gi, 'Control clínico de rutina')
    .replace(/\[CONTROL_RUTINA\]/gi, 'Control clínico de rutina')
    .replace(/Motivo:\s*\[SEGUIMIENTO\]/gi, 'Seguimiento de condición')
    .replace(/\[SEGUIMIENTO\]/gi, 'Seguimiento de condición')
    .replace(/Motivo:\s*\[PREVENCION\]/gi, 'Pesquisa preventiva de salud')
    .replace(/\[PREVENCION\]/gi, 'Pesquisa preventiva de salud')
    .replace(/Motivo:\s*\[MATERNO_INFANTIL\]/gi, 'Control materno-infantil')
    .replace(/\[MATERNO_INFANTIL\]/gi, 'Control materno-infantil')
    .replace(/Motivo:\s*\[PRIMEROS_AUXILIOS\]/gi, 'Primeros auxilios')
    .replace(/\[PRIMEROS_AUXILIOS\]/gi, 'Primeros auxilios')
    .replace(/\[VACUNACION\]/gi, 'Inmunización')
    .replace(/Atenci[oó]n Comunitaria\s*\[(.*?)\]/gi, '$1');
}

export const ReporteAtencionDocumento: React.FC<ReporteAtencionDocumentoProps> = ({
  reporte,
  onVolver,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Barra de Acciones de Vista Previa (No imprimible) */}
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
            Vista previa oficial del Reporte de Morbilidad SOAP • MedicOS
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

      {/* Reglas de impresión limpias para PDF tamaño Carta/A4 */}
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
          #reporte-morbilidad-imprimible,
          #reporte-morbilidad-imprimible * {
            visibility: visible;
          }
          #reporte-morbilidad-imprimible {
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

      {/* HOJA OFICIAL CONSOLIDADA FORMATO PAPEL DOCUMENTAL */}
      <div
        id="reporte-morbilidad-imprimible"
        className="bg-white text-slate-900 border border-slate-300 rounded-3xl p-6 sm:p-9 shadow-lg space-y-5 max-w-4xl mx-auto font-sans text-xs leading-normal"
      >
        {/* Encabezado Institucional Propio de MedicOS */}
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
                Brigada Médica Territorial • Registro de Atención Primaria
              </h2>
              <span className="text-xs font-bold text-slate-600 block tracking-wide">
                INFORME DE MORBILIDAD Y ATENCIONES CLÍNICAS EN TERRENO (SOAP)
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

        {/* Ficha de Metadatos */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[10.5px]">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#166E7A]" />
              <span>Municipio / Territorio</span>
            </span>
            <strong className="text-slate-950 block truncate">
              {reporte.territorio.municipio}, {reporte.territorio.departamento}
            </strong>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#166E7A]" />
              <span>Comunidad / Sector</span>
            </span>
            <strong className="text-slate-950 block truncate">
              {reporte.territorio.comunidadFiltro === 'TODOS'
                ? 'Todas las comunidades'
                : reporte.territorio.comunidadFiltro}
            </strong>
          </div>

          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#166E7A]" />
              <span>Rango Cronológico</span>
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

        {/* 1. Resumen Cuantitativo: Atenciones vs Pacientes Únicos */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D] flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-[#166E7A]" />
              <span>1. Volumen y Cobertura de Atenciones Realizadas</span>
            </h3>
            <span className="text-[9.5px] font-bold text-slate-500">
              Atenciones vs. Personas Únicas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-200">
              <span className="text-[9px] font-black text-[#166E7A] uppercase block">Atenciones Totales</span>
              <strong className="text-xl font-black text-slate-950">{reporte.resumen.totalAtenciones}</strong>
              <span className="text-[9px] text-teal-800 font-semibold block">Consultas Registradas</span>
            </div>

            <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200">
              <span className="text-[9px] font-black text-sky-800 uppercase block">Pacientes Únicos</span>
              <strong className="text-xl font-black text-sky-950">{reporte.resumen.pacientesUnicos}</strong>
              <span className="text-[9px] text-sky-700 font-semibold block">Personas Atendidas</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[9px] font-black text-emerald-800 uppercase block">Resueltas en Terreno</span>
              <strong className="text-xl font-black text-emerald-950">{reporte.resumen.atencionesCompletadas}</strong>
              <span className="text-[9px] text-emerald-700 font-semibold block">Sin Requerir Derivación</span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-[9px] font-black text-amber-800 uppercase block">Derivadas / Refs</span>
              <strong className="text-xl font-black text-amber-950">
                {reporte.resumen.derivadasMedico + reporte.resumen.referenciasEmitidas}
              </strong>
              <span className="text-[9px] text-amber-700 font-semibold block">Médico + Boletas F-01</span>
            </div>
          </div>
        </div>

        {/* 2. Morbilidad y Problemas Identificados */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D]">
              2. Consolidación de Morbilidad y Motivos de Consulta
            </h3>
            <span className="text-[9.5px] text-slate-500 font-bold">
              Clasificación de motivos comunitarios
            </span>
          </div>

          <table className="w-full text-left text-[10.5px] border border-slate-300 rounded-xl overflow-hidden table-fixed">
            <thead className="bg-slate-100 text-[9.5px] font-black uppercase text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-1.5 px-3 w-[55%]">Problema de Salud / Motivo Clínico</th>
                <th className="py-1.5 px-3 text-right w-[15%]">Atenciones</th>
                <th className="py-1.5 px-3 text-right w-[15%]">Pacientes</th>
                <th className="py-1.5 px-3 text-right w-[15%]">Proporción (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {reporte.morbilidad.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="py-1.5 px-3 font-bold text-slate-900 truncate">
                    {formatearTextoClinico(m.descripcion)}
                  </td>
                  <td className="py-1.5 px-3 text-right font-black text-slate-950">{m.atenciones}</td>
                  <td className="py-1.5 px-3 text-right text-slate-700">{m.pacientesUnicos}</td>
                  <td className="py-1.5 px-3 text-right font-bold text-[#166E7A]">{m.porcentaje}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Indicadores de Signos Vitales y Alertas de Terreno (O - Objetivo) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D] flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-[#166E7A]" />
              <span>3. Control de Signos Vitales y Detección de Alertas (SOAP: Objetivo)</span>
            </h3>
            <span className="text-[9.5px] text-slate-500 font-bold">Pesquisas y alertas</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Presión Arterial</span>
              <strong className="text-sm font-black text-slate-900">{reporte.signosVitalesKpis.presionArterialRegistrada} tomas</strong>
            </div>

            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Temperatura</span>
              <strong className="text-sm font-black text-slate-900">{reporte.signosVitalesKpis.temperaturaRegistrada} tomas</strong>
            </div>

            <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-200">
              <span className="text-[9px] font-black text-rose-800 uppercase block items-center justify-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                <span>Alertas Tensión</span>
              </span>
              <strong className="text-sm font-black text-rose-950">{reporte.signosVitalesKpis.alertasPresion} casos</strong>
            </div>

            <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-[9px] font-black text-amber-800 uppercase block items-center justify-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Alertas Fiebre</span>
              </span>
              <strong className="text-sm font-black text-amber-950">{reporte.signosVitalesKpis.alertasFiebre} casos</strong>
            </div>
          </div>
        </div>

        {/* 4. Desenlace / Plan Clínico */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D] border-b border-slate-200 pb-1">
            4. Desenlace de las Atenciones y Articulación Asistencial (SOAP: Plan)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[8.5px] font-bold text-slate-500 block uppercase">Resueltas en Terreno</span>
              <strong className="text-sm font-black text-slate-900">{reporte.desenlaces.resueltas}</strong>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[8.5px] font-bold text-slate-500 block uppercase">Derivadas a Médico</span>
              <strong className="text-sm font-black text-slate-900">{reporte.desenlaces.paseMedico}</strong>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[8.5px] font-bold text-slate-500 block uppercase">A Seguimiento</span>
              <strong className="text-sm font-black text-slate-900">{reporte.desenlaces.seguimiento}</strong>
            </div>
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[8.5px] font-bold text-slate-500 block uppercase">Boletas F-01 (Red)</span>
              <strong className="text-sm font-black text-amber-800">{reporte.desenlaces.referenciaF01}</strong>
            </div>
          </div>
        </div>

        {/* 5. Tabla Detallada sin scrollbars ni cortes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1A282D]">
              5. Padrón Detallado de Atenciones SOAP ({reporte.atencionesDetalladas.length})
            </h3>
            <span className="text-[9.5px] text-slate-500 font-bold">
              Registro trazable de consultas
            </span>
          </div>

          <div className="rounded-xl border border-slate-300 overflow-hidden print-no-overflow">
            <table className="w-full text-left text-[10px] border-collapse bg-white table-fixed print-table">
              <thead className="bg-slate-100 text-[9px] font-black uppercase text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2 px-2 w-[11%]">Fecha</th>
                  <th className="py-2 px-2 w-[22%]">Paciente / DUI</th>
                  <th className="py-2 px-2 w-[23%]">S — Motivo / Síntomas</th>
                  <th className="py-2 px-2 w-[18%]">O — Signos Vitales</th>
                  <th className="py-2 px-2 w-[16%]">A — Evaluación</th>
                  <th className="py-2 px-2 w-[10%] text-right">P — Desenlace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {reporte.atencionesDetalladas.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/80">
                    <td className="py-2 px-2 font-mono text-[9.5px] text-slate-700 align-top whitespace-nowrap">
                      {a.fecha}
                    </td>

                    <td className="py-2 px-2 align-top">
                      <span className="font-bold text-slate-900 block leading-tight truncate">
                        {a.pacienteNombre}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono block">
                        {a.pacienteDui}
                      </span>
                      <span className="text-[8.5px] text-slate-400 block">
                        {a.edad}a • {a.sexo === 'FEMALE' ? 'F' : 'M'}
                      </span>
                    </td>

                    <td className="py-2 px-2 text-slate-800 align-top wrap-break-word leading-tight">
                      {formatearTextoClinico(a.motivoSubjetivo)}
                    </td>

                    <td className="py-2 px-2 align-top font-mono text-[9px] text-slate-700 leading-tight">
                      {a.signosVitalesTexto && a.signosVitalesTexto !== 'No registrados' ? (
                        <div className="space-y-0.5">
                          {a.signosVitalesTexto.split('•').map((signo, sIdx) => (
                            <span key={sIdx} className="block truncate">
                              {signo.trim()}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Sin registro</span>
                      )}
                    </td>

                    <td className="py-2 px-2 font-semibold text-slate-900 align-top wrap-break-word leading-tight">
                      {formatearTextoClinico(a.evaluacionDiagnostica)}
                    </td>

                    <td className="py-2 px-2 text-right align-top">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase border leading-tight ${
                          a.desenlacePlan.includes('Médico')
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : a.desenlacePlan.includes('Referencia')
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : a.desenlacePlan.includes('Seguimiento')
                            ? 'bg-teal-50 text-teal-800 border-teal-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {a.desenlacePlan}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6. Observaciones */}
        {reporte.observaciones && (
          <div className="space-y-1 pt-1 border-t border-slate-200">
            <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-500 block">
              6. Observaciones de Campo y Patrones Clínicos:
            </span>
            <p className="text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed text-[10.5px]">
              {reporte.observaciones}
            </p>
          </div>
        )}

        {/* 7. Firmas y Sellos Comunitarios */}
        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 text-center text-[10px]">
          <div className="space-y-6">
            <div className="h-8 flex items-end justify-center">
              <span className="font-mono text-[8.5px] text-slate-400 italic">
                [Firma y Sello de Personal Clínico]
              </span>
            </div>
            <div className="border-t border-slate-900 pt-1">
              <strong className="text-slate-950 block text-[11px]">{reporte.generadoPor.nombre}</strong>
              <span className="text-slate-500 text-[9px] font-medium">Personal Clínico / Brigadista Responsable</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-8 flex items-end justify-center">
              <span className="font-mono text-[8.5px] text-slate-400 italic">
                [Sello de Recepción / Coordinación de Brigada]
              </span>
            </div>
            <div className="border-t border-slate-900 pt-1">
              <strong className="text-slate-950 block text-[11px]">Coordinación de Brigada Territorial</strong>
              <span className="text-slate-500 text-[9px] font-medium">Supervisión Operativa de Campo</span>
            </div>
          </div>
        </div>

        {/* 8. Pie de Documento */}
        <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#166E7A]" />
            <span>Documento generado por MedicOS • Sistema Integrado para Brigadas Médicas Comunitarias</span>
          </span>
          <span className="font-mono">Registro Clínico Territorial Auditable</span>
        </div>
      </div>
    </div>
  );
};