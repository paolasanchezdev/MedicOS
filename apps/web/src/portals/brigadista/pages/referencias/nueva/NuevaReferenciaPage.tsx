// =========================================================================
// ARCHIVO: apps/web/src/portals/brigadista/pages/referencias/nueva/NuevaReferenciaPage.tsx
// DESCRIPCIÓN: Acceso directo a emisión de referencia F-01. Monta el modal flotante
//              central y redirige ordenadamente a la bandeja de trabajo.
// =========================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReferences } from '../../../../../modules/references/hooks/useReferences';
import { ModalNuevaReferencia } from '../pendientes/components/ModalNuevaReferencia';

export const NuevaReferenciaPage: React.FC = () => {
  const navigate = useNavigate();
  const { pacientesPadron, establecimientos, createReference } = useReferences();

  return (
    <ModalNuevaReferencia
      isOpen={true}
      onClose={() => navigate('/brigadista/referencias/pendientes')}
      pacientesPadron={pacientesPadron}
      establecimientos={establecimientos}
      onGuardar={async (dto) => {
        await createReference(dto);
        navigate('/brigadista/referencias/pendientes');
      }}
    />
  );
};

export default NuevaReferenciaPage;