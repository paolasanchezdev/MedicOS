// =========================================================================
// ARCHIVO: apps/web/src/App.tsx
// DESCRIPCIÓN: Componente raíz de MedicOS. Provee el contexto global de
//              autenticación y habilita el enrutado con React Router.
// =========================================================================

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './core/context/AuthContext';
import { AppRoutes } from './app/router/routes';

export function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;