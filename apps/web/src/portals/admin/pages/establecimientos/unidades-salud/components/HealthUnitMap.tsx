// apps/web/src/portals/admin/pages/establecimientos/unidades-salud/components/HealthUnitMap.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Establishment } from '../../../../../../modules/establishments/types/establishment.types';

interface HealthUnitMapProps {
  healthUnits: Establishment[];
  selectedUnitId?: string;
  onSelectUnit?: (unit: Establishment) => void;
}

const ES_BOUNDS = [
  [13.1, -90.2],
  [14.5, -87.6],
];

const MAP_CONFIG = {
  viewBoxWidth: 1000,
  viewBoxHeight: 550,
  minLon: -90.15,
  maxLon: -87.65,
  minLat: 13.12,
  maxLat: 14.48,
};

interface LeafletMarkerInstance {
  bindPopup: (html: string) => LeafletMarkerInstance;
  on: (event: string, callback: () => void) => LeafletMarkerInstance;
  addTo: (map: LeafletMapInstance) => LeafletMarkerInstance;
}

interface LeafletMapInstance {
  setView: (center: [number, number], zoom: number) => void;
  remove: () => void;
}

interface LeafletLibrary {
  map: (el: HTMLElement, options?: Record<string, unknown>) => LeafletMapInstance;
  tileLayer: (url: string, options?: Record<string, unknown>) => {
    addTo: (map: LeafletMapInstance) => void;
  };
  circleMarker: (latLng: [number, number], options?: Record<string, unknown>) => LeafletMarkerInstance;
}

interface LeafletWindow extends Window {
  L?: LeafletLibrary;
}

function projectGpsToSvg(lat?: number | null, lon?: number | null) {
  if (lat == null || lon == null) return null;
  const { minLon, maxLon, minLat, maxLat, viewBoxWidth, viewBoxHeight } = MAP_CONFIG;
  const x = ((lon - minLon) / (maxLon - minLon)) * viewBoxWidth;
  const y = ((maxLat - lat) / (maxLat - minLat)) * viewBoxHeight;
  return x < 0 || x > viewBoxWidth || y < 0 || y > viewBoxHeight ? null : { x, y };
}

const getGoogleMapsUrl = (u: Establishment) => {
  const query = `${u.name}, ${u.municipality || ''}, ${u.department || ''}, El Salvador`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

export const HealthUnitMap: React.FC<HealthUnitMapProps> = ({
  healthUnits,
  selectedUnitId,
  onSelectUnit,
}) => {
  const [mapMode, setMapMode] = useState<'online' | 'offline'>(
    navigator.onLine ? 'online' : 'offline'
  );
  const [activeUnitId, setActiveUnitId] = useState<string | undefined>(
    selectedUnitId
  );

  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState<boolean>(false);

  const leafletMapRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);

  const activeUnit =
    healthUnits.find((u) => u.id === (activeUnitId || selectedUnitId)) || null;

  const handleSelectUnitOffline = (
    unit: Establishment,
    coords: { x: number; y: number }
  ) => {
    if (hasMoved) return;

    const targetScale = 2.4;
    const centerX = MAP_CONFIG.viewBoxWidth / 2;
    const centerY = MAP_CONFIG.viewBoxHeight / 2;
    const newX = centerX - coords.x * targetScale;
    const newY = centerY - coords.y * targetScale;

    setScale(targetScale);
    setPosition({ x: newX, y: newY });
    setActiveUnitId(unit.id);
    onSelectUnit?.(unit);
  };

  const handleResetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setActiveUnitId(undefined);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = Math.abs(e.clientX - (dragStart.x + position.x));
    const deltaY = Math.abs(e.clientY - (dragStart.y + position.y));

    if (deltaX > 3 || deltaY > 3) {
      setHasMoved(true);
    }

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container || mapMode !== 'offline') return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.2 : 0.8;

      setScale((prevScale) => {
        const nextScale = Math.min(Math.max(prevScale * zoomFactor, 1), 4.5);
        if (nextScale === 1) {
          setPosition({ x: 0, y: 0 });
        }
        return nextScale;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [mapMode]);

  const initLeafletMap = useCallback(() => {
    const win = window as unknown as LeafletWindow;
    const L = win.L;
    if (!L || !leafletMapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(leafletMapRef.current, {
      maxBounds: ES_BOUNDS,
      minZoom: 8,
      maxZoom: 16,
    });
    map.setView([13.7942, -88.8965], 9);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(map);

    healthUnits.forEach((u) => {
      if (u.latitude != null && u.longitude != null) {
        const color =
          u.status === 'OPERATIONAL'
            ? '#0f766e'
            : u.status === 'INACTIVE'
            ? '#e11d48'
            : '#d97706';

        const marker = L.circleMarker([u.latitude, u.longitude], {
          radius: 6.5,
          fillColor: color,
          color: '#fff',
          weight: 2,
          fillOpacity: 1,
        });

        marker.addTo(map);
        const gmapsUrl = getGoogleMapsUrl(u);
        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; min-width: 210px; line-height: 1.4;">
            <strong style="color: #1e293b; font-size: 13px;">${u.name}</strong><br/>
            <span style="color: #64748b;">📍 ${u.address || `${u.municipality}, ${u.department}`}</span><br/>
            <div style="margin-top: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span style="color: ${u.hasEmergency ? '#e11d48' : '#0f766e'}; font-weight: 600;">
                ${u.hasEmergency ? '🚨 Emergencia 24/7' : '● Consulta Externa'}
              </span>
              <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 500;">Google Maps ↗</a>
            </div>
          </div>
        `);
        marker.on('click', () => {
          setActiveUnitId(u.id);
          onSelectUnit?.(u);
        });
      }
    });
  }, [healthUnits, onSelectUnit]);

  useEffect(() => {
    if (mapMode === 'online' && leafletMapRef.current) {
      const win = window as unknown as LeafletWindow;
      if (!win.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          initLeafletMap();
        };
        document.body.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      } else {
        initLeafletMap();
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapMode, initLeafletMap]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden relative z-0 isolate shadow-xs">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
            Mapa de Unidades Médicas
          </h3>
          <p className="text-[11px] text-slate-500">
            {mapMode === 'offline'
              ? 'Arrastre el mapa para explorar o use la rueda del ratón para acercar/alejar'
              : 'Red de Unidades Médicas sincronizada con OpenStreetMap'}
          </p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-md p-0.5 text-[10px] font-bold shadow-xs">
          <button
            type="button"
            onClick={() => {
              setMapMode('online');
              handleResetView();
            }}
            className={`px-2.5 py-1 rounded transition-colors ${
              mapMode === 'online' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ONLINE
          </button>
          <button
            type="button"
            onClick={() => setMapMode('offline')}
            className={`px-2.5 py-1 rounded transition-colors ${
              mapMode === 'offline' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            OFFLINE
          </button>
        </div>
      </div>

      <div className="w-full h-112.5 relative z-0 isolate bg-slate-50">
        {mapMode === 'online' ? (
          <div ref={leafletMapRef} className="w-full h-full z-0" />
        ) : (
          <div
            ref={svgContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`w-full h-full flex items-center justify-center relative overflow-hidden select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur-xs border border-slate-200 p-1 rounded-lg shadow-sm">
              <button
                type="button"
                title="Acercar (+)"
                onClick={(e) => {
                  e.stopPropagation();
                  setScale((prev) => Math.min(prev + 0.5, 4.5));
                }}
                className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-sm font-bold transition-colors"
              >
                +
              </button>
              <button
                type="button"
                title="Alejar (-)"
                onClick={(e) => {
                  e.stopPropagation();
                  setScale((prev) => {
                    const next = Math.max(prev - 0.5, 1);
                    if (next === 1) setPosition({ x: 0, y: 0 });
                    return next;
                  });
                }}
                className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-sm font-bold transition-colors"
              >
                −
              </button>
              {(scale > 1 || position.x !== 0 || position.y !== 0) && (
                <button
                  type="button"
                  title="Restaurar posición original"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetView();
                  }}
                  className="w-7 h-7 flex items-center justify-center text-teal-700 hover:bg-teal-50 rounded text-xs font-bold transition-colors border-t border-slate-100 pt-1"
                >
                  ⟲
                </button>
              )}
            </div>

            <svg
              viewBox={`0 0 ${MAP_CONFIG.viewBoxWidth} ${MAP_CONFIG.viewBoxHeight}`}
              className="w-full h-full p-4 pointer-events-none"
            >
              <g
                className="pointer-events-auto"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: '0 0',
                  transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <image
                  href="/sv.svg"
                  width={MAP_CONFIG.viewBoxWidth}
                  height={MAP_CONFIG.viewBoxHeight}
                />

                {healthUnits
                  .filter((u) => projectGpsToSvg(u.latitude, u.longitude))
                  .map((u) => {
                    const coords = projectGpsToSvg(u.latitude, u.longitude)!;
                    const isSelected = u.id === activeUnitId;

                    return (
                      <g key={u.id} className="cursor-pointer">
                        {isSelected && (
                          <>
                            <circle
                              cx={coords.x}
                              cy={coords.y}
                              r="11"
                              fill="#0f766e"
                              fillOpacity="0.2"
                              stroke="#0f766e"
                              strokeWidth="1.5"
                            />
                            <circle
                              cx={coords.x}
                              cy={coords.y}
                              r="7.5"
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="1"
                            />
                          </>
                        )}

                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r={isSelected ? '6.5' : '5'}
                          fill={u.hasEmergency ? '#e11d48' : u.status === 'OPERATIONAL' ? '#0f766e' : '#d97706'}
                          stroke="#ffffff"
                          strokeWidth={isSelected ? '1.5' : '1'}
                          className="transition-all duration-200 hover:opacity-80"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectUnitOffline(u, coords);
                          }}
                        />
                      </g>
                    );
                  })}
              </g>
            </svg>

            {activeUnit && (
              <div
                onMouseDown={(e) => e.stopPropagation()}
                className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs p-4 rounded-xl shadow-xl border border-slate-200 text-xs w-76 z-20 space-y-2 animate-fade-in"
              >
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <span className="text-[10px] font-mono text-teal-700 font-semibold uppercase bg-teal-50 px-1.5 py-0.5 rounded">
                      {activeUnit.code} • ISSS
                    </span>
                    <p className="font-bold text-slate-900 leading-snug mt-1.5">
                      {activeUnit.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetView}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold p-0.5"
                    title="Cerrar detalle"
                  >
                    ×
                  </button>
                </div>

                <div className="text-slate-600 space-y-0.5">
                  <p className="flex items-start gap-1">
                    <span className="font-medium text-slate-700">📍 Dirección:</span>
                    <span className="line-clamp-2">{activeUnit.address || 'Sin dirección'}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {activeUnit.municipality}, {activeUnit.department}
                  </p>
                  {activeUnit.phone && (
                    <p className="text-[11px] text-slate-700 font-mono pt-1">
                      📞 {activeUnit.phone.split(';')[0]}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className={`font-semibold ${activeUnit.hasEmergency ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {activeUnit.hasEmergency ? '🚨 Emergencia 24/7' : '● Operativa'}
                  </span>
                  <a
                    href={getGoogleMapsUrl(activeUnit)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-teal-700 font-semibold hover:text-teal-900 bg-teal-50 px-2 py-1 rounded transition-colors"
                  >
                    <span>Google Maps</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};