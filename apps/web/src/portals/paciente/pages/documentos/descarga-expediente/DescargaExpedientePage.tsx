// =========================================================================
// ARCHIVO: apps/web/src/portals/paciente/pages/documentos/descarga-expediente/DescargaExpedientePage.tsx
// DESCRIPCIÓN: Página principal de descarga con conteos desacoplados del filtro visual
//              y vinculación a datos reales de base de datos.
// =========================================================================

import React, { useState, useMemo } from 'react';
import { useClinicalGraph } from '../../../../../modules/clinical-knowledge/hooks/useClinicalGraph.js';
import { ClinicalGraphViewer } from '../../../../../modules/clinical-knowledge/components/ClinicalGraphViewer.js';

import {
  DescargaExpedienteHeader,
  ResumenExpedienteCard,
  EstadoExpedienteCard,
  InformacionRelevanteCard,
  FiltrosExpediente,
  SeccionesExpediente,
  ResumenIAExpedienteCard,
  OpcionesDescargaCard,
  GenerandoExpedienteModal,
  DescargaExpedienteLoading,
  DescargaExpedienteError,
  DescargaExpedienteEmpty,
  type SectionItemData,
} from './components/index.js';

import {
  User,
  Activity,
  AlertCircle,
  FileText,
  Pill,
  Stethoscope,
  Calendar,
  Heart,
  Microscope,
  Baby,
  ShieldCheck,
  Building,
  Flame,
} from 'lucide-react';

export const DescargaExpedientePage: React.FC = () => {
  const {
    loading,
    error,
    graph,
    nodes,
    edges,
    selectedNode,
    connectedNodes,
    viewMode,
    searchQuery,
    activeCategoryFilter,
    setSelectedNode,
    setViewMode,
    setSearchQuery,
    setActiveCategoryFilter,
    refetch,
  } = useClinicalGraph();

  const [showGraphView, setShowGraphView] = useState<boolean>(false);
  const [periodFilter, setPeriodFilter] = useState<'ALL' | '1Y' | '6M'>('ALL');
  const [sectionSearch, setSectionSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [excludedSectionIds, setExcludedSectionIds] = useState<Set<string>>(new Set());

  const now = new Date();
  const formattedSystemDate = now.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Los conteos oficiales del expediente leen de la totalidad de datos reales (graph.nodes)
  const masterNodes = useMemo(() => graph?.nodes || [], [graph]);
  const patientNode = useMemo(() => masterNodes.find((n) => n.type === 'PATIENT') || null, [masterNodes]);

  const allSections = useMemo<SectionItemData[]>(() => {
    return [
      {
        id: 'sec-id',
        title: 'Datos de Identificación y Filiación',
        count: patientNode ? 1 : 0,
        included: !excludedSectionIds.has('sec-id'),
        icon: <User className="w-4 h-4" />,
        description: 'Nombre completo, DUI, nacimiento, contacto y residencia.',
      },
      {
        id: 'sec-ant',
        title: 'Antecedentes Personales y Quirúrgicos',
        count: masterNodes.filter((n) => n.type === 'CLINICAL_RECORD').length,
        included: !excludedSectionIds.has('sec-ant'),
        icon: <Activity className="w-4 h-4" />,
        description: 'Cirugías, hospitalizaciones y antecedentes médicos documentados.',
      },
      {
        id: 'sec-fam',
        title: 'Antecedentes Heredofamiliares',
        count: masterNodes.filter((n) => n.type === 'CLINICAL_RECORD').length,
        included: !excludedSectionIds.has('sec-fam'),
        icon: <Heart className="w-4 h-4" />,
        description: 'Enfermedades y condiciones familiares registradas en expediente.',
      },
      {
        id: 'sec-alg',
        title: 'Alergias y Reacciones Adversas',
        count: masterNodes.filter((n) => n.type === 'ALLERGY').length,
        included: !excludedSectionIds.has('sec-alg'),
        icon: <AlertCircle className="w-4 h-4" />,
        description: 'Sustancias, severidad y alertas de hipersensibilidad.',
      },
      {
        id: 'sec-diag',
        title: 'Enfermedades y Diagnósticos CIE',
        count: masterNodes.filter((n) => n.type === 'DIAGNOSIS').length,
        included: !excludedSectionIds.has('sec-diag'),
        icon: <Activity className="w-4 h-4" />,
        description: 'Diagnósticos formales activos, históricos y resueltos.',
      },
      {
        id: 'sec-med',
        title: 'Farmacoterapia y Medicamentos',
        count: masterNodes.filter((n) => n.type === 'MEDICATION' || n.type === 'PRESCRIPTION').length,
        included: !excludedSectionIds.has('sec-med'),
        icon: <Pill className="w-4 h-4" />,
        description: 'Fármacos prescritos, posología, vías e indicaciones activas.',
      },
      {
        id: 'sec-cons',
        title: 'Historial de Consultas Médicas',
        count: masterNodes.filter((n) => n.type === 'CONSULTATION').length,
        included: !excludedSectionIds.has('sec-cons'),
        icon: <Stethoscope className="w-4 h-4" />,
        description: 'Encuentros médicos territoriales con evolución clínica SOAP.',
      },
      {
        id: 'sec-vit',
        title: 'Signos Vitales y Constantes',
        count: masterNodes.filter((n) => n.type === 'VITAL_SIGN').length,
        included: !excludedSectionIds.has('sec-vit'),
        icon: <Heart className="w-4 h-4" />,
        description: 'Curvas de presión arterial, frecuencia cardíaca, peso y SpO2.',
      },
      {
        id: 'sec-lab',
        title: 'Exámenes de Laboratorio',
        count: masterNodes.filter((n) => n.type === 'LAB_STUDY' || n.type === 'ANALYTE_RESULT').length,
        included: !excludedSectionIds.has('sec-lab'),
        icon: <Microscope className="w-4 h-4" />,
        description: 'Analitos cuantificados con rangos de referencia oficiales.',
      },
      {
        id: 'sec-img',
        title: 'Estudios de Imagen Médica',
        count: masterNodes.filter((n) => n.type === 'IMAGING_STUDY').length,
        included: !excludedSectionIds.has('sec-img'),
        icon: <FileText className="w-4 h-4" />,
        description: 'Radiografías, ultrasonidos y conclusiones diagnósticas.',
      },
      {
        id: 'sec-vac',
        title: 'Esquema de Vacunación',
        count: masterNodes.filter((n) => n.type === 'VACCINATION').length,
        included: !excludedSectionIds.has('sec-vac'),
        icon: <ShieldCheck className="w-4 h-4" />,
        description: 'Biológicos administrados y esquema nacional MINSAL.',
      },
      {
        id: 'sec-mat',
        title: 'Control Prenatal y Salud Materna',
        count: masterNodes.filter((n) => n.type === 'PRENATAL_CONTROL').length,
        included: !excludedSectionIds.has('sec-mat'),
        icon: <Baby className="w-4 h-4" />,
        description: 'Evolución obstétrica, semanas de gestación y seguimiento materno.',
      },
      {
        id: 'sec-hab',
        title: 'Hábitos de Salud y Autocuidado',
        count: masterNodes.filter((n) => n.type === 'LIFESTYLE_HABIT').length,
        included: !excludedSectionIds.has('sec-hab'),
        icon: <Flame className="w-4 h-4" />,
        description: 'Autorregistros de estilo de vida, nutrición e hidratación.',
      },
      {
        id: 'sec-brig',
        title: 'Atenciones en Brigada Territorial',
        count: masterNodes.filter((n) => n.type === 'BRIGADE').length,
        included: !excludedSectionIds.has('sec-brig'),
        icon: <Building className="w-4 h-4" />,
        description: 'Atenciones comunitarias en despliegues territoriales MedicOS.',
      },
      {
        id: 'sec-doc',
        title: 'Documentos y Constancias Oficiales',
        count: masterNodes.filter((n) => n.type === 'CERTIFICATE').length,
        included: !excludedSectionIds.has('sec-doc'),
        icon: <FileText className="w-4 h-4" />,
        description: 'Certificados emitidos con validación QR criptográfica.',
      },
      {
        id: 'sec-cita',
        title: 'Citas y Encuentros Médicos',
        count: masterNodes.filter((n) => n.type === 'CONSULTATION' || n.type === 'PRENATAL_CONTROL').length,
        included: !excludedSectionIds.has('sec-cita'),
        icon: <Calendar className="w-4 h-4" />,
        description: 'Programación de atenciones presenciales y telemedicina.',
      },
    ];
  }, [masterNodes, patientNode, excludedSectionIds]);

  const filteredSections = useMemo(() => {
    if (!sectionSearch.trim()) return allSections;
    const q = sectionSearch.toLowerCase();
    return allSections.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }, [allSections, sectionSearch]);

  const handleToggleSection = (id: string) => {
    setExcludedSectionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) return <DescargaExpedienteLoading />;
  if (error) return <DescargaExpedienteError message={error} onRetry={refetch} />;
  if (!graph || masterNodes.length === 0) return <DescargaExpedienteEmpty />;

  const selectedCount = allSections.filter((s) => s.included).length;

  return (
    <div className="w-full max-w-[1700px] mx-auto p-3 sm:p-5 space-y-5 select-none animate-in fade-in duration-200">
      
      {/* 1. Encabezado */}
      <DescargaExpedienteHeader lastUpdated={formattedSystemDate} />

      {/* 2. Resumen General */}
      <ResumenExpedienteCard
        patientNode={patientNode}
        lastConsultationDate={masterNodes.find((n) => n.type === 'CONSULTATION')?.sublabel}
        onOpenGraphView={() => setShowGraphView(!showGraphView)}
      />

      {/* 3. Mapa de Conocimiento Clínico */}
      {showGraphView && (
        <div className="space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Mapa de Conocimiento Clínico Relacional
            </span>
            <button
              type="button"
              onClick={() => setShowGraphView(false)}
              className="text-xs text-[#1c5752] hover:underline font-bold cursor-pointer"
            >
              Cerrar Mapa
            </button>
          </div>
          <ClinicalGraphViewer
            nodes={nodes}
            edges={edges}
            selectedNode={selectedNode}
            connectedNodes={connectedNodes}
            viewMode={viewMode}
            searchQuery={searchQuery}
            activeCategory={activeCategoryFilter}
            loading={loading}
            onSelectNode={setSelectedNode}
            onViewModeChange={setViewMode}
            onSearchChange={setSearchQuery}
            onCategoryChange={setActiveCategoryFilter}
            onRefresh={refetch}
          />
        </div>
      )}

      {/* 4. Estado del Expediente */}
      <EstadoExpedienteCard
        totalNodes={graph.nodeCount}
        totalEdges={graph.edgeCount}
        originDevice={patientNode?.provenance?.originDeviceId || 'SERVER_CENTRAL'}
      />

      {/* 5. Alertas Clínicas */}
      <InformacionRelevanteCard nodes={masterNodes} />

      {/* 6. Filtros */}
      <FiltrosExpediente
        periodFilter={periodFilter}
        onPeriodChange={setPeriodFilter}
        searchFilter={sectionSearch}
        onSearchChange={setSectionSearch}
      />

      {/* 7. Secciones */}
      <SeccionesExpediente
        sections={filteredSections}
        onToggleSection={handleToggleSection}
        onSelectAll={() => setExcludedSectionIds(new Set())}
        onDeselectAll={() => setExcludedSectionIds(new Set(allSections.map((s) => s.id)))}
      />

      {/* 8. Resumen Asistido por IA */}
      <ResumenIAExpedienteCard nodes={masterNodes} />

      {/* 9. Botón de Generación */}
      <OpcionesDescargaCard
        selectedCount={selectedCount}
        onGeneratePdf={() => setIsModalOpen(true)}
      />

      {/* 10. Hoja de Impresión Oficial del Expediente */}
      {isModalOpen && (
        <GenerandoExpedienteModal
          nodes={masterNodes}
          sections={allSections}
          generatedAt={formattedSystemDate}
          onClose={() => setIsModalOpen(false)}
        />
      )}

    </div>
  );
};

export default DescargaExpedientePage;