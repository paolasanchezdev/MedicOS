import type { Patient } from '@medicos/shared-types';

function App() {
  // Testigo en el frontend
  const testPatient: Patient = {
    id: "web-456",
    fullName: "Paciente Frontend de Prueba",
    dateOfBirth: "1995-05-20",
    createdAt: "2026-07-14"
  };
  
  console.log("[Validación Frontend Monorepo]:", testPatient.fullName);

  return (
    <>
      <h1>MedicOS</h1>
      <p>Sistema Inteligente para Brigadas Médicas</p>
      <p style={{ color: 'green', fontWeight: 'bold' }}>
        ✓ Conexión con shared-types activa para: {testPatient.fullName}
      </p>
    </>
  );
}

export default App;