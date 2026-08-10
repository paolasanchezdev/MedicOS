#!/bin/bash

# ============================================================
# MedicOS - Crear estructura completa del Portal Brigadista
# ============================================================

base="apps/web/src/portals/brigadista"

# ============================================================
# COLORES
# ============================================================

GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m'

# ============================================================
# FUNCIÓN: CREAR ARCHIVO SOLO SI NO EXISTE
# ============================================================

New-FileIfMissing() {
    local path="$1"

    if [ ! -f "$path" ]; then
        touch "$path"
        echo -e "${GREEN}CREADO:${NC} $path"
    else
        echo -e "${YELLOW}EXISTE:${NC} $path"
    fi
}

# ============================================================
# FUNCIÓN: CREAR CARPETA
# ============================================================

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
New-FileIfMissing "$base/layout/BrigadistaHeader.tsx"
New-FileIfMissing "$base/layout/BrigadistaLayout.tsx"
New-FileIfMissing "$base/layout/BrigadistaSidebar.tsx"
New-FileIfMissing "$base/layout/BrigadistaBottomNav.tsx"
New-FileIfMissing "$base/layout/BrigadistaStatusBadge.tsx"

# ============================================================
# NAVIGATION
# ============================================================

New-DirIfMissing "$base/navigation"

New-FileIfMissing "$base/navigation/brigadista.navigation.ts"

# ============================================================
# DASHBOARD
# ============================================================

New-DirIfMissing "$base/pages/dashboard/resumen"
New-DirIfMissing "$base/pages/dashboard/actividad"

New-FileIfMissing "$base/pages/dashboard/resumen/ResumenBrigadistaPage.tsx"
New-FileIfMissing "$base/pages/dashboard/actividad/ActividadBrigadistaPage.tsx"

# ============================================================
# PACIENTES
# ============================================================

New-DirIfMissing "$base/pages/pacientes/escanear"
New-DirIfMissing "$base/pages/pacientes/registrar"
New-DirIfMissing "$base/pages/pacientes/buscar"
New-DirIfMissing "$base/pages/pacientes/expediente"

New-FileIfMissing "$base/pages/pacientes/escanear/EscanearPacientePage.tsx"
New-FileIfMissing "$base/pages/pacientes/registrar/RegistrarPacientePage.tsx"
New-FileIfMissing "$base/pages/pacientes/buscar/BuscarPacientePage.tsx"
New-FileIfMissing "$base/pages/pacientes/expediente/ExpedientePacientePage.tsx"

# ============================================================
# CONSULTAS
# ============================================================

New-DirIfMissing "$base/pages/consultas/nueva"
New-DirIfMissing "$base/pages/consultas/pendientes"
New-DirIfMissing "$base/pages/consultas/historial"

New-FileIfMissing "$base/pages/consultas/nueva/NuevaConsultaPage.tsx"
New-FileIfMissing "$base/pages/consultas/pendientes/ConsultasPendientesPage.tsx"
New-FileIfMissing "$base/pages/consultas/historial/HistorialConsultasPage.tsx"

# ============================================================
# EVALUACIÓN
# ============================================================

New-DirIfMissing "$base/pages/evaluacion/signos-vitales"
New-DirIfMissing "$base/pages/evaluacion/antecedentes"
New-DirIfMissing "$base/pages/evaluacion/sintomas"
New-DirIfMissing "$base/pages/evaluacion/observaciones"

New-FileIfMissing "$base/pages/evaluacion/signos-vitales/SignosVitalesPage.tsx"
New-FileIfMissing "$base/pages/evaluacion/antecedentes/AntecedentesPage.tsx"
New-FileIfMissing "$base/pages/evaluacion/sintomas/SintomasPage.tsx"
New-FileIfMissing "$base/pages/evaluacion/observaciones/ObservacionesPage.tsx"

# ============================================================
# TRATAMIENTOS
# ============================================================

New-DirIfMissing "$base/pages/tratamientos/medicamentos"
New-DirIfMissing "$base/pages/tratamientos/indicaciones"
New-DirIfMissing "$base/pages/tratamientos/seguimiento"

New-FileIfMissing "$base/pages/tratamientos/medicamentos/MedicamentosPage.tsx"
New-FileIfMissing "$base/pages/tratamientos/indicaciones/IndicacionesPage.tsx"
New-FileIfMissing "$base/pages/tratamientos/seguimiento/SeguimientoTratamientoPage.tsx"

# ============================================================
# SEGUIMIENTO
# ============================================================

New-DirIfMissing "$base/pages/seguimiento/pacientes"
New-DirIfMissing "$base/pages/seguimiento/controles"
New-DirIfMissing "$base/pages/seguimiento/alertas"

New-FileIfMissing "$base/pages/seguimiento/pacientes/SeguimientoPacientesPage.tsx"
New-FileIfMissing "$base/pages/seguimiento/controles/ControlesPage.tsx"
New-FileIfMissing "$base/pages/seguimiento/alertas/AlertasSeguimientoPage.tsx"

# ============================================================
# BRIGADA
# ============================================================

New-DirIfMissing "$base/pages/brigada/jornada"
New-DirIfMissing "$base/pages/brigada/pacientes"
New-DirIfMissing "$base/pages/brigada/resumen"

New-FileIfMissing "$base/pages/brigada/jornada/JornadaBrigadaPage.tsx"
New-FileIfMissing "$base/pages/brigada/pacientes/PacientesBrigadaPage.tsx"
New-FileIfMissing "$base/pages/brigada/resumen/ResumenBrigadaPage.tsx"

# ============================================================
# MAPA
# ============================================================

New-DirIfMissing "$base/pages/mapa/ubicacion"
New-DirIfMissing "$base/pages/mapa/pacientes"
New-DirIfMissing "$base/pages/mapa/establecimientos"

New-FileIfMissing "$base/pages/mapa/ubicacion/UbicacionPage.tsx"
New-FileIfMissing "$base/pages/mapa/pacientes/MapaPacientesPage.tsx"
New-FileIfMissing "$base/pages/mapa/establecimientos/MapaEstablecimientosPage.tsx"

# ============================================================
# SINCRONIZACIÓN
# ============================================================

New-DirIfMissing "$base/pages/sincronizacion/estado"
New-DirIfMissing "$base/pages/sincronizacion/pendientes"
New-DirIfMissing "$base/pages/sincronizacion/historial"

New-FileIfMissing "$base/pages/sincronizacion/estado/EstadoSincronizacionPage.tsx"
New-FileIfMissing "$base/pages/sincronizacion/pendientes/PendientesSincronizacionPage.tsx"
New-FileIfMissing "$base/pages/sincronizacion/historial/HistorialSincronizacionPage.tsx"

# ============================================================
# REPORTES
# ============================================================

New-DirIfMissing "$base/pages/reportes/consultas"
New-DirIfMissing "$base/pages/reportes/pacientes"
New-DirIfMissing "$base/pages/reportes/brigada"

New-FileIfMissing "$base/pages/reportes/consultas/ReportesConsultasPage.tsx"
New-FileIfMissing "$base/pages/reportes/pacientes/ReportesPacientesPage.tsx"
New-FileIfMissing "$base/pages/reportes/brigada/ReportesBrigadaPage.tsx"

# ============================================================
# NOTIFICACIONES
# ============================================================

New-DirIfMissing "$base/pages/notificaciones/centro"
New-DirIfMissing "$base/pages/notificaciones/alertas"

New-FileIfMissing "$base/pages/notificaciones/centro/CentroNotificacionesPage.tsx"
New-FileIfMissing "$base/pages/notificaciones/alertas/AlertasPage.tsx"

# ============================================================
# PERFIL
# ============================================================

New-DirIfMissing "$base/pages/perfil/datos"
New-DirIfMissing "$base/pages/perfil/seguridad"
New-DirIfMissing "$base/pages/perfil/preferencias"

New-FileIfMissing "$base/pages/perfil/datos/DatosBrigadistaPage.tsx"
New-FileIfMissing "$base/pages/perfil/seguridad/SeguridadBrigadistaPage.tsx"
New-FileIfMissing "$base/pages/perfil/preferencias/PreferenciasBrigadistaPage.tsx"

# ============================================================
# ROUTES
# ============================================================

New-DirIfMissing "$base/routes"

New-FileIfMissing "$base/routes/BrigadistaRoutes.tsx"

# ============================================================
# PANEL PRINCIPAL
# ============================================================

New-FileIfMissing "$base/index.ts"
New-FileIfMissing "$base/BrigadistaPanel.tsx"

# ============================================================
# FINAL
# ============================================================

echo ""
echo -e "${MAGENTA}============================================${NC}"
echo -e "${MAGENTA}   PORTAL BRIGADISTA CREADO/COMPLETADO${NC}"
echo -e "${MAGENTA}============================================${NC}"
echo ""
echo -e "${WHITE}Ruta:${NC} $base"
echo ""
echo -e "${GREEN}Estructura lista para MedicOS.${NC}"
echo ""