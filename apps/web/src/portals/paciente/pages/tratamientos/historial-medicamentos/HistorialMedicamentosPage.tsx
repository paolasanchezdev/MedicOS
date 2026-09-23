// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/tratamientos/historial-medicamentos/HistorialMedicamentosPage.tsx
// DESCRIPCIÓN: Vista orquestadora de Historial de Medicamentos con tarjetas KPI.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  useMedicationHistory,
  type MedicationHistoryItem,
  DetalleMedicamentoModal,
} from '../../../../../modules/medications/index.js';
import {
  HistorialMedicamentosHeader,
  HistorialMedicamentosStatusCards,
  HistorialMedicamentosFilters,
  MedicamentoHistorialCard,
  HistorialMedicamentosEmpty,
  HistorialMedicamentosLoading,
  HistorialMedicamentosError,
} from './components/index.js';

export const HistorialMedicamentosPage: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [status, setStatus] = useState<string>('ALL');
  const [sort, setSort] = useState<'recent' | 'oldest' | 'az'>('recent');

  const { medications, loading, error, refetch } = useMedicationHistory({
    search,
    status,
    sort,
  });

  const [selectedMedication, setSelectedMedication] = useState<MedicationHistoryItem | null>(null);

  // Agrupación cronológica por Mes y Año
  const groupedByMonth = useMemo(() => {
    const map = new Map<string, MedicationHistoryItem[]>();

    medications.forEach((med) => {
      const d = new Date(med.startDate);
      const key = d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(med);
    });

    return Array.from(map.entries()).map(([label, items]) => ({
      label,
      items,
    }));
  }, [medications]);

  if (loading && medications.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 max-w-[1700px] mx-auto">
        <HistorialMedicamentosLoading />
      </div>
    );
  }

  if (error && medications.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-md mx-auto">
        <HistorialMedicamentosError message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Cabecera Verde Institucional */}
      <HistorialMedicamentosHeader totalCount={medications.length} />

      {/* 2. Grid de 4 Tarjetas de Resumen Clínico */}
      <HistorialMedicamentosStatusCards
        medications={medications}
        onSelectStatus={setStatus}
      />

      {/* 3. Barra Compacta de Filtros */}
      <HistorialMedicamentosFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
      />

      {/* 4. Listado o Estado Vacío */}
      {medications.length === 0 ? (
        <HistorialMedicamentosEmpty />
      ) : (
        <div className="space-y-4">
          {groupedByMonth.map(({ label, items }) => (
            <section key={label} className="space-y-2.5">
              <div className="flex items-center gap-3 px-1 select-none">
                <span className="text-xs font-black text-medicos-teal tracking-wide">
                  {label}
                </span>
                <div className="h-px bg-slate-200/80 flex-1" />
                <span className="text-[10.5px] font-semibold text-slate-400">
                  {items.length} fármaco(s)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {items.map((med) => (
                  <MedicamentoHistorialCard
                    key={med.id}
                    medication={med}
                    onViewDetails={setSelectedMedication}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Modal Clínico Desacoplado */}
      <DetalleMedicamentoModal
        medication={selectedMedication}
        onClose={() => setSelectedMedication(null)}
      />
    </div>
  );
};

export default HistorialMedicamentosPage;