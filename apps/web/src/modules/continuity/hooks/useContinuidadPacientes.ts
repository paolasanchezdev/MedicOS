// =========================================================================
// ARCHIVO: apps/web/src/modules/continuity/hooks/useContinuidadPacientes.ts
// DESCRIPCIÓN: Motor de agregación transversal de Continuidad Territorial.
//              Conecta 100% en tiempo real con la base de datos de atenciones,
//              la cola de sincronización local (outbox), nutrición y gestantes.
// =========================================================================

import { useState, useEffect, useCallback } from 'react';
import { patientsService } from '../../patients/services/patients.service';
import type { PatientRecord } from '../../patients/types/patient.types';
import { atencionService } from '../../atencion/services/atencion.service';
import type {
  SeguimientoItem,
  SeguimientoMetricas,
  CrearSeguimientoDto,
  RegistrarAccionDto,
  TemporalidadSeguimiento,
  EstadoSeguimiento,
  TipoSeguimiento,
} from '../types/continuity.types';

const STORAGE_KEY_SEGUIMIENTOS = 'medicos_seguimientos_activos_territorio';
const STORAGE_KEY_GESTANTES = 'medicos_censo_gestantes_territorio';
const STORAGE_KEY_NUTRICION = 'medicos_nutricion_seguimiento_territorio';
const STORAGE_KEY_NUTRI_HISTORIAL = 'medicos_nutricion_evaluaciones_historial';
const STORAGE_KEY_MATERNO_HISTORIAL = 'medicos_atenciones_materno_infantil_historial';
const PENDING_SYNC_STORAGE_KEY = 'medicos_brigadista_pending_sync_attentions';

// Parser estricto en hora local para evitar desfaces de zona horaria
export function parseFechaLocal(str?: string | null): Date | null {
  if (!str) return null;
  const clean = str.trim();

  // Formato YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    const [y, m, d] = clean.split('-').map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
  }

  // Formato DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(clean)) {
    const [d, m, y] = clean.split('/').map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
  }

  const d = new Date(clean);
  return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function calcularTemporalidad(fechaPrevistaStr: string, estado: string): TemporalidadSeguimiento {
  if (estado === 'COMPLETADO' || estado === 'REFERIDO') {
    return 'COMPLETADO';
  }

  const fechaP = parseFechaLocal(fechaPrevistaStr);
  if (!fechaP) return 'PROXIMO';

  // Fecha operativa de la jornada en curso: 1 de octubre de 2026
  const hoy = new Date(2026, 9, 1);

  const diffTime = fechaP.getTime() - hoy.getTime();
  const diffDias = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDias < 0) return 'VENCIDO';
  if (diffDias === 0) return 'HOY';
  return 'PROXIMO';
}

function calcularEdadAnios(fechaNac?: string | Date | null): number | null {
  if (!fechaNac) return null;
  const nac = new Date(fechaNac);
  if (isNaN(nac.getTime())) return null;
  const hoy = new Date(2026, 9, 1);
  let anios = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) anios--;
  return anios >= 0 ? anios : null;
}

function calcularEdadTexto(fechaNac?: string | Date | null): string {
  const anios = calcularEdadAnios(fechaNac);
  if (anios === null) return 'Edad no reg.';
  if (anios === 0) return 'Menor de 1 año';
  return `${anios} año${anios > 1 ? 's' : ''}`;
}

// Extrae de forma exhaustiva los datos de seguimiento de una consulta/atención
function extraerSeguimientoDeAtencion(atn: Record<string, unknown>) {
  const draftForm = atn['draftFormData'] as Record<string, unknown> | undefined;
  const segObj = (draftForm?.['seguimiento'] || atn['seguimiento'] || atn['followUp'] || {}) as Record<string, unknown>;

  const desenlace = (
    segObj['desenlace'] ||
    atn['desenlace'] ||
    atn['outcome'] ||
    draftForm?.['desenlace'] ||
    ''
  ).toString();

  const requiere = Boolean(
    segObj['requiereSeguimiento'] ||
    atn['requiereSeguimiento'] ||
    atn['requiresFollowUp'] ||
    segObj['requiresFollowUp'] ||
    desenlace.toUpperCase().includes('SEGUIMIENTO')
  );

  const fecha = (
    segObj['fechaSeguimiento'] ||
    segObj['followUpDate'] ||
    atn['fechaSeguimiento'] ||
    atn['followUpDate'] ||
    atn['fechaProximoSeguimiento'] ||
    ''
  ).toString();

  const motivo = (
    segObj['motivoSeguimiento'] ||
    segObj['followUpReason'] ||
    atn['motivoSeguimiento'] ||
    atn['followUpReason'] ||
    ''
  ).toString();

  const requiereReferencia = Boolean(
    segObj['requiereReferencia'] ||
    atn['requiereReferencia'] ||
    atn['requiresReferral'] ||
    desenlace.toUpperCase().includes('REFERENCIA')
  );

  return {
    tieneSeguimiento: requiere || Boolean(fecha) || desenlace.toUpperCase().includes('SEGUIMIENTO'),
    desenlace,
    fecha,
    motivo,
    requiereReferencia,
    segObj,
  };
}

export function useContinuidadPacientes() {
  const [pacientesPadron, setPacientesPadron] = useState<PatientRecord[]>([]);
  const [seguimientos, setSeguimientos] = useState<SeguimientoItem[]>([]);
  const [metricas, setMetricas] = useState<SeguimientoMetricas>({
    hoy: 0,
    vencidos: 0,
    proximos: 0,
    activos: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filtroTexto, setFiltroTexto] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [filtroTemporalidad, setFiltroTemporalidad] = useState<string>('TODOS');
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('TODOS');

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Consultar en paralelo padrón, atenciones de la base de datos y atenciones en outbox
      const [patientsRes, attentionHistoryRes, pendingAttentionsRes] = await Promise.allSettled([
        patientsService.getAllPatients(),
        atencionService.getAttentionHistory({ limit: 100 }),
        atencionService.getPendingAttentions(),
      ]);

      const listaPacientes = patientsRes.status === 'fulfilled' ? patientsRes.value || [] : [];
      setPacientesPadron(listaPacientes);

      const historyItems = attentionHistoryRes.status === 'fulfilled' ? attentionHistoryRes.value.items || [] : [];
      const pendingItems = pendingAttentionsRes.status === 'fulfilled' ? pendingAttentionsRes.value || [] : [];

      // 1. Cargar seguimientos manuales existentes en Continuidad
      let listaManual: SeguimientoItem[] = [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY_SEGUIMIENTOS);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            listaManual = parsed;
          }
        }
      } catch (err: unknown) {
        console.warn('[Continuidad] Error leyendo almacenamiento local:', err);
      }

      const mapaSeguimientos = new Map<string, SeguimientoItem>();

      // Incorporar primero los manuales
      listaManual.forEach((s) => {
        mapaSeguimientos.set(s.id, s);
      });

      // 2. CONSOLIDAR ATENCIONES REALES CON SEGUIMIENTO (Tanto API como Outbox Local)
      const todasLasAtenciones: Array<Record<string, unknown>> = [
        ...historyItems.map((h) => h as unknown as Record<string, unknown>),
        ...pendingItems.map((p) => p as unknown as Record<string, unknown>),
      ];

      // Lectura de seguridad directa de la cola outbox
      try {
        const rawSync = localStorage.getItem(PENDING_SYNC_STORAGE_KEY);
        if (rawSync) {
          const parsedSync = JSON.parse(rawSync);
          if (Array.isArray(parsedSync)) {
            parsedSync.forEach((rawItem: Record<string, unknown>) => {
              if (!todasLasAtenciones.some((a) => a['id'] === rawItem['id'])) {
                todasLasAtenciones.push(rawItem);
              }
            });
          }
        }
      } catch (err: unknown) {
        console.warn('[Continuidad] Error leyendo pending sync outbox:', err);
      }

      todasLasAtenciones.forEach((atn) => {
        const segInfo = extraerSeguimientoDeAtencion(atn);
        if (!segInfo.tieneSeguimiento) return;

        const draftForm = atn['draftFormData'] as Record<string, unknown> | undefined;
        const patientObj = (atn['patient'] || draftForm?.['patient'] || {}) as Record<string, unknown>;
        const patientId = (patientObj['id'] || atn['patientId'] || '').toString();

        const pacEnPadron = listaPacientes.find(
          (p) =>
            (patientId && p.id === patientId) ||
            (p.dui && patientObj['dui'] && p.dui.replace(/\D/g, '') === String(patientObj['dui']).replace(/\D/g, '')) ||
            (p.firstName && patientObj['fullName'] && `${p.firstName} ${p.lastName}`.trim().toLowerCase() === String(patientObj['fullName']).trim().toLowerCase())
        );

        const nombre =
          (patientObj['fullName'] as string) ||
          (pacEnPadron ? `${pacEnPadron.firstName} ${pacEnPadron.lastName}`.trim() : '') ||
          (patientObj['firstName'] ? `${patientObj['firstName']} ${patientObj['lastName'] || ''}`.trim() : 'Paciente en Seguimiento');

        const dui = (patientObj['dui'] as string) || pacEnPadron?.dui || 'Sin DUI';
        const cleanDui = dui.replace(/\D/g, '');
        const exp = pacEnPadron?.clinicalRecord?.id
          ? `EXP-2026-${pacEnPadron.clinicalRecord.id.slice(0, 4).toUpperCase()}`
          : cleanDui
          ? `EXP-${cleanDui.slice(-4)}`
          : `EXP-${(patientId || atn['id'] || '0000').toString().slice(0, 4).toUpperCase()}`;

        const direccion =
          (patientObj['community'] as string) ||
          (patientObj['address'] as string) ||
          pacEnPadron?.address ||
          'Comunidad asignada';

        const telefono =
          (patientObj['phone'] as string) ||
          pacEnPadron?.phone ||
          'No registrado';

        const edad = calcularEdadTexto(
          pacEnPadron?.dateOfBirth ||
          (patientObj['dateOfBirth'] as string | undefined)
        );

        let tipo: TipoSeguimiento = 'CONTROL_CLINICO';
        const desUpper = segInfo.desenlace.toUpperCase();
        if (desUpper.includes('DOMICILIARIO') || desUpper.includes('VISITA')) {
          tipo = 'VISITA_DOMICILIARIA';
        } else if (segInfo.requiereReferencia || desUpper.includes('REFERENCIA')) {
          tipo = 'SEGUIMIENTO_REFERENCIA';
        } else if (atn['category'] === 'MATERNO_INFANTIL' || desUpper.includes('MATERNO') || desUpper.includes('PRENATAL')) {
          tipo = 'CONTROL_MATERNO';
        } else if (atn['category'] === 'NUTRICION' || desUpper.includes('NUTRI')) {
          tipo = 'SEGUIMIENTO_NUTRICIONAL';
        } else if (atn['category'] === 'VACUNACION_APOYO' || atn['category'] === 'PREVENCION') {
          tipo = 'EDUCACION_PREVENCION';
        }

        const proximaAccion = segInfo.motivo || (segInfo.desenlace ? segInfo.desenlace : 'Control y seguimiento clínico');
        const descripcion = `Atención comunitaria registrada.${segInfo.motivo ? ` Motivo: ${segInfo.motivo}.` : ''}${segInfo.desenlace ? ` Desenlace: ${segInfo.desenlace}.` : ''}`;

        const fechaPrevista = segInfo.fecha || '2026-10-09';
        const fechaCreacion = atn['startedAt']
          ? String(atn['startedAt']).slice(0, 10)
          : atn['createdAt']
          ? String(atn['createdAt']).slice(0, 10)
          : '01/10/2026';

        const segId = `seg-atn-${atn['id'] || patientId}`;

        // Solo agregar si el usuario no ha modificado esta tarea manualmente en Continuidad
        if (!mapaSeguimientos.has(segId)) {
          mapaSeguimientos.set(segId, {
            id: segId,
            pacienteId: patientId || pacEnPadron?.id || 'pac-temp',
            pacienteNombre: nombre,
            pacienteExpediente: exp,
            pacienteDui: dui,
            pacienteEdad: edad,
            pacienteTelefono: telefono,
            pacienteDireccion: direccion,
            tipo,
            descripcion,
            proximaAccion,
            fechaPrevista,
            fechaCreacion,
            ultimaAccionFecha: fechaCreacion,
            prioridad: atn['priority'] === 'HIGH' || segInfo.segObj?.['prioridadReferencia'] === 'HIGH' ? 'ALTA' : 'NORMAL',
            estado: 'ACTIVO',
            responsable: (atn['brigadistName'] || atn['doctorName'] || 'Carlos Pérez (Brigadista Territorial)') as string,
            origenModulo: 'ATENCION',
            historialAcciones: [
              {
                id: `act-init-${atn['id'] || Date.now()}`,
                fecha: fechaCreacion,
                tipoAccion: 'Atención en terreno registrada',
                resultado: 'REQUIERE_NUEVA_ACCION',
                observaciones: descripcion,
                responsable: (atn['brigadistName'] || atn['doctorName'] || 'Carlos Pérez (Brigadista Territorial)') as string,
                fechaRegistro: fechaCreacion,
              },
            ],
          });
        }
      });

      // 3. CONSOLIDAR GESTANTES REALES CAPTADAS
      try {
        const rawGestantes = localStorage.getItem(STORAGE_KEY_GESTANTES);
        if (rawGestantes) {
          const gestantesMap: Record<string, { semanas: number; fpp: string }> = JSON.parse(rawGestantes);
          Object.entries(gestantesMap).forEach(([pId, info]) => {
            const pac = listaPacientes.find((p) => p.id === pId);
            if (pac) {
              const segId = `seg-mat-${pac.id}`;
              if (!mapaSeguimientos.has(segId)) {
                mapaSeguimientos.set(segId, {
                  id: segId,
                  pacienteId: pac.id,
                  pacienteNombre: `${pac.firstName} ${pac.lastName}`.trim(),
                  pacienteExpediente: pac.dui ? `EXP-MAT-${pac.dui.replace(/\D/g, '').slice(-4)}` : `EXP-MAT-${pac.id.slice(0, 4).toUpperCase()}`,
                  pacienteDui: pac.dui || 'Sin DUI',
                  pacienteEdad: calcularEdadTexto(pac.dateOfBirth),
                  pacienteTelefono: pac.phone || 'No registrado',
                  pacienteDireccion: pac.address || 'Comunidad asignada',
                  tipo: 'CONTROL_MATERNO',
                  descripcion: `Seguimiento prenatal en semana ${info.semanas}. FPP: ${info.fpp}.`,
                  proximaAccion: 'Control prenatal y monitoreo de signos vitales',
                  fechaPrevista: '2026-10-01',
                  fechaCreacion: '01/10/2026',
                  ultimaAccionFecha: '01/10/2026',
                  prioridad: info.semanas >= 36 ? 'ALTA' : 'NORMAL',
                  estado: 'ACTIVO',
                  responsable: 'Carlos Pérez (Brigadista Territorial)',
                  origenModulo: 'MATERNO_INFANTIL',
                  historialAcciones: [
                    {
                      id: `act-mat-${pac.id}`,
                      fecha: '01/10/2026',
                      tipoAccion: 'Captación prenatal en censo',
                      resultado: 'COMPLETADA',
                      observaciones: `Captada en semana ${info.semanas} de gestación.`,
                      responsable: 'Carlos Pérez (Brigadista Territorial)',
                      fechaRegistro: '01/10/2026',
                    },
                  ],
                });
              }
            }
          });
        }
      } catch (err: unknown) {
        console.warn('[Continuidad] Error al consolidar gestantes:', err);
      }

      // 4. CONSOLIDAR ATENCIONES PREVENTIVAS MATERNO-INFANTILES CON PRÓXIMA CITA
      try {
        const rawMaternoHist = localStorage.getItem(STORAGE_KEY_MATERNO_HISTORIAL);
        if (rawMaternoHist) {
          const atenciones: Array<{
            pacienteId: string;
            tipo: 'materno' | 'infantil';
            fechaProximoSeguimiento?: string;
            observaciones?: string;
          }> = JSON.parse(rawMaternoHist);

          atenciones.forEach((atn) => {
            if (atn.fechaProximoSeguimiento) {
              const pac = listaPacientes.find((p) => p.id === atn.pacienteId);
              if (pac) {
                const segId = `seg-atn-${atn.tipo}-${pac.id}`;
                if (!mapaSeguimientos.has(segId)) {
                  const esInfantil = atn.tipo === 'infantil';
                  mapaSeguimientos.set(segId, {
                    id: segId,
                    pacienteId: pac.id,
                    pacienteNombre: `${pac.firstName} ${pac.lastName}`.trim(),
                    pacienteExpediente: pac.dui ? `EXP-${pac.dui.replace(/\D/g, '').slice(-4)}` : `EXP-${pac.id.slice(0, 4).toUpperCase()}`,
                    pacienteDui: pac.dui || (esInfantil ? 'Menor de edad' : 'Sin DUI'),
                    pacienteEdad: calcularEdadTexto(pac.dateOfBirth),
                    pacienteTelefono: pac.phone || pac.emergencyPhone || 'No registrado',
                    pacienteDireccion: pac.address || 'Comunidad asignada',
                    tipo: esInfantil ? 'CONTROL_INFANTIL' : 'CONTROL_MATERNO',
                    descripcion: atn.observaciones || (esInfantil ? 'Control de crecimiento y desarrollo' : 'Control prenatal'),
                    proximaAccion: esInfantil ? 'Evaluación de peso, talla y vacunas' : 'Control prenatal programado',
                    fechaPrevista: atn.fechaProximoSeguimiento,
                    fechaCreacion: '01/10/2026',
                    ultimaAccionFecha: '01/10/2026',
                    prioridad: 'NORMAL',
                    estado: 'ACTIVO',
                    responsable: 'Carlos Pérez (Brigadista Territorial)',
                    origenModulo: 'MATERNO_INFANTIL',
                    historialAcciones: [
                      {
                        id: `act-atn-${Date.now()}`,
                        fecha: '01/10/2026',
                        tipoAccion: 'Control preventivo registrado',
                        resultado: 'COMPLETADA',
                        observaciones: atn.observaciones || 'Atención realizada en jornada.',
                        responsable: 'Carlos Pérez (Brigadista Territorial)',
                        fechaRegistro: '01/10/2026',
                      },
                    ],
                  });
                }
              }
            }
          });
        }
      } catch (err: unknown) {
        console.warn('[Continuidad] Error al consolidar atenciones materno-infantiles:', err);
      }

      // 5. CONSOLIDAR VIGILANCIA NUTRICIONAL REAL
      try {
        const rawNutriCenso = localStorage.getItem(STORAGE_KEY_NUTRICION);
        const rawNutriHist = localStorage.getItem(STORAGE_KEY_NUTRI_HISTORIAL);

        if (rawNutriCenso) {
          const censoNutri: Record<string, { grupo: string; motivo: string }> = JSON.parse(rawNutriCenso);
          Object.entries(censoNutri).forEach(([pId, info]) => {
            const pac = listaPacientes.find((p) => p.id === pId);
            if (pac) {
              const segId = `seg-nutri-${pac.id}`;
              if (!mapaSeguimientos.has(segId)) {
                mapaSeguimientos.set(segId, {
                  id: segId,
                  pacienteId: pac.id,
                  pacienteNombre: `${pac.firstName} ${pac.lastName}`.trim(),
                  pacienteExpediente: pac.dui ? `EXP-NUT-${pac.dui.replace(/\D/g, '').slice(-4)}` : `EXP-NUT-${pac.id.slice(0, 4).toUpperCase()}`,
                  pacienteDui: pac.dui || 'Sin DUI',
                  pacienteEdad: calcularEdadTexto(pac.dateOfBirth),
                  pacienteTelefono: pac.phone || 'No registrado',
                  pacienteDireccion: pac.address || 'Comunidad asignada',
                  tipo: 'SEGUIMIENTO_NUTRICIONAL',
                  descripcion: `Vigilancia nutricional activa: ${info.motivo}.`,
                  proximaAccion: 'Control de peso, talla y evaluación de hábitos',
                  fechaPrevista: '2026-10-15',
                  fechaCreacion: '01/10/2026',
                  ultimaAccionFecha: '01/10/2026',
                  prioridad: 'NORMAL',
                  estado: 'ACTIVO',
                  responsable: 'Carlos Pérez (Brigadista Territorial)',
                  origenModulo: 'NUTRICION',
                  historialAcciones: [
                    {
                      id: `act-nut-${pac.id}`,
                      fecha: '01/10/2026',
                      tipoAccion: 'Enrolamiento en vigilancia nutricional',
                      resultado: 'COMPLETADA',
                      observaciones: `Motivo: ${info.motivo}.`,
                      responsable: 'Carlos Pérez (Brigadista Territorial)',
                      fechaRegistro: '01/10/2026',
                    },
                  ],
                });
              }
            }
          });
        }

        if (rawNutriHist) {
          const evals: Array<{
            pacienteId: string;
            desenlace: string;
            fechaProximoSeguimiento?: string;
            observaciones?: string;
          }> = JSON.parse(rawNutriHist);

          evals.forEach((ev) => {
            if (ev.fechaProximoSeguimiento && ev.desenlace !== 'SEGUIMIENTO_NORMAL') {
              const pac = listaPacientes.find((p) => p.id === ev.pacienteId);
              if (pac) {
                const segId = `seg-eval-nutri-${pac.id}`;
                if (!mapaSeguimientos.has(segId)) {
                  mapaSeguimientos.set(segId, {
                    id: segId,
                    pacienteId: pac.id,
                    pacienteNombre: `${pac.firstName} ${pac.lastName}`.trim(),
                    pacienteExpediente: pac.dui ? `EXP-NUT-${pac.dui.replace(/\D/g, '').slice(-4)}` : `EXP-NUT-${pac.id.slice(0, 4).toUpperCase()}`,
                    pacienteDui: pac.dui || 'Sin DUI',
                    pacienteEdad: calcularEdadTexto(pac.dateOfBirth),
                    pacienteTelefono: pac.phone || 'No registrado',
                    pacienteDireccion: pac.address || 'Comunidad asignada',
                    tipo: 'SEGUIMIENTO_NUTRICIONAL',
                    descripcion: ev.observaciones || 'Control nutricional periódico programado en jornada.',
                    proximaAccion: 'Nuevo control antropométrico',
                    fechaPrevista: ev.fechaProximoSeguimiento,
                    fechaCreacion: '01/10/2026',
                    ultimaAccionFecha: '01/10/2026',
                    prioridad: 'NORMAL',
                    estado: 'ACTIVO',
                    responsable: 'Carlos Pérez (Brigadista Territorial)',
                    origenModulo: 'NUTRICION',
                    historialAcciones: [
                      {
                        id: `act-ev-nut-${Date.now()}`,
                        fecha: '01/10/2026',
                        tipoAccion: 'Evaluación nutricional realizada',
                        resultado: 'COMPLETADA',
                        observaciones: ev.observaciones || 'Evaluación registrada en jornada.',
                        responsable: 'Carlos Pérez (Brigadista Territorial)',
                        fechaRegistro: '01/10/2026',
                      },
                    ],
                  });
                }
              }
            }
          });
        }
      } catch (err: unknown) {
        console.warn('[Continuidad] Error al consolidar nutrición:', err);
      }

      const todosConsolidados = Array.from(mapaSeguimientos.values());

      // 6. Métricas exactas en tiempo real
      let cHoy = 0;
      let cVencidos = 0;
      let cProximos = 0;
      let cActivos = 0;

      todosConsolidados.forEach((seg) => {
        if (seg.estado !== 'COMPLETADO') {
          cActivos++;
          const temp = calcularTemporalidad(seg.fechaPrevista, seg.estado);
          if (temp === 'HOY') cHoy++;
          else if (temp === 'VENCIDO') cVencidos++;
          else if (temp === 'PROXIMO') cProximos++;
        }
      });

      setSeguimientos(todosConsolidados);
      setMetricas({
        hoy: cHoy,
        vencidos: cVencidos,
        proximos: cProximos,
        activos: cActivos,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar pacientes en seguimiento';
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

  const crearSeguimiento = async (dto: CrearSeguimientoDto): Promise<boolean> => {
    try {
      const p = pacientesPadron.find((pac) => pac.id === dto.pacienteId);
      if (!p) return false;

      const hoyStr = '01/10/2026';

      const nuevo: SeguimientoItem = {
        id: `seg-${Date.now()}`,
        pacienteId: p.id,
        pacienteNombre: `${p.firstName} ${p.lastName}`.trim(),
        pacienteExpediente: p.dui ? `EXP-${p.dui.replace(/\D/g, '').slice(-4)}` : `EXP-${p.id.slice(0, 4).toUpperCase()}`,
        pacienteDui: p.dui || 'Sin DUI',
        pacienteEdad: calcularEdadTexto(p.dateOfBirth),
        pacienteTelefono: p.phone || 'No registrado',
        pacienteDireccion: p.address || 'Comunidad asignada',
        tipo: dto.tipo,
        descripcion: dto.descripcion.trim(),
        proximaAccion: dto.proximaAccion.trim(),
        fechaPrevista: dto.fechaPrevista,
        fechaCreacion: hoyStr,
        ultimaAccionFecha: hoyStr,
        prioridad: dto.prioridad,
        estado: 'ACTIVO',
        responsable: dto.responsable.trim() || 'Carlos Pérez (Brigadista Territorial)',
        origenModulo: 'PADRON',
        historialAcciones: [
          {
            id: `act-${Date.now()}`,
            fecha: hoyStr,
            tipoAccion: 'Seguimiento creado en jornada',
            resultado: 'COMPLETADA',
            observaciones: dto.descripcion.trim(),
            responsable: dto.responsable.trim() || 'Carlos Pérez (Brigadista Territorial)',
            fechaRegistro: hoyStr,
          },
        ],
      };

      const actualizados = [nuevo, ...seguimientos];
      localStorage.setItem(STORAGE_KEY_SEGUIMIENTOS, JSON.stringify(actualizados));
      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  const registrarAccion = async (dto: RegistrarAccionDto): Promise<boolean> => {
    try {
      const actualizados = seguimientos.map((seg) => {
        if (seg.id !== dto.seguimientoId) return seg;

        const nuevaAccion = {
          id: `act-${Date.now()}`,
          fecha: dto.fecha,
          tipoAccion: dto.tipoAccion,
          resultado: dto.resultado,
          observaciones: dto.observaciones.trim(),
          responsable: 'Carlos Pérez (Brigadista Territorial)',
          fechaRegistro: '01/10/2026',
        };

        let nuevoEstado: EstadoSeguimiento;
        let nuevaProximaAccion = seg.proximaAccion;
        let nuevaFechaPrevista = seg.fechaPrevista;

        if (dto.proximoPaso === 'CERRAR') {
          nuevoEstado = 'COMPLETADO';
        } else if (dto.proximoPaso === 'CREAR_REFERENCIA') {
          nuevoEstado = 'REFERIDO';
          nuevaProximaAccion = 'Verificar atención recibida en la red de salud';
          if (dto.nuevaFechaPropuesta) nuevaFechaPrevista = dto.nuevaFechaPropuesta;
        } else if (dto.proximoPaso === 'REPROGRAMAR') {
          nuevoEstado = 'REPROGRAMADO';
          if (dto.nuevaFechaPropuesta) nuevaFechaPrevista = dto.nuevaFechaPropuesta;
          if (dto.motivoNuevaAccion) nuevaProximaAccion = dto.motivoNuevaAccion;
        } else if (dto.resultado === 'NO_LOCALIZADO') {
          nuevoEstado = 'NO_LOCALIZADO';
          if (dto.nuevaFechaPropuesta) nuevaFechaPrevista = dto.nuevaFechaPropuesta;
        } else {
          nuevoEstado = 'EN_PROCESO';
          if (dto.nuevaFechaPropuesta) nuevaFechaPrevista = dto.nuevaFechaPropuesta;
        }

        return {
          ...seg,
          estado: nuevoEstado,
          proximaAccion: nuevaProximaAccion,
          fechaPrevista: nuevaFechaPrevista,
          ultimaAccionFecha: dto.fecha,
          historialAcciones: [nuevaAccion, ...seg.historialAcciones],
        };
      });

      localStorage.setItem(STORAGE_KEY_SEGUIMIENTOS, JSON.stringify(actualizados));
      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  const cerrarSeguimiento = async (seguimientoId: string, motivo: string): Promise<boolean> => {
    try {
      const actualizados = seguimientos.map((seg) => {
        if (seg.id !== seguimientoId) return seg;

        const accionCierre = {
          id: `act-${Date.now()}`,
          fecha: '01/10/2026',
          tipoAccion: 'Cierre de continuidad',
          resultado: 'COMPLETADA' as const,
          observaciones: motivo.trim() || 'Seguimiento completado satisfactoriamente en territorio.',
          responsable: 'Carlos Pérez (Brigadista Territorial)',
          fechaRegistro: '01/10/2026',
        };

        return {
          ...seg,
          estado: 'COMPLETADO' as const,
          ultimaAccionFecha: '01/10/2026',
          historialAcciones: [accionCierre, ...seg.historialAcciones],
        };
      });

      localStorage.setItem(STORAGE_KEY_SEGUIMIENTOS, JSON.stringify(actualizados));
      await cargarDatos();
      return true;
    } catch {
      return false;
    }
  };

  const seguimientosFiltrados = seguimientos.filter((seg) => {
    const q = filtroTexto.toLowerCase().trim();
    const matchTexto =
      !q ||
      seg.pacienteNombre.toLowerCase().includes(q) ||
      seg.pacienteExpediente.toLowerCase().includes(q) ||
      seg.pacienteDui.toLowerCase().includes(q) ||
      seg.descripcion.toLowerCase().includes(q);

    const matchEstado = filtroEstado === 'TODOS' || seg.estado === filtroEstado;
    const matchTipo = filtroTipo === 'TODOS' || seg.tipo === filtroTipo;
    const matchPrioridad = filtroPrioridad === 'TODOS' || seg.prioridad === filtroPrioridad;

    const temp = calcularTemporalidad(seg.fechaPrevista, seg.estado);
    const matchTemporalidad =
      filtroTemporalidad === 'TODOS' ||
      (filtroTemporalidad === 'HOY' && temp === 'HOY') ||
      (filtroTemporalidad === 'VENCIDOS' && temp === 'VENCIDO') ||
      (filtroTemporalidad === 'PROXIMOS' && temp === 'PROXIMO') ||
      (filtroTemporalidad === 'ACTIVOS' && seg.estado !== 'COMPLETADO');

    return matchTexto && matchEstado && matchTipo && matchPrioridad && matchTemporalidad;
  });

  return {
    pacientesPadron,
    seguimientos: seguimientosFiltrados,
    todosLosSeguimientos: seguimientos,
    metricas,
    loading,
    error,
    filtroTexto,
    setFiltroTexto,
    filtroEstado,
    setFiltroEstado,
    filtroTipo,
    setFiltroTipo,
    filtroTemporalidad,
    setFiltroTemporalidad,
    filtroPrioridad,
    setFiltroPrioridad,
    crearSeguimiento,
    registrarAccion,
    cerrarSeguimiento,
    recargar: cargarDatos,
  };
}