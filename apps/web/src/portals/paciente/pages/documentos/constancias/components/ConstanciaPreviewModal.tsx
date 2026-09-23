// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/constancias/components/ConstanciaPreviewModal.tsx
// DESCRIPCIÓN: Visor oficial de constancias médicas homologado a la Hoja Oficial
//              de Emisión y Carnet Territorial MedicOS (EXP-2026-1223).
//              Implementa React Portal de forma síncrona y flujo estático
//              para impresión multipágina sin recortes ni re-renders en cascada.
// =========================================================================

import React, { useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Printer, QrCode, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';
import type { MedicalCertificateItem } from '../../../../../../modules/documents/types/constancias.types.js';
import { useAuth } from '../../../../../../core/context/useAuth.js';

interface ConstanciaPreviewModalProps {
  certificate: MedicalCertificateItem | null;
  onClose: () => void;
  onDownload: (cert: MedicalCertificateItem) => void;
}

interface ParsedClinicalObservations {
  diagnostico?: string;
  plan?: string;
  detalles: { label: string; value: string }[];
  general?: string;
}

function parseObservations(rawText?: string | null): ParsedClinicalObservations {
  if (!rawText || !rawText.trim()) {
    return { detalles: [] };
  }

  let text = rawText.trim();
  text = text.replace(/^Paciente atendido\(a\) en evaluación clínica oficial\.\s*/i, '');

  const diagMatch = text.match(/Diagnóstico:\s*(.+?)(?=\s*(?:Plan:|$))/i);
  const planMatch = text.match(/Plan:\s*(.+)/i);

  if (diagMatch || planMatch) {
    const diagnostico = diagMatch ? diagMatch[1].replace(/\.$/, '').trim() : undefined;
    const planText = planMatch ? planMatch[1].trim() : '';

    const detalles: { label: string; value: string }[] = [];
    let mainPlan = planText;

    if (planText.includes('|')) {
      const parts = planText.split('|').map((p) => p.trim()).filter(Boolean);
      mainPlan = parts[0] || '';
      for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        const colonIdx = part.indexOf(':');
        if (colonIdx > 0) {
          detalles.push({
            label: part.substring(0, colonIdx).trim(),
            value: part.substring(colonIdx + 1).trim(),
          });
        } else {
          detalles.push({
            label: 'Indicación adicional',
            value: part,
          });
        }
      }
    }

    return {
      diagnostico,
      plan: mainPlan,
      detalles,
    };
  }

  return {
    general: text,
    detalles: [],
  };
}

export const ConstanciaPreviewModal: React.FC<ConstanciaPreviewModalProps> = ({
  certificate,
  onClose,
  onDownload,
}) => {
  const { user } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  const parsedObservations = useMemo(() => {
    return parseObservations(certificate?.observations);
  }, [certificate?.observations]);

  if (!certificate || typeof document === 'undefined' || !document.body) {
    return null;
  }

  const patientFullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'María González'
    : 'María González';

  const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedLongDate = new Date(certificate.issuedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrintToPdf = () => {
    onDownload(certificate);
    window.print();
  };

  const modalContent = (
    <div className="medicos-modal-overlay fixed inset-0 z-50 flex flex-col bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      
      {/* Estilos CSS nativos de impresión con soporte multipágina */}
      <style>{`
        @page {
          size: letter portrait;
          margin: 10mm 12mm 10mm 12mm;
        }
        @media print {
          /* 1. Ocultar completamente todo el árbol principal de React */
          body > *:not(.medicos-modal-overlay) {
            display: none !important;
          }

          /* 2. Cuerpo del documento libre para paginar de forma fluida */
          html, body {
            height: auto !important;
            min-height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 3. Transformar el overlay en un contenedor estático */
          .medicos-modal-overlay {
            position: static !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            z-index: auto !important;
          }

          /* 4. Ocultar botones y cabecera de la modal */
          .print-hide {
            display: none !important;
          }

          /* 5. El contenedor con scroll se despliega sin restricciones de altura */
          .medicos-modal-scroll {
            position: static !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          /* 6. La hoja membretada se renderiza en flujo estándar */
          .medicos-document-sheet {
            position: static !important;
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            page-break-after: auto !important;
            break-after: auto !important;
          }

          /* 7. Bloques clínicos protegidos: no se fragmentan a mitad de salto */
          .print-keep-together {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Barra de herramientas superior (oculta al imprimir) */}
      <div className="print-hide w-full bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2B7A78]/20 border border-[#2B7A78]/40 flex items-center justify-center p-1">
            <img 
              src="/Logo MedicOS Cruz.png" 
              alt="MedicOS" 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-100">
              {certificate.title}
            </span>
            <span className="text-[10px] font-mono font-bold bg-teal-950/80 text-teal-300 px-2 py-0.5 rounded border border-teal-700/50">
              {certificate.code}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handlePrintToPdf}
            title="Imprimir documento oficial"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold border border-slate-700 active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
          <button
            type="button"
            onClick={handlePrintToPdf}
            title="Guardar o Descargar en PDF"
            className="px-4 py-1.5 rounded-xl bg-[#2B7A78] hover:bg-[#236866] text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-black shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-teal-200" />
            <span>Descargar PDF</span>
          </button>
          <div className="w-px h-5 bg-slate-700 mx-1"></div>
          <button
            type="button"
            onClick={onClose}
            title="Cerrar visor"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Contenedor del documento */}
      <div className="medicos-modal-scroll flex-1 overflow-y-auto p-4 sm:p-8 flex items-start justify-center">
        <div 
          ref={printRef}
          className="medicos-document-sheet bg-white w-full max-w-3xl rounded-lg shadow-2xl p-8 sm:p-12 text-slate-900 border border-slate-200 space-y-6 my-auto"
        >
          
          {/* 1. Cabecera Oficial MedicOS */}
          <div className="print-keep-together flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#2B7A78] pb-4">
            <div className="flex items-center gap-4">
              <img 
                src="/Logo MedicOS.png" 
                alt="MedicOS" 
                className="h-16 sm:h-18 w-auto object-contain shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/Logo MedicOS Cruz.png';
                }}
              />
              <div className="space-y-0.5">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-[#2B7A78] uppercase">
                  MedicOS Oficial
                </h2>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Sistema Nacional de Gestión en Salud Comunitaria y Brigadas
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  República de El Salvador · Registro Nominal de Pacientes
                </p>
              </div>
            </div>

            <div className="bg-teal-50/60 border-2 border-[#2B7A78] rounded-xl p-3 text-right shrink-0">
              <p className="text-[9px] font-black uppercase tracking-wider text-[#2B7A78]">
                Documento de Acreditación
              </p>
              <p className="text-base font-black font-mono text-slate-900 mt-0.5">
                {certificate.code}
              </p>
              <p className="text-[10px] text-slate-600 font-bold mt-0.5">
                Emisión: {formattedDate}
              </p>
            </div>
          </div>

          {/* 2. Título Central del Documento */}
          <div className="print-keep-together text-center space-y-1 pt-1">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
              {certificate.title}
            </h1>
            <p className="text-xs text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
              Certificado oficial de identidad clínica y acreditación para atención médica en brigadas territoriales y centros asistenciales de la red MedicOS.
            </p>
          </div>

          {/* 3. Bloque: Titular de la Constancia */}
          <div className="print-keep-together bg-slate-50/90 rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2B7A78]">
                Titular del Carnet / Documento
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Activo y Sincronizado</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Nombre del Titular</span>
                <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{patientFullName}</span>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Expediente Clínico</span>
                <span className="font-mono font-bold text-slate-800 mt-0.5 block">
                  {certificate.consultationReference || 'EXP-2026-1223'}
                </span>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Registro Nominal</span>
                <span className="font-bold text-[#2B7A78] mt-0.5 block items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                  <span>Validado en Red Territorial</span>
                </span>
              </div>
            </div>
          </div>

          {/* 4. Bloque: Datos de la Atención Clínica */}
          <div className="print-keep-together bg-slate-50/90 rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="border-b border-slate-200/80 pb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2B7A78]">
                Datos de la Atención y Registro Clínico
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Establecimiento / Puesto de Salud</span>
                <span className="font-extrabold text-slate-900 text-xs mt-0.5 block">{certificate.establishment}</span>
              </div>
              <div>
                <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Profesional Responsable</span>
                <span className="font-extrabold text-slate-900 text-xs mt-0.5 block">{certificate.professional}</span>
              </div>
              <div className="pt-2 border-t border-slate-200/70 sm:col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Fecha de Atención Oficial</span>
                  <span className="font-bold text-slate-900 text-xs mt-0.5 block">{formattedLongDate}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Tipo de Encuentro</span>
                  <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                    {certificate.type === 'PRENATAL_CONTROL' ? 'Control Prenatal Territorial' : 'Consulta Médica General'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Certificación Médica Oficial y Observaciones Estructuradas */}
          <div className="print-keep-together space-y-3 text-xs leading-relaxed text-slate-700 pt-1">
            <p className="text-justify font-medium">
              Por medio del presente documento, el personal de salud acreditado de la red MedicOS certifica formalmente que el/la paciente antes identificado(a) ha recibido atención médica dentro de las brigadas asistenciales y establecimientos oficiales del sistema, quedando debidamente asentado el encuentro en el expediente clínico digital centralizado.
            </p>

            {certificate.observations && (
              <div className="bg-slate-50/90 rounded-xl border border-slate-200 p-4 space-y-3 print:bg-white print:border-slate-300">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#2B7A78] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Dictamen, Indicaciones y Registro Clínico</span>
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Resumen Oficial
                  </span>
                </div>

                {parsedObservations.diagnostico ? (
                  <div className="space-y-2.5 text-xs">
                    {/* Tarjeta de Diagnóstico Principal */}
                    <div className="bg-white rounded-lg p-3 border border-slate-200/90 shadow-2xs">
                      <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wide block">
                        Diagnóstico Determinado
                      </span>
                      <p className="font-extrabold text-slate-900 text-xs mt-0.5">
                        {parsedObservations.diagnostico}
                      </p>
                    </div>

                    {/* Tarjeta de Plan Terapéutico */}
                    {parsedObservations.plan && (
                      <div className="bg-white rounded-lg p-3 border border-slate-200/90 shadow-2xs">
                        <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wide block">
                          Plan de Manejo y Tratamiento Indicado
                        </span>
                        <p className="font-semibold text-slate-800 text-xs mt-0.5 leading-relaxed">
                          {parsedObservations.plan}
                        </p>
                      </div>
                    )}

                    {/* Cuadrícula de detalles: Lotes, Reacciones y Notas */}
                    {parsedObservations.detalles.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {parsedObservations.detalles.map((item, index) => (
                          <div 
                            key={index} 
                            className="bg-teal-50/60 rounded-lg p-2.5 border border-teal-200/70 space-y-0.5"
                          >
                            <span className="text-[9px] font-black text-[#2B7A78] uppercase tracking-wider block">
                              {item.label}
                            </span>
                            <p className="text-[11px] font-medium text-slate-800 leading-snug">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-3 border border-slate-200/90 shadow-2xs text-xs text-slate-800 font-medium leading-relaxed">
                    {parsedObservations.general || certificate.observations}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 6. Validación Digital y Firmas Oficiales */}
          <div className="print-keep-together pt-3 border-t border-slate-200 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              
              {/* QR y Validación Centralizada */}
              <div className="sm:col-span-5 flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-200 text-[#2B7A78] shrink-0 flex items-center justify-center shadow-xs">
                  <QrCode className="w-full h-full" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-wider text-[#2B7A78]">
                    Validación Digital
                  </p>
                  <p className="text-[10px] font-mono font-bold text-slate-800 truncate">
                    {certificate.qrHash}
                  </p>
                  <p className="text-[8.5px] text-slate-500 leading-tight">
                    El código QR permite verificar en tiempo real en la base central MedicOS.
                  </p>
                </div>
              </div>

              {/* Firma Electrónica del Profesional */}
              <div className="sm:col-span-4 flex flex-col items-center justify-end text-center space-y-1">
                <div className="text-[9px] font-bold text-[#2B7A78] font-mono bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                  [ FIRMA DIGITAL AUTORIZADA ]
                </div>
                <div className="w-36 border-b border-slate-400 mt-2"></div>
                <p className="text-[10.5px] font-black text-slate-900 leading-tight truncate max-w-full">
                  {certificate.professional}
                </p>
                <p className="text-[8.5px] text-slate-500 font-semibold">Firma del Responsable Clínico</p>
                <p className="text-[8px] text-slate-400">Estación Territorial MedicOS</p>
              </div>

              {/* Sello Oficial Circular Institucional */}
              <div className="sm:col-span-3 flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#2B7A78] p-1 mx-auto flex flex-col items-center justify-center text-[#2B7A78] text-[7px] font-black uppercase text-center leading-tight -rotate-3 bg-teal-50/40">
                  <span>★ MedicOS ★</span>
                  <span className="text-[8px] font-extrabold my-0.5 text-slate-900">SELLO OFICIAL</span>
                  <span>BRIGADA 2026</span>
                </div>
                <p className="text-[8px] text-slate-600 font-bold mt-1 text-center">
                  Ministerio de Salud / Dirección Médica
                </p>
              </div>

            </div>
          </div>

          {/* 7. Cintillo Inferior Institucional */}
          <div className="print-keep-together pt-3 border-t-2 border-[#2B7A78] flex flex-col sm:flex-row items-center justify-between text-[9px] text-slate-600 font-bold gap-1">
            <p>
              MedicOS Plataforma de Salud Comunitaria · <span className="text-[#2B7A78]">Tu salud, nuestra prioridad</span>
            </p>
            <p>
              Año 2026 · Documento Oficial de Identificación Territorial
            </p>
          </div>

        </div>
      </div>

    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConstanciaPreviewModal;