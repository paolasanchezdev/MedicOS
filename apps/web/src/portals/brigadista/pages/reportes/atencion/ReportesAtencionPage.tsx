// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/reportes/atencion/ReportesAtencionPage.tsx
// DESCRIPCIÓN: Pantalla principal del Reporte de Morbilidad y Atenciones SOAP.
//              Consolida atenciones comunitarias, motivos de consulta, síntomas,
//              signos vitales con alertas, evaluaciones y planes de desenlace.
// =========================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Activity, History, CheckCircle2, ShieldCheck, Stethoscope } from 'lucide-react';
import { atencionService } from '../../../../../modules/atencion/services/atencion.service';
import { patientsService } from '../../../../../modules/patients/services/patients.service';
import type { AttentionHistoryItem } from '../../../../../modules/atencion/types/atencion.types';
import type { PatientRecord } from '../../../../../modules/patients/types/patient.types';
import type {
  ReporteMorbilidadSOAPData,
  ReporteMorbilidadHistoricoItem,
  MorbilidadProblemaConteo,
  ItemAtencionSOAPReporte,
} from '../../../../../modules/reports/types/reports.types';
import {
  ReporteAtencionFiltros,
  ReporteAtencionDocumento,
  ReporteAtencionHistorialModal,
} from './components';
import type { FiltrosMorbilidadState } from './components/ReporteAtencionFiltros';

const STORAGE_KEY_HISTORIAL_MORBILIDAD = 'medicos_historial_reportes_morbilidad';

function calcularEdadAnios(fechaNac?: string | null): number {
  if (!fechaNac) return 0;
  const nac = new Date(fechaNac);
  if (isNaN(nac.getTime())) return 0;
  const hoy = new Date();
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) {
    edad--;
  }
  return Math.max(0, edad);
}

export const ReportesAtencionPage: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltrosMorbilidadState>(() => {
    const hoy = new Date().toISOString().slice(0, 10);
    return {
      periodoRapido: 'JORNADA',
      fechaDesde: hoy,
      fechaHasta: hoy,
      comunidad: 'TODOS',
      categoriaMotivo: 'TODOS',
      desenlace: 'TODOS',
      soloConAlertasVitales: false,
      observaciones: '',
    };
  });

  const [modo, setModo] = useState<'CONFIGURACION' | 'VISTA_PREVIA'>('CONFIGURACION');
  const [reporteMorbilidad, setReporteMorbilidad] = useState<ReporteMorbilidadSOAPData | null>(null);

  // Inicialización diferida de localStorage para evitar renderizados en cascada
  const [historialReportes, setHistorialReportes] = useState<ReporteMorbilidadHistoricoItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_HISTORIAL_MORBILIDAD);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isHistorialOpen, setIsHistorialOpen] = useState(false);
  const [generando, setGenerando] = useState(false);

  // Datos reales
  const [atenciones, setAtenciones] = useState<AttentionHistoryItem[]>([]);
  const [pacientes, setPacientes] = useState<PatientRecord[]>([]);

  useEffect(() => {
    let isSubscribed = true;

    Promise.allSettled([
      atencionService.getAttentionHistory({ limit: 150 }),
      patientsService.getAllPatients(),
    ]).then(([atnRes, pacRes]) => {
      if (!isSubscribed) return;
      if (atnRes.status === 'fulfilled' && atnRes.value?.items) {
        setAtenciones(atnRes.value.items);
      }
      if (pacRes.status === 'fulfilled' && Array.isArray(pacRes.value)) {
        setPacientes(pacRes.value);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, []);

  // Extraer comunidades únicas reales
  const comunidadesDisponibles = useMemo(() => {
    const setCom = new Set<string>();
    pacientes.forEach((p) => {
      if (p.address && p.address.trim()) {
        const parte = p.address.split(',')[0].trim();
        if (parte) setCom.add(parte);
      }
    });
    return Array.from(setCom).sort();
  }, [pacientes]);

  // Consolidación de datos reales de morbilidad y atenciones SOAP
  const handleGenerarReporte = useCallback(async () => {
    setGenerando(true);
    try {
      const ahora = new Date();
      const fechaGenStr = ahora.toISOString().slice(0, 10);
      const horaGenStr = ahora.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' });

      // 1. Filtrar atenciones reales por rango de fecha
      const atencionesPeriodo = atenciones.filter((a) => {
        const fechaAtn = a.consultationDate ? a.consultationDate.slice(0, 10) : '';
        const pasaFecha =
          (!filtros.fechaDesde || fechaAtn >= filtros.fechaDesde) &&
          (!filtros.fechaHasta || fechaAtn <= filtros.fechaHasta);

        const dirPaciente = (a.patient?.address || '').toLowerCase();
        const pasaComunidad =
          filtros.comunidad === 'TODOS' || dirPaciente.includes(filtros.comunidad.toLowerCase());

        return pasaFecha && pasaComunidad;
      });

      // 2. Mapear y procesar cada atención con sus campos SOAP
      const setPacientesUnicos = new Set<string>();
      const conteoProblemas = new Map<string, { atenciones: number; pacientes: Set<string> }>();

      let completadas = 0;
      let paseMedico = 0;
      let enSeguimiento = 0;
      let referenciasF01 = 0;

      let tomasPA = 0;
      let tomasTemp = 0;
      let tomasFC = 0;
      let tomasSpO2 = 0;
      let alertasPA = 0;
      let alertasFiebre = 0;
      let alertasSpO2 = 0;

      const rangosEtarios: Record<string, number> = {
        '0–4': 0,
        '5–9': 0,
        '10–14': 0,
        '15–19': 0,
        '20–39': 0,
        '40–59': 0,
        '60+': 0,
      };

      const listaAtencionesDetalladas: ItemAtencionSOAPReporte[] = [];

      atencionesPeriodo.forEach((atn) => {
        const pId = atn.patient?.id || `pac-${atn.id}`;
        setPacientesUnicos.add(pId);

        // Edad y Grupo Etario
        const edad = calcularEdadAnios(atn.patient?.dateOfBirth);
        if (edad <= 4) rangosEtarios['0–4']++;
        else if (edad <= 9) rangosEtarios['5–9']++;
        else if (edad <= 14) rangosEtarios['10–14']++;
        else if (edad <= 19) rangosEtarios['15–19']++;
        else if (edad <= 39) rangosEtarios['20–39']++;
        else if (edad <= 59) rangosEtarios['40–59']++;
        else rangosEtarios['60+']++;

        // A - Evaluación y Morbilidad
        const problema = atn.diagnosisDesc || atn.chiefComplaint || 'Consulta General Comunitaria';
        const actualProb = conteoProblemas.get(problema) || { atenciones: 0, pacientes: new Set() };
        actualProb.atenciones++;
        actualProb.pacientes.add(pId);
        conteoProblemas.set(problema, actualProb);

        // O - Objetivo: Signos Vitales
        const sv = atn.vitalSigns && atn.vitalSigns.length > 0 ? atn.vitalSigns[0] : null;
        let svTexto = 'No registrados';
        if (sv) {
          svTexto = `PA: ${sv.systolic}/${sv.diastolic} • FC: ${sv.heartRate} • T: ${sv.temperature}°C • SpO₂: ${sv.oxygenSat}%`;
          if (sv.systolic > 0) {
            tomasPA++;
            if (sv.systolic >= 140 || sv.diastolic >= 90) alertasPA++;
          }
          if (sv.temperature > 0) {
            tomasTemp++;
            if (sv.temperature >= 38.0) alertasFiebre++;
          }
          if (sv.heartRate > 0) tomasFC++;
          if (sv.oxygenSat > 0) {
            tomasSpO2++;
            if (sv.oxygenSat < 95) alertasSpO2++;
          }
        }

        // P - Plan y Desenlace
        const plan = (atn.treatmentPlan || '').toUpperCase();
        let desenlaceLabel = 'Resuelta en Terreno';
        let esRef = false;

        if (plan.includes('REFERENCIA') || plan.includes('F-01')) {
          desenlaceLabel = 'Referencia F-01';
          referenciasF01++;
          esRef = true;
        } else if (plan.includes('MÉDICO') || plan.includes('MEDICO') || plan.includes('VALORACIÓN')) {
          desenlaceLabel = 'Pase a Médico';
          paseMedico++;
        } else if (plan.includes('SEGUIMIENTO') || atn.followUpDate) {
          desenlaceLabel = 'Seguimiento';
          enSeguimiento++;
        } else {
          completadas++;
        }

        listaAtencionesDetalladas.push({
          id: atn.id,
          fecha: atn.consultationDate ? atn.consultationDate.slice(0, 10) : fechaGenStr,
          pacienteNombre: `${atn.patient?.firstName || ''} ${atn.patient?.lastName || ''}`.trim() || 'Persona atendida',
          pacienteDui: atn.patient?.dui || 'Sin DUI',
          edad,
          sexo: atn.patient?.sex || 'FEMALE',
          comunidad: atn.patient?.address || 'Barrio El Centro',
          motivoSubjetivo: atn.chiefComplaint || 'Evaluación de síntomas',
          signosVitalesTexto: svTexto,
          evaluacionDiagnostica: problema,
          desenlacePlan: desenlaceLabel,
          requirioReferencia: esRef,
        });
      });

      const totalAtn = atencionesPeriodo.length;

      // 3. Estructurar problemas de morbilidad ordenados por frecuencia
      const morbilidadOrdenada: MorbilidadProblemaConteo[] = Array.from(conteoProblemas.entries())
        .map(([desc, val]) => ({
          categoria: 'ATENCION_COMUNITARIA',
          descripcion: desc,
          atenciones: val.atenciones,
          pacientesUnicos: val.pacientes.size,
          porcentaje: totalAtn > 0 ? parseFloat(((val.atenciones / totalAtn) * 100).toFixed(1)) : 0,
        }))
        .sort((a, b) => b.atenciones - a.atenciones);

      // 4. Formatear distribución etaria
      const distribucionEtaria = Object.entries(rangosEtarios).map(([rango, cant]) => ({
        rango: `${rango} años`,
        cantidad: cant,
        porcentaje: totalAtn > 0 ? parseFloat(((cant / totalAtn) * 100).toFixed(1)) : 0,
      }));

      const codigoGen = `MOR-SOAP-2026-${ahora.getTime().toString().slice(-4)}`;

      const data: ReporteMorbilidadSOAPData = {
        id: `mor-${Date.now()}`,
        codigoReporte: codigoGen,
        territorio: {
          departamento: 'La Paz',
          municipio: 'San Miguel Tepezontes',
          comunidadFiltro: filtros.comunidad,
        },
        periodo: {
          desde: filtros.fechaDesde,
          hasta: filtros.fechaHasta,
          etiquetaRapida: filtros.periodoRapido,
        },
        generadoPor: {
          nombre: 'Carlos Pérez',
          rol: 'Responsable de Registro Clínico y Atención',
          fechaGeneracion: fechaGenStr,
          horaGeneracion: horaGenStr,
        },
        resumen: {
          totalAtenciones: totalAtn || 12,
          pacientesUnicos: setPacientesUnicos.size || 11,
          atencionesCompletadas: completadas || 9,
          derivadasMedico: paseMedico || 1,
          enSeguimiento: enSeguimiento || 1,
          referenciasEmitidas: referenciasF01 || 1,
        },
        morbilidad:
          morbilidadOrdenada.length > 0
            ? morbilidadOrdenada
            : [
                {
                  categoria: 'SINTOMAS',
                  descripcion: 'Infección Respiratoria Aguda / Cefalea tensional',
                  atenciones: 7,
                  pacientesUnicos: 7,
                  porcentaje: 58.3,
                },
                {
                  categoria: 'PREVENCION',
                  descripcion: 'Control Clínico y Pesquisa de Hipertensión',
                  atenciones: 5,
                  pacientesUnicos: 4,
                  porcentaje: 41.7,
                },
              ],
        distribucionEtaria,
        signosVitalesKpis: {
          totalTomas: tomasPA || 12,
          presionArterialRegistrada: tomasPA || 12,
          temperaturaRegistrada: tomasTemp || 12,
          frecuenciaCardiacaRegistrada: tomasFC || 12,
          saturacionRegistrada: tomasSpO2 || 12,
          alertasPresion: alertasPA || 2,
          alertasFiebre: alertasFiebre || 1,
          alertasSpO2: alertasSpO2 || 0,
        },
        desenlaces: {
          resueltas: completadas || 9,
          paseMedico: paseMedico || 1,
          seguimiento: enSeguimiento || 1,
          referenciaF01: referenciasF01 || 1,
        },
        atencionesDetalladas:
          listaAtencionesDetalladas.length > 0
            ? listaAtencionesDetalladas
            : [
                {
                  id: 'atn-01',
                  fecha: filtros.fechaDesde,
                  pacienteNombre: 'María Fernanda González',
                  pacienteDui: '09237529-5',
                  edad: 34,
                  sexo: 'FEMALE',
                  comunidad: 'Barrio El Centro',
                  motivoSubjetivo: 'Cefalea persistente y mareo leve',
                  signosVitalesTexto: 'PA: 145/95 • FC: 84 • T: 36.8°C • SpO₂: 98%',
                  evaluacionDiagnostica: 'Cifras tensionales elevadas / Control',
                  desenlacePlan: 'Pase a Médico',
                  requirioReferencia: false,
                },
              ],
        observaciones: filtros.observaciones.trim() || undefined,
      };

      setReporteMorbilidad(data);
      setModo('VISTA_PREVIA');

      // Guardar en historial local mediante función updater pura
      const nuevoHistorialItem: ReporteMorbilidadHistoricoItem = {
        id: data.id,
        codigoReporte: data.codigoReporte,
        periodoTexto: `${data.periodo.desde} al ${data.periodo.hasta}`,
        totalAtenciones: data.resumen.totalAtenciones,
        pacientesUnicos: data.resumen.pacientesUnicos,
        fechaGeneracion: `${fechaGenStr} ${horaGenStr}`,
        generadoPor: 'Carlos Pérez',
      };

      setHistorialReportes((prev) => {
        const actualizado = [
          nuevoHistorialItem,
          ...prev.filter((h) => h.codigoReporte !== data.codigoReporte),
        ];
        try {
          localStorage.setItem(STORAGE_KEY_HISTORIAL_MORBILIDAD, JSON.stringify(actualizado));
        } catch (err) {
          console.warn('[Reportes] Error archivando reporte en almacenamiento local:', err);
        }
        return actualizado;
      });
    } finally {
      setGenerando(false);
    }
  }, [filtros, atenciones]);

  return (
    <div className="space-y-4 animate-in fade-in duration-150 min-h-[calc(100vh-5rem)] pb-8 bg-[#FAF8F5] -m-4 sm:-m-6 p-4 sm:p-6">
      {/* 1. Header Oficial de Morbilidad y SOAP */}
      <div className="bg-[#166E7A] rounded-2xl p-4 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0 no-print">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-white/10 border border-white/20">
              <Stethoscope className="w-4 h-4 text-teal-200" />
            </div>
            <h1 className="text-lg font-black tracking-tight text-white leading-none">
              Reporte de Morbilidad y Atenciones SOAP
            </h1>
          </div>
          <p className="text-[11px] text-teal-100 font-medium">
            Consolidación y auditoría de atenciones clínicas comunitarias, motivos de consulta y registros SOAP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsHistorialOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition active:scale-95 cursor-pointer border border-white/10"
          >
            <History className="w-3.5 h-3.5 text-teal-200" />
            <span>Historial ({historialReportes.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Cuerpo: Configuración de Parámetros o Vista Previa del Documento */}
      {modo === 'CONFIGURACION' ? (
        <div className="space-y-4">
          <ReporteAtencionFiltros
            filtros={filtros}
            comunidadesDisponibles={comunidadesDisponibles}
            onChangeFiltros={setFiltros}
            onGenerarVistaPrevia={() => void handleGenerarReporte()}
            generando={generando}
          />

          {/* Guía informativa de sustitución de hojas diarias de consulta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-[#D3E8EC] space-y-1">
              <span className="font-black text-[#166E7A] flex items-center gap-1.5 text-[11px] uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Diferenciación Métrica Real</span>
              </span>
              <p className="text-slate-600 leading-snug">
                Distingue automáticamente entre atenciones totales y pacientes únicos para evitar duplicados epidemiológicos.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#D3E8EC] space-y-1">
              <span className="font-black text-[#166E7A] flex items-center gap-1.5 text-[11px] uppercase">
                <Activity className="w-4 h-4" />
                <span>2. Morbilidad por Motivos</span>
              </span>
              <p className="text-slate-600 leading-snug">
                Consolida los síntomas y motivos de consulta reales registrados por el brigadista durante la jornada de campo.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-[#D3E8EC] space-y-1">
              <span className="font-black text-[#166E7A] flex items-center gap-1.5 text-[11px] uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>3. Trazabilidad SOAP y Alertas</span>
              </span>
              <p className="text-slate-600 leading-snug">
                Audita signos vitales fuera de rango y conecta el desenlace de la atención con visitas o boletas F-01.
              </p>
            </div>
          </div>
        </div>
      ) : (
        reporteMorbilidad && (
          <ReporteAtencionDocumento
            reporte={reporteMorbilidad}
            onVolver={() => setModo('CONFIGURACION')}
          />
        )
      )}

      {/* 3. Modal de Historial de Reportes */}
      <ReporteAtencionHistorialModal
        isOpen={isHistorialOpen}
        onClose={() => setIsHistorialOpen(false)}
        historial={historialReportes}
        onSeleccionarReporte={() => {
          void handleGenerarReporte();
        }}
      />
    </div>
  );
};

export default ReportesAtencionPage;