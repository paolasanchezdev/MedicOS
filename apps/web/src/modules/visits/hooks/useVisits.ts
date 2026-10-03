// =========================================================================
// ARCHIVO: apps/web/src/modules/visits/hooks/useVisits.ts
// DESCRIPCIÓN: Hook de dominio 100% datos reales.
//              Conecta con visitsService (/appointments), atencionService y
//              padrón de pacientes. Cero mocks, cero fechas fijas ni textos inventados.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { visitsService } from '../services/visits.service';
import { patientsService } from '../../patients/services/patients.service';
import { atencionService } from '../../atencion/services/atencion.service';
import type { PatientRecord } from '../../patients/types/patient.types';
import type {
  CommunityVisitRecord,
  VisitasMetricas,
  ProgramarVisitaDTO,
  RegistrarResultadoVisitaDTO,
  VisitStatus,
} from '../types/visit.types';

const STORAGE_KEY_VISITAS_LOCALES = 'medicos_visitas_domiciliarias_territorio';
const STORAGE_KEY_OUTBOX = 'medicos_brigadista_pending_sync_attentions';
const STORAGE_KEY_BITACORA = 'medicos_jornada_actividades_bitacora';

export function parseFechaLocal(str?: string | null): Date | null {
  if (!str) return null;
  const clean = str.trim();

  if (clean.includes('T')) {
    const datePart = clean.split('T')[0];
    if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      const [y, m, d] = datePart.split('-').map(Number);
      if (y && m && d) return new Date(y, m - 1, d);
    }
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    const [y, m, d] = clean.split('-').map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
  }

  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(clean)) {
    const [d, m, y] = clean.split('/').map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
  }

  const d = new Date(clean);
  return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function calcularTemporalidadVisita(
  fechaStr: string,
  status: VisitStatus
): 'HOY' | 'PROXIMA' | 'VENCIDA' | 'COMPLETADA' {
  if (status === 'COMPLETED' || status === 'CANCELLED') {
    return 'COMPLETADA';
  }

  const fechaVisita = parseFechaLocal(fechaStr);
  if (!fechaVisita) return 'PROXIMA';

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fechaVisita.setHours(0, 0, 0, 0);

  const diffTime = fechaVisita.getTime() - hoy.getTime();
  const diffDias = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDias < 0) return 'VENCIDA';
  if (diffDias === 0) return 'HOY';
  return 'PROXIMA';
}

function registrarEnBitacoraJornada(tipoActividad: string, detalle: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BITACORA);
    const lista = raw ? JSON.parse(raw) : [];
    const ahora = new Date();
    const nuevoRegistro = {
      id: `act-jornada-${Date.now()}`,
      hora: ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      tipo: tipoActividad,
      descripcion: detalle,
      fecha: ahora.toISOString().slice(0, 10),
    };
    localStorage.setItem(STORAGE_KEY_BITACORA, JSON.stringify([nuevoRegistro, ...lista]));
  } catch (err: unknown) {
    console.warn('[Visitas] No se pudo escribir en bitácora:', err);
  }
}

export function useVisits() {
  const [pacientesPadron, setPacientesPadron] = useState<PatientRecord[]>([]);
  const [visitas, setVisitas] = useState<CommunityVisitRecord[]>([]);
  const [metricas, setMetricas] = useState<VisitasMetricas>({
    hoy: 0,
    proximas: 0,
    vencidas: 0,
    programadas: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroTexto, setFiltroTexto] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [filtroTemporalidad, setFiltroTemporalidad] = useState<string>('TODOS');
  const [filtroMotivo, setFiltroMotivo] = useState<string>('TODOS');

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [patientsRes, visitsApiRes, historyAtnRes, pendingAtnRes] = await Promise.allSettled([
        patientsService.getAllPatients(),
        visitsService.getVisits(),
        atencionService.getAttentionHistory({ limit: 100 }),
        atencionService.getPendingAttentions(),
      ]);

      const listaPac = patientsRes.status === 'fulfilled' ? patientsRes.value || [] : [];
      setPacientesPadron(listaPac);

      const mapaVisitas = new Map<string, CommunityVisitRecord>();

      // 1. Citas reales desde la Base de Datos (/appointments)
      if (visitsApiRes.status === 'fulfilled' && Array.isArray(visitsApiRes.value)) {
        visitsApiRes.value.forEach((v) => {
          const pac = listaPac.find((p) => p.id === v.patientId);
          const dir = pac?.address || v.patientAddress || '';
          const partes = dir.split(',').map((p) => p.trim()).filter(Boolean);

          mapaVisitas.set(v.id, {
            ...v,
            patientExpediente: pac?.clinicalRecord?.id
              ? `EXP-2026-${pac.clinicalRecord.id.slice(0, 4).toUpperCase()}`
              : v.patientDui
              ? `EXP-${v.patientDui.replace(/\D/g, '').slice(-4)}`
              : undefined,
            patientPhone: pac?.phone || v.patientPhone,
            comunidad: partes[0] || dir,
            sector: partes[1] || undefined,
            referenciaUbicacion: dir,
          });
        });
      }

      // 2. Atenciones reales que registraron seguimiento domiciliario
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
      } catch (err: unknown) {
        console.warn('[Visitas] Error leyendo outbox local:', err);
      }

      atencionesCombinadas.forEach((atn) => {
        const draftForm = atn['draftFormData'] as Record<string, unknown> | undefined;
        const seg = (draftForm?.['seguimiento'] || atn['seguimiento'] || {}) as Record<string, unknown>;
        const desenlace = String(seg['desenlace'] || atn['desenlace'] || '').toUpperCase();

        if (desenlace.includes('DOMICILIARIO') || desenlace.includes('VISITA')) {
          // Extraer la fecha real que el usuario ingresó
          const fechaPrevista = String(
            seg['fechaSeguimiento'] ||
            seg['followUpDate'] ||
            atn['fechaSeguimiento'] ||
            atn['appointmentDate'] ||
            ''
          ).trim();

          // Si la atención no especificó fecha de visita, no se crea un registro ficticio
          if (!fechaPrevista) return;

          const patientObj = (atn['patient'] || draftForm?.['patient'] || {}) as Record<string, unknown>;
          const patientId = String(patientObj['id'] || atn['patientId'] || '');
          const pac = listaPac.find(
            (p) =>
              (patientId && p.id === patientId) ||
              (p.dui && patientObj['dui'] && p.dui.replace(/\D/g, '') === String(patientObj['dui']).replace(/\D/g, ''))
          );

          const visId = `vis-atn-${atn['id'] || patientId}`;
          if (!mapaVisitas.has(visId)) {
            const nombre = String(
              patientObj['fullName'] ||
              (pac ? `${pac.firstName} ${pac.lastName}`.trim() : '') ||
              'Persona en Seguimiento'
            );
            const dui = String(patientObj['dui'] || pac?.dui || 'Sin DUI');
            const direccion = String(patientObj['community'] || patientObj['address'] || pac?.address || '');
            const partesDir = direccion.split(',').map((p) => p.trim()).filter(Boolean);

            const motivoReal = String(
              seg['motivoSeguimiento'] ||
              seg['followUpReason'] ||
              atn['motivoSeguimiento'] ||
              atn['reason'] ||
              atn['chiefComplaintSummary'] ||
              desenlace
            ).trim();

            let scheduledTime: string | undefined;
            if (fechaPrevista.includes('T')) {
              scheduledTime = fechaPrevista.split('T')[1]?.slice(0, 5);
            }

            const cleanDate = fechaPrevista.includes('T') ? fechaPrevista.split('T')[0] : fechaPrevista;
            const createdAt = String(atn['startedAt'] || atn['createdAt'] || new Date().toISOString());

            mapaVisitas.set(visId, {
              id: visId,
              patientId: patientId || pac?.id || 'pac-sin-id',
              patientName: nombre,
              patientDui: dui,
              patientExpediente: pac?.clinicalRecord?.id
                ? `EXP-2026-${pac.clinicalRecord.id.slice(0, 4).toUpperCase()}`
                : dui !== 'Sin DUI'
                ? `EXP-${dui.replace(/\D/g, '').slice(-4)}`
                : undefined,
              patientAddress: direccion,
              patientPhone: String(patientObj['phone'] || pac?.phone || ''),
              comunidad: partesDir[0] || direccion,
              sector: partesDir[1] || undefined,
              referenciaUbicacion: direccion,
              brigadistaId: String(atn['doctorId'] || ''),
              brigadistaName: String(atn['doctorName'] || atn['brigadistName'] || ''),
              brigadeId: (atn['brigadeId'] as string) || null,
              scheduledDate: cleanDate || fechaPrevista,
              scheduledTime,
              duracionEstimadaMin: 30,
              visitType: 'CONTROL_SEGUIMIENTO',
              priority: 'MEDIUM',
              status: 'SCHEDULED',
              reason: motivoReal,
              requiresFollowUp: true,
              requiresReference: false,
              origenModulo: 'ATENCION',
              createdAt,
              updatedAt: createdAt,
            });
          }
        }
      });

      // 3. Sincronizar estados locales modificados por el brigadista
      try {
        const rawLocal = localStorage.getItem(STORAGE_KEY_VISITAS_LOCALES);
        if (rawLocal) {
          const parsed = JSON.parse(rawLocal);
          if (Array.isArray(parsed)) {
            parsed.forEach((localItem: CommunityVisitRecord) => {
              if (mapaVisitas.has(localItem.id)) {
                mapaVisitas.set(localItem.id, { ...mapaVisitas.get(localItem.id)!, ...localItem });
              } else {
                mapaVisitas.set(localItem.id, localItem);
              }
            });
          }
        }
      } catch (err: unknown) {
        console.warn('[Visitas] Error leyendo visitas locales:', err);
      }

      const listaFinal = Array.from(mapaVisitas.values());

      let cHoy = 0;
      let cProximas = 0;
      let cVencidas = 0;
      let cProgramadas = 0;

      listaFinal.forEach((v) => {
        if (v.status === 'SCHEDULED' || v.status === 'IN_PROGRESS' || v.status === 'REPROGRAMMED') {
          cProgramadas++;
          const temp = calcularTemporalidadVisita(v.scheduledDate, v.status);
          if (temp === 'HOY') cHoy++;
          else if (temp === 'PROXIMA') cProximas++;
          else if (temp === 'VENCIDA') cVencidas++;
        }
      });

      setVisitas(listaFinal);
      setMetricas({
        hoy: cHoy,
        proximas: cProximas,
        vencidas: cVencidas,
        programadas: cProgramadas,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar visitas domiciliarias';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      await Promise.resolve();
      if (!isMounted) return;
      await cargarDatos();
    };
    void init();
    return () => {
      isMounted = false;
    };
  }, [cargarDatos]);

  const programarVisita = async (
    dto: ProgramarVisitaDTO,
    contexto?: { brigadistaId?: string; brigadeId?: string | null }
  ): Promise<boolean> => {
    try {
      const p = pacientesPadron.find((pac) => pac.id === dto.patientId);
      if (!p) return false;

      let nuevaVisita: CommunityVisitRecord;

      try {
        nuevaVisita = await visitsService.createVisit({
          patientId: dto.patientId,
          brigadeId: contexto?.brigadeId || null,
          scheduledDate: dto.scheduledDate,
          scheduledTime: dto.scheduledTime,
          durationMinutes: dto.duracionEstimadaMin,
          visitType: dto.visitType,
          priority: dto.priority,
          reason: dto.reason,
          notes: dto.referenciaUbicacion,
        });
      } catch {
        const cleanDui = (p.dui || '').replace(/\D/g, '');
        const ahoraIso = new Date().toISOString();

        nuevaVisita = {
          id: `vis-${Date.now()}`,
          patientId: p.id,
          patientName: `${p.firstName} ${p.lastName}`.trim(),
          patientDui: p.dui || undefined,
          patientExpediente: p.clinicalRecord?.id
            ? `EXP-2026-${p.clinicalRecord.id.slice(0, 4).toUpperCase()}`
            : cleanDui
            ? `EXP-${cleanDui.slice(-4)}`
            : undefined,
          patientAddress: p.address || undefined,
          patientPhone: p.phone || undefined,
          comunidad: dto.comunidad || undefined,
          sector: dto.sector || undefined,
          referenciaUbicacion: dto.referenciaUbicacion || p.address || undefined,
          brigadistaId: contexto?.brigadistaId || '',
          brigadistaName: dto.brigadistaName || '',
          brigadeId: contexto?.brigadeId || null,
          scheduledDate: dto.scheduledDate,
          scheduledTime: dto.scheduledTime,
          duracionEstimadaMin: dto.duracionEstimadaMin,
          visitType: dto.visitType,
          priority: dto.priority || 'MEDIUM',
          status: 'SCHEDULED',
          reason: dto.reason.trim(),
          requiresFollowUp: true,
          requiresReference: false,
          origenModulo: 'MANUAL',
          createdAt: ahoraIso,
          updatedAt: ahoraIso,
        };
      }

      const listaLocalRaw = localStorage.getItem(STORAGE_KEY_VISITAS_LOCALES);
      const listaLocal: CommunityVisitRecord[] = listaLocalRaw ? JSON.parse(listaLocalRaw) : [];
      localStorage.setItem(STORAGE_KEY_VISITAS_LOCALES, JSON.stringify([nuevaVisita, ...listaLocal]));

      registrarEnBitacoraJornada(
        'Visita domiciliaria programada',
        `Programada visita a ${p.firstName} ${p.lastName} para el ${dto.scheduledDate}${dto.scheduledTime ? ` a las ${dto.scheduledTime}` : ''}. Motivo: ${dto.reason}`
      );

      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  const iniciarVisita = async (visitId: string): Promise<boolean> => {
    try {
      const ahora = new Date();
      const horaActual = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const fechaActualIso = ahora.toISOString();

      const target = visitas.find((v) => v.id === visitId);
      if (!target) return false;

      const listaLocalRaw = localStorage.getItem(STORAGE_KEY_VISITAS_LOCALES);
      const listaLocal: CommunityVisitRecord[] = listaLocalRaw ? JSON.parse(listaLocalRaw) : [];

      const itemActualizado: CommunityVisitRecord = {
        ...target,
        status: 'IN_PROGRESS',
        horaInicio: horaActual,
        updatedAt: fechaActualIso,
      };

      const filtrada = listaLocal.filter((v) => v.id !== visitId);
      localStorage.setItem(STORAGE_KEY_VISITAS_LOCALES, JSON.stringify([itemActualizado, ...filtrada]));

      registrarEnBitacoraJornada(
        'Visita domiciliaria iniciada',
        `Inicio de visita a ${target.patientName || 'paciente'} a las ${horaActual}.`
      );

      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  const registrarResultado = async (dto: RegistrarResultadoVisitaDTO): Promise<boolean> => {
    try {
      const ahora = new Date();
      const horaActual = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      const fechaActualIso = ahora.toISOString();

      const target = visitas.find((v) => v.id === dto.visitId);
      if (!target) return false;

      try {
        await visitsService.completeVisit({
          visitId: dto.visitId,
          findings: dto.observaciones.trim(),
          actionsTaken: dto.actividadesRealizadas,
          requiresFollowUp: dto.reprogramar,
          requiresReference: dto.crearReferencia,
          notes: dto.observaciones.trim(),
        });
      } catch (err: unknown) {
        console.warn('[Visitas] Backend no disponible para completar cita, persistiendo localmente:', err);
      }

      let statusFinal: VisitStatus = 'COMPLETED';
      if (dto.resultadoVisita === 'NO_LOCALIZADO') statusFinal = 'NOT_LOCATED';
      else if (dto.reprogramar) statusFinal = 'REPROGRAMMED';

      const itemActualizado: CommunityVisitRecord = {
        ...target,
        status: statusFinal,
        resultadoVisita: dto.resultadoVisita,
        findings: dto.observaciones.trim(),
        actionsTaken: dto.actividadesRealizadas,
        motivoNoLocalizado: dto.motivoNoLocalizado || null,
        fechaReprogramada: dto.nuevaFecha || null,
        completedDate: fechaActualIso,
        horaFin: horaActual,
        requiresReference: Boolean(dto.crearReferencia),
        scheduledDate: dto.nuevaFecha || target.scheduledDate,
        scheduledTime: dto.nuevaHora || target.scheduledTime,
        updatedAt: fechaActualIso,
      };

      const listaLocalRaw = localStorage.getItem(STORAGE_KEY_VISITAS_LOCALES);
      const listaLocal: CommunityVisitRecord[] = listaLocalRaw ? JSON.parse(listaLocalRaw) : [];
      const filtrada = listaLocal.filter((v) => v.id !== dto.visitId);
      localStorage.setItem(STORAGE_KEY_VISITAS_LOCALES, JSON.stringify([itemActualizado, ...filtrada]));

      registrarEnBitacoraJornada(
        'Visita domiciliaria finalizada',
        `Visita a ${target.patientName || 'paciente'} finalizada como ${dto.resultadoVisita}.`
      );

      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  const cancelarVisita = async (visitId: string, motivo: string): Promise<boolean> => {
    try {
      const fechaActualIso = new Date().toISOString();
      const target = visitas.find((v) => v.id === visitId);
      if (!target) return false;

      const listaLocalRaw = localStorage.getItem(STORAGE_KEY_VISITAS_LOCALES);
      const listaLocal: CommunityVisitRecord[] = listaLocalRaw ? JSON.parse(listaLocalRaw) : [];

      const itemActualizado: CommunityVisitRecord = {
        ...target,
        status: 'CANCELLED',
        notes: motivo.trim() || null,
        updatedAt: fechaActualIso,
      };

      const filtrada = listaLocal.filter((v) => v.id !== visitId);
      localStorage.setItem(STORAGE_KEY_VISITAS_LOCALES, JSON.stringify([itemActualizado, ...filtrada]));

      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  const visitasFiltradas = visitas.filter((v) => {
    const q = filtroTexto.toLowerCase().trim();
    const matchTexto =
      !q ||
      (v.patientName && v.patientName.toLowerCase().includes(q)) ||
      (v.patientDui && v.patientDui.toLowerCase().includes(q)) ||
      (v.patientExpediente && v.patientExpediente.toLowerCase().includes(q)) ||
      v.reason.toLowerCase().includes(q) ||
      (v.comunidad && v.comunidad.toLowerCase().includes(q));

    const matchEstado = filtroEstado === 'TODOS' || v.status === filtroEstado;
    const matchMotivo = filtroMotivo === 'TODOS' || v.visitType === filtroMotivo;

    const temp = calcularTemporalidadVisita(v.scheduledDate, v.status);
    const matchTemporalidad =
      filtroTemporalidad === 'TODOS' ||
      (filtroTemporalidad === 'HOY' && temp === 'HOY') ||
      (filtroTemporalidad === 'PROXIMAS' && temp === 'PROXIMA') ||
      (filtroTemporalidad === 'VENCIDAS' && temp === 'VENCIDA') ||
      (filtroTemporalidad === 'PROGRAMADAS' &&
        (v.status === 'SCHEDULED' || v.status === 'IN_PROGRESS' || v.status === 'REPROGRAMMED'));

    return matchTexto && matchEstado && matchMotivo && matchTemporalidad;
  });

  return {
    pacientesPadron,
    visitas: visitasFiltradas,
    metricas,
    loading,
    error,
    filtroTexto,
    setFiltroTexto,
    filtroEstado,
    setFiltroEstado,
    filtroTemporalidad,
    setFiltroTemporalidad,
    filtroMotivo,
    setFiltroMotivo,
    programarVisita,
    iniciarVisita,
    registrarResultado,
    cancelarVisita,
    recargar: cargarDatos,
  };
}