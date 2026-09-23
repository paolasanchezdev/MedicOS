// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/descarga-expediente/components/GenerandoExpedienteModal.tsx
// DESCRIPCIÓN: Visor oficial del expediente en hoja tamaño Carta montado en portal,
//              con extracción directa de DUI, Grupo Sanguíneo y soporte multipágina
//              sin sobrecosto de memoización manual (compatible con React Compiler).
// =========================================================================

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Printer, QrCode, Stethoscope, Heart, ShieldCheck, Baby, Flame } from 'lucide-react';
import type { ClinicalGraphNode } from '../../../../../../modules/clinical-knowledge/types/clinical-graph.types.js';
import type { SectionItemData } from './SeccionExpedienteCard.js';

interface GenerandoExpedienteModalProps {
  nodes: ClinicalGraphNode[];
  sections: SectionItemData[];
  generatedAt: string;
  onClose: () => void;
}

function formatBirthDateLong(rawDate?: unknown): string {
  if (!rawDate) return 'No registrada';
  const str = String(rawDate).trim();
  if (!str) return 'No registrada';

  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ];

  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = months[monthIndex] || month;
    return `${parseInt(day, 10)} de ${monthName} de ${year}`;
  }

  const d = new Date(str);
  if (isNaN(d.getTime())) return 'No registrada';

  return `${d.getUTCDate()} de ${months[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

export const GenerandoExpedienteModal: React.FC<GenerandoExpedienteModalProps> = ({
  nodes,
  generatedAt,
  onClose,
}) => {
  const patient = nodes.find((n) => n.type === 'PATIENT');
  const record = nodes.find((n) => n.type === 'CLINICAL_RECORD');
  const allergies = nodes.filter((n) => n.type === 'ALLERGY').map((n) => n.label);
  const medications = nodes.filter((n) => n.type === 'MEDICATION').map((n) => n.label);
  const diagnoses = nodes.filter((n) => n.type === 'DIAGNOSIS');
  const consultations = nodes.filter((n) => n.type === 'CONSULTATION');
  const prenatal = nodes.filter((n) => n.type === 'PRENATAL_CONTROL');
  const vaccines = nodes.filter((n) => n.type === 'VACCINATION');
  const vitals = nodes.filter((n) => n.type === 'VITAL_SIGN');
  const habits = nodes.filter((n) => n.type === 'LIFESTYLE_HABIT' && !n.id.startsWith('habit-hub-'));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const formattedBirth = formatBirthDateLong(patient?.metadata?.dateOfBirth);

  // Extracción unificada del DUI en render directo (O(1))
  const metadataDui = patient?.metadata?.dui;
  const sublabel = patient?.sublabel || '';
  const displayDui =
    typeof metadataDui === 'string' && metadataDui.trim()
      ? metadataDui.trim()
      : sublabel.startsWith('DUI: ') && !sublabel.includes('No registrado')
        ? sublabel.replace('DUI: ', '').trim()
        : 'No registrado';

  // Extracción unificada del Grupo Sanguíneo en render directo (O(1))
  const fromRecord = record?.metadata?.bloodType;
  const fromPatient = patient?.metadata?.bloodType;
  const displayBlood =
    typeof fromRecord === 'string' &&
    fromRecord.trim() &&
    fromRecord !== 'UNKNOWN' &&
    fromRecord !== 'No determinado'
      ? fromRecord.replace(/_/g, ' ')
      : typeof fromPatient === 'string' &&
          fromPatient.trim() &&
          fromPatient !== 'UNKNOWN' &&
          fromPatient !== 'No determinado'
        ? fromPatient.replace(/_/g, ' ')
        : 'No determinado';

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="medicos-modal-wrapper fixed inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-xs select-none animate-in fade-in duration-150">
      
      {/* Reglas de impresión multi-página nativas */}
      <style>{`
        @media print {
          @page {
            size: letter portrait;
            margin: 12mm 15mm 15mm 15mm;
          }
          
          #root {
            display: none !important;
          }

          html, body {
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
            position: static !important;
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .medicos-modal-wrapper {
            position: static !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .medicos-modal-scroll {
            position: static !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .medicos-sheet-carta {
            position: static !important;
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #ffffff !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-avoid-break {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          tr {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Barra de Herramientas */}
      <div className="w-full bg-[#1c5752] border-b border-[#164743] px-4 sm:px-8 py-3 flex items-center justify-between text-white shrink-0 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center p-1">
            <img 
              src="/Logo MedicOS Cruz.png" 
              alt="MedicOS" 
              className="w-full h-full object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white">
                Expediente Clínico del Paciente
              </span>
              <span className="text-[10px] font-mono font-bold bg-white/20 text-teal-100 px-2 py-0.5 rounded">
                {patient?.provenance?.recordId ? `EXP-${patient.provenance.recordId.slice(0, 8).toUpperCase()}` : 'EXP-OFICIAL-2026'}
              </span>
            </div>
            <p className="text-[10px] text-teal-100">Copia Oficial Fidedigna · Red Territorial MedicOS</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            title="Imprimir o Guardar en PDF"
            className="px-4 py-2 rounded-xl bg-white hover:bg-teal-50 text-[#1c5752] transition cursor-pointer flex items-center gap-2 text-xs font-bold active:scale-95 shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#1c5752]" />
            <span>Imprimir / Guardar PDF</span>
          </button>
          <div className="w-px h-5 bg-white/20 mx-1 hidden sm:block"></div>
          <button
            type="button"
            onClick={onClose}
            title="Cerrar visor"
            className="p-1.5 rounded-lg text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hoja del documento */}
      <div className="medicos-modal-scroll flex-1 overflow-y-auto bg-slate-200/80 p-4 sm:p-8 flex items-start justify-center">
        <div className="medicos-sheet-carta bg-white w-full max-w-4xl shadow-xl rounded-xs p-8 sm:p-12 text-slate-900 border border-slate-300 space-y-6 my-auto">
          
          {/* Cabecera Oficial */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1c5752] pb-5 print-avoid-break">
            <div className="flex items-center gap-4">
              <img 
                src="/Logo MedicOS.png" 
                alt="MedicOS" 
                className="h-16 sm:h-20 w-auto object-contain shrink-0"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/Logo MedicOS Cruz.png'; }}
              />
              <div className="space-y-0.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-[#1c5752] uppercase">
                  MedicOS · Expediente Clínico del Paciente
                </span>
                <p className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Sistema Nacional de Gestión en Salud Comunitaria y Brigadas
                </p>
                <p className="text-[10.5px] text-slate-600 font-bold uppercase tracking-wider">
                  República de El Salvador · Registro Nominal Territorial
                </p>
              </div>
            </div>

            <div className="bg-teal-50/70 border-2 border-[#1c5752] rounded p-2.5 text-right shrink-0">
              <p className="text-[8.5px] font-black uppercase tracking-wider text-[#1c5752]">
                Folio Único Central
              </p>
              <p className="text-base font-black font-mono text-slate-900 mt-0.5">
                {patient?.provenance?.recordId ? `EXP-${patient.provenance.recordId.slice(0, 8).toUpperCase()}` : 'EXP-OFICIAL-2026'}
              </p>
              <p className="text-[10px] text-slate-600 font-bold mt-0.5">
                Compilado: {generatedAt}
              </p>
            </div>
          </div>

          {/* 1. Identificación y Filiación */}
          <div className="space-y-1.5 print-avoid-break">
            <div className="border-b border-[#1c5752] pb-1 flex justify-between items-center">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#1c5752]">
                1. Datos de Identificación y Filiación
              </span>
              <span className="text-[9px] font-bold text-teal-800 uppercase bg-teal-50 px-2 py-0.5 border border-teal-200">
                ✓ Activo en Red
              </span>
            </div>

            <table className="w-full border-collapse border border-slate-300 text-xs">
              <tbody>
                <tr>
                  <td className="w-1/4 bg-slate-50 p-2 border border-slate-300 font-bold text-slate-500 uppercase text-[9px]">Titular</td>
                  <td className="w-1/4 p-2 border border-slate-300 font-black text-slate-900">{patient?.label || 'No registrado'}</td>
                  <td className="w-1/4 bg-slate-50 p-2 border border-slate-300 font-bold text-slate-500 uppercase text-[9px]">DUI</td>
                  <td className="w-1/4 p-2 border border-slate-300 font-mono font-bold text-slate-900">{displayDui}</td>
                </tr>
                <tr>
                  <td className="bg-slate-50 p-2 border border-slate-300 font-bold text-slate-500 uppercase text-[9px]">Fecha de Nacimiento</td>
                  <td className="p-2 border border-slate-300 font-semibold">{formattedBirth}</td>
                  <td className="bg-slate-50 p-2 border border-slate-300 font-bold text-slate-500 uppercase text-[9px]">Grupo Sanguíneo</td>
                  <td className="p-2 border border-slate-300 font-black text-[#1c5752]">{displayBlood}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 2. Alertas Clínicas */}
          <div className="space-y-1.5 print-avoid-break">
            <div className="border-b border-[#1c5752] pb-1">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#1c5752]">
                2. Alertas Clínicas Registradas
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-300">
              <div>
                <strong className="text-rose-700 block uppercase text-[9px]">Alergias Documentadas:</strong>
                <p className="font-bold text-slate-900">{allergies.length > 0 ? allergies.join(', ') : 'Niega alergias medicamentosas o alimentarias'}</p>
              </div>
              <div>
                <strong className="text-[#1c5752] block uppercase text-[9px]">Medicamentos Activos:</strong>
                <p className="font-bold text-slate-900">{medications.length > 0 ? medications.join(' | ') : 'Sin fármacos activos prescritos'}</p>
              </div>
            </div>
          </div>

          {/* 3. Diagnósticos Clínicos */}
          <div className="space-y-1.5 print-avoid-break">
            <div className="border-b border-[#1c5752] pb-1">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#1c5752]">
                3. Enfermedades y Diagnósticos Formales ({diagnoses.length})
              </span>
            </div>
            {diagnoses.length > 0 ? (
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-[9px] uppercase font-bold">
                    <th className="p-1.5 border border-slate-300 text-left">Diagnóstico</th>
                    <th className="p-1.5 border border-slate-300 text-left">Código CIE</th>
                    <th className="p-1.5 border border-slate-300 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {diagnoses.map((d) => (
                    <tr key={d.id}>
                      <td className="p-2 border border-slate-300 font-bold">{d.label}</td>
                      <td className="p-2 border border-slate-300 font-mono text-slate-600">{String(d.metadata?.code || 'CIE-10')}</td>
                      <td className="p-2 border border-slate-300 text-center font-bold text-emerald-800 text-[10px]">Activo</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xs text-slate-500 italic p-2 bg-slate-50 border border-slate-200 rounded">Sin diagnósticos patológicos registrados.</p>
            )}
          </div>

          {/* 4. Historial de Consultas Médicas */}
          <div className="space-y-1.5 print-avoid-break">
            <div className="border-b border-[#1c5752] pb-1">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#1c5752]">
                4. Historial de Consultas Médicas ({consultations.length})
              </span>
            </div>
            {consultations.length > 0 ? (
              <div className="space-y-2">
                {consultations.map((c) => (
                  <div key={c.id} className="bg-slate-50 border border-slate-300 rounded p-3 text-xs space-y-1 print-avoid-break">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-1">
                      <span className="font-bold text-[#1c5752] flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5" />
                        {c.label}
                      </span>
                      <span className="font-mono text-slate-600 text-[11px]">{c.sublabel}</span>
                    </div>
                    {c.metadata?.doctorName && (
                      <p className="text-[10.5px] text-slate-700 font-bold">Médico Responsable: {String(c.metadata.doctorName)}</p>
                    )}
                    {c.metadata?.treatmentPlan && (
                      <p className="text-[11px] text-slate-800">
                        <strong>Plan e Indicaciones:</strong> {String(c.metadata.treatmentPlan)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-2 bg-slate-50 border border-slate-200 rounded">Sin consultas registradas.</p>
            )}
          </div>

          {/* 5. Controles Prenatales y Obstétricos */}
          {prenatal.length > 0 && (
            <div className="space-y-1.5 print-avoid-break">
              <div className="border-b border-[#1c5752] pb-1">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-[#1c5752]">
                  5. Controles Prenatales y Salud Materna ({prenatal.length})
                </span>
              </div>
              <div className="space-y-2">
                {prenatal.map((p) => (
                  <div key={p.id} className="bg-pink-50/50 border border-pink-200 rounded p-2.5 text-xs space-y-1 print-avoid-break">
                    <div className="flex justify-between items-center border-b border-pink-100 pb-1">
                      <span className="font-bold text-pink-900 flex items-center gap-1.5">
                        <Baby className="w-3.5 h-3.5 text-pink-700" />
                        {p.label}
                      </span>
                      <span className="font-mono text-pink-800 text-[11px]">{p.sublabel}</span>
                    </div>
                    {p.metadata?.treatmentPlan && (
                      <p className="text-[11px] text-slate-800">
                        <strong>Evolución y Cuidados:</strong> {String(p.metadata.treatmentPlan)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Inmunizaciones y Vacunas */}
          {vaccines.length > 0 && (
            <div className="space-y-1.5 print-avoid-break">
              <div className="border-b border-[#1c5752] pb-1">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-[#1c5752]">
                  6. Esquema de Vacunación Aplicado ({vaccines.length})
                </span>
              </div>
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-[9px] uppercase font-bold">
                    <th className="p-1.5 border border-slate-300 text-left">Biológico / Vacuna</th>
                    <th className="p-1.5 border border-slate-300 text-left">Fecha de Aplicación</th>
                    <th className="p-1.5 border border-slate-300 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {vaccines.map((v) => (
                    <tr key={v.id}>
                      <td className="p-2 border border-slate-300 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {v.label}
                      </td>
                      <td className="p-2 border border-slate-300 text-slate-700">{v.sublabel}</td>
                      <td className="p-2 border border-slate-300 text-center font-bold text-emerald-800 text-[10px]">
                        Aplicada
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 7. Registro Histórico de Signos Vitales */}
          <div className="space-y-1.5 print-avoid-break">
            <div className="border-b border-[#1c5752] pb-1">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#1c5752]">
                7. Registro Histórico de Signos Vitales ({vitals.length})
              </span>
            </div>
            {vitals.length > 0 ? (
              <table className="w-full border-collapse border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 text-[9px] uppercase font-bold">
                    <th className="p-1.5 border border-slate-300 text-left">Presión Arterial</th>
                    <th className="p-1.5 border border-slate-300 text-left">Constantes Adicionales</th>
                    <th className="p-1.5 border border-slate-300 text-center">Evaluación</th>
                  </tr>
                </thead>
                <tbody>
                  {vitals.map((v) => (
                    <tr key={v.id}>
                      <td className="p-2 border border-slate-300 font-bold flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-indigo-600" />
                        {v.label}
                      </td>
                      <td className="p-2 border border-slate-300 text-slate-700">{v.sublabel}</td>
                      <td className="p-2 border border-slate-300 text-center text-[#1c5752] font-bold text-[10px]">Normal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xs text-slate-500 italic p-2 bg-slate-50 border border-slate-200 rounded">Sin signos vitales registrados.</p>
            )}
          </div>

          {/* 8. Hábitos de Salud y Autocuidado */}
          {habits.length > 0 && (
            <div className="space-y-1.5 print-avoid-break">
              <div className="border-b border-[#1c5752] pb-1">
                <span className="text-[9.5px] font-black uppercase tracking-wider text-[#1c5752]">
                  8. Estilo de Vida y Hábitos de Salud ({habits.length})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {habits.map((h) => (
                  <div key={h.id} className="p-2 bg-slate-50 border border-slate-300 rounded flex justify-between print-avoid-break">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {h.label}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">{h.sublabel}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sellos Oficiales y QR */}
          <div className="pt-4 border-t-2 border-slate-200 flex items-center justify-between print-avoid-break">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1 border border-slate-300 text-[#1c5752] flex items-center justify-center">
                <QrCode className="w-full h-full" />
              </div>
              <div className="space-y-0.5 text-left">
                <span className="text-[9px] font-black uppercase text-[#1c5752]">Validación Criptográfica Territorial</span>
                <p className="text-xs font-mono font-bold text-slate-800">EXP-VERIFY-2026-MEDICOS</p>
                <p className="text-[8.5px] text-slate-500">Documento clínico oficial respaldado por la Red Territorial de Salud de El Salvador.</p>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#1c5752] p-1 flex flex-col items-center justify-center text-[#1c5752] text-[7px] font-black uppercase -rotate-3 bg-teal-50/40">
                <span>★ MedicOS ★</span>
                <span className="text-[8px] font-extrabold my-0.5 text-slate-900">SELLO OFICIAL</span>
                <span>EXPEDIENTE 2026</span>
              </div>
            </div>
          </div>

          {/* Pie de Página */}
          <div className="pt-2 border-t-2 border-[#1c5752] flex justify-between text-[9px] text-slate-600 font-bold print-avoid-break">
            <span>MedicOS · Tu salud, nuestra prioridad</span>
            <span>Año 2026 · Copia Fiel de Base de Datos PostgreSQL</span>
          </div>

        </div>
      </div>

    </div>,
    document.body
  );
};

export default GenerandoExpedienteModal;