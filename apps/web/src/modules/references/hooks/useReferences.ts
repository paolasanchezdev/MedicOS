// =========================================================================
// ARCHIVO: apps/web/src/modules/references/hooks/useReferences.ts
// DESCRIPCIÓN: Hook de dominio para gestión operativa de Referencias F-01.
//              Conecta con referencesService, padrón, establecimientos y outbox.
//              Tipado 100% estricto sin errores de tipos en PatientRecord.
// =========================================================================

import { useState, useCallback, useEffect } from 'react';
import { referencesService } from '../services/references.service';
import { patientsService } from '../../patients/services/patients.service';
import { atencionService } from '../../atencion/services/atencion.service';
import { establishmentsService } from '../../establishments/services/establishments.service';
import type {
  CommunityReferenceRecord,
  CreateCommunityReferenceDTO,
  UpdateReferenceStatusDTO,
  ReferenceFilters,
  ReferenciasMetricas,
  ReferencePriority,
} from '../types/reference.types';
import type { PatientRecord } from '../../patients/types/patient.types';
import type { Establishment } from '../../establishments/types/establishment.types';

const STORAGE_KEY_REFERENCIAS_LOCALES = 'medicos_referencias_red_territorio';
const STORAGE_KEY_OUTBOX = 'medicos_brigadista_pending_sync_attentions';

function calcularEdadTexto(fechaNac?: string | Date | null): string {
  if (!fechaNac) return 'Edad no reg.';
  const nac = new Date(fechaNac);
  if (isNaN(nac.getTime())) return 'Edad no reg.';
  const hoy = new Date();
  let anios = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) anios--;
  return `${anios} años`;
}

function obtenerGeneroPaciente(pac?: PatientRecord): string | undefined {
  if (!pac) return undefined;
  const p = pac as unknown as { gender?: string; sex?: string };
  return p.gender || p.sex || undefined;
}

export function useReferences(initialFilters?: ReferenceFilters, autoFetch = true) {
  const [references, setReferences] = useState<CommunityReferenceRecord[]>([]);
  const [pacientesPadron, setPacientesPadron] = useState<PatientRecord[]>([]);
  const [establecimientos, setEstablecimientos] = useState<Establishment[]>([]);
  const [metricas, setMetricas] = useState<ReferenciasMetricas>({
    pendientes: 0,
    enviadas: 0,
    enSeguimiento: 0,
    completadas: 0,
    urgentes: 0,
  });
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  // Filtros de UI
  const [filtroTexto, setFiltroTexto] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('TODOS');
  const [filtroDestino, setFiltroDestino] = useState<string>('TODOS');

  const fetchReferences = useCallback(async (customFilters?: ReferenceFilters) => {
    setLoading(true);
    setError(null);
    try {
      const [refsApiRes, patientsRes, estabRes, historyAtnRes, pendingAtnRes] = await Promise.allSettled([
        referencesService.getReferences(customFilters || initialFilters),
        patientsService.getAllPatients(),
        establishmentsService.getHospitals(),
        atencionService.getAttentionHistory({ limit: 100 }),
        atencionService.getPendingAttentions(),
      ]);

      const listaPac = patientsRes.status === 'fulfilled' ? patientsRes.value || [] : [];
      setPacientesPadron(listaPac);

      const listaEstab = estabRes.status === 'fulfilled' ? estabRes.value || [] : [];
      setEstablecimientos(listaEstab);

      const mapaReferencias = new Map<string, CommunityReferenceRecord>();

      // 1. Incorporar referencias existentes del backend
      if (refsApiRes.status === 'fulfilled' && Array.isArray(refsApiRes.value)) {
        refsApiRes.value.forEach((r) => {
          const pac = listaPac.find((p) => p.id === r.patientId);
          const est = listaEstab.find((e) => e.id === r.establishmentId);

          mapaReferencias.set(r.id, {
            ...r,
            folioF01: r.folioF01 || `F01-${r.id.slice(0, 6).toUpperCase()}`,
            patientName: r.patientName || (pac ? `${pac.firstName} ${pac.lastName}`.trim() : 'Persona no identificada'),
            patientDui: r.patientDui || pac?.dui || 'Sin DUI',
            patientAge: calcularEdadTexto(pac?.dateOfBirth),
            patientGender: obtenerGeneroPaciente(pac),
            patientCommunity: pac?.address || undefined,
            establishmentName: est?.name || r.establishmentName || 'Establecimiento de Salud',
            establishmentLevel: est?.level || r.establishmentLevel || 'Básico',
            establishmentType: est?.type || r.establishmentType,
            establishmentDepartment: est?.department || r.establishmentDepartment,
            establishmentMunicipality: est?.municipality || r.establishmentMunicipality,
            establishmentPhone: est?.phone || est?.emergencyPhone || r.establishmentPhone || undefined,
            categoria: r.categoria || 'VALORACION_MEDICA',
            medioTraslado: r.medioTraslado || 'PROPIO',
          });
        });
      }

      // 2. Consolidar atenciones reales que requirieron referencia F-01
      const atencionesCombinadas: Array<Record<string, unknown>> = [
        ...(historyAtnRes.status === 'fulfilled'
          ? (historyAtnRes.value.items as unknown as Array<Record<string, unknown>>) || []
          : []),
        ...(pendingAtnRes.status === 'fulfilled'
          ? (pendingAtnRes.value as unknown as Array<Record<string, unknown>>) || []
          : []),
      ];

      try {
        const rawOutbox = localStorage.getItem(STORAGE_KEY_OUTBOX);
        if (rawOutbox) {
          const parsed = JSON.parse(rawOutbox);
          if (Array.isArray(parsed)) {
            parsed.forEach((it: Record<string, unknown>) => {
              if (!atencionesCombinadas.some((a) => a['id'] === it['id'])) {
                atencionesCombinadas.push(it);
              }
            });
          }
        }
      } catch (err) {
        console.warn('[Referencias] Error leyendo outbox:', err);
      }

      atencionesCombinadas.forEach((atn) => {
        const draftForm = atn['draftFormData'] as Record<string, unknown> | undefined;
        const seg = (draftForm?.['seguimiento'] || atn['seguimiento'] || {}) as Record<string, unknown>;
        const desenlace = String(seg['desenlace'] || atn['desenlace'] || '').toUpperCase();
        const requiereRef = Boolean(seg['requiereReferencia'] || atn['requiereReferencia'] || desenlace.includes('REFERENCIA'));

        if (requiereRef) {
          const patientObj = (atn['patient'] || draftForm?.['patient'] || {}) as Record<string, unknown>;
          const patientId = String(patientObj['id'] || atn['patientId'] || '');
          const pac = listaPac.find(
            (p) =>
              (patientId && p.id === patientId) ||
              (p.dui && patientObj['dui'] && p.dui.replace(/\D/g, '') === String(patientObj['dui']).replace(/\D/g, ''))
          );

          const refId = `ref-atn-${atn['id'] || patientId}`;
          if (!mapaReferencias.has(refId)) {
            const estabDestinoId = String(seg['establecimientoReferenciaId'] || seg['establishmentId'] || atn['establishmentId'] || '');
            const est = listaEstab.find((e) => e.id === estabDestinoId) || listaEstab[0];

            const nombre = String(
              patientObj['fullName'] ||
              (pac ? `${pac.firstName} ${pac.lastName}`.trim() : '') ||
              'Paciente en Terreno'
            );

            const vitals = draftForm?.['signosVitales'] as Record<string, unknown> | undefined;
            const sv: Record<string, string> = {};
            if (vitals) {
              if (vitals['presionArterial']) sv['presionArterial'] = String(vitals['presionArterial']);
              if (vitals['frecuenciaCardiaca']) sv['frecuenciaCardiaca'] = String(vitals['frecuenciaCardiaca']);
              if (vitals['temperatura']) sv['temperatura'] = String(vitals['temperatura']);
              if (vitals['saturacionOxigeno']) sv['saturacionOxigeno'] = String(vitals['saturacionOxigeno']);
              if (vitals['frecuenciaRespiratoria']) sv['frecuenciaRespiratoria'] = String(vitals['frecuenciaRespiratoria']);
            }

            const priorityRaw = String(seg['prioridadReferencia'] || atn['priority'] || 'MEDIUM').toUpperCase();
            const priority: ReferencePriority =
              priorityRaw === 'HIGH' || priorityRaw === 'URGENT' ? (priorityRaw as ReferencePriority) : 'MEDIUM';

            const fechaIso = String(atn['startedAt'] || atn['createdAt'] || new Date().toISOString());

            mapaReferencias.set(refId, {
              id: refId,
              folioF01: `F01-${String(atn['id'] || '2026').slice(-4).toUpperCase()}`,
              patientId: patientId || pac?.id || 'pac-sin-id',
              patientName: nombre,
              patientDui: String(patientObj['dui'] || pac?.dui || 'Sin DUI'),
              patientAge: calcularEdadTexto(pac?.dateOfBirth),
              patientGender: obtenerGeneroPaciente(pac),
              patientCommunity: String(patientObj['community'] || pac?.address || ''),
              establishmentId: est?.id || 'est-red-01',
              establishmentName: est?.name || 'Unidad de Salud / Hospital de la Red',
              establishmentLevel: est?.level || 'Básico',
              establishmentType: est?.type || 'HEALTH_CENTER',
              establishmentDepartment: est?.department || 'La Paz',
              establishmentMunicipality: est?.municipality || 'San Miguel Tepezontes',
              establishmentPhone: est?.phone || est?.emergencyPhone || undefined,
              brigadistaId: String(atn['doctorId'] || ''),
              brigadistaName: String(atn['doctorName'] || atn['brigadistName'] || 'Carlos Pérez'),
              categoria: 'VALORACION_MEDICA',
              reason: String(seg['motivoReferencia'] || atn['chiefComplaintSummary'] || 'Valoración médica en segundo nivel'),
              situacionEncontrada: String(draftForm?.['motivoDescripcion'] || 'Paciente evaluado durante jornada comunitaria que requiere atención en red.'),
              clinicalSummary: String(draftForm?.['observacionesSOAP'] || 'Evaluación territorial en brigada de campo.'),
              signosVitales: Object.keys(sv).length > 0 ? sv : undefined,
              priority,
              status: 'PENDING',
              medioTraslado: 'PROPIO',
              referredAt: fechaIso,
              origenModulo: 'ATENCION',
              createdAt: fechaIso,
              updatedAt: fechaIso,
            });
          }
        }
      });

      // 3. Sincronizar referencias locales guardadas en el navegador
      try {
        const rawLocales = localStorage.getItem(STORAGE_KEY_REFERENCIAS_LOCALES);
        if (rawLocales) {
          const parsed: CommunityReferenceRecord[] = JSON.parse(rawLocales);
          if (Array.isArray(parsed)) {
            parsed.forEach((loc) => {
              if (mapaReferencias.has(loc.id)) {
                mapaReferencias.set(loc.id, { ...mapaReferencias.get(loc.id)!, ...loc });
              } else {
                mapaReferencias.set(loc.id, loc);
              }
            });
          }
        }
      } catch (err) {
        console.warn('[Referencias] Error leyendo almacenamiento local:', err);
      }

      const listaFinal = Array.from(mapaReferencias.values());

      // 4. Calcular métricas operativas
      let cPendientes = 0;
      let cEnviadas = 0;
      let cEnSeguimiento = 0;
      let cCompletadas = 0;
      let cUrgentes = 0;

      listaFinal.forEach((r) => {
        if (r.status === 'PENDING') cPendientes++;
        else if (r.status === 'SENT') cEnviadas++;
        else if (r.status === 'IN_FOLLOW_UP') cEnSeguimiento++;
        else if (r.status === 'ATTENDED') cCompletadas++;

        if (r.priority === 'HIGH' || r.priority === 'URGENT') {
          cUrgentes++;
        }
      });

      setReferences(listaFinal);
      setMetricas({
        pendientes: cPendientes,
        enviadas: cEnviadas,
        enSeguimiento: cEnSeguimiento,
        completadas: cCompletadas,
        urgentes: cUrgentes,
      });
    } catch (err) {
      setError((err as Error).message || 'No fue posible cargar las referencias a la red.');
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  useEffect(() => {
    if (!autoFetch) return;
    let isSubscribed = true;
    const init = async () => {
      await Promise.resolve();
      if (!isSubscribed) return;
      await fetchReferences();
    };
    void init();
    return () => {
      isSubscribed = false;
    };
  }, [autoFetch, fetchReferences]);

  const createReference = async (
    dto: CreateCommunityReferenceDTO,
    contexto?: { brigadistaId?: string; brigadistaName?: string }
  ): Promise<CommunityReferenceRecord> => {
    setLoading(true);
    setError(null);
    try {
      const pac = pacientesPadron.find((p) => p.id === dto.patientId);
      const est = establecimientos.find((e) => e.id === dto.establishmentId);
      const ahoraIso = new Date().toISOString();

      let nuevaRef: CommunityReferenceRecord;

      try {
        const apiRes = await referencesService.createReference(dto);
        nuevaRef = {
          ...apiRes,
          folioF01: `F01-${apiRes.id.slice(0, 6).toUpperCase()}`,
          patientName: pac ? `${pac.firstName} ${pac.lastName}`.trim() : apiRes.patientName,
          patientDui: pac?.dui || apiRes.patientDui,
          patientAge: calcularEdadTexto(pac?.dateOfBirth),
          patientGender: obtenerGeneroPaciente(pac),
          patientCommunity: pac?.address || undefined,
          establishmentName: est?.name || apiRes.establishmentName,
          establishmentLevel: est?.level || apiRes.establishmentLevel,
          establishmentType: est?.type,
          establishmentDepartment: est?.department,
          establishmentMunicipality: est?.municipality,
          establishmentPhone: est?.phone || est?.emergencyPhone || undefined,
          categoria: dto.categoria || 'VALORACION_MEDICA',
          situacionEncontrada: dto.situacionEncontrada,
          signosVitales: dto.signosVitales,
          antecedentesRelevantes: dto.antecedentesRelevantes,
          medioTraslado: dto.medioTraslado || 'PROPIO',
          acompananteNombre: dto.acompananteNombre,
          acompananteParentesco: dto.acompananteParentesco,
          acompananteTelefono: dto.acompananteTelefono,
        };
      } catch {
        const idLocal = `ref-${Date.now()}`;
        nuevaRef = {
          id: idLocal,
          folioF01: `F01-${idLocal.slice(-6).toUpperCase()}`,
          patientId: dto.patientId,
          patientName: pac ? `${pac.firstName} ${pac.lastName}`.trim() : 'Persona no identificada',
          patientDui: pac?.dui || 'Sin DUI',
          patientAge: calcularEdadTexto(pac?.dateOfBirth),
          patientGender: obtenerGeneroPaciente(pac),
          patientCommunity: pac?.address || undefined,
          establishmentId: dto.establishmentId,
          establishmentName: est?.name || 'Establecimiento de Referencia',
          establishmentLevel: est?.level || 'Básico',
          establishmentType: est?.type,
          establishmentDepartment: est?.department,
          establishmentMunicipality: est?.municipality,
          establishmentPhone: est?.phone || est?.emergencyPhone || undefined,
          brigadistaId: contexto?.brigadistaId || '',
          brigadistaName: contexto?.brigadistaName || 'Carlos Pérez',
          categoria: dto.categoria || 'VALORACION_MEDICA',
          reason: dto.reason.trim(),
          situacionEncontrada: dto.situacionEncontrada?.trim(),
          clinicalSummary: dto.clinicalSummary.trim(),
          signosVitales: dto.signosVitales,
          antecedentesRelevantes: dto.antecedentesRelevantes,
          priority: dto.priority,
          status: 'PENDING',
          medioTraslado: dto.medioTraslado || 'PROPIO',
          acompananteNombre: dto.acompananteNombre?.trim(),
          acompananteParentesco: dto.acompananteParentesco?.trim(),
          acompananteTelefono: dto.acompananteTelefono?.trim(),
          notes: dto.notes?.trim() || null,
          referredAt: ahoraIso,
          origenModulo: 'MANUAL',
          createdAt: ahoraIso,
          updatedAt: ahoraIso,
        };
      }

      const raw = localStorage.getItem(STORAGE_KEY_REFERENCIAS_LOCALES);
      const lista: CommunityReferenceRecord[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(STORAGE_KEY_REFERENCIAS_LOCALES, JSON.stringify([nuevaRef, ...lista]));

      await fetchReferences();
      return nuevaRef;
    } catch (err) {
      const msg = (err as Error).message || 'Error al generar la referencia F-01.';
      setError(msg);
      throw new Error(msg, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (dto: UpdateReferenceStatusDTO): Promise<boolean> => {
    try {
      const ahoraIso = new Date().toISOString();

      try {
        await referencesService.updateReferenceStatus(dto);
      } catch (err) {
        console.warn('[Referencias] Endpoint status no disponible, persistiendo estado localmente:', err);
      }

      const raw = localStorage.getItem(STORAGE_KEY_REFERENCIAS_LOCALES);
      const lista: CommunityReferenceRecord[] = raw ? JSON.parse(raw) : [];

      const target = references.find((r) => r.id === dto.referenceId);
      if (!target) return false;

      const actualizado: CommunityReferenceRecord = {
        ...target,
        status: dto.status,
        notes: dto.notes || target.notes,
        respuestaEstablecimiento: dto.respuestaEstablecimiento || target.respuestaEstablecimiento,
        indicacionesRetorno: dto.indicacionesRetorno || target.indicacionesRetorno,
        attendedAt: dto.status === 'ATTENDED' ? ahoraIso : target.attendedAt,
        updatedAt: ahoraIso,
      };

      const filtrada = lista.filter((r) => r.id !== dto.referenceId);
      localStorage.setItem(STORAGE_KEY_REFERENCIAS_LOCALES, JSON.stringify([actualizado, ...filtrada]));

      await fetchReferences();
      return true;
    } catch {
      return false;
    }
  };

  const referenciasFiltradas = references.filter((r) => {
    const q = filtroTexto.toLowerCase().trim();
    const matchTexto =
      !q ||
      (r.patientName && r.patientName.toLowerCase().includes(q)) ||
      (r.patientDui && r.patientDui.toLowerCase().includes(q)) ||
      (r.folioF01 && r.folioF01.toLowerCase().includes(q)) ||
      (r.reason && r.reason.toLowerCase().includes(q)) ||
      (r.establishmentName && r.establishmentName.toLowerCase().includes(q));

    const matchEstado = filtroEstado === 'TODOS' || r.status === filtroEstado;
    const matchPrioridad = filtroPrioridad === 'TODOS' || r.priority === filtroPrioridad;
    const matchDestino = filtroDestino === 'TODOS' || r.establishmentId === filtroDestino;

    return matchTexto && matchEstado && matchPrioridad && matchDestino;
  });

  return {
    references: referenciasFiltradas,
    todasLasReferencias: references,
    pacientesPadron,
    establecimientos,
    metricas,
    loading,
    error,
    filtroTexto,
    setFiltroTexto,
    filtroEstado,
    setFiltroEstado,
    filtroPrioridad,
    setFiltroPrioridad,
    filtroDestino,
    setFiltroDestino,
    fetchReferences,
    createReference,
    changeStatus,
  };
}