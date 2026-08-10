# ============================================================
# MedicOS - Crear estructura completa del Portal Authority
# ============================================================

$base = "apps/web/src/portals/authority"

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

# ------------------------------------------------------------
# LAYOUT
# ------------------------------------------------------------

New-DirIfMissing "$base/layout"

New-FileIfMissing "$base/layout/AuthorityHeader.tsx"
New-FileIfMissing "$base/layout/AuthorityLayout.tsx"
New-FileIfMissing "$base/layout/AuthoritySidebar.tsx"
New-FileIfMissing "$base/layout/EstadoSistemaBadge.tsx"
New-FileIfMissing "$base/layout/index.ts"

# ------------------------------------------------------------
# NAVIGATION
# ------------------------------------------------------------

New-DirIfMissing "$base/navigation"

New-FileIfMissing "$base/navigation/authority.navigation.ts"

# ============================================================
# PAGES
# ============================================================

# ------------------------------------------------------------
# DASHBOARD
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/dashboard/resumen"
New-DirIfMissing "$base/pages/dashboard/salud-sistema"

New-FileIfMissing "$base/pages/dashboard/resumen/ResumenAutoridadPage.tsx"
New-FileIfMissing "$base/pages/dashboard/salud-sistema/SaludSistemaPage.tsx"

# ------------------------------------------------------------
# ESTADÍSTICAS
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/estadisticas/pacientes"
New-DirIfMissing "$base/pages/estadisticas/enfermedades"
New-DirIfMissing "$base/pages/estadisticas/brigadas"
New-DirIfMissing "$base/pages/estadisticas/comunidades"
New-DirIfMissing "$base/pages/estadisticas/cobertura"
New-DirIfMissing "$base/pages/estadisticas/vacunacion"
New-DirIfMissing "$base/pages/estadisticas/salud-materno-infantil"

New-FileIfMissing "$base/pages/estadisticas/pacientes/EstadisticasPacientesPage.tsx"
New-FileIfMissing "$base/pages/estadisticas/enfermedades/EstadisticasEnfermedadesPage.tsx"
New-FileIfMissing "$base/pages/estadisticas/brigadas/EstadisticasBrigadasPage.tsx"
New-FileIfMissing "$base/pages/estadisticas/comunidades/EstadisticasComunidadesPage.tsx"
New-FileIfMissing "$base/pages/estadisticas/cobertura/CoberturaPage.tsx"
New-FileIfMissing "$base/pages/estadisticas/vacunacion/VacunacionPage.tsx"
New-FileIfMissing "$base/pages/estadisticas/salud-materno-infantil/SaludMaternoInfantilPage.tsx"

# ------------------------------------------------------------
# EPIDEMIOLOGÍA
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/epidemiologia/alertas"
New-DirIfMissing "$base/pages/epidemiologia/brotes"
New-DirIfMissing "$base/pages/epidemiologia/factores-riesgo"
New-DirIfMissing "$base/pages/epidemiologia/tendencias"
New-DirIfMissing "$base/pages/epidemiologia/vigilancia"

New-FileIfMissing "$base/pages/epidemiologia/alertas/AlertasEpidemiologicasPage.tsx"
New-FileIfMissing "$base/pages/epidemiologia/brotes/BrotesPage.tsx"
New-FileIfMissing "$base/pages/epidemiologia/factores-riesgo/FactoresRiesgoPage.tsx"
New-FileIfMissing "$base/pages/epidemiologia/tendencias/TendenciasEpidemiologicasPage.tsx"
New-FileIfMissing "$base/pages/epidemiologia/vigilancia/VigilanciaEpidemiologicaPage.tsx"

# ------------------------------------------------------------
# MAPAS
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/mapas/cobertura"
New-DirIfMissing "$base/pages/mapas/comunidades"
New-DirIfMissing "$base/pages/mapas/zonas-prioritarias"
New-DirIfMissing "$base/pages/mapas/calor-epidemiologico"
New-DirIfMissing "$base/pages/mapas/brigadas"

New-FileIfMissing "$base/pages/mapas/cobertura/MapaCoberturaPage.tsx"
New-FileIfMissing "$base/pages/mapas/comunidades/MapaComunidadesPage.tsx"
New-FileIfMissing "$base/pages/mapas/zonas-prioritarias/ZonasPrioritariasPage.tsx"
New-FileIfMissing "$base/pages/mapas/calor-epidemiologico/MapaCalorEpidemiologicoPage.tsx"
New-FileIfMissing "$base/pages/mapas/brigadas/MapaBrigadasPage.tsx"

# ------------------------------------------------------------
# BRIGADAS
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/brigadas/historial"
New-DirIfMissing "$base/pages/brigadas/programadas"
New-DirIfMissing "$base/pages/brigadas/resultados"
New-DirIfMissing "$base/pages/brigadas/cobertura"

New-FileIfMissing "$base/pages/brigadas/historial/HistorialBrigadasPage.tsx"
New-FileIfMissing "$base/pages/brigadas/programadas/BrigadasProgramadasPage.tsx"
New-FileIfMissing "$base/pages/brigadas/resultados/ResultadosBrigadasPage.tsx"
New-FileIfMissing "$base/pages/brigadas/cobertura/CoberturaBrigadasPage.tsx"

# ------------------------------------------------------------
# CAMPAÑAS
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/campanas/activas"
New-DirIfMissing "$base/pages/campanas/planificacion"
New-DirIfMissing "$base/pages/campanas/seguimiento"
New-DirIfMissing "$base/pages/campanas/resultados"

New-FileIfMissing "$base/pages/campanas/activas/CampanasActivasPage.tsx"
New-FileIfMissing "$base/pages/campanas/planificacion/PlanificacionCampanasPage.tsx"
New-FileIfMissing "$base/pages/campanas/seguimiento/SeguimientoCampanasPage.tsx"
New-FileIfMissing "$base/pages/campanas/resultados/ResultadosCampanasPage.tsx"

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
# REPORTES
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/reportes/ejecutivos"
New-DirIfMissing "$base/pages/reportes/epidemiologicos"
New-DirIfMissing "$base/pages/reportes/brigadas"
New-DirIfMissing "$base/pages/reportes/exportaciones"
New-DirIfMissing "$base/pages/reportes/personalizados"

New-FileIfMissing "$base/pages/reportes/ejecutivos/ReportesEjecutivosPage.tsx"
New-FileIfMissing "$base/pages/reportes/epidemiologicos/ReportesEpidemiologicosPage.tsx"
New-FileIfMissing "$base/pages/reportes/brigadas/ReportesBrigadasPage.tsx"
New-FileIfMissing "$base/pages/reportes/exportaciones/ExportacionesPage.tsx"
New-FileIfMissing "$base/pages/reportes/personalizados/ReportesPersonalizadosPage.tsx"

# ------------------------------------------------------------
# INTELIGENCIA ARTIFICIAL
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/inteligencia-artificial/resumenes"
New-DirIfMissing "$base/pages/inteligencia-artificial/tendencias"
New-DirIfMissing "$base/pages/inteligencia-artificial/predicciones"
New-DirIfMissing "$base/pages/inteligencia-artificial/recomendaciones"
New-DirIfMissing "$base/pages/inteligencia-artificial/consultas"

New-FileIfMissing "$base/pages/inteligencia-artificial/resumenes/ResumenesIAPage.tsx"
New-FileIfMissing "$base/pages/inteligencia-artificial/tendencias/TendenciasIAPage.tsx"
New-FileIfMissing "$base/pages/inteligencia-artificial/predicciones/PrediccionesIAPage.tsx"
New-FileIfMissing "$base/pages/inteligencia-artificial/recomendaciones/RecomendacionesIAPage.tsx"
New-FileIfMissing "$base/pages/inteligencia-artificial/consultas/ConsultasIAPage.tsx"

# ------------------------------------------------------------
# CONFIGURACIÓN
# ------------------------------------------------------------

New-DirIfMissing "$base/pages/configuracion/preferencias"
New-DirIfMissing "$base/pages/configuracion/notificaciones"
New-DirIfMissing "$base/pages/configuracion/accesos"
New-DirIfMissing "$base/pages/configuracion/auditoria"

New-FileIfMissing "$base/pages/configuracion/preferencias/PreferenciasPage.tsx"
New-FileIfMissing "$base/pages/configuracion/notificaciones/NotificacionesPage.tsx"
New-FileIfMissing "$base/pages/configuracion/accesos/AccesosPage.tsx"
New-FileIfMissing "$base/pages/configuracion/auditoria/AuditoriaPage.tsx"

# ------------------------------------------------------------
# ROUTES
# ------------------------------------------------------------

New-DirIfMissing "$base/routes"

New-FileIfMissing "$base/routes/AuthorityRoutes.tsx"

# ------------------------------------------------------------
# PANEL PRINCIPAL
# ------------------------------------------------------------

New-FileIfMissing "$base/AuthorityPanel.tsx"

Write-Host ""
Write-Host "============================================" -ForegroundColor Magenta
Write-Host "  PORTAL AUTHORITY CREADO/COMPLETADO" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "Ruta: $base" -ForegroundColor White
Write-Host ""