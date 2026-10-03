// =========================================================================
// ARCHIVO: ModalDetalleReferencia.tsx
// DESCRIPCIÓN: Ficha completa de la referencia con previsualización del F-01
//              oficial del MINSAL e impresión física/PDF.
// =========================================================================

import React from 'react';
import { X, Edit } from 'lucide-react';
import type { CommunityReferenceRecord } from '../../../../../../modules/references/types/reference.types';
import { DocumentoF01Oficial } from './DocumentoF01Oficial';

interface ModalDetalleReferenciaProps {
  isOpen: boolean;
  onClose: () => void;
  referencia: CommunityReferenceRecord | null;
  onEditarEstado: (ref: CommunityReferenceRecord) => void;
}

export const ModalDetalleReferencia: React.FC<ModalDetalleReferenciaProps> = ({
  isOpen,
  onClose,
  referencia,
  onEditarEstado,
}) => {
  if (!isOpen || !referencia) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Cabecera */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0 no-print">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-[#166E7A] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {referencia.folioF01}
            </span>
            <span className="text-xs font-bold text-slate-700">
              {referencia.patientName} • Destino: {referencia.establishmentName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditarEstado(referencia);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#166E7A] hover:bg-[#105F68] text-white text-xs font-bold transition cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Actualizar Estado</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cuerpo: Documento F-01 Oficial Imprimible */}
        <div className="p-6 overflow-y-auto flex-1">
          <DocumentoF01Oficial
            folio={referencia.folioF01}
            fechaEmision={referencia.referredAt}
            paciente={{
              nombre: referencia.patientName || 'Persona no identificada',
              dui: referencia.patientDui || 'Sin DUI',
              edad: referencia.patientAge,
              sexo: referencia.patientGender,
              direccion: referencia.patientCommunity,
            }}
            establecimientoDestino={{
              nombre: referencia.establishmentName || 'Establecimiento Receptor',
              nivel: referencia.establishmentLevel,
              tipo: referencia.establishmentType,
              departamento: referencia.establishmentDepartment,
              municipio: referencia.establishmentMunicipality,
              telefono: referencia.establishmentPhone,
            }}
            brigadista={{
              nombre: referencia.brigadistaName || 'Carlos Pérez',
              brigada: 'Brigada Territorial San Miguel Tepezontes',
            }}
            categoria={referencia.categoria || 'VALORACION_MEDICA'}
            prioridad={referencia.priority}
            motivo={referencia.reason}
            situacionEncontrada={referencia.situacionEncontrada}
            clinicalSummary={referencia.clinicalSummary}
            signosVitales={referencia.signosVitales}
            traslado={{
              medio: referencia.medioTraslado,
              acompanante: referencia.acompananteNombre,
            }}
            retorno={{
              atendido: referencia.status === 'ATTENDED',
              respuesta: referencia.respuestaEstablecimiento,
              indicaciones: referencia.indicacionesRetorno,
            }}
            mostrarAccionesImpresion={true}
          />
        </div>

        {/* Pie */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end shrink-0 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};