// =========================================================================
// ARCHIVO: apps/web/src/modules/clinical-knowledge/hooks/useClinicalGraph.ts
// DESCRIPCIÓN: Hook para orquestar la carga de datos reales, filtrado de nodos,
//              selección de entidades y conmutación entre Vista Red y Vista Árbol.
// =========================================================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { clinicalKnowledgeService } from '../services/clinical-knowledge.service.js';
import type {
  ClinicalGraphResponse,
  ClinicalGraphNode,
  ClinicalGraphEdge,
  GraphViewMode,
} from '../types/clinical-graph.types.js';

interface UseClinicalGraphOptions {
  patientId?: string; // Si se omite, consulta el grafo propio del paciente autenticado
  autoFetch?: boolean;
}

export const useClinicalGraph = (options: UseClinicalGraphOptions = {}) => {
  const { patientId, autoFetch = true } = options;

  const [loading, setLoading] = useState<boolean>(Boolean(autoFetch));
  const [error, setError] = useState<string | null>(null);
  const [rawGraph, setRawGraph] = useState<ClinicalGraphResponse | null>(null);

  // Estados visuales y de interacción
  const [viewMode, setViewMode] = useState<GraphViewMode>('network');
  const [selectedNode, setSelectedNode] = useState<ClinicalGraphNode | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  useEffect(() => {
    if (!autoFetch) return;

    let isMounted = true;

    const executeFetch = async () => {
      try {
        const data = patientId
          ? await clinicalKnowledgeService.getPatientGraph(patientId)
          : await clinicalKnowledgeService.getMyGraph();

        if (isMounted) {
          setRawGraph(data);
          setError(null);

          const rootPatient = data.nodes.find((n) => n.type === 'PATIENT');
          if (rootPatient) {
            setSelectedNode(rootPatient);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Error al conectar con la base de datos de conocimiento.';
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void executeFetch();

    return () => {
      isMounted = false;
    };
  }, [autoFetch, patientId]);

  // Recarga manual disparada por interacción del usuario
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = patientId
        ? await clinicalKnowledgeService.getPatientGraph(patientId)
        : await clinicalKnowledgeService.getMyGraph();

      setRawGraph(data);

      const rootPatient = data.nodes.find((n) => n.type === 'PATIENT');
      if (rootPatient) {
        setSelectedNode(rootPatient);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al conectar con la base de datos de conocimiento.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  // Filtrado reactivo de nodos según búsqueda y categoría
  const filteredNodes = useMemo<ClinicalGraphNode[]>(() => {
    if (!rawGraph) return [];

    return rawGraph.nodes.filter((node) => {
      // 1. Filtro por categoría
      if (activeCategoryFilter !== 'ALL' && node.category !== activeCategoryFilter) {
        // Preservar el nodo raíz del paciente para mantener el centro del grafo
        if (node.type !== 'PATIENT') return false;
      }

      // 2. Filtro por término de búsqueda
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesLabel = node.label.toLowerCase().includes(q);
        const matchesSublabel = node.sublabel?.toLowerCase().includes(q) ?? false;
        const matchesType = node.type.toLowerCase().includes(q);
        if (!matchesLabel && !matchesSublabel && !matchesType && node.type !== 'PATIENT') {
          return false;
        }
      }

      return true;
    });
  }, [rawGraph, activeCategoryFilter, searchQuery]);

  // Filtrado de aristas para conectar únicamente nodos activos
  const filteredEdges = useMemo<ClinicalGraphEdge[]>(() => {
    if (!rawGraph) return [];
    const validIds = new Set(filteredNodes.map((n) => n.id));

    return rawGraph.edges.filter((edge) => validIds.has(edge.source) && validIds.has(edge.target));
  }, [rawGraph, filteredNodes]);

  // Nodos adyacentes al nodo actualmente seleccionado
  const connectedNodes = useMemo<ClinicalGraphNode[]>(() => {
    if (!selectedNode || !rawGraph) return [];

    const connectedIds = new Set<string>();
    rawGraph.edges.forEach((edge) => {
      if (edge.source === selectedNode.id) connectedIds.add(edge.target);
      if (edge.target === selectedNode.id) connectedIds.add(edge.source);
    });

    return rawGraph.nodes.filter((n) => connectedIds.has(n.id));
  }, [selectedNode, rawGraph]);

  return {
    loading,
    error,
    graph: rawGraph,
    nodes: filteredNodes,
    edges: filteredEdges,
    totalNodesCount: rawGraph?.nodeCount || 0,
    totalEdgesCount: rawGraph?.edgeCount || 0,
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
  };
};