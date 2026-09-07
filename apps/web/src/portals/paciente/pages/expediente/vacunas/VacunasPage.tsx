// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/expediente/vacunas/VacunasPage.tsx
// DESCRIPCIÓN: Vista oficial "Pasaporte de Vacunación Digital" con 4 tarjetas
//              superiores de estatus, filtros, histórico por año y soporte offline.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../../../core/context/useAuth.js';
import {
  vaccinationsService,
  ESQUEMA_MINSAL_2026_CATALOG,
  useVaccinationRecord,
  type VaccinationRecord,
  DetalleVacunaModal,
  EsquemaMinsalModal,
} from '../../../../../modules/vaccinations/index.js';
import {
  VacunasHeader,
  VacunasStatusCards,
  VacunasFilters,
  type VacunaFilterCategory,
  VacunaCard,
} from './components/index.js';
import {
  RotateCcw,
  BookOpen,
  Info,
  Check,
  QrCode,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export const VacunasPage: React.FC = () => {
  const { user } = useAuth();
  const patientId = user?.id || '';

  // Hook oficial del módulo de vacunas
  const { records: remoteRecords, loading, error, refresh } = useVaccinationRecord(patientId);

  // Filtros y buscador
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<VacunaFilterCategory>('ALL');

  // Modales
  const [selectedRecord, setSelectedRecord] = useState<VaccinationRecord | null>(null);
  const [showMinsalModal, setShowMinsalModal] = useState<boolean>(false);
  const [showCartillaModal, setShowCartillaModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Consolidación de registros (remotos + cola local offline)
  const records = useMemo(() => {
    if (remoteRecords && remoteRecords.length > 0) {
      return remoteRecords;
    }

    const localPending = vaccinationsService.getPendingSyncVaccinations();
    return localPending.map((p): VaccinationRecord => ({
      id: p.id,
      patientId: p.payload.patientId,
      vaccineCode: p.payload.vaccineCode,
      vaccineName: p.payload.vaccineName,
      doseNumber: p.payload.doseNumber,
      totalDoses: p.payload.totalDoses,
      lotNumber: p.payload.lotNumber,
      expirationDate: p.payload.expirationDate,
      administrationRoute: p.payload.administrationRoute,
      anatomicalSite: p.payload.anatomicalSite,
      administeredAt: p.administeredAt,
      notes: p.payload.notes,
      adverseReactions: p.payload.adverseReactions,
      status: 'COMPLETED',
      syncStatus: 'PENDING',
      createdAt: p.administeredAt,
    }));
  }, [remoteRecords]);

  // Mapa de enfermedades diana desde el catálogo maestro oficial MINSAL 2026
  const targetDiseaseMap = useMemo(() => {
    const map = new Map<string, string>();
    ESQUEMA_MINSAL_2026_CATALOG.forEach((item) => {
      map.set(item.code, item.targetDisease);
    });
    return map;
  }, []);

  // Filtrado reactivo en memoria
  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();

    return records.filter((r) => {
      if (categoryFilter === 'COMPLETED' && r.doseNumber < r.totalDoses) return false;
      if (categoryFilter === 'NEXT' && r.doseNumber >= r.totalDoses) return false;

      if (q) {
        const disease = targetDiseaseMap.get(r.vaccineCode) || '';
        const matchesName = r.vaccineName.toLowerCase().includes(q);
        const matchesCode = r.vaccineCode.toLowerCase().includes(q);
        const matchesLot = r.lotNumber.toLowerCase().includes(q);
        const matchesDisease = disease.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesLot && !matchesDisease) return false;
      }

      return true;
    });
  }, [records, search, categoryFilter, targetDiseaseMap]);

  // Agrupación cronológica por año
  const groupedByYear = useMemo(() => {
    const map = new Map<number, VaccinationRecord[]>();

    filteredRecords.forEach((item) => {
      const year = new Date(item.administeredAt || item.createdAt).getFullYear() || 2026;
      if (!map.has(year)) {
        map.set(year, []);
      }
      map.get(year)!.push(item);
    });

    return Array.from(map.entries())
      .sort(([yearA], [yearB]) => yearB - yearA)
      .map(([year, items]) => ({
        year,
        items: items.sort(
          (a, b) =>
            new Date(b.administeredAt || b.createdAt).getTime() -
            new Date(a.administeredAt || a.createdAt).getTime()
        ),
      }));
  }, [filteredRecords]);

  // Total de dosis requeridas según catálogo nacional obligatorio MINSAL
  const targetRequiredDoses = useMemo(() => {
    return ESQUEMA_MINSAL_2026_CATALOG.filter((v) => v.isRequired).length;
  }, []);

  if (loading && records.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-pulse">
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="h-40 bg-slate-200 rounded-2xl" />
          <div className="h-40 bg-slate-200 rounded-2xl" />
          <div className="h-40 bg-slate-200 rounded-2xl" />
          <div className="h-40 bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-10 bg-slate-200 rounded-xl" />
        <div className="h-24 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  if (error && records.length === 0) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 max-w-md mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Error al cargar pasaporte</h3>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2B7A78] hover:bg-[#236866] text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reintentar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-5 space-y-4 max-w-[1700px] mx-auto animate-in fade-in duration-200">
      {/* 1. Cabecera Ejecutiva Pasaporte de Vacunación */}
      <VacunasHeader
        totalApplied={records.length}
        onOpenEsquemaMinsal={() => setShowMinsalModal(true)}
        onOpenCartillaQR={() => setShowCartillaModal(true)}
      />

      {/* 2. Grid de 4 Tarjetas de Estatus Inmunológico */}
      <VacunasStatusCards
        records={records}
        targetDosesCount={targetRequiredDoses}
        nextVaccineLabel="Influenza Estacional"
        nextVaccineDate="Campaña Anual 2026"
        selectedFilter={categoryFilter}
        onSelectFilter={(f) => setCategoryFilter(f as VacunaFilterCategory)}
        onOpenCartilla={() => setShowCartillaModal(true)}
      />

      {/* 3. Buscador y Filtros Segmentados */}
      <VacunasFilters
        search={search}
        onSearchChange={setSearch}
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
      />

      {/* 4. Lista Cronológica por Año con Tarjetas Clínicas Anchas */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center text-xs text-slate-500 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-[#2B7A78] flex items-center justify-center mx-auto shadow-2xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 text-sm">
              {search || categoryFilter !== 'ALL'
                ? 'No se encontraron vacunas con este filtro'
                : 'Sin registros de vacunación digitalizados'}
            </p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1">
              {search || categoryFilter !== 'ALL'
                ? 'Intenta restablecer los términos de búsqueda o cambiar de categoría.'
                : 'Presenta tu carnet en tu próxima brigada médica para certificar e integrar tus dosis previas.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowMinsalModal(true)}
              className="px-3.5 py-1.5 bg-[#2B7A78] text-white font-bold rounded-xl transition cursor-pointer text-xs"
            >
              Consultar Esquema MINSAL 2026
            </button>
            {(search || categoryFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('ALL');
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restablecer</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByYear.map(({ year, items }) => (
            <section key={year} className="space-y-2.5">
              <div className="flex items-center gap-3 px-1">
                <span className="text-xs font-black text-[#2B7A78] tabular-nums tracking-wide">
                  {year}
                </span>
                <div className="h-px bg-slate-200/80 flex-1" />
                <span className="text-[10.5px] font-semibold text-slate-400">
                  {items.length} dosis aplicada(s)
                </span>
              </div>

              <div className="space-y-2">
                {items.map((record) => (
                  <VacunaCard
                    key={record.id}
                    record={record}
                    targetDisease={targetDiseaseMap.get(record.vaccineCode)}
                    onViewDetail={setSelectedRecord}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* 5. Franja Inferior Informativa de Certificación Digital */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-100 text-[#2B7A78] flex items-center justify-center shrink-0 shadow-xs">
            <Info className="w-4 h-4" />
          </div>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            <strong className="text-slate-900 font-bold">Pasaporte Clínico Inalterable:</strong> Los biológicos
            registrados corresponden a las dosis certificadas en centros de salud y brigadas comunitarias. Para registrar
            una vacuna previa de tu cartilla física, preséntala ante tu médico tratante.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
          }}
          className="shrink-0 px-3.5 py-1.5 bg-slate-100 hover:bg-[#2B7A78] text-slate-700 hover:text-white font-bold text-xs rounded-xl border border-slate-200 hover:border-[#2B7A78] transition-all cursor-pointer shadow-xs select-none"
        >
          Validar cartilla física
        </button>
      </div>

      {/* Modales Clínicos Desacoplados Reexportados desde el Módulo de Vacunas */}
      <DetalleVacunaModal
        record={selectedRecord}
        targetDisease={selectedRecord ? targetDiseaseMap.get(selectedRecord.vaccineCode) : undefined}
        onClose={() => setSelectedRecord(null)}
      />

      <EsquemaMinsalModal
        isOpen={showMinsalModal}
        onClose={() => setShowMinsalModal(false)}
      />

      {/* Modal Rápido de Cartilla Digital QR */}
      {showCartillaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-sm p-6 text-center space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 text-[#2B7A78] flex items-center justify-center mx-auto shadow-sm">
              <QrCode className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">
                Cartilla Digital de Inmunización
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {user?.firstName} {user?.lastName} &bull; Expediente MedicOS
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 inline-block shadow-2xs">
              <div className="w-44 h-44 bg-white border border-slate-200 rounded-xl flex items-center justify-center mx-auto p-2">
                <div className="space-y-1 text-center">
                  <QrCode className="w-28 h-28 text-slate-800 mx-auto" />
                  <span className="text-[10px] font-mono font-bold text-slate-500 block">
                    MED-VAC-{patientId ? patientId.slice(0, 8).toUpperCase() : 'ONLINE'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Presenta este código en cualquier jornada médica comunitaria para lectura y actualización sin necesidad de internet.
            </p>

            <button
              type="button"
              onClick={() => setShowCartillaModal(false)}
              className="w-full py-2 bg-[#2B7A78] hover:bg-[#236866] text-white font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Cerrar cartilla
            </button>
          </div>
        </div>
      )}

      {/* Toast Flotante */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 stroke-3" />
          </div>
          <span>
            Solicitud iniciada. Presenta tu cartilla física en tu próxima brigada para validarla.
          </span>
        </div>
      )}
    </div>
  );
};

export default VacunasPage;