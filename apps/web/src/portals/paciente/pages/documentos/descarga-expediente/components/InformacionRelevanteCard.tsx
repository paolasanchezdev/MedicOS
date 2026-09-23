// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/descarga-expediente/components/InformacionRelevanteCard.tsx
// DESCRIPCIÓN: Bloque de alertas médicas inmediatas (Alergias, Fármacos,
//              Grupo Sanguíneo y Detección de Salud Materna / Embarazo).
// =========================================================================

import React, { useMemo } from 'react';
import { AlertTriangle, Pill, Activity, Baby, Heart } from 'lucide-react';
import type { ClinicalGraphNode } from '../../../../../../modules/clinical-knowledge/types/clinical-graph.types.js';

interface InformacionRelevanteCardProps {
  nodes: ClinicalGraphNode[];
}

export const InformacionRelevanteCard: React.FC<InformacionRelevanteCardProps> = ({ nodes }) => {
  // 1. Extraer Alergias reales
  const allergies = useMemo(() => {
    return nodes.filter((n) => n.type === 'ALLERGY').map((n) => n.label);
  }, [nodes]);
  
  // 2. Extraer Diagnósticos Activos
  const activeDiseases = useMemo(() => {
    return nodes
      .filter((n) => n.type === 'DIAGNOSIS' && n.status !== 'RESOLVED')
      .map((n) => n.label);
  }, [nodes]);

  // 3. Extraer Medicamentos Activos
  const activeMeds = useMemo(() => {
    return nodes
      .filter((n) => n.type === 'MEDICATION' || n.type === 'PRESCRIPTION')
      .map((n) => n.label);
  }, [nodes]);

  // 4. Extraer Grupo Sanguíneo (Búsqueda en ClinicalRecord y Patient)
  const bloodType = useMemo(() => {
    const recordNode = nodes.find((n) => n.type === 'CLINICAL_RECORD');
    const patientNode = nodes.find((n) => n.type === 'PATIENT');

    const raw =
      (typeof recordNode?.metadata?.bloodType === 'string' && recordNode.metadata.bloodType) ||
      (typeof patientNode?.metadata?.bloodType === 'string' && patientNode.metadata.bloodType) ||
      '';

    if (!raw || raw === 'UNKNOWN' || raw === 'No determinado') {
      return 'No determinado';
    }

    return raw.replace(/_/g, ' ');
  }, [nodes]);

  // 5. Extraer Estado Materno / Controles Prenatales
  const maternalStatus = useMemo(() => {
    const prenatalNodes = nodes.filter((n) => n.type === 'PRENATAL_CONTROL');
    if (prenatalNodes.length > 0) {
      // Priorizar el control más reciente
      const latest = prenatalNodes[0];
      return latest.label || `Control Gestacional Activo (${prenatalNodes.length})`;
    }

    const fallbackMaternal = nodes.find((n) => {
      const text = `${n.label} ${n.sublabel || ''}`.toLowerCase();
      return (
        text.includes('gest') ||
        text.includes('embarazo') ||
        text.includes('prenatal') ||
        text.includes('trimestre') ||
        text.includes('fetal')
      );
    });

    return fallbackMaternal ? fallbackMaternal.label : 'No registrada';
  }, [nodes]);

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200/90 p-5 shadow-xs select-none space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            Información Clínica Relevante
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Alertas Activas del Expediente
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        
        {/* Alergias */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-rose-700 text-xs font-black">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Alergias</span>
          </div>
          {allergies.length > 0 ? (
            <div className="space-y-0.5">
              {allergies.map((a, i) => (
                <span key={i} className="block text-xs font-bold text-rose-900">
                  {a}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium italic">No registradas</p>
          )}
        </div>

        {/* Enfermedades Activas */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-800 text-xs font-black">
            <Activity className="w-3.5 h-3.5" />
            <span>Enfermedades activas</span>
          </div>
          {activeDiseases.length > 0 ? (
            <div className="space-y-0.5">
              {activeDiseases.slice(0, 2).map((d, i) => (
                <span key={i} className="block text-xs font-bold text-amber-950 truncate">
                  {d}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium italic">Sin patologías activas</p>
          )}
        </div>

        {/* Medicamentos Activos */}
        <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-[#2B7A78] text-xs font-black">
            <Pill className="w-3.5 h-3.5" />
            <span>Medicamentos activos</span>
          </div>
          {activeMeds.length > 0 ? (
            <div className="space-y-0.5">
              {activeMeds.slice(0, 2).map((m, i) => (
                <span key={i} className="block text-xs font-bold text-teal-950 truncate">
                  {m}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium italic">Sin fármacos prescritos</p>
          )}
        </div>

        {/* Grupo Sanguíneo */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700 text-xs font-black">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Grupo sanguíneo</span>
          </div>
          <p className="text-sm font-black font-mono text-slate-900 mt-0.5">
            {bloodType}
          </p>
        </div>

        {/* Estado Gestacional */}
        <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-sky-800 text-xs font-black">
            <Baby className="w-3.5 h-3.5" />
            <span>Embarazo / Materno</span>
          </div>
          <p className="text-xs font-bold text-sky-950 leading-tight">
            {maternalStatus}
          </p>
        </div>

      </div>
    </div>
  );
};

export default InformacionRelevanteCard;