// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-knowledge/components/ClinicalGraphNodeDetails.tsx
// DESCRIPCIÓN: Panel lateral de información clínica humanizada para el paciente.
//              Sin tecnicismos de base de datos ni UUIDs expuestos.
//              Tipado seguro para TypeScript y limpio de reglas ESLint.
// =========================================================================

import React from 'react';
import {
  X,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Activity,
  AlertCircle,
  FileText,
  User,
  Pill,
  Stethoscope,
  Heart,
  Baby,
  Building,
  Flame,
} from 'lucide-react';
import type { ClinicalGraphNode, ClinicalNodeType } from '../types/clinical-graph.types.js';

interface ClinicalGraphNodeDetailsProps {
  node: ClinicalGraphNode | null;
  connectedNodes: ClinicalGraphNode[];
  onSelectNode: (node: ClinicalGraphNode) => void;
  onClose: () => void;
}

const getNodeIcon = (type: ClinicalNodeType) => {
  switch (type) {
    case 'PATIENT':
      return <User className="w-4 h-4 text-[#1c5752]" />;
    case 'CONSULTATION':
      return <Stethoscope className="w-4 h-4 text-teal-700" />;
    case 'PRENATAL_CONTROL':
      return <Baby className="w-4 h-4 text-pink-700" />;
    case 'VACCINATION':
      return <ShieldCheck className="w-4 h-4 text-emerald-700" />;
    case 'DIAGNOSIS':
      return <Activity className="w-4 h-4 text-amber-700" />;
    case 'ALLERGY':
      return <AlertCircle className="w-4 h-4 text-rose-700" />;
    case 'MEDICATION':
    case 'PRESCRIPTION':
      return <Pill className="w-4 h-4 text-emerald-700" />;
    case 'VITAL_SIGN':
      return <Heart className="w-4 h-4 text-indigo-700" />;
    case 'LIFESTYLE_HABIT':
      return <Flame className="w-4 h-4 text-amber-700" />;
    case 'BRIGADE':
      return <Building className="w-4 h-4 text-cyan-700" />;
    default:
      return <FileText className="w-4 h-4 text-slate-600" />;
  }
};

const formatReadableDate = (dateStr?: unknown): string => {
  if (!dateStr) return 'Fecha no especificada';
  try {
    const parsedDate = new Date(dateStr as string | number | Date);
    if (Number.isNaN(parsedDate.getTime())) return String(dateStr);
    return parsedDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return String(dateStr);
  }
};

export const ClinicalGraphNodeDetails: React.FC<ClinicalGraphNodeDetailsProps> = ({
  node,
  connectedNodes,
  onSelectNode,
  onClose,
}) => {
  if (!node) return null;

  // Generación de parámetros en lenguaje natural para el paciente
  const renderHumanizedDetails = () => {
    const meta = node.metadata || {};

    switch (node.type) {
      case 'PATIENT':
        return (
          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Titular del expediente:</span>
              <span className="font-bold text-slate-900">{node.label}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Documento de Identidad (DUI):</span>
              <span className="font-mono font-bold text-slate-800">{String(meta.dui || 'Registrado')}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Sexo registrado:</span>
              <span className="font-bold text-slate-800">
                {meta.sex === 'FEMALE' ? 'Femenino' : meta.sex === 'MALE' ? 'Masculino' : 'No especificado'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Fecha de nacimiento:</span>
              <span className="font-bold text-slate-800">{formatReadableDate(meta.dateOfBirth)}</span>
            </div>
            {meta.phone ? (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Teléfono de contacto:</span>
                <span className="font-bold text-slate-800">{String(meta.phone)}</span>
              </div>
            ) : null}
            {meta.address ? (
              <div className="flex flex-col py-1.5">
                <span className="text-slate-500 font-medium">Comunidad / Dirección:</span>
                <span className="font-semibold text-slate-800 mt-0.5">{String(meta.address)}</span>
              </div>
            ) : null}
          </div>
        );

      case 'CONSULTATION':
      case 'PRENATAL_CONTROL':
      case 'VACCINATION':
        return (
          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Fecha de atención:</span>
              <span className="font-bold text-slate-800">{formatReadableDate(meta.consultationDate || node.provenance.timestamp)}</span>
            </div>
            {meta.doctorName ? (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Profesional responsable:</span>
                <span className="font-bold text-[#1c5752]">{String(meta.doctorName)}</span>
              </div>
            ) : null}
            {meta.diagnosisDesc ? (
              <div className="py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium block">Diagnóstico de la consulta:</span>
                <span className="font-bold text-slate-900 mt-0.5 block">{String(meta.diagnosisDesc)}</span>
              </div>
            ) : null}
            {meta.treatmentPlan ? (
              <div className="py-1.5">
                <span className="text-slate-500 font-medium block">Indicaciones / Plan de cuidado:</span>
                <span className="font-medium text-slate-700 mt-0.5 block bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {String(meta.treatmentPlan)}
                </span>
              </div>
            ) : null}
          </div>
        );

      case 'VITAL_SIGN':
        return (
          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Presión Arterial:</span>
              <span className="font-bold text-slate-900">
                {String(meta.systolic ?? '--')}/{String(meta.diastolic ?? '--')} mmHg
              </span>
            </div>
            {meta.heartRate ? (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Frecuencia Cardíaca:</span>
                <span className="font-bold text-slate-800">{String(meta.heartRate)} lpm</span>
              </div>
            ) : null}
            {meta.oxygenSat ? (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Saturación de Oxígeno (SpO2):</span>
                <span className="font-bold text-slate-800">{String(meta.oxygenSat)}%</span>
              </div>
            ) : null}
            {meta.temperature ? (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Temperatura Corporal:</span>
                <span className="font-bold text-slate-800">{String(meta.temperature)} °C</span>
              </div>
            ) : null}
          </div>
        );

      case 'DIAGNOSIS':
        return (
          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Diagnóstico Clínico:</span>
              <span className="font-bold text-slate-900">{node.label}</span>
            </div>
            {meta.code ? (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Código CIE Oficial:</span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {String(meta.code)}
                </span>
              </div>
            ) : null}
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Estado del diagnóstico:</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {node.status || 'Activo en expediente'}
              </span>
            </div>
          </div>
        );

      case 'LIFESTYLE_HABIT':
        return (
          <div className="space-y-2">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Hábito de salud:</span>
              <span className="font-bold text-slate-900">{String(meta.habitType || node.label)}</span>
            </div>
            {meta.value ? (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Registro documentado:</span>
                <span className="font-bold text-slate-800">{String(meta.value)} {String(meta.unit || '')}</span>
              </div>
            ) : null}
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 font-medium">Fecha de registro:</span>
              <span className="font-bold text-slate-800">{formatReadableDate(meta.loggedDate || node.provenance.timestamp)}</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-2 text-slate-700">
            <p className="font-semibold text-slate-900">{node.label}</p>
            {node.sublabel ? <p className="text-xs text-slate-500">{node.sublabel}</p> : null}
          </div>
        );
    }
  };

  return (
    <div className="w-full sm:w-96 bg-white/95 border-l border-slate-200 backdrop-blur-md flex flex-col h-full text-slate-800 select-none shadow-xl z-20 animate-in slide-in-from-right duration-200">
      {/* Encabezado del Panel */}
      <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/70">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
            {getNodeIcon(node.type)}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#1c5752] block">
              Detalle del Registro
            </span>
            <h3 className="text-sm font-black text-slate-900 tracking-tight truncate">
              {node.label}
            </h3>
            {node.sublabel ? (
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {node.sublabel}
              </p>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Contenido Clínico */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Parámetros del Registro */}
        <div className="space-y-2">
          <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#1c5752]" />
            Información Documentada
          </span>

          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs">
            {renderHumanizedDetails()}
          </div>
        </div>

        {/* Trazabilidad Oficial Simplificada */}
        <div className="space-y-2">
          <div className="bg-teal-50/70 rounded-2xl p-3.5 border border-teal-200/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#1c5752] font-black text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Registro Clínico Verificado</span>
            </div>
            <p className="text-[11px] text-teal-900/90 leading-relaxed font-medium">
              Información oficial almacenada y sincronizada en el expediente electrónico territorial de MedicOS.
            </p>
            <div className="pt-1.5 border-t border-teal-200/50 flex items-center justify-between text-[10.5px] text-teal-800 font-bold">
              <span>Fecha de registro:</span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3 text-[#1c5752]" />
                {formatReadableDate(node.provenance.timestamp)}
              </span>
            </div>
          </div>
        </div>

        {/* Conexiones Directas */}
        <div className="space-y-2">
          <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>Registros Relacionados ({connectedNodes.length})</span>
          </span>

          {connectedNodes.length === 0 ? (
            <p className="text-slate-400 italic text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              No cuenta con conexiones directas adicionales.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {connectedNodes.map((target) => (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => onSelectNode(target)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-teal-50/60 border border-slate-200 hover:border-teal-300 transition cursor-pointer flex items-center justify-between group shadow-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/60 shrink-0">
                      {getNodeIcon(target.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11.5px] font-bold text-slate-800 truncate group-hover:text-[#1c5752] transition-colors">
                        {target.label}
                      </p>
                      <span className="text-[9.5px] text-slate-400 block truncate">
                        {target.sublabel || target.type}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1c5752] group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pie del Panel */}
      <div className="p-3 border-t border-slate-100 text-[10px] text-slate-400 bg-slate-50 flex items-center justify-between">
        <span>Portal Paciente MedicOS</span>
        <span className="text-[#1c5752] font-bold">2026</span>
      </div>
    </div>
  );
};

export default ClinicalGraphNodeDetails;