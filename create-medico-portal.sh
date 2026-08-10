

# ============================================================
# MedicOS - Crear estructura completa del Portal Médico
# ============================================================

base="apps/web/src/portals/medico"

# Colores para la consola
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m'

# ------------------------------------------------------------
# Función: crear archivo solo si NO existe
# ------------------------------------------------------------

New-FileIfMissing() {
    local path="$1"

    if [ ! -f "$path" ]; then
        touch "$path"
        echo -e "${GREEN}CREADO:${NC} $path"
    else
        echo -e "${YELLOW}EXISTE:${NC} $path"
    fi
}

# ------------------------------------------------------------
# Función: crear carpeta
# ------------------------------------------------------------

New-DirIfMissing() {
    local path="$1"

    if [ ! -d "$path" ]; then
        mkdir -p "$path"
        echo -e "${CYAN}CARPETA:${NC} $path"
    fi
}

# ============================================================
# LAYOUT
# ============================================================

New-DirIfMissing "$base/layout"

New-FileIfMissing "$base/layout/index.ts"
New-FileIfMissing "$base/layout/MedicoBottomNav.tsx"
New-FileIfMissing "$base/layout/MedicoHeader.tsx"
New-FileIfMissing "$base/layout/MedicoLayout.tsx"
New-FileIfMissing "$base/layout/MedicoSidebar.tsx"
New-FileIfMissing "$base/layout/MedicoStatusBadge.tsx"

# ============================================================
# NAVIGATION
# ============================================================

New-DirIfMissing "$base/navigation"

New-FileIfMissing "$base/navigation/medico.navigation.ts"

# ============================================================
# PAGES
# ============================================================

New-DirIfMissing "$base/pages"

# ============================================================
# DASHBOARD
# ============================================================

New-DirIfMissing "$base/pages/dashboard/resumen"
New-DirIfMissing "$base/pages/dashboard/agenda"
New-DirIfMissing "$base/pages/dashboard/alertas"
New-DirIfMissing "$base/pages/dashboard/actividad"

New-FileIfMissing "$base/pages/dashboard/resumen/ResumenMedicoPage.tsx"
New-FileIfMissing "$base/pages/dashboard/agenda/AgendaMedicoPage.tsx"
New-FileIfMissing "$base/pages/dashboard/alertas/AlertasClinicasPage.tsx"
New-FileIfMissing "$base/pages/dashboard/actividad/ActividadMedicoPage.tsx"

# ============================================================
# PACIENTES
# ============================================================

New-DirIfMissing "$base/pages/pacientes/listado"
New-DirIfMissing "$base/pages/pacientes/buscar"
New-DirIfMissing "$base/pages/pacientes/detalle"
New-DirIfMissing "$base/pages/pacientes/qr"

New-FileIfMissing "$base/pages/pacientes/listado/PacientesPage.tsx"
New-FileIfMissing "$base/pages/pacientes/buscar/BuscarPacientePage.tsx"
New-FileIfMissing "$base/pages/pacientes/detalle/DetallePacientePage.tsx"
New-FileIfMissing "$base/pages/pacientes/qr/LectorQRPage.tsx"

# ============================================================
# CONSULTAS
# ============================================================

New-DirIfMissing "$base/pages/consultas/agenda"
New-DirIfMissing "$base/pages/consultas/nueva"
New-DirIfMissing "$base/pages/consultas/historial"
New-DirIfMissing "$base/pages/consultas/seguimiento"

New-FileIfMissing "$base/pages/consultas/agenda/AgendaConsultasPage.tsx"
New-FileIfMissing "$base/pages/consultas/nueva/NuevaConsultaPage.tsx"
New-FileIfMissing "$base/pages/consultas/historial/HistorialConsultasPage.tsx"
New-FileIfMissing "$base/pages/consultas/seguimiento/SeguimientoConsultasPage.tsx"

# ============================================================
# EVALUACIÓN
# ============================================================

New-DirIfMissing "$base/pages/evaluacion/anamnesis"
New-DirIfMissing "$base/pages/evaluacion/examen-fisico"
New-DirIfMissing "$base/pages/evaluacion/signos-vitales"
New-DirIfMissing "$base/pages/evaluacion/observaciones"

New-FileIfMissing "$base/pages/evaluacion/anamnesis/AnamnesisPage.tsx"
New-FileIfMissing "$base/pages/evaluacion/examen-fisico/ExamenFisicoPage.tsx"
New-FileIfMissing "$base/pages/evaluacion/signos-vitales/RegistroSignosVitalesPage.tsx"
New-FileIfMissing "$base/pages/evaluacion/observaciones/ObservacionesClinicasPage.tsx"

# ============================================================
# DIAGNÓSTICOS
# ============================================================

New-DirIfMissing "$base/pages/diagnosticos/nuevo"
New-DirIfMissing "$base/pages/diagnosticos/historial"
New-DirIfMissing "$base/pages/diagnosticos/catalogo"

New-FileIfMissing "$base/pages/diagnosticos/nuevo/NuevoDiagnosticoPage.tsx"
New-FileIfMissing "$base/pages/diagnosticos/historial/HistorialDiagnosticosPage.tsx"
New-FileIfMissing "$base/pages/diagnosticos/catalogo/CatalogoDiagnosticosPage.tsx"

# ============================================================
# TRATAMIENTOS
# ============================================================

New-DirIfMissing "$base/pages/tratamientos/plan"
New-DirIfMissing "$base/pages/tratamientos/medicamentos"
New-DirIfMissing "$base/pages/tratamientos/historial"
New-DirIfMissing "$base/pages/tratamientos/seguimiento"

New-FileIfMissing "$base/pages/tratamientos/plan/PlanTratamientoPage.tsx"
New-FileIfMissing "$base/pages/tratamientos/medicamentos/MedicamentosPage.tsx"
New-FileIfMissing "$base/pages/tratamientos/historial/HistorialTratamientosPage.tsx"
New-FileIfMissing "$base/pages/tratamientos/seguimiento/SeguimientoTratamientoPage.tsx"

# ============================================================
# RECETAS
# ============================================================

New-DirIfMissing "$base/pages/recetas/nueva"
New-DirIfMissing "$base/pages/recetas/activas"
New-DirIfMissing "$base/pages/recetas/historial"

New-FileIfMissing "$base/pages/recetas/nueva/NuevaRecetaPage.tsx"
New-FileIfMissing "$base/pages/recetas/activas/RecetasActivasPage.tsx"
New-FileIfMissing "$base/pages/recetas/historial/HistorialRecetasPage.tsx"

# ============================================================
# EXPEDIENTE
# ============================================================

New-DirIfMissing "$base/pages/expediente/consultas"
New-DirIfMissing "$base/pages/expediente/diagnosticos"
New-DirIfMissing "$base/pages/expediente/antecedentes"
New-DirIfMissing "$base/pages/expediente/medicamentos"
New-DirIfMissing "$base/pages/expediente/signos-vitales"
New-DirIfMissing "$base/pages/expediente/vacunas"

New-FileIfMissing "$base/pages/expediente/consultas/ConsultasPacientePage.tsx"
New-FileIfMissing "$base/pages/expediente/diagnosticos/DiagnosticosPacientePage.tsx"
New-FileIfMissing "$base/pages/expediente/antecedentes/AlergiasAntecedentesPacientePage.tsx"
New-FileIfMissing "$base/pages/expediente/medicamentos/MedicamentosPacientePage.tsx"
New-FileIfMissing "$base/pages/expediente/signos-vitales/SignosVitalesPacientePage.tsx"
New-FileIfMissing "$base/pages/expediente/vacunas/VacunasPacientePage.tsx"

# ============================================================
# ESTUDIOS
# ============================================================

New-DirIfMissing "$base/pages/estudios/solicitar"
New-DirIfMissing "$base/pages/estudios/resultados"
New-DirIfMissing "$base/pages/estudios/laboratorio"
New-DirIfMissing "$base/pages/estudios/imagen"

New-FileIfMissing "$base/pages/estudios/solicitar/SolicitarEstudioPage.tsx"
New-FileIfMissing "$base/pages/estudios/resultados/ResultadosEstudiosPage.tsx"
New-FileIfMissing "$base/pages/estudios/laboratorio/ResultadosLaboratorioPage.tsx"
New-FileIfMissing "$base/pages/estudios/imagen/EstudiosImagenPage.tsx"

# ============================================================
# IA
# ============================================================

New-DirIfMissing "$base/pages/ia/asistente"
New-DirIfMissing "$base/pages/ia/analisis"
New-DirIfMissing "$base/pages/ia/alertas"
New-DirIfMissing "$base/pages/ia/historial"

New-FileIfMissing "$base/pages/ia/asistente/AsistenteClinicoIAPage.tsx"
New-FileIfMissing "$base/pages/ia/analisis/AnalisisIAPage.tsx"
New-FileIfMissing "$base/pages/ia/alertas/AlertasIAPage.tsx"
New-FileIfMissing "$base/pages/ia/historial/HistorialAnalisisIAPage.tsx"

# ============================================================
# SALUD MATERNA
# ============================================================

New-DirIfMissing "$base/pages/salud-materna/embarazo"
New-DirIfMissing "$base/pages/salud-materna/controles-prenatales"
New-DirIfMissing "$base/pages/salud-materna/seguimiento"

New-FileIfMissing "$base/pages/salud-materna/embarazo/ControlEmbarazoPage.tsx"
New-FileIfMissing "$base/pages/salud-materna/controles-prenatales/ControlesPrenatalesPage.tsx"
New-FileIfMissing "$base/pages/salud-materna/seguimiento/SeguimientoMaternoPage.tsx"

# ============================================================
# REPORTES
# ============================================================

New-DirIfMissing "$base/pages/reportes/consultas"
New-DirIfMissing "$base/pages/reportes/pacientes"
New-DirIfMissing "$base/pages/reportes/clinicos"
New-DirIfMissing "$base/pages/reportes/brigadas"

New-FileIfMissing "$base/pages/reportes/consultas/ReporteConsultasPage.tsx"
New-FileIfMissing "$base/pages/reportes/pacientes/ReportePacientesPage.tsx"
New-FileIfMissing "$base/pages/reportes/clinicos/ReportesClinicosPage.tsx"
New-FileIfMissing "$base/pages/reportes/brigadas/ReporteBrigadasPage.tsx"

# ============================================================
# NOTIFICACIONES
# ============================================================

New-DirIfMissing "$base/pages/notificaciones/centro"
New-DirIfMissing "$base/pages/notificaciones/alertas"
New-DirIfMissing "$base/pages/notificaciones/mensajes"

New-FileIfMissing "$base/pages/notificaciones/centro/CentroNotificacionesPage.tsx"
New-FileIfMissing "$base/pages/notificaciones/alertas/AlertasPage.tsx"
New-FileIfMissing "$base/pages/notificaciones/mensajes/MensajesPage.tsx"

# ============================================================
# PERFIL
# ============================================================

New-DirIfMissing "$base/pages/perfil/datos-profesionales"
New-DirIfMissing "$base/pages/perfil/especialidad"
New-DirIfMissing "$base/pages/perfil/preferencias"
New-DirIfMissing "$base/pages/perfil/seguridad"

New-FileIfMissing "$base/pages/perfil/datos-profesionales/DatosProfesionalesPage.tsx"
New-FileIfMissing "$base/pages/perfil/especialidad/EspecialidadPage.tsx"
New-FileIfMissing "$base/pages/perfil/preferencias/PreferenciasMedicoPage.tsx"
New-FileIfMissing "$base/pages/perfil/seguridad/SeguridadMedicoPage.tsx"

# ============================================================
# ROUTES
# ============================================================

New-DirIfMissing "$base/routes"

New-FileIfMissing "$base/routes/MedicoRoutes.tsx"

# ============================================================
# PANEL PRINCIPAL
# ============================================================

New-FileIfMissing "$base/index.ts"
New-FileIfMissing "$base/MedicoPanel.tsx"

# ============================================================
# FINAL
# ============================================================

echo ""
echo -e "${MAGENTA}============================================${NC}"
echo -e "${MAGENTA}     PORTAL MÉDICO CREADO/COMPLETADO${NC}"
echo -e "${MAGENTA}============================================${NC}"
echo ""
echo -e "${WHITE}Ruta: $base${NC}"
echo ""
echo -e "${GREEN}Estructura del Portal Médico lista.${NC}"
echo ""

