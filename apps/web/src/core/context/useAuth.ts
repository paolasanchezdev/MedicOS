// =========================================================================
// ARCHIVO: apps/web/src/core/context/useAuth.ts
// DESCRIPCIÓN: Hook personalizado para consumir de forma segura el contexto 
//              de autenticación en cualquier parte de la aplicación.
// =========================================================================

import { useContext } from 'react';
import { AuthContext } from './AuthContextInstance';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Si el contexto es null (por ejemplo, si se usa fuera del AuthProvider),
  // lanzamos un error en tiempo de ejecución. Esto asegura a TypeScript que 
  // el valor retornado jamás será 'null'.
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  
  return context;
};