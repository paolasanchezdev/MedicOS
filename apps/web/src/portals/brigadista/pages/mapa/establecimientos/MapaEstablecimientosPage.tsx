// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/mapa/establecimientos/MapaEstablecimientosPage.tsx
// DESCRIPCIÓN: Directorio geoespacial oficial de la Red Pública de Salud (MINSAL / ISSS).
//              Con mapa interactivo Leaflet, marcadores vectoriales diferenciados
//              por tipo y ficha contextual para derivación F-01.
// =========================================================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  ArrowLeft,
  X,
  Share2,
  Bed,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useHospitals } from '../../../../../modules/establishments';
import type { EstablishmentType } from '../../../../../modules/establishments/types/establishment.types';

const CENTRO_EL_SALVADOR = { lat: 13.7942, lng: -88.8965 };

// Controlador para centrar la cámara suavemente en el establecimiento seleccionado
function ControladorCamara({
  centro,
  zoom,
}: {
  centro: { lat: number; lng: number };
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([centro.lat, centro.lng], zoom, { duration: 1.2 });
  }, [centro, zoom, map]);
  return null;
}

// Corrige el renderizado de mosaicos grises en contenedores flexibles
function AjustadorTamanoMapa() {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 450);
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', onResize);
    };
  }, [map]);
  return null;
}

// Generador de marcadores vectoriales diferenciados por tipo
function crearMarcadorEstablecimiento(tipo: EstablishmentType, isSelected: boolean) {
  let colorBg = '#0284C7'; // Clínica por defecto
  let svgPath = '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M12 4v4"/>';

  if (tipo === 'HOSPITAL') {
    colorBg = '#1E40AF'; // Azul Rey Profundo para Hospitales
    svgPath = '<path d="M12 6v12"/><path d="M6 12h12"/><rect width="18" height="18" x="3" y="3" rx="2"/>';
  } else if (tipo === 'HEALTH_CENTER') {
    colorBg = '#0D9488'; // Teal para Unidades de Salud
    svgPath = '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>';
  }

  const size = isSelected ? 34 : 26;
  const borderSize = isSelected ? '3px' : '2px';
  const shadow = isSelected
    ? '0 0 0 4px rgba(22, 110, 122, 0.45), 0 8px 16px rgba(0,0,0,0.35)'
    : '0 3px 8px rgba(0,0,0,0.22)';

  return L.divIcon({
    className: 'custom-establishment-marker',
    html: `
      <div style="background-color: ${colorBg}; border: ${borderSize} solid #ffffff; box-shadow: ${shadow}; width: ${size}px; height: ${size}px;" 
           class="rounded-full flex items-center justify-center text-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200">
        <svg style="width: ${isSelected ? 18 : 13}px; height: ${isSelected ? 18 : 13}px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          ${svgPath}
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)],
  });
}

export const MapaEstablecimientosPage: React.FC = () => {
  const navigate = useNavigate();
  const { hospitals: establecimientos, loading } = useHospitals();

  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<string>('TODOS');
  const [departamentoFiltro, setDepartamentoFiltro] = useState<string>('TODOS');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Departamentos únicos con establecimientos
  const departamentos = useMemo(() => {
    const setDept = new Set<string>();
    establecimientos.forEach((e) => {
      if (e.department) setDept.add(e.department);
    });
    return Array.from(setDept).sort();
  }, [establecimientos]);

  // Contadores analíticos
  const metricas = useMemo(() => {
    let hospitales = 0;
    let unidades = 0;
    let clinicas = 0;
    let emergencias = 0;

    establecimientos.forEach((e) => {
      if (e.type === 'HOSPITAL') hospitales++;
      else if (e.type === 'HEALTH_CENTER') unidades++;
      else if (e.type === 'CLINIC') clinicas++;
      if (e.hasEmergency) emergencias++;
    });

    return {
      total: establecimientos.length,
      hospitales,
      unidades,
      clinicas,
      emergencias,
    };
  }, [establecimientos]);

  // Filtrado de la lista en tiempo real
  const filtrados = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return establecimientos.filter((e) => {
      const matchText =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.municipality.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        (e.address && e.address.toLowerCase().includes(q));

      const matchTipo = tipoFiltro === 'TODOS' || e.type === tipoFiltro;
      const matchDept = departamentoFiltro === 'TODOS' || e.department === departamentoFiltro;

      return matchText && matchTipo && matchDept;
    });
  }, [establecimientos, searchTerm, tipoFiltro, departamentoFiltro]);

  const establecimientoSeleccionado = useMemo(() => {
    return establecimientos.find((e) => e.id === selectedId) || null;
  }, [establecimientos, selectedId]);

  // Coordenada actual de la cámara
  const centroCamara = useMemo(() => {
    if (
      establecimientoSeleccionado &&
      typeof establecimientoSeleccionado.latitude === 'number' &&
      typeof establecimientoSeleccionado.longitude === 'number'
    ) {
      return {
        lat: establecimientoSeleccionado.latitude,
        lng: establecimientoSeleccionado.longitude,
      };
    }
    return CENTRO_EL_SALVADOR;
  }, [establecimientoSeleccionado]);

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] -m-4 sm:-m-6 p-3 sm:p-4 space-y-3 bg-[#FAF8F5]">
      
      {/* 1. Header Institucional Oficial */}
      <div className="bg-[#166E7A] rounded-2xl p-4 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/brigadista/mapa/ubicacion')}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer border border-white/20"
              title="Volver al Mapa Territorial"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-teal-100 text-[10.5px] font-bold border border-white/20">
              <Building2 className="w-3.5 h-3.5" />
              <span>Red Pública Nacional • MINSAL & ISSS</span>
            </div>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white leading-none">
            Directorio Oficial de Establecimientos de Salud
          </h1>
          <p className="text-xs text-teal-100/90 font-medium">
            Catálogo georreferenciado de hospitales, unidades comunitarias y clínicas de El Salvador.
          </p>
        </div>

        {/* Indicadores rápidos de red */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-center">
            <span className="text-[10px] text-teal-200 block font-bold uppercase">Total Red</span>
            <strong className="text-base font-black text-white">{metricas.total}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-center">
            <span className="text-[10px] text-teal-200 block font-bold uppercase">Hospitales</span>
            <strong className="text-base font-black text-white">{metricas.hospitales}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-center">
            <span className="text-[10px] text-teal-200 block font-bold uppercase">UCSF / Salud</span>
            <strong className="text-base font-black text-white">{metricas.unidades}</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-400/40 text-center">
            <span className="text-[10px] text-emerald-200 block font-bold uppercase">Emergencia</span>
            <strong className="text-base font-black text-emerald-300">{metricas.emergencias}</strong>
          </div>
        </div>
      </div>

      {/* 2. Cuerpo en Split-View: Directorio & Mapa */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
        
        {/* COLUMNA IZQUIERDA: Filtros y Directorio (5 columnas) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#D3E8EC] p-3.5 shadow-xs flex flex-col min-h-0 space-y-2.5">
          
          {/* Barra de Búsqueda y Selector de Departamento */}
          <div className="space-y-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por hospital, unidad, clínica o municipio..."
                className="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] text-slate-800 font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <select
                value={departamentoFiltro}
                onChange={(e) => setDepartamentoFiltro(e.target.value)}
                className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#166E7A] font-bold text-slate-700 truncate"
              >
                <option value="TODOS">Todos los Departamentos</option>
                {departamentos.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-xl shrink-0">
                {filtrados.length} centros
              </span>
            </div>

            {/* Píldoras Rápidas de Tipo */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] font-bold shrink-0">
              {[
                { id: 'TODOS', label: 'Todos' },
                { id: 'HOSPITAL', label: 'Hospitales' },
                { id: 'HEALTH_CENTER', label: 'Unidades de Salud' },
                { id: 'CLINIC', label: 'Clínicas' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setTipoFiltro(p.id)}
                  className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer ${
                    tipoFiltro === p.id
                      ? 'bg-[#166E7A] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista Scrolleable de Establecimientos */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-[#FAF8F5]/60 pr-0.5">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Cargando directorio de la red nacional...
              </div>
            ) : filtrados.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-bold text-slate-600">No se encontraron centros de salud</p>
                <p className="text-[11px]">Prueba ajustando el término o los filtros de tipo y departamento.</p>
              </div>
            ) : (
              filtrados.map((est) => {
                const isSelected = selectedId === est.id;
                const esHospital = est.type === 'HOSPITAL';
                const esUnidad = est.type === 'HEALTH_CENTER';

                return (
                  <div
                    key={est.id}
                    onClick={() => setSelectedId(est.id)}
                    className={`p-3 transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-teal-50/90 border-l-4 border-[#166E7A] shadow-2xs'
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9.5px] font-black uppercase border ${
                              esHospital
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : esUnidad
                                ? 'bg-teal-50 text-teal-800 border-teal-200'
                                : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                            }`}
                          >
                            {est.type}
                          </span>

                          {est.hasEmergency && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-200">
                              Emergencia 24/7
                            </span>
                          )}

                          {est.level && (
                            <span className="text-[9.5px] font-bold text-slate-400">
                              Nivel {est.level}
                            </span>
                          )}
                        </div>

                        <h4 className="text-xs font-black text-slate-900 mt-1 truncate">
                          {est.name}
                        </h4>
                      </div>

                      <div className="shrink-0 text-right">
                        {typeof est.latitude === 'number' ? (
                          <span className="text-[9px] font-mono font-bold text-[#166E7A] bg-teal-50 px-1 py-0.5 rounded">
                            GPS OK
                          </span>
                        ) : (
                          <span className="text-[9px] text-slate-400">Sin GPS</span>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {est.municipality}, <strong>{est.department}</strong>
                      </span>
                    </p>

                    {est.phone && (
                      <p className="text-[10.5px] text-[#166E7A] font-semibold flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#166E7A]/70" />
                        <span>{est.phone}</span>
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Mapa Territorial Interactivo (7 columnas) */}
        <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-[#D3E8EC] shadow-xs">
          
          <MapContainer
            center={[centroCamara.lat, centroCamara.lng]}
            zoom={establecimientoSeleccionado ? 15 : 8}
            scrollWheelZoom={true}
            className="w-full h-full min-h-112.5 z-0"
          >
            <AjustadorTamanoMapa />
            <ControladorCamara
              centro={centroCamara}
              zoom={establecimientoSeleccionado ? 15 : 8}
            />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marcadores diferenciados con iconos SVG vectoriales */}
            {filtrados.map((est) => {
              if (typeof est.latitude !== 'number' || typeof est.longitude !== 'number') {
                return null;
              }

              const isSelected = selectedId === est.id;

              return (
                <Marker
                  key={est.id}
                  position={[est.latitude, est.longitude]}
                  icon={crearMarcadorEstablecimiento(est.type, isSelected)}
                  eventHandlers={{
                    click: () => setSelectedId(est.id),
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1 p-0.5 min-w-45">
                      <span className="text-[9.5px] font-bold text-[#166E7A] uppercase block">
                        {est.type} • Nivel {est.level || 'Básico'}
                      </span>
                      <strong className="text-slate-900 block text-xs font-black">
                        {est.name}
                      </strong>
                      <span className="text-slate-600 block text-[11px]">
                        {est.municipality}, {est.department}
                      </span>
                      {est.phone && (
                        <span className="text-[#166E7A] font-bold block text-[11px]">
                          Tel: {est.phone}
                        </span>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Leyenda Visual Flotante */}
          <div className="absolute top-3 right-3 z-1000 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-2.5 shadow-md text-[10.5px] font-bold space-y-1">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-100">
              Red de Salud
            </span>
            <div className="flex items-center gap-2 text-blue-900">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E40AF]"></span>
              <span>Hospitales</span>
            </div>
            <div className="flex items-center gap-2 text-teal-900">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]"></span>
              <span>Unidades de Salud</span>
            </div>
            <div className="flex items-center gap-2 text-sky-900">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]"></span>
              <span>Clínicas ISSS</span>
            </div>
          </div>

          {/* FICHA FLOTANTE DE DETALLE AL SELECCIONAR CENTRO */}
          {establecimientoSeleccionado && (
            <div className="absolute bottom-4 left-4 right-4 z-1000 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl p-4 animate-in slide-in-from-bottom-2 duration-150 space-y-2.5">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[9.5px] font-black uppercase bg-teal-50 text-[#166E7A] border border-teal-200">
                      {establecimientoSeleccionado.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      Nivel {establecimientoSeleccionado.level || 'Básico'}
                    </span>
                    {establecimientoSeleccionado.hasEmergency && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-200">
                        Emergencia 24/7
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 truncate mt-0.5">
                    {establecimientoSeleccionado.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#166E7A] shrink-0" />
                    <span className="truncate">
                      {establecimientoSeleccionado.address || `${establecimientoSeleccionado.municipality}, ${establecimientoSeleccionado.department}`}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Datos Operativos & Acción de Referencia F-01 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-slate-600 flex-wrap">
                  {establecimientoSeleccionado.phone && (
                    <span className="flex items-center gap-1 font-semibold text-[#166E7A]">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{establecimientoSeleccionado.phone}</span>
                    </span>
                  )}
                  {establecimientoSeleccionado.totalBeds > 0 && (
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Camas: <strong>{establecimientoSeleccionado.availableBeds}</strong> / {establecimientoSeleccionado.totalBeds}
                      </span>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/brigadista/referencias/nueva')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-black shadow-xs transition active:scale-95 cursor-pointer shrink-0"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>+ Emitir Referencia F-01 a este Centro</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapaEstablecimientosPage;