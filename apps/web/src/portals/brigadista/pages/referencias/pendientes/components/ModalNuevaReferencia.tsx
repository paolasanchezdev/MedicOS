// =========================================================================
// ARCHIVO: ModalNuevaReferencia.tsx
// DESCRIPCIÓN: Formulario flotante en el centro de la pantalla para emisión
//              del F-01 oficial, sin espacios vacíos ni páginas aisladas.
// =========================================================================

import React, { useState, useMemo } from 'react';
import {
  X,
  Share2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Search,
  Check,
} from 'lucide-react';
import type { PatientRecord } from '../../../../../../modules/patients/types/patient.types';
import type { Establishment } from '../../../../../../modules/establishments/types/establishment.types';
import type {
  CategoriaReferencia,
  MedioTraslado,
  ReferencePriority,
  SignosVitalesReferencia,
  CreateCommunityReferenceDTO,
} from '../../../../../../modules/references/types/reference.types';
import { DocumentoF01Oficial } from './DocumentoF01Oficial';

interface ModalNuevaReferenciaProps {
  isOpen: boolean;
  onClose: () => void;
  pacientesPadron: PatientRecord[];
  establecimientos: Establishment[];
  onGuardar: (dto: CreateCommunityReferenceDTO) => Promise<unknown>;
}

export const ModalNuevaReferencia: React.FC<ModalNuevaReferenciaProps> = ({
  isOpen,
  onClose,
  pacientesPadron,
  establecimientos,
  onGuardar,
}) => {
  const [paso, setPaso] = useState<number>(1);

  // Inicialización diferida de metadatos para garantizar pureza en hooks
  const [emisionMetadata] = useState(() => {
    const ahora = new Date();
    return {
      folio: `F01-${ahora.getTime().toString().slice(-6)}`,
      fecha: ahora.toISOString().slice(0, 10),
      hora: ahora.toLocaleTimeString('es-SV', { hour: '2-digit', minute: '2-digit' }),
    };
  });

  // Paso 1: Paciente y Causa
  const [pacienteId, setPacienteId] = useState<string>('');
  const [busquedaPaciente, setBusquedaPaciente] = useState<string>('');
  const [categoria, setCategoria] = useState<CategoriaReferencia>('VALORACION_MEDICA');
  const [reason, setReason] = useState<string>('');
  const [situacionEncontrada, setSituacionEncontrada] = useState<string>('');
  const [priority, setPriority] = useState<ReferencePriority>('MEDIUM');

  // Paso 2: Buscador en tiempo real de Establecimiento Destino
  const [busquedaEstablecimiento, setBusquedaEstablecimiento] = useState<string>('');
  const [filtroTipoEstablecimiento, setFiltroTipoEstablecimiento] = useState<string>('TODOS');
  const [establishmentId, setEstablishmentId] = useState<string>('');

  // Signos vitales y Traslado
  const [pa, setPa] = useState<string>('');
  const [fc, setFc] = useState<string>('');
  const [temp, setTemp] = useState<string>('');
  const [spo2, setSpo2] = useState<string>('');
  const [medioTraslado, setMedioTraslado] = useState<MedioTraslado>('PROPIO');
  const [acompananteNombre, setAcompananteNombre] = useState<string>('');

  const [guardando, setGuardando] = useState<boolean>(false);

  // Filtrado en tiempo real de pacientes
  const pacientesFiltrados = useMemo(() => {
    const q = busquedaPaciente.toLowerCase().trim();
    if (!q) return pacientesPadron;
    return pacientesPadron.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        (p.dui && p.dui.includes(q))
    );
  }, [pacientesPadron, busquedaPaciente]);

  // Filtrado en tiempo real de hospitales y centros de salud
  const establecimientosFiltrados = useMemo(() => {
    const q = busquedaEstablecimiento.toLowerCase().trim();
    return establecimientos.filter((e) => {
      const matchTipo =
        filtroTipoEstablecimiento === 'TODOS' || e.type === filtroTipoEstablecimiento;
      const matchTexto =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.municipality.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        (e.address && e.address.toLowerCase().includes(q));
      return matchTipo && matchTexto;
    });
  }, [establecimientos, busquedaEstablecimiento, filtroTipoEstablecimiento]);

  const pacienteSeleccionado = pacientesPadron.find((p) => p.id === pacienteId);
  const establecimientoSeleccionado = establecimientos.find((e) => e.id === establishmentId);

  if (!isOpen) return null;

  const handleCompletar = async () => {
    if (!pacienteId || !establishmentId || !reason.trim()) return;

    setGuardando(true);
    try {
      const sv: SignosVitalesReferencia = {};
      if (pa) sv.presionArterial = pa;
      if (fc) sv.frecuenciaCardiaca = fc;
      if (temp) sv.temperatura = temp;
      if (spo2) sv.saturacionOxigeno = spo2;

      await onGuardar({
        patientId: pacienteId,
        establishmentId,
        categoria,
        reason: reason.trim(),
        situacionEncontrada: situacionEncontrada.trim() || undefined,
        clinicalSummary: situacionEncontrada.trim() || 'Referencia emitida en jornada territorial de salud.',
        signosVitales: Object.keys(sv).length > 0 ? sv : undefined,
        priority,
        medioTraslado,
        acompananteNombre: acompananteNombre.trim() || undefined,
      });

      setPaso(1);
      onClose();
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-[#D3E8EC] shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Cabecera Flotante F-01 */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/95 shrink-0 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-50 text-[#166E7A] border border-teal-200">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#1A282D] tracking-tight">
                  Emisión de Referencia Médica
                </h3>
                <span className="font-mono text-[10px] font-black text-[#166E7A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Boleta Oficial F-01 MINSAL
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Paso {paso} de 3 • Continuidad asistencial hacia la red nacional de salud
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Superior */}
        <div className="px-6 py-2.5 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between text-xs font-bold shrink-0 no-print">
          {[
            { num: 1, label: '1. Paciente y Causa' },
            { num: 2, label: '2. Buscador de Destino y Signos' },
            { num: 3, label: '3. Boleta Oficial F-01' },
          ].map((st) => (
            <div
              key={st.num}
              className={`flex items-center gap-2 ${
                paso === st.num ? 'text-[#166E7A]' : paso > st.num ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10.5px] ${
                  paso === st.num
                    ? 'bg-[#166E7A] text-white shadow-xs'
                    : paso > st.num
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {st.num}
              </span>
              <span>{st.label}</span>
            </div>
          ))}
        </div>

        {/* Contenido Flexible */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* PASO 1: PACIENTE Y CAUSA */}
          {paso === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Persona / Paciente a Referir
                </label>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={busquedaPaciente}
                    onChange={(e) => setBusquedaPaciente(e.target.value)}
                    placeholder="Filtrar paciente por nombre o DUI..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl mb-1 focus:outline-none focus:border-[#166E7A]"
                  />
                </div>

                <select
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] font-medium text-slate-800"
                >
                  <option value="">-- Seleccionar Persona del Padrón Nominal ({pacientesFiltrados.length}) --</option>
                  {pacientesFiltrados.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} • DUI: {p.dui || 'Sin DUI'} • {p.address}
                    </option>
                  ))}
                </select>

                {pacienteSeleccionado && (
                  <div className="mt-2 p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Paciente</span>
                      <span className="font-black text-[#1A282D] text-sm">
                        {pacienteSeleccionado.firstName} {pacienteSeleccionado.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">DUI</span>
                      <span className="font-bold text-slate-800">{pacienteSeleccionado.dui || 'Sin DUI'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Comunidad</span>
                      <span className="font-bold text-slate-800 truncate block">{pacienteSeleccionado.address || 'Asignada'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Categoría y Prioridad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Categoría de Derivación</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaReferencia)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  >
                    <option value="VALORACION_MEDICA">Valoración Médica</option>
                    <option value="EMERGENCIA">Emergencia Clínica</option>
                    <option value="ESTUDIOS_DIAGNOSTICOS">Estudios Diagnósticos</option>
                    <option value="ATENCION_ESPECIALIZADA">Atención Especializada</option>
                    <option value="SALUD_MATERNA">Salud Materna</option>
                    <option value="SALUD_INFANTIL">Salud Infantil</option>
                    <option value="OTRO">Otro Motivo</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prioridad Clínica</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ReferencePriority)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="LOW">Normal (Programable)</option>
                    <option value="MEDIUM">Prioritaria (Atención en días próximos)</option>
                    <option value="HIGH">Alta (Atención pronta)</option>
                    <option value="URGENT">Urgente (Traslado inmediato)</option>
                  </select>
                </div>
              </div>

              {/* Motivo */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Motivo de la Referencia
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ej. Cefalea persistente y cifras tensionales elevadas..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] font-semibold text-slate-800"
                />
              </div>

              {/* Situación encontrada */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Situación Clínica Encontrada en Comunidad
                </label>
                <textarea
                  value={situacionEncontrada}
                  onChange={(e) => setSituacionEncontrada(e.target.value)}
                  rows={2}
                  placeholder="Detalla los hallazgos en terreno o la condición física de la persona..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A]"
                />
              </div>
            </div>
          )}

          {/* PASO 2: BUSCADOR EN TIEMPO REAL DE HOSPITALES + SIGNOS */}
          {paso === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Buscador de Establecimientos */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#166E7A]" />
                    <span>Establecimiento Receptor de la Red</span>
                  </label>
                  <span className="text-[10.5px] font-bold text-slate-500">
                    {establecimientosFiltrados.length} disponibles
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={busquedaEstablecimiento}
                      onChange={(e) => setBusquedaEstablecimiento(e.target.value)}
                      placeholder="Buscar por hospital, municipio, depto o tipo (ej. Rosales, Tepezontes)..."
                      className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] font-medium"
                    />
                  </div>

                  <select
                    value={filtroTipoEstablecimiento}
                    onChange={(e) => setFiltroTipoEstablecimiento(e.target.value)}
                    className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700"
                  >
                    <option value="TODOS">Todos</option>
                    <option value="HOSPITAL">Hospitales</option>
                    <option value="HEALTH_CENTER">Unidades de Salud</option>
                    <option value="CLINIC">Clínicas</option>
                  </select>
                </div>

                {/* Lista de Resultados con Selección Visual Directa */}
                <div className="border border-slate-200 rounded-2xl max-h-48 overflow-y-auto divide-y divide-slate-100 bg-[#FAF8F5]/60">
                  {establecimientosFiltrados.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No se encontraron centros de salud con el término ingresado.
                    </div>
                  ) : (
                    establecimientosFiltrados.map((est) => {
                      const isSelected = establishmentId === est.id;
                      return (
                        <div
                          key={est.id}
                          onClick={() => setEstablishmentId(est.id)}
                          className={`p-3 transition cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-teal-50/90 border-l-4 border-[#166E7A]'
                              : 'bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h5 className="text-xs font-black text-slate-900 truncate">
                                {est.name}
                              </h5>
                              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-black uppercase bg-slate-100 text-slate-700 border border-slate-200">
                                {est.type}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold text-[#166E7A] bg-teal-50 border border-teal-200">
                                {est.level}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{est.municipality}, {est.department}</span>
                              {est.phone && (
                                <>
                                  <span className="text-slate-300">•</span>
                                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{est.phone}</span>
                                </>
                              )}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {isSelected ? (
                              <div className="w-6 h-6 rounded-full bg-[#166E7A] text-white flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 stroke-3" />
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="px-2.5 py-1 text-[11px] font-bold text-[#166E7A] bg-teal-50 border border-teal-200 rounded-lg"
                              >
                                Seleccionar
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {establecimientoSeleccionado && (
                  <div className="p-3 rounded-2xl bg-teal-50/80 border border-teal-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-[#166E7A] block">
                        Destino Seleccionado:
                      </span>
                      <strong className="text-slate-900 text-xs">{establecimientoSeleccionado.name}</strong>
                      <span className="text-slate-600 block text-[11px]">
                        {establecimientoSeleccionado.municipality}, {establecimientoSeleccionado.department}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-black text-[#166E7A] bg-white px-2 py-0.5 rounded border border-teal-200">
                      Nivel {establecimientoSeleccionado.level}
                    </span>
                  </div>
                )}
              </div>

              {/* Signos Vitales */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-700 block">
                  Signos Vitales Tomados en Terreno
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">P. Arterial</label>
                    <input
                      type="text"
                      value={pa}
                      onChange={(e) => setPa(e.target.value)}
                      placeholder="120/80"
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">F. Cardíaca</label>
                    <input
                      type="text"
                      value={fc}
                      onChange={(e) => setFc(e.target.value)}
                      placeholder="78 lpm"
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Temperatura</label>
                    <input
                      type="text"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      placeholder="36.8 °C"
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">SpO₂</label>
                    <input
                      type="text"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      placeholder="98 %"
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Medio de Traslado y Acompañante */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Medio de Traslado</label>
                  <select
                    value={medioTraslado}
                    onChange={(e) => setMedioTraslado(e.target.value as MedioTraslado)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="PROPIO">Por cuenta propia</option>
                    <option value="FAMILIAR">Acompañado por familiar</option>
                    <option value="INSTITUCIONAL">Transporte institucional</option>
                    <option value="AMBULANCIA">Ambulancia SEM</option>
                    <option value="OTRO">Otro medio</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Acompañante Responsable</label>
                  <input
                    type="text"
                    value={acompananteNombre}
                    onChange={(e) => setAcompananteNombre(e.target.value)}
                    placeholder="Familiar o tutor..."
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: BOLETA OFICIAL F-01 COMPLETA CON METADATOS PUROS */}
          {paso === 3 && pacienteSeleccionado && establecimientoSeleccionado && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <DocumentoF01Oficial
                folio={emisionMetadata.folio}
                fechaEmision={emisionMetadata.fecha}
                horaEmision={emisionMetadata.hora}
                paciente={{
                  nombre: `${pacienteSeleccionado.firstName} ${pacienteSeleccionado.lastName}`.trim(),
                  dui: pacienteSeleccionado.dui || 'Sin DUI',
                  direccion: pacienteSeleccionado.address || 'Comunidad territorial asignada',
                  telefono: pacienteSeleccionado.phone || 'No registrado',
                  expediente: pacienteSeleccionado.clinicalRecord?.id
                    ? `EXP-2026-${pacienteSeleccionado.clinicalRecord.id.slice(0, 4).toUpperCase()}`
                    : undefined,
                }}
                establecimientoDestino={{
                  nombre: establecimientoSeleccionado.name,
                  tipo: establecimientoSeleccionado.type,
                  nivel: establecimientoSeleccionado.level,
                  departamento: establecimientoSeleccionado.department,
                  municipio: establecimientoSeleccionado.municipality,
                  telefono: establecimientoSeleccionado.phone || undefined,
                  direccion: establecimientoSeleccionado.address,
                }}
                brigadista={{
                  nombre: 'Carlos Pérez',
                  rol: 'Brigadista Territorial de Salud',
                  brigada: 'Brigada Territorial San Miguel Tepezontes',
                }}
                categoria={categoria}
                prioridad={priority}
                motivo={reason}
                situacionEncontrada={situacionEncontrada}
                clinicalSummary={situacionEncontrada}
                signosVitales={{
                  presionArterial: pa || undefined,
                  frecuenciaCardiaca: fc || undefined,
                  temperatura: temp || undefined,
                  saturacionOxigeno: spo2 || undefined,
                }}
                traslado={{
                  medio: medioTraslado,
                  acompanante: acompananteNombre || undefined,
                }}
                mostrarAccionesImpresion={true}
              />
            </div>
          )}
        </div>

        {/* Pie Fijo */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/95 flex items-center justify-between shrink-0 no-print">
          {paso > 1 ? (
            <button
              type="button"
              onClick={() => setPaso((p) => p - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Atrás</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
          )}

          {paso < 3 ? (
            <button
              type="button"
              disabled={paso === 1 ? !pacienteId || !reason.trim() : !establishmentId}
              onClick={() => setPaso((p) => p + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-40"
            >
              <span>Continuar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={guardando}
              onClick={() => void handleCompletar()}
              className="inline-flex items-center gap-1.5 px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-xs transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{guardando ? 'Guardando en Base de Datos...' : 'Guardar y Emitir Boleta F-01'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalNuevaReferencia;