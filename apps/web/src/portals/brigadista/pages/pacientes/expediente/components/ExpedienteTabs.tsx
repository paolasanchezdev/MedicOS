// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/pacientes/expediente/components/ExpedienteTabs.tsx
// DESCRIPCIÓN: Selector Segmentado estilo iOS/Admin con deduplicación garantizada de signos vitales.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { User, Stethoscope, HeartPulse, CreditCard } from 'lucide-react';
import type { PatientHistoryData, VitalSignsRecord } from '../../../../../../modules/patients';
import { ResumenPacienteTab } from './tabs/ResumenPacienteTab';
import { ConsultasPacienteTab } from './tabs/ConsultasPacienteTab';
import { SignosVitalesPacienteTab } from './tabs/SignosVitalesPacienteTab';
import { CarnetDigitalPacienteTab } from './tabs/CarnetDigitalPacienteTab';

interface ExpedienteTabsProps {
  historyData: PatientHistoryData;
}

type TabType = 'resumen' | 'consultas' | 'vitals' | 'carnet';

export const ExpedienteTabs: React.FC<ExpedienteTabsProps> = ({ historyData }) => {
  const [activeTab, setActiveTab] = useState<TabType>('resumen');

  const { consultations = [], standaloneVitalSigns = [] } = historyData;

  // Deduplicación estricta por ID único para evitar registros repetidos entre consultas y triajes
  const allVitals = useMemo(() => {
    const vitalsMap = new Map<string, VitalSignsRecord>();

    // 1. Agregar signos vitales independientes / de triaje
    standaloneVitalSigns.forEach((v) => {
      if (v?.id) vitalsMap.set(v.id, v);
    });

    // 2. Agregar signos vitales asociados a consultas (si no estaban ya registrados)
    consultations.forEach((c) => {
      if (Array.isArray(c.vitalSigns)) {
        c.vitalSigns.forEach((v) => {
          if (v?.id) vitalsMap.set(v.id, v);
        });
      } else if (c.vitalSigns && typeof c.vitalSigns === 'object' && 'id' in c.vitalSigns) {
        const v = c.vitalSigns as VitalSignsRecord;
        if (v.id) vitalsMap.set(v.id, v);
      }
    });

    // 3. Ordenar cronológicamente de más reciente a más antiguo
    return Array.from(vitalsMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [consultations, standaloneVitalSigns]);

  const tabs = [
    { id: 'resumen', label: 'Resumen General', icon: User, count: null },
    { id: 'consultas', label: 'Consultas Médicas', icon: Stethoscope, count: consultations.length },
    { id: 'vitals', label: 'Signos Vitales', icon: HeartPulse, count: allVitals.length },
    { id: 'carnet', label: 'Carnet Territorial Oficial', icon: CreditCard, count: null },
  ];

  return (
    <div className="space-y-4">
      {/* Selector Estilo iOS / Admin */}
      <div className="bg-slate-100/90 p-1 rounded-xl flex items-center border border-slate-200/60 text-xs font-medium">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#1B5250]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  className={`text-[10px] px-2 py-0.2 rounded-md border font-bold ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                      : 'bg-slate-200/80 text-slate-600 border-slate-300/60'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Contenido de la pestaña */}
      <div>
        {activeTab === 'resumen' && <ResumenPacienteTab historyData={historyData} />}
        {activeTab === 'consultas' && <ConsultasPacienteTab consultations={consultations} />}
        {activeTab === 'vitals' && <SignosVitalesPacienteTab vitalSigns={allVitals} />}
        {activeTab === 'carnet' && <CarnetDigitalPacienteTab historyData={historyData} />}
      </div>
    </div>
  );
};

export default ExpedienteTabs;