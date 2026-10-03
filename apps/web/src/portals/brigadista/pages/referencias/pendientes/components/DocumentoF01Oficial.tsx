// =========================================================================
// ARCHIVO: DocumentoF01Oficial.tsx
// DESCRIPCIÓN: Hoja ministerial oficial de Referencia y Retorno (F-01).
//              Con membrete de El Salvador, logos oficiales, firmas y
//              soporte nativo para impresión / descarga en PDF.
// =========================================================================

import React from 'react';
import { Printer } from 'lucide-react';
import type { SignosVitalesReferencia } from '../../../../../../modules/references/types/reference.types';

export interface DocumentoF01OficialProps {
  folio: string;
  fechaEmision: string;
  horaEmision?: string;
  paciente: {
    nombre: string;
    dui: string;
    edad?: string;
    sexo?: string;
    direccion?: string;
    telefono?: string;
    expediente?: string;
  };
  establecimientoDestino: {
    nombre: string;
    tipo?: string;
    nivel?: string;
    departamento?: string;
    municipio?: string;
    telefono?: string;
    direccion?: string;
  };
  brigadista: {
    nombre: string;
    rol?: string;
    brigada?: string;
  };
  categoria: string;
  prioridad: string;
  motivo: string;
  situacionEncontrada?: string;
  clinicalSummary?: string;
  signosVitales?: SignosVitalesReferencia;
  traslado: {
    medio?: string;
    acompanante?: string;
  };
  retorno?: {
    atendido?: boolean;
    respuesta?: string | null;
    indicaciones?: string | null;
    fechaRespuesta?: string | null;
  };
  mostrarAccionesImpresion?: boolean;
}

export const DocumentoF01Oficial: React.FC<DocumentoF01OficialProps> = ({
  folio,
  fechaEmision,
  horaEmision,
  paciente,
  establecimientoDestino,
  brigadista,
  categoria,
  prioridad,
  motivo,
  situacionEncontrada,
  clinicalSummary,
  signosVitales,
  traslado,
  retorno,
  mostrarAccionesImpresion = true,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const esUrgente = prioridad === 'HIGH' || prioridad === 'URGENT';

  return (
    <div className="space-y-4">
      {/* Botones de Acción para Descargar / Imprimir */}
      {mostrarAccionesImpresion && (
        <div className="flex items-center justify-between no-print bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Documento Oficial F-01
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Válido para presentación en centros de la red pública
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-black shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar como PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* ESTILOS DE IMPRESIÓN PARA GENERAR PDF LIMPIO */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #boleta-f01-imprimible, #boleta-f01-imprimible * {
            visibility: visible;
          }
          #boleta-f01-imprimible {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 12mm;
            box-shadow: none !important;
            border: 1px solid #475569 !important;
            background: white !important;
            color: black !important;
            z-index: 999999;
            font-size: 11px !important;
            line-height: 1.35 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* HOJA OFICIAL F-01 FORMATO PAPEL DOCUMENTAL */}
      <div
        id="boleta-f01-imprimible"
        className="bg-white text-slate-900 border-2 border-slate-400 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 max-w-3xl mx-auto font-sans text-xs leading-normal"
      >
        {/* 1. ENCABEZADO INSTITUCIONAL MINSAL */}
        <div className="border-b-2 border-slate-900 pb-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/sv.svg"
              alt="Escudo El Salvador"
              className="w-12 h-12 object-contain shrink-0"
            />
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                República de El Salvador • Ministerio de Salud (MINSAL)
              </span>
              <h2 className="text-sm sm:text-base font-black tracking-tight text-slate-950 uppercase leading-none">
                Sistema Nacional Integrado de Salud
              </h2>
              <span className="text-[11px] font-extrabold text-[#166E7A] block">
                FORMULARIO F-01: BOLETA OFICIAL DE REFERENCIA Y RETORNO
              </span>
            </div>
          </div>

          <div className="text-right shrink-0 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-300">
              <span className="text-[9.5px] font-bold text-slate-500 uppercase">FOLIO F-01:</span>
              <span className="font-mono text-xs font-black text-slate-950">{folio}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">
              Fecha: <strong className="text-slate-800">{fechaEmision.slice(0, 10)}</strong>
              {horaEmision && ` • ${horaEmision}`}
            </div>
          </div>
        </div>

        {/* 2. SECCIÓN I: ESTABLECIMIENTOS DE ORIGEN Y DESTINO */}
        <div className="border border-slate-400 rounded-xl overflow-hidden">
          <div className="bg-slate-100 px-3 py-1 border-b border-slate-300 flex items-center justify-between">
            <span className="font-black text-[10px] uppercase tracking-wider text-slate-800">
              I. Datos de Procedencia y Establecimiento Receptor
            </span>
            <span className={`px-2 py-0.2 rounded text-[9.5px] font-black uppercase border ${
              esUrgente ? 'bg-rose-100 text-rose-900 border-rose-400' : 'bg-teal-100 text-teal-900 border-teal-300'
            }`}>
              Prioridad: {prioridad}
            </span>
          </div>

          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
            <div className="border-r border-slate-200 pr-2 space-y-0.5">
              <span className="text-[9.5px] font-black uppercase text-slate-500 block">
                Establecimiento / Brigada Emisora:
              </span>
              <p className="font-extrabold text-slate-950">
                {brigadista.brigada || 'Brigada Territorial de Salud Comunitaria'}
              </p>
              <p className="text-slate-600">
                Responsable que refiere: <strong>{brigadista.nombre}</strong>
              </p>
              <p className="text-slate-500 text-[10.5px]">
                Categoría de derivación: <strong className="text-slate-800">{categoria}</strong>
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[9.5px] font-black uppercase text-slate-500 block">
                Establecimiento de Salud Destino (Receptor):
              </span>
              <p className="font-extrabold text-slate-950 text-xs">
                {establecimientoDestino.nombre}
              </p>
              <p className="text-slate-600">
                Ubicación: <strong>{establecimientoDestino.municipio || 'Municipio asignado'}, {establecimientoDestino.departamento || 'El Salvador'}</strong>
              </p>
              <p className="text-slate-500 text-[10.5px]">
                Nivel de Atención: <strong>{establecimientoDestino.nivel || 'Básico'}</strong>
                {establecimientoDestino.telefono && ` • Tel: ${establecimientoDestino.telefono}`}
              </p>
            </div>
          </div>
        </div>

        {/* 3. SECCIÓN II: DATOS DE LA PERSONA USUARIA */}
        <div className="border border-slate-400 rounded-xl overflow-hidden">
          <div className="bg-slate-100 px-3 py-1 border-b border-slate-300">
            <span className="font-black text-[10px] uppercase tracking-wider text-slate-800">
              II. Identificación de la Persona Usuaria
            </span>
          </div>

          <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
            <div className="col-span-2">
              <span className="text-[9.5px] font-bold text-slate-500 uppercase block">Nombre Completo:</span>
              <p className="font-black text-slate-950 text-xs">{paciente.nombre}</p>
            </div>
            <div>
              <span className="text-[9.5px] font-bold text-slate-500 uppercase block">Documento Único (DUI):</span>
              <p className="font-mono font-bold text-slate-900">{paciente.dui || 'Sin DUI'}</p>
            </div>
            <div>
              <span className="text-[9.5px] font-bold text-slate-500 uppercase block">Edad / Sexo:</span>
              <p className="font-bold text-slate-900">{paciente.edad || 'No reg.'} {paciente.sexo ? `• ${paciente.sexo}` : ''}</p>
            </div>
            <div className="col-span-2">
              <span className="text-[9.5px] font-bold text-slate-500 uppercase block">Dirección de Residencia / Comunidad:</span>
              <p className="font-medium text-slate-800">{paciente.direccion || 'Comunidad territorial asignada'}</p>
            </div>
            <div>
              <span className="text-[9.5px] font-bold text-slate-500 uppercase block">Teléfono de Contacto:</span>
              <p className="font-bold text-slate-900">{paciente.telefono || 'No registrado'}</p>
            </div>
            <div>
              <span className="text-[9.5px] font-bold text-slate-500 uppercase block">Expediente Clínico:</span>
              <p className="font-mono font-bold text-[#166E7A]">{paciente.expediente || 'EXP-2026'}</p>
            </div>
          </div>
        </div>

        {/* 4. SECCIÓN III: MOTIVO DE REFERENCIA Y SITUACIÓN ENCONTRADA */}
        <div className="border border-slate-400 rounded-xl overflow-hidden space-y-0">
          <div className="bg-slate-100 px-3 py-1 border-b border-slate-300">
            <span className="font-black text-[10px] uppercase tracking-wider text-slate-800">
              III. Causa Clínica de la Derivación y Hallazgos en Comunidad
            </span>
          </div>

          <div className="p-3 space-y-2 text-[11.5px]">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-500 block">Motivo Principal de la Referencia:</span>
              <p className="font-black text-slate-950">{motivo}</p>
            </div>

            {situacionEncontrada && (
              <div className="pt-1.5 border-t border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-500 block">Situación y Cuadro Clínico Encontrado:</span>
                <p className="text-slate-800 leading-snug">{situacionEncontrada}</p>
              </div>
            )}

            {clinicalSummary && clinicalSummary !== situacionEncontrada && (
              <div className="pt-1.5 border-t border-slate-200">
                <span className="text-[10px] font-black uppercase text-slate-500 block">Resumen y Observaciones de Brigada:</span>
                <p className="text-slate-700 leading-snug">{clinicalSummary}</p>
              </div>
            )}
          </div>
        </div>

        {/* 5. SECCIÓN IV: SIGNOS VITALES REGISTRADOS EN TERRENO */}
        <div className="border border-slate-400 rounded-xl overflow-hidden">
          <div className="bg-slate-100 px-3 py-1 border-b border-slate-300 flex items-center justify-between">
            <span className="font-black text-[10px] uppercase tracking-wider text-slate-800">
              IV. Registro de Signos Vitales al Momento de la Emisión
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">Toma en Terreno</span>
          </div>

          <div className="p-2.5 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[11px]">
            <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">P. Arterial</span>
              <strong className="text-slate-950 font-black">{signosVitales?.presionArterial || '--/--'}</strong>
            </div>
            <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">F. Cardíaca</span>
              <strong className="text-slate-950 font-black">{signosVitales?.frecuenciaCardiaca ? `${signosVitales.frecuenciaCardiaca} lpm` : '--'}</strong>
            </div>
            <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Temperatura</span>
              <strong className="text-slate-950 font-black">{signosVitales?.temperatura ? `${signosVitales.temperatura} °C` : '--'}</strong>
            </div>
            <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">SpO₂</span>
              <strong className="text-slate-950 font-black">{signosVitales?.saturacionOxigeno ? `${signosVitales.saturacionOxigeno} %` : '--'}</strong>
            </div>
            <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">F. Resp.</span>
              <strong className="text-slate-950 font-black">{signosVitales?.frecuenciaRespiratoria ? `${signosVitales.frecuenciaRespiratoria} rpm` : '--'}</strong>
            </div>
            <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[9px] font-bold text-slate-500 uppercase block">Peso</span>
              <strong className="text-slate-950 font-black">{signosVitales?.pesoKg ? `${signosVitales.pesoKg} kg` : '--'}</strong>
            </div>
          </div>
        </div>

        {/* 6. SECCIÓN V: TRASLADO Y ACOMPAÑANTE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          <div className="border border-slate-400 rounded-xl p-2.5 space-y-0.5">
            <span className="text-[9.5px] font-bold text-slate-500 uppercase block">Medio de Traslado:</span>
            <p className="font-extrabold text-slate-900">{traslado.medio || 'Por cuenta propia'}</p>
          </div>
          <div className="border border-slate-400 rounded-xl p-2.5 space-y-0.5">
            <span className="text-[9.5px] font-bold text-slate-500 uppercase block">Acompañante Responsable:</span>
            <p className="font-extrabold text-slate-900">{traslado.acompanante || 'Sin acompañante registrado'}</p>
          </div>
        </div>

        {/* 7. FIRMAS Y SELLOS NORMATIVOS */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-300 text-center text-[10.5px]">
          <div className="space-y-6">
            <div className="h-10 flex items-end justify-center">
              <span className="font-mono text-[9px] text-slate-400 italic">[Firma Digitalizada / Validación Brigada]</span>
            </div>
            <div className="border-t border-slate-900 pt-1">
              <p className="font-black text-slate-950">{brigadista.nombre}</p>
              <p className="text-slate-500 text-[9.5px]">Personal Comunitario / Médico que Refiere</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="h-10 flex items-end justify-center">
              <span className="font-mono text-[9px] text-slate-400 italic">[Sello y Hora de Recepción en Destino]</span>
            </div>
            <div className="border-t border-slate-900 pt-1">
              <p className="font-black text-slate-950">Acuse de Recibo en Establecimiento</p>
              <p className="text-slate-500 text-[9.5px]">Firma / Sello de Admisión o Triaje</p>
            </div>
          </div>
        </div>

        {/* 8. TALÓN DESPRENDIBLE DE CONTRARREFERENCIA / RETORNO */}
        <div className="pt-2 border-t-2 border-dashed border-slate-400 space-y-2">
          <div className="flex items-center justify-between text-[9.5px] text-slate-500 font-bold uppercase tracking-wider">
            <span>✂ Talón Desprendible de Contrarreferencia (Retorno al 1.er Nivel)</span>
            <span>Uso exclusivo del médico del hospital o unidad de salud</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-[10.5px] space-y-1 text-slate-700">
            {retorno?.atendido ? (
              <div className="space-y-1">
                <span className="font-black text-emerald-800 uppercase block">Respuesta Médica Registrada:</span>
                <p className="font-bold text-slate-900">{retorno.respuesta || 'Atención completada.'}</p>
                {retorno.indicaciones && (
                  <p className="text-slate-600">Indicaciones: {retorno.indicaciones}</p>
                )}
              </div>
            ) : (
              <p className="italic text-slate-400 text-center py-1">
                Espacio reservado para diagnóstico de egreso, tratamiento prescrito e indicaciones de seguimiento territorial.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};