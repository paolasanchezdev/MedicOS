import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

export const AuthorityPanel: React.FC = () => {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800">Portal Autoridades</h1>
            <p className="text-slate-500 mt-2">Monitoreo epidemiológico y reportes comunitarios.</p>
          </div>
        }
      />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
};

export default AuthorityPanel;