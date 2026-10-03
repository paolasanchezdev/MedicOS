// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/mapa/ubicacion/UbicacionPage.tsx
// DESCRIPCIÓN: Pantalla principal de Mapa Territorial y Georreferenciación.
//              Inicia siempre centrado en el territorio real de la brigada
//              (San Miguel Tepezontes) sin teletransportación por IP del ISP.
// =========================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Compass, Navigation, Layers, RefreshCw, MapPin } from 'lucide-react';
import { useHospitals } from '../../../../../modules/establishments';
import { useVisits } from '../../../../../modules/visits/hooks/useVisits';
import { useReferences } from '../../../../../modules/references/hooks/useReferences';
import { patientsService } from '../../../../../modules/patients/services/patients.service';
import type { PatientRecord } from '../../../../../modules/patients/types/patient.types';
import {
  MapaBusqueda,
  MapaCapas,
  MapaPanelDetalle,
  CercaDeMiModal,
  MapaTerritorial,
} from './components';
import type { ElementoBusquedaMapa } from './components/MapaBusqueda';
import type { EstadoCapasMapa } from './components/MapaCapas';

// Coordenada base comunitaria real de la brigada: San Miguel Tepezontes, La Paz, El Salvador
const COORDENADA_BRIGADA_TEPEZONTES = { lat: 13.6231, lng: -89.0278 };

function calcularDistanciaKm(
  origen: { lat: number; lng: number },
  destino: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((destino.lat - origen.lat) * Math.PI) / 180;
  const dLng = ((destino.lng - origen.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origen.lat * Math.PI) / 180) *
      Math.cos((destino.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

function extraerCoordenadaReal(paciente: PatientRecord): { lat: number; lng: number } | null {
  if (
    typeof paciente.latitude === 'number' &&
    typeof paciente.longitude === 'number' &&
    !isNaN(paciente.latitude) &&
    !isNaN(paciente.longitude)
  ) {
    return { lat: paciente.latitude, lng: paciente.longitude };
  }

  const texto = (paciente.address || '').trim();
  const match = texto.match(/(-?\d{1,2}\.\d+)[,\s]+(-?\d{1,3}\.\d+)/);
  if (match) {
    const lat = parseFloat(match[1]);
    const lng = parseFloat(match[2]);
    if (lat >= 13.0 && lat <= 14.5 && lng >= -90.2 && lng <= -87.6) {
      return { lat, lng };
    }
  }

  return null;
}

export const UbicacionPage: React.FC = () => {
  // Inicializa siempre en San Miguel Tepezontes a nivel de calle (zoom 15)
  const [miUbicacion, setMiUbicacion] = useState(COORDENADA_BRIGADA_TEPEZONTES);
  const [centroCamara, setCentroCamara] = useState(COORDENADA_BRIGADA_TEPEZONTES);
  const [zoomCamara, setZoomCamara] = useState(15);
  const [cargandoGPS, setCargandoGPS] = useState(false);
  const [avisoIsp, setAvisoIsp] = useState<string | null>(null);

  // Capas del Territorio
  const [capas, setCapas] = useState<EstadoCapasMapa>({
    establecimientos: true,
    visitas: true,
    pacientes: true,
    referencias: false,
  });

  // Datos de Dominio Reales
  const { hospitals: establecimientos } = useHospitals();
  const { visitas, iniciarVisita, recargar: recargarVisitas } = useVisits();
  const { references: referencias, fetchReferences: recargarReferencias } = useReferences();
  const [pacientes, setPacientes] = useState<PatientRecord[]>([]);

  // Interfaz
  const [elementoSeleccionado, setElementoSeleccionado] = useState<ElementoBusquedaMapa | null>(null);
  const [isCercaDeMiOpen, setIsCercaDeMiOpen] = useState(false);

  // Carga asíncrona de pacientes al montar
  useEffect(() => {
    let isSubscribed = true;

    patientsService
      .getAllPatients()
      .then((res) => {
        if (isSubscribed) {
          setPacientes(res || []);
        }
      })
      .catch(() => {
        if (isSubscribed) {
          setPacientes([]);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleRecargarPacientes = useCallback(async () => {
    try {
      const res = await patientsService.getAllPatients();
      setPacientes(res || []);
    } catch {
      setPacientes([]);
    }
  }, []);

  // Volver a centrar en el territorio de la brigada
  const handleCentrarEnBrigada = () => {
    setMiUbicacion(COORDENADA_BRIGADA_TEPEZONTES);
    setCentroCamara(COORDENADA_BRIGADA_TEPEZONTES);
    setZoomCamara(15);
    setAvisoIsp(null);
  };

  // Geolocalización activa disparada voluntariamente por el usuario
  const handleLocalizarme = () => {
    if (!navigator.geolocation) return;
    setCargandoGPS(true);
    setAvisoIsp(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setMiUbicacion(coords);
        setCentroCamara(coords);
        setZoomCamara(16);
        setCargandoGPS(false);

        // Si la precisión es mayor a 500m (común en laptops/Wi-Fi), se informa al brigadista
        if (pos.coords.accuracy > 500) {
          setAvisoIsp('Ubicación aproximada por red Wi-Fi. Puedes arrastrar el marcador verde a tu posición exacta.');
        }
      },
      () => {
        setCargandoGPS(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Consolidar únicamente elementos que sí tienen coordenadas reales
  const todosLosElementos = useMemo<ElementoBusquedaMapa[]>(() => {
    const lista: ElementoBusquedaMapa[] = [];

    // 1. Establecimientos con coordenadas en PostgreSQL
    if (capas.establecimientos) {
      establecimientos.forEach((est) => {
        if (typeof est.latitude === 'number' && typeof est.longitude === 'number') {
          const coord = { lat: est.latitude, lng: est.longitude };
          lista.push({
            id: est.id,
            tipo: 'ESTABLECIMIENTO',
            titulo: est.name,
            subtitulo: `${est.type} • ${est.municipality || 'El Salvador'}`,
            coordenadas: coord,
            distanciaKm: calcularDistanciaKm(miUbicacion, coord),
          });
        }
      });
    }

    // 2. Pacientes con coordenadas reales capturadas
    if (capas.pacientes) {
      pacientes.forEach((p) => {
        const coordReal = extraerCoordenadaReal(p);
        if (coordReal) {
          lista.push({
            id: p.id,
            tipo: 'PACIENTE',
            titulo: `${p.firstName} ${p.lastName}`.trim(),
            subtitulo: p.address || 'Ubicación georreferenciada',
            coordenadas: coordReal,
            distanciaKm: calcularDistanciaKm(miUbicacion, coordReal),
          });
        }
      });
    }

    // 3. Visitas domiciliarias con ubicación de vivienda
    if (capas.visitas) {
      visitas.forEach((v) => {
        const pacienteRel = pacientes.find((p) => p.id === v.patientId);
        const coordReal = pacienteRel ? extraerCoordenadaReal(pacienteRel) : null;

        if (coordReal) {
          lista.push({
            id: v.id,
            tipo: 'VISITA',
            titulo: v.patientName || 'Visita Domiciliaria',
            subtitulo: `${v.status} • ${v.reason}`,
            coordenadas: coordReal,
            distanciaKm: calcularDistanciaKm(miUbicacion, coordReal),
          });
        }
      });
    }

    // 4. Referencias a la red (coordenadas del centro receptor)
    if (capas.referencias) {
      referencias.forEach((r) => {
        const estReceptor = establecimientos.find((e) => e.id === r.establishmentId);
        if (
          estReceptor &&
          typeof estReceptor.latitude === 'number' &&
          typeof estReceptor.longitude === 'number'
        ) {
          const coordRef = { lat: estReceptor.latitude, lng: estReceptor.longitude };
          lista.push({
            id: r.id,
            tipo: 'REFERENCIA',
            titulo: `Ref. ${r.folioF01}: ${r.patientName}`,
            subtitulo: `Destino: ${r.establishmentName} (${r.status})`,
            coordenadas: coordRef,
            distanciaKm: calcularDistanciaKm(miUbicacion, coordRef),
          });
        }
      });
    }

    return lista;
  }, [capas, establecimientos, visitas, pacientes, referencias, miUbicacion]);

  // Total de pacientes georreferenciados reales
  const pacientesGeorreferenciadosCount = useMemo(() => {
    return pacientes.filter((p) => extraerCoordenadaReal(p) !== null).length;
  }, [pacientes]);

  const elementosCercanos = useMemo(() => {
    return [...todosLosElementos].sort(
      (a, b) => (a.distanciaKm || 0) - (b.distanciaKm || 0)
    );
  }, [todosLosElementos]);

  const handleSeleccionar = (el: ElementoBusquedaMapa) => {
    setElementoSeleccionado(el);
    setCentroCamara(el.coordenadas);
    setZoomCamara(16);
  };

  const datosDetalle = useMemo<Record<string, unknown>>(() => {
    if (!elementoSeleccionado) return {};
    if (elementoSeleccionado.tipo === 'ESTABLECIMIENTO') {
      const e = establecimientos.find((item) => item.id === elementoSeleccionado.id);
      return (e as unknown as Record<string, unknown>) || {};
    }
    if (elementoSeleccionado.tipo === 'VISITA') {
      const v = visitas.find((item) => item.id === elementoSeleccionado.id);
      return (v as unknown as Record<string, unknown>) || {};
    }
    if (elementoSeleccionado.tipo === 'PACIENTE') {
      const p = pacientes.find((item) => item.id === elementoSeleccionado.id);
      return (p as unknown as Record<string, unknown>) || {};
    }
    if (elementoSeleccionado.tipo === 'REFERENCIA') {
      const r = referencias.find((item) => item.id === elementoSeleccionado.id);
      return (r as unknown as Record<string, unknown>) || {};
    }
    return {};
  }, [elementoSeleccionado, establecimientos, visitas, pacientes, referencias]);

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] -m-4 sm:-m-6 p-3 sm:p-4 space-y-2.5 bg-[#FAF8F5]">
      {/* Encabezado */}
      <div className="bg-[#166E7A] rounded-2xl p-3.5 sm:p-4 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-white/10 border border-white/20">
              <Compass className="w-4 h-4 text-teal-200" />
            </div>
            <h1 className="text-lg font-black tracking-tight text-white leading-none">
              Mapa Territorial y Georreferenciación
            </h1>
          </div>
          <p className="text-[11px] text-teal-100 font-medium">
            Visualiza información relevante para el trabajo de campo de la brigada.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              void recargarVisitas();
              void recargarReferencias();
              void handleRecargarPacientes();
            }}
            title="Refrescar datos"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer border border-white/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleCentrarEnBrigada}
            title="Centrar en San Miguel Tepezontes"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition active:scale-95 cursor-pointer border border-white/10"
          >
            <MapPin className="w-3.5 h-3.5 text-teal-200" />
            <span>Zona de Brigada</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCercaDeMiOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition active:scale-95 cursor-pointer border border-white/10"
          >
            <Layers className="w-3.5 h-3.5 text-teal-200" />
            <span>Cerca de mí</span>
          </button>

          <button
            type="button"
            onClick={handleLocalizarme}
            disabled={cargandoGPS}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-[#166E7A] text-xs font-black shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Navigation className={`w-3.5 h-3.5 ${cargandoGPS ? 'animate-spin' : ''}`} />
            <span>{cargandoGPS ? 'Localizando...' : 'Mi Ubicación'}</span>
          </button>
        </div>
      </div>

      {avisoIsp && (
        <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between shrink-0">
          <span>{avisoIsp}</span>
          <button
            type="button"
            onClick={() => setAvisoIsp(null)}
            className="text-amber-700 hover:text-amber-900 underline ml-2 text-[11px] cursor-pointer"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Visor Cartográfico Principal */}
      <div className="flex-1 relative rounded-3xl overflow-hidden shadow-xs border border-[#D3E8EC]">
        {/* Buscador Universal */}
        <MapaBusqueda
          elementos={todosLosElementos}
          onSeleccionar={handleSeleccionar}
        />

        {/* Control de Capas */}
        <MapaCapas
          capas={capas}
          onToggleCapa={(capa) => setCapas((prev) => ({ ...prev, [capa]: !prev[capa] }))}
          conteos={{
            establecimientos: establecimientos.filter((e) => typeof e.latitude === 'number').length,
            visitas: todosLosElementos.filter((e) => e.tipo === 'VISITA').length,
            pacientes: pacientesGeorreferenciadosCount,
            referencias: todosLosElementos.filter((e) => e.tipo === 'REFERENCIA').length,
          }}
        />

        {/* Mapa Leaflet */}
        <MapaTerritorial
          centro={centroCamara}
          zoom={zoomCamara}
          miUbicacion={miUbicacion}
          elementos={todosLosElementos}
          onSeleccionar={handleSeleccionar}
          onCambiarMiUbicacion={(coords) => {
            setMiUbicacion(coords);
          }}
        />

        {/* Panel de Detalle de la Entidad */}
        <MapaPanelDetalle
          elemento={elementoSeleccionado}
          datosDetalle={datosDetalle}
          onClose={() => setElementoSeleccionado(null)}
          onIniciarVisita={async (visId) => {
            await iniciarVisita(visId);
            setElementoSeleccionado(null);
          }}
        />
      </div>

      {/* Modal Cerca de Mí */}
      <CercaDeMiModal
        isOpen={isCercaDeMiOpen}
        onClose={() => setIsCercaDeMiOpen(false)}
        elementos={elementosCercanos}
        onSeleccionar={handleSeleccionar}
      />
    </div>
  );
};

export default UbicacionPage;