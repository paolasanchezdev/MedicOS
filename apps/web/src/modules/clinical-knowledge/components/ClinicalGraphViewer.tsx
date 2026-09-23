// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-knowledge/components/ClinicalGraphViewer.tsx
// DESCRIPCIÓN: Visor con física estable, red silenciosa y Vista de Historial
//              Clínico en Árbol elegante, intuitivo y 100% en español.
// =========================================================================

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  User,
  Stethoscope,
  Activity,
  AlertCircle,
  Pill,
  Heart,
  Baby,
  ShieldCheck,
  Building,
  Flame,
  ChevronRight,
  ChevronDown,
  Layers,
  Calendar,
} from 'lucide-react';
import type {
  ClinicalGraphNode,
  ClinicalGraphEdge,
  GraphViewMode,
  ClinicalNodeType,
} from '../types/clinical-graph.types.js';

import { ClinicalGraphToolbar } from './ClinicalGraphToolbar.js';
import { ClinicalGraphFilters } from './ClinicalGraphFilters.js';
import { ClinicalGraphLegend } from './ClinicalGraphLegend.js';
import { ClinicalGraphNodeDetails } from './ClinicalGraphNodeDetails.js';
import { ClinicalGraphEmpty } from './ClinicalGraphEmpty.js';

interface ClinicalGraphViewerProps {
  nodes: ClinicalGraphNode[];
  edges: ClinicalGraphEdge[];
  selectedNode: ClinicalGraphNode | null;
  connectedNodes: ClinicalGraphNode[];
  viewMode: GraphViewMode;
  searchQuery: string;
  activeCategory: string;
  loading: boolean;
  onSelectNode: (node: ClinicalGraphNode | null) => void;
  onViewModeChange: (mode: GraphViewMode) => void;
  onSearchChange: (q: string) => void;
  onCategoryChange: (cat: string) => void;
  onRefresh: () => void;
}

interface SimulatedNode extends ClinicalGraphNode {
  x: number;
  y: number;
}

const getNodeStyling = (type: ClinicalNodeType) => {
  switch (type) {
    case 'PATIENT':
      return { fill: '#1c5752', stroke: '#2B7A78', text: '#134e4a', icon: <User className="w-3.5 h-3.5 text-white" /> };
    case 'CONSULTATION':
      return { fill: '#115e59', stroke: '#14b8a6', text: '#0f766e', icon: <Stethoscope className="w-3.5 h-3.5 text-white" /> };
    case 'PRENATAL_CONTROL':
      return { fill: '#be185d', stroke: '#f472b6', text: '#9d174d', icon: <Baby className="w-3.5 h-3.5 text-white" /> };
    case 'VACCINATION':
      return { fill: '#047857', stroke: '#34d399', text: '#065f46', icon: <ShieldCheck className="w-3.5 h-3.5 text-white" /> };
    case 'DIAGNOSIS':
      return { fill: '#d97706', stroke: '#fbbf24', text: '#92400e', icon: <Activity className="w-3.5 h-3.5 text-white" /> };
    case 'ALLERGY':
      return { fill: '#e11d48', stroke: '#fb7185', text: '#9f1239', icon: <AlertCircle className="w-3.5 h-3.5 text-white" /> };
    case 'VITAL_SIGN':
      return { fill: '#4338ca', stroke: '#818cf8', text: '#3730a3', icon: <Heart className="w-3.5 h-3.5 text-white" /> };
    case 'MEDICATION':
    case 'PRESCRIPTION':
      return { fill: '#059669', stroke: '#6ee7b7', text: '#047857', icon: <Pill className="w-3.5 h-3.5 text-white" /> };
    case 'LIFESTYLE_HABIT':
      return { fill: '#ca8a04', stroke: '#fde047', text: '#854d0e', icon: <Flame className="w-3.5 h-3.5 text-white" /> };
    case 'BRIGADE':
      return { fill: '#0f766e', stroke: '#2dd4bf', text: '#115e59', icon: <Building className="w-3.5 h-3.5 text-white" /> };
    default:
      return { fill: '#475569', stroke: '#94a3b8', text: '#334155', icon: <Layers className="w-3.5 h-3.5 text-white" /> };
  }
};

export const ClinicalGraphViewer: React.FC<ClinicalGraphViewerProps> = ({
  nodes,
  edges,
  selectedNode,
  connectedNodes,
  viewMode,
  searchQuery,
  activeCategory,
  loading,
  onSelectNode,
  onViewModeChange,
  onSearchChange,
  onCategoryChange,
  onRefresh,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Cámara (Pan y Zoom)
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Posiciones de los nodos
  const [simNodes, setSimNodes] = useState<SimulatedNode[]>([]);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  // Ramas colapsadas para la Vista de Árbol
  const [collapsedBranches, setCollapsedBranches] = useState<Set<string>>(new Set());

  useEffect(() => {
    let animId: number;

    animId = requestAnimationFrame(() => {
      if (nodes.length === 0) {
        setSimNodes([]);
        return;
      }

      const width = containerRef.current?.clientWidth || 900;
      const height = containerRef.current?.clientHeight || 600;
      const centerX = width / 2;
      const centerY = height / 2;

      let current: SimulatedNode[] = nodes.map((node, i) => {
        if (node.type === 'PATIENT') {
          return { ...node, x: centerX, y: centerY };
        }
        const angle = (i / Math.max(1, nodes.length - 1)) * 2 * Math.PI;
        const dist = 140 + (i % 3) * 50;
        return {
          ...node,
          x: Math.max(70, Math.min(width - 70, centerX + Math.cos(angle) * dist)),
          y: Math.max(70, Math.min(height - 70, centerY + Math.sin(angle) * dist)),
        };
      });

      setSimNodes(current);

      if (viewMode !== 'network') return;

      let iterations = 0;
      const maxIterations = 50;

      const runStep = () => {
        if (iterations >= maxIterations) return;

        const next = current.map((n) => ({ ...n }));
        const nodeMap = new Map(next.map((n) => [n.id, n]));

        // Repulsión electrostática
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const n1 = next[i];
            const n2 = next[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.max(40, Math.sqrt(dx * dx + dy * dy));

            if (dist < 240) {
              const rawForce = ((240 - dist) / dist) * 0.25;
              const force = Math.min(5, rawForce);

              if (n1.type !== 'PATIENT') {
                n1.x -= (dx / dist) * force;
                n1.y -= (dy / dist) * force;
              }
              if (n2.type !== 'PATIENT') {
                n2.x += (dx / dist) * force;
                n2.y += (dy / dist) * force;
              }
            }
          }
        }

        // Atracción por aristas relacionales
        edges.forEach((edge) => {
          const source = nodeMap.get(edge.source);
          const target = nodeMap.get(edge.target);
          if (!source || !target) return;

          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dist = Math.max(15, Math.sqrt(dx * dx + dy * dy));
          const targetDist = 110;
          const rawForce = (dist - targetDist) * 0.035;
          const force = Math.min(5, Math.max(-5, rawForce));

          if (source.type !== 'PATIENT') {
            source.x += (dx / dist) * force;
            source.y += (dy / dist) * force;
          }
          if (target.type !== 'PATIENT') {
            target.x -= (dx / dist) * force;
            target.y -= (dy / dist) * force;
          }
        });

        // Paciente fijado en el centro
        next.forEach((n) => {
          if (n.type === 'PATIENT') {
            n.x = centerX;
            n.y = centerY;
          } else {
            n.x = Math.max(70, Math.min(width - 70, n.x));
            n.y = Math.max(70, Math.min(height - 70, n.y));
          }
        });

        current = next;
        setSimNodes(next);
        iterations++;
        animId = requestAnimationFrame(runStep);
      };

      animId = requestAnimationFrame(runStep);
    });

    return () => cancelAnimationFrame(animId);
  }, [nodes, edges, viewMode]);

  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (e.target !== containerRef.current && (e.target as HTMLElement).tagName !== 'svg') return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    } else if (draggedNodeId) {
      setSimNodes((prev) =>
        prev.map((n) => {
          if (n.id === draggedNodeId && n.type !== 'PATIENT') {
            const rect = containerRef.current?.getBoundingClientRect();
            const left = rect?.left || 0;
            const top = rect?.top || 0;
            return {
              ...n,
              x: (e.clientX - pan.x - left) / zoom,
              y: (e.clientY - pan.y - top) / zoom,
            };
          }
          return n;
        })
      );
    }
  };

  const handleMouseUpCanvas = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  const nodePositionsMap = useMemo(() => {
    return new Map(simNodes.map((n) => [n.id, { x: n.x, y: n.y }]));
  }, [simNodes]);

  const activeConnectedIds = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    const ids = new Set<string>([selectedNode.id]);
    edges.forEach((e) => {
      if (e.source === selectedNode.id) ids.add(e.target);
      if (e.target === selectedNode.id) ids.add(e.source);
    });
    return ids;
  }, [selectedNode, edges]);

  const toggleBranch = (key: string) => {
    setCollapsedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Clasificación para la vista de árbol
  const treeData = useMemo(() => {
    const patient = nodes.find((n) => n.type === 'PATIENT');
    const consultations = nodes.filter((n) => n.type === 'CONSULTATION');
    const prenatal = nodes.filter((n) => n.type === 'PRENATAL_CONTROL');
    const vaccines = nodes.filter((n) => n.type === 'VACCINATION');
    const vitals = nodes.filter((n) => n.type === 'VITAL_SIGN');
    const diagnoses = nodes.filter((n) => n.type === 'DIAGNOSIS');
    // Filtramos el hub agrupador y dejamos solo los hábitos individuales
    const habits = nodes.filter((n) => n.type === 'LIFESTYLE_HABIT' && !n.id.startsWith('habit-hub-'));

    return { patient, consultations, prenatal, vaccines, vitals, diagnoses, habits };
  }, [nodes]);

  return (
    <div className="relative w-full h-180 bg-[#f8fafc] rounded-3xl border border-slate-200/90 overflow-hidden select-none flex flex-col shadow-xs">
      
      {/* Barra de Filtros Superior */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto">
          <ClinicalGraphFilters
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
            totalNodes={nodes.length}
          />
        </div>

        <div className="pointer-events-auto self-end sm:self-auto">
          <ClinicalGraphToolbar
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            onZoomIn={() => setZoom((z) => Math.min(2.2, z + 0.2))}
            onZoomOut={() => setZoom((z) => Math.max(0.5, z - 0.2))}
            onResetView={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            onRefresh={onRefresh}
            isRefreshing={loading}
          />
        </div>
      </div>

      {/* ÁREA CENTRAL */}
      {viewMode === 'network' ? (
        // VISTA DE RED LIMPIA
        <div
          ref={containerRef}
          onMouseDown={handleMouseDownCanvas}
          onMouseMove={handleMouseMoveCanvas}
          onMouseUp={handleMouseUpCanvas}
          className="flex-1 w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-size-[20px_20px]"
        >
          {nodes.length === 0 ? (
            <ClinicalGraphEmpty
              hasFilters={searchQuery.trim() !== '' || activeCategory !== 'ALL'}
              onResetFilters={() => { onSearchChange(''); onCategoryChange('ALL'); }}
            />
          ) : (
            <svg className="w-full h-full">
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                
                {/* Aristas silenciosas */}
                {edges.map((edge) => {
                  const s = nodePositionsMap.get(edge.source);
                  const t = nodePositionsMap.get(edge.target);
                  if (!s || !t) return null;

                  const isHighlight =
                    selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id);

                  return (
                    <g key={edge.id}>
                      <line
                        x1={s.x}
                        y1={s.y}
                        x2={t.x}
                        y2={t.y}
                        stroke={isHighlight ? '#1c5752' : '#cbd5e1'}
                        strokeWidth={isHighlight ? 2.5 : 1.2}
                        strokeOpacity={isHighlight ? 1 : 0.6}
                      />
                      {isHighlight && (
                        <text
                          x={(s.x + t.x) / 2}
                          y={(s.y + t.y) / 2 - 4}
                          fill="#1c5752"
                          fontSize={9}
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          textAnchor="middle"
                          className="pointer-events-none"
                          style={{
                            paintOrder: 'stroke fill',
                            stroke: '#ffffff',
                            strokeWidth: '3px',
                          }}
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Nodos con halo protector anticolisión */}
                {simNodes.map((node) => {
                  const styling = getNodeStyling(node.type);
                  const isSelected = selectedNode?.id === node.id;
                  const isConnected = activeConnectedIds.has(node.id);
                  const isDimmed = selectedNode && !isConnected;
                  const isRoot = node.type === 'PATIENT';
                  const nodeRadius = isRoot ? 24 : 14;

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className="cursor-pointer transition-opacity duration-150"
                      opacity={isDimmed ? 0.25 : 1}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setDraggedNodeId(node.id);
                        onSelectNode(node);
                      }}
                    >
                      {isSelected && (
                        <circle
                          r={nodeRadius + 6}
                          fill="none"
                          stroke="#1c5752"
                          strokeWidth={2}
                          strokeDasharray="4 2"
                        />
                      )}

                      <circle
                        r={nodeRadius}
                        fill={styling.fill}
                        stroke={styling.stroke}
                        strokeWidth={isRoot ? 3 : 2}
                        className="transition-transform hover:scale-110 shadow-sm"
                      />

                      <text
                        y={nodeRadius + 14}
                        textAnchor="middle"
                        fill="#1e293b"
                        fontSize={isRoot ? 11.5 : 9.5}
                        fontWeight={isRoot ? 'bold' : '600'}
                        className="pointer-events-none font-sans"
                        style={{
                          paintOrder: 'stroke fill',
                          stroke: '#ffffff',
                          strokeWidth: '3px',
                          strokeLinejoin: 'round',
                        }}
                      >
                        {node.label.length > 24 ? `${node.label.slice(0, 22)}…` : node.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          )}
        </div>
      ) : (
        // VISTA DE HISTORIAL CLÍNICO EN ÁRBOL (REDISEÑADA Y ELEGANTE)
        <div className="flex-1 w-full h-full overflow-y-auto p-4 sm:p-8 pt-22 bg-[#f8fafc]">
          <div className="max-w-3xl mx-auto space-y-4">
            
            {/* Cabecera del Expediente */}
            <div
              onClick={() => treeData.patient && onSelectNode(treeData.patient)}
              className="p-5 rounded-2xl bg-white border border-teal-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#1c5752] transition bg-linear-to-r from-teal-50/50 to-white"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#1c5752] text-white flex items-center justify-center font-bold shadow-xs">
                  <User className="w-6 h-6 text-teal-100" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#1c5752] font-black block">
                    Expediente Clínico del Paciente
                  </span>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">{treeData.patient?.label}</h3>
                  <p className="text-xs text-slate-500 font-medium">{treeData.patient?.sublabel}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#1c5752] bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200/80">
                {nodes.length} registros
              </span>
            </div>

            {/* 1. Rama: Consultas Médicas */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleBranch('consultations')}
                className="w-full p-4 bg-slate-50/60 hover:bg-slate-100/60 flex items-center justify-between text-left transition cursor-pointer border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#1c5752] flex items-center justify-center border border-teal-200/60">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Consultas Médicas ({treeData.consultations.length})
                    </h4>
                    <p className="text-[11px] text-slate-500">Atenciones en salud y evolución clínica</p>
                  </div>
                </div>
                <div className="text-slate-400">
                  {collapsedBranches.has('consultations') ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-[#1c5752]" />}
                </div>
              </button>

              {!collapsedBranches.has('consultations') && (
                <div className="p-3 space-y-2">
                  {treeData.consultations.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onSelectNode(c)}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-[#1c5752] hover:bg-teal-50/30 transition cursor-pointer flex items-center justify-between shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 block">{c.label}</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#1c5752]" />
                          {c.sublabel}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Rama: Controles Prenatales y Obstétricos */}
            {treeData.prenatal.length > 0 && (
              <div className="bg-white rounded-2xl border border-pink-200/80 shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleBranch('prenatal')}
                  className="w-full p-4 bg-pink-50/40 hover:bg-pink-100/50 flex items-center justify-between text-left transition cursor-pointer border-b border-pink-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-pink-100/70 text-pink-700 flex items-center justify-center border border-pink-200">
                      <Baby className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-pink-900">
                        Controles Prenatales ({treeData.prenatal.length})
                      </h4>
                      <p className="text-[11px] text-pink-700/80">Seguimiento obstétrico y bienestar materno-fetal</p>
                    </div>
                  </div>
                  <div className="text-pink-400">
                    {collapsedBranches.has('prenatal') ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-pink-700" />}
                  </div>
                </button>

                {!collapsedBranches.has('prenatal') && (
                  <div className="p-3 space-y-2">
                    {treeData.prenatal.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => onSelectNode(p)}
                        className="p-3 rounded-xl border border-pink-200/80 bg-white hover:border-pink-500 hover:bg-pink-50/40 transition cursor-pointer flex items-center justify-between shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 block">{p.label}</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-pink-600" />
                            {p.sublabel}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-pink-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Rama: Vacunación */}
            {treeData.vaccines.length > 0 && (
              <div className="bg-white rounded-2xl border border-emerald-200/80 shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleBranch('vaccines')}
                  className="w-full p-4 bg-emerald-50/40 hover:bg-emerald-100/50 flex items-center justify-between text-left transition cursor-pointer border-b border-emerald-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center border border-emerald-200">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">
                        Inmunizaciones y Vacunas ({treeData.vaccines.length})
                      </h4>
                      <p className="text-[11px] text-emerald-700/80">Biológicos aplicados según esquema nacional</p>
                    </div>
                  </div>
                  <div className="text-emerald-400">
                    {collapsedBranches.has('vaccines') ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-emerald-700" />}
                  </div>
                </button>

                {!collapsedBranches.has('vaccines') && (
                  <div className="p-3 space-y-2">
                    {treeData.vaccines.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => onSelectNode(v)}
                        className="p-3 rounded-xl border border-emerald-200/80 bg-white hover:border-emerald-500 hover:bg-emerald-50/40 transition cursor-pointer flex items-center justify-between shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 block">{v.label}</span>
                          <span className="text-[11px] text-emerald-700 font-bold">Dosis aplicada en red</span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-500">{v.sublabel}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Rama: Signos Vitales */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleBranch('vitals')}
                className="w-full p-4 bg-slate-50/60 hover:bg-slate-100/60 flex items-center justify-between text-left transition cursor-pointer border-b border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200/70">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Signos Vitales y Constantes ({treeData.vitals.length})
                    </h4>
                    <p className="text-[11px] text-slate-500">Presión arterial, pulso y oxigenación</p>
                  </div>
                </div>
                <div className="text-slate-400">
                  {collapsedBranches.has('vitals') ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-[#1c5752]" />}
                </div>
              </button>

              {!collapsedBranches.has('vitals') && (
                <div className="p-3 space-y-2">
                  {treeData.vitals.map((v) => (
                    <div
                      key={v.id}
                      onClick={() => onSelectNode(v)}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/30 transition cursor-pointer flex items-center justify-between shadow-2xs"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-slate-900 block">{v.label}</span>
                        <span className="text-[11px] text-slate-500">{v.sublabel}</span>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200/70">
                        Registrado
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Rama: Hábitos de Salud y Autocuidado */}
            {treeData.habits.length > 0 && (
              <div className="bg-white rounded-2xl border border-amber-200/80 shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleBranch('habits')}
                  className="w-full p-4 bg-amber-50/40 hover:bg-amber-100/50 flex items-center justify-between text-left transition cursor-pointer border-b border-amber-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-800 flex items-center justify-center border border-amber-200">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
                        Hábitos de Salud y Autocuidado ({treeData.habits.length})
                      </h4>
                      <p className="text-[11px] text-amber-700/80">Registros de hidratación, descanso y bienestar</p>
                    </div>
                  </div>
                  <div className="text-amber-400">
                    {collapsedBranches.has('habits') ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-amber-700" />}
                  </div>
                </button>

                {!collapsedBranches.has('habits') && (
                  <div className="p-3 space-y-2">
                    {treeData.habits.map((h) => (
                      <div
                        key={h.id}
                        onClick={() => onSelectNode(h)}
                        className="p-3 rounded-xl border border-amber-200/70 bg-white hover:border-amber-400 hover:bg-amber-50/30 transition cursor-pointer flex items-center justify-between shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 block">{h.label}</span>
                          <span className="text-[11px] text-slate-500">{h.sublabel}</span>
                        </div>
                        <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                          Completado
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Leyenda visible exclusivamente en modo Red */}
      {viewMode === 'network' && (
        <div className="absolute bottom-4 left-4 z-10 pointer-events-auto hidden md:block">
          <ClinicalGraphLegend />
        </div>
      )}

      {/* Panel Lateral de Detalle del Nodo */}
      {selectedNode && (
        <div className="absolute top-0 right-0 bottom-0 z-20">
          <ClinicalGraphNodeDetails
            node={selectedNode}
            connectedNodes={connectedNodes}
            onSelectNode={onSelectNode}
            onClose={() => onSelectNode(null)}
          />
        </div>
      )}

    </div>
  );
};

export default ClinicalGraphViewer;