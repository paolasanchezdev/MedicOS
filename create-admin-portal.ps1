```powershell
# ============================================================
# MedicOS - Crear estructura completa del Portal Admin
# ============================================================

$base = "apps/web/src/portals/admin"

# ------------------------------------------------------------
# Función: crear archivo solo si NO existe
# ------------------------------------------------------------
function New-FileIfMissing {
    param (
        [string]$Path
    )

    if (-not (Test-Path $Path)) {
        New-Item -ItemType File -Path $Path -Force | Out-Null
        Write-Host "CREADO: $Path" -ForegroundColor Green
    }
    else {
        Write-Host "EXISTE: $Path" -ForegroundColor Yellow
    }
}

# ------------------------------------------------------------
# Función: crear carpeta
# ------------------------------------------------------------
function New-DirIfMissing {
    param (
        [string]$Path
    )

    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Host "CARPETA: $Path" -ForegroundColor Cyan
    }
}

# ============================================================
# LAYOUT
# ============================================================

New-DirIfMissing "$base/layout"

New-FileIfMissing "$base/layout/AdminHeader.tsx"
New-FileIfMissing "$base/layout/AdminLayout.tsx"
New-FileIfMissing "$base/layout/AdminSidebar.tsx"
New-FileIfMissing "$base/layout/EstadoSistemaBadge.tsx"
New-FileIfMissing "$base/layout/index.ts"

# ============================================================
# NAVIGATION
# ============================================================

New-DirIfMissing "$base/navigation"

New-FileIfMissing "$base/navigation/admin.navigation.ts"

# ============================================================
# PAGES
# ============================================================

# ------------------------------------------------------------
# DASHBOARD
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/dashboard/resumen"
New-DirIfMissing "$base/pages/dashboard/actividad"

New-FileIfMissing "$base/pages/dashboard/resumen/ResumenAdminPage.tsx"
New-FileIfMissing "$base/pages/dashboard/actividad/ActividadSistemaPage.tsx"

# ------------------------------------------------------------
# USUARIOS
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/usuarios/todos"
New-DirIfMissing "$base/pages/usuarios/roles"
New-DirIfMissing "$base/pages/usuarios/permisos"
New-DirIfMissing "$base/pages/usuarios/estado"

New-FileIfMissing "$base/pages/usuarios/todos/UsuariosPage.tsx"
New-FileIfMissing "$base/pages/usuarios/roles/RolesPage.tsx"
New-FileIfMissing "$base/pages/usuarios/permisos/PermisosPage.tsx"
New-FileIfMissing "$base/pages/usuarios/estado/EstadoUsuariosPage.tsx"

# ------------------------------------------------------------
# PACIENTES
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/pacientes/todos"
New-DirIfMissing "$base/pages/pacientes/identificacion"
New-DirIfMissing "$base/pages/pacientes/estado-registros"

New-FileIfMissing "$base/pages/pacientes/todos/PacientesPage.tsx"
New-FileIfMissing "$base/pages/pacientes/identificacion/IdentificacionPacientesPage.tsx"
New-FileIfMissing "$base/pages/pacientes/estado-registros/EstadoRegistrosPage.tsx"

# ------------------------------------------------------------
# BRIGADAS
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/brigadas/todas"
New-DirIfMissing "$base/pages/brigadas/equipos"
New-DirIfMissing "$base/pages/brigadas/responsables"
New-DirIfMissing "$base/pages/brigadas/estado"

New-FileIfMissing "$base/pages/brigadas/todas/BrigadasPage.tsx"
New-FileIfMissing "$base/pages/brigadas/equipos/EquiposBrigadasPage.tsx"
New-FileIfMissing "$base/pages/brigadas/responsables/ResponsablesBrigadasPage.tsx"
New-FileIfMissing "$base/pages/brigadas/estado/EstadoBrigadasPage.tsx"

# ------------------------------------------------------------
# ESTABLECIMIENTOS
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/establecimientos/unidades-salud"
New-DirIfMissing "$base/pages/establecimientos/hospitales"
New-DirIfMissing "$base/pages/establecimientos/clinicas"
New-DirIfMissing "$base/pages/establecimientos/recursos"

New-FileIfMissing "$base/pages/establecimientos/unidades-salud/UnidadesSaludPage.tsx"
New-FileIfMissing "$base/pages/establecimientos/hospitales/HospitalesPage.tsx"
New-FileIfMissing "$base/pages/establecimientos/clinicas/ClinicasPage.tsx"
New-FileIfMissing "$base/pages/establecimientos/recursos/RecursosEstablecimientosPage.tsx"

# ------------------------------------------------------------
# SEGURIDAD
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/seguridad/sesiones"
New-DirIfMissing "$base/pages/seguridad/accesos"
New-DirIfMissing "$base/pages/seguridad/auditoria"
New-DirIfMissing "$base/pages/seguridad/eventos"

New-FileIfMissing "$base/pages/seguridad/sesiones/SesionesActivasPage.tsx"
New-FileIfMissing "$base/pages/seguridad/accesos/AccesosPage.tsx"
New-FileIfMissing "$base/pages/seguridad/auditoria/AuditoriaPage.tsx"
New-FileIfMissing "$base/pages/seguridad/eventos/EventosSeguridadPage.tsx"

# ------------------------------------------------------------
# DATOS
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/datos/integridad"
New-DirIfMissing "$base/pages/datos/sincronizacion"
New-DirIfMissing "$base/pages/datos/importacion"
New-DirIfMissing "$base/pages/datos/exportacion"

New-FileIfMissing "$base/pages/datos/integridad/IntegridadDatosPage.tsx"
New-FileIfMissing "$base/pages/datos/sincronizacion/SincronizacionPage.tsx"
New-FileIfMissing "$base/pages/datos/importacion/ImportacionDatosPage.tsx"
New-FileIfMissing "$base/pages/datos/exportacion/ExportacionDatosPage.tsx"

# ------------------------------------------------------------
# SISTEMA
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/sistema/salud"
New-DirIfMissing "$base/pages/sistema/servicios"
New-DirIfMissing "$base/pages/sistema/base-datos"
New-DirIfMissing "$base/pages/sistema/sincronizacion"

New-FileIfMissing "$base/pages/sistema/salud/SaludSistemaPage.tsx"
New-FileIfMissing "$base/pages/sistema/servicios/ServiciosSistemaPage.tsx"
New-FileIfMissing "$base/pages/sistema/base-datos/EstadoBaseDatosPage.tsx"
New-FileIfMissing "$base/pages/sistema/sincronizacion/EstadoSincronizacionPage.tsx"

# ------------------------------------------------------------
# NOTIFICACIONES
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/notificaciones/centro"
New-DirIfMissing "$base/pages/notificaciones/plantillas"
New-DirIfMissing "$base/pages/notificaciones/historial"

New-FileIfMissing "$base/pages/notificaciones/centro/CentroNotificacionesPage.tsx"
New-FileIfMissing "$base/pages/notificaciones/plantillas/PlantillasNotificacionesPage.tsx"
New-FileIfMissing "$base/pages/notificaciones/historial/HistorialNotificacionesPage.tsx"

# ------------------------------------------------------------
# REPORTES
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/reportes/sistema"
New-DirIfMissing "$base/pages/reportes/usuarios"
New-DirIfMissing "$base/pages/reportes/actividad"
New-DirIfMissing "$base/pages/reportes/exportaciones"

New-FileIfMissing "$base/pages/reportes/sistema/ReportesSistemaPage.tsx"
New-FileIfMissing "$base/pages/reportes/usuarios/ReportesUsuariosPage.tsx"
New-FileIfMissing "$base/pages/reportes/actividad/ReportesActividadPage.tsx"
New-FileIfMissing "$base/pages/reportes/exportaciones/ExportacionesPage.tsx"

# ------------------------------------------------------------
# CONFIGURACIÓN
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/configuracion/general"
New-DirIfMissing "$base/pages/configuracion/seguridad"
New-DirIfMissing "$base/pages/configuracion/notificaciones"
New-DirIfMissing "$base/pages/configuracion/preferencias"

New-FileIfMissing "$base/pages/configuracion/general/ConfiguracionGeneralPage.tsx"
New-FileIfMissing "$base/pages/configuracion/seguridad/ConfiguracionSeguridadPage.tsx"
New-FileIfMissing "$base/pages/configuracion/notificaciones/ConfiguracionNotificacionesPage.tsx"
New-FileIfMissing "$base/pages/configuracion/preferencias/PreferenciasPage.tsx"

# ============================================================
# ROUTES
# ============================================================

New-DirIfMissing "$base/routes"

New-FileIfMissing "$base/routes/AdminRoutes.tsx"

# ============================================================
# PANEL PRINCIPAL
# ============================================================

New-FileIfMissing "$base/AdminPanel.tsx"

# ============================================================
# FINAL
# ============================================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Magenta
Write-Host "  PORTAL ADMIN CREADO/COMPLETADO" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Ruta: $base" -ForegroundColor White
Write-Host ""
```
