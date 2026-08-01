Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "        MedicOS Launcher v1.0        " -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Cyan

# 1. Verificar Requisitos
Write-Host "[1/6] Verificando entorno del sistema..." -ForegroundColor Yellow

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "✖ Node.js no está instalado. Descárgalo de https://nodejs.org" -ForegroundColor Red
    Exit 1
}
$nodeVer = node -v
Write-Host "  ✔ Node.js $nodeVer detectado" -ForegroundColor Green

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "✖ npm no está instalado." -ForegroundColor Red
    Exit 1
}
$npmVer = npm -v
Write-Host "  ✔ npm v$npmVer detectado" -ForegroundColor Green

# 2. Verificar Puertos
Write-Host "`n[2/6] Verificando disponibilidad de puertos..." -ForegroundColor Yellow

function Test-PortAvailability ($port) {
    $tcp = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($tcp) {
        Write-Host "✖ El puerto $port está ocupado por otro proceso." -ForegroundColor Red
        return $false
    }
    Write-Host "  ✔ Puerto $port libre" -ForegroundColor Green
    return $true
}

if (-not (Test-PortAvailability 3000) -or -not (Test-PortAvailability 5173)) {
    Exit 1
}

# 3. Instalación de Dependencias
Write-Host "`n[3/6] Comprobando dependencias de Node..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "  📦 Instalando dependencias del monorepo..." -ForegroundColor Cyan
    npm install
    Write-Host "  ✔ Dependencias instaladas con éxito." -ForegroundColor Green
} else {
    Write-Host "  ✔ Dependencias ya presentes en node_modules." -ForegroundColor Green
}

# 4. Variables de Entorno
Write-Host "`n[4/6] Verificando archivos de configuración (.env)..." -ForegroundColor Yellow
if (-not (Test-Path "apps/api/.env")) {
    if (Test-Path "apps/api/.env.example") {
        Copy-Item "apps/api/.env.example" "apps/api/.env"
        Write-Host "  ⚠ Se creó apps/api/.env basado en .env.example." -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✔ Configuración de API (.env) detectada." -ForegroundColor Green
}

# 5. Configurar Prisma
Write-Host "`n[5/6] Sincronizando Prisma ORM..." -ForegroundColor Yellow
npx prisma generate --schema=apps/api/prisma/schema.prisma
npx prisma db push --schema=apps/api/prisma/schema.prisma
Write-Host "  ✔ Base de datos y cliente Prisma listos." -ForegroundColor Green

# 6. Despliegue
Write-Host "`n[6/6] Iniciando ecosistema MedicOS..." -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Green
Write-Host "🚀 MedicOS se está ejecutando:" -ForegroundColor Green
Write-Host "   • Backend API:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "   • Frontend Web: http://localhost:5173" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Green

# Levantar desarrollo
npm run dev