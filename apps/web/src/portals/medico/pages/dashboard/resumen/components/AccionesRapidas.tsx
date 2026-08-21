// =========================================================================
// ARCHIVO: apps/web/src/portals/medico/pages/dashboard/resumen/components/AccionesRapidas.tsx
// DESCRIPCIÓN: Panel de Acciones Rápidas con rutas alineadas a MedicoRoutes.tsx.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  Stethoscope,
  UserPlus,
  Search,
  FileText,
  ChevronRight,
} from 'lucide-react';

interface AccionItem {
  id: string;
  titulo: string;
  descripcion: string;
  icono: React.ElementType;
  ruta: string;
  bgColor: string;
  textColor: string;
  isPrimary?: boolean;
}

interface AccionesRapidasProps {
  onOpenQRScanner?: (tipo: 'PACIENTE' | 'BRIGADISTA' | 'MEDICO') => void;
}

export const AccionesRapidas: React.FC<AccionesRapidasProps> = ({ onOpenQRScanner }) => {
  const navigate = useNavigate();

  const acciones: AccionItem[] = [
    {
      id: 'escanear-qr',
      titulo: 'Escanear QR Paciente',
      descripcion: 'Carnet o expediente rápido',
      icono: QrCode,
      ruta: '/medico/pacientes/qr',
      bgColor: 'bg-teal-600',
      textColor: 'text-white',
      isPrimary: true,
    },
    {
      id: 'nueva-consulta',
      titulo: 'Nueva Consulta',
      descripcion: 'Iniciar atención médica',
      icono: Stethoscope,
      ruta: '/medico/consultas/nueva',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
    },
    {
      id: 'registrar-paciente',
      titulo: 'Registrar Paciente',
      descripcion: 'Nuevo expediente clínico',
      icono: UserPlus,
      ruta: '/medico/pacientes/buscar',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      id: 'buscar-expediente',
      titulo: 'Buscar Expediente',
      descripcion: 'Historial y antecedentes',
      icono: Search,
      ruta: '/medico/expediente/consultas',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      id: 'emitir-receta',
      titulo: 'Emitir Receta',
      descripcion: 'Prescribir medicamentos',
      icono: FileText,
      ruta: '/medico/recetas/nueva',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  ];

  const handleClick = (accion: AccionItem) => {
    if (accion.id === 'escanear-qr' && onOpenQRScanner) {
      onOpenQRScanner('PACIENTE');
      return;
    }
    navigate(accion.ruta);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          ACCIONES RÁPIDAS
        </p>
        <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
          Escaneo e Identificación
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {acciones.map((acc) => {
          const Icon = acc.icono;
          const isPrimary = acc.isPrimary;

          return (
            <div
              key={acc.id}
              onClick={() => handleClick(acc)}
              className={`rounded-2xl p-4 border transition-all duration-200 flex items-center justify-between cursor-pointer group shadow-2xs hover:shadow-md ${
                isPrimary
                  ? 'bg-linear-to-br from-teal-600 to-teal-800 border-teal-600 text-white hover:border-teal-500'
                  : 'bg-white border-slate-200/80 hover:border-teal-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl ${
                    isPrimary ? 'bg-white/20 text-white' : `${acc.bgColor} ${acc.textColor}`
                  } flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3
                    className={`text-sm font-bold truncate ${
                      isPrimary
                        ? 'text-white'
                        : 'text-slate-800 group-hover:text-teal-700'
                    } transition-colors`}
                  >
                    {acc.titulo}
                  </h3>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isPrimary ? 'text-teal-100/90 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {acc.descripcion}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 shrink-0 transition-all ${
                  isPrimary
                    ? 'text-teal-200 group-hover:translate-x-0.5'
                    : 'text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};