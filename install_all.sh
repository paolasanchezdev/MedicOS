#!/usr/bin/env bash

# ============================================================
# MedicOS - Instalador completo y automatizado (v2.3)
# ============================================================
# Compatible con Ubuntu 22.04 / 24.04 LTS (Sistemas limpios)
# ============================================================

set -u

# ------------------------------------------------------------
# Colores
# ------------------------------------------------------------

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ------------------------------------------------------------
# Funciones de Logging
# ------------------------------------------------------------

log() {
    echo -e "${CYAN}$1${NC}"
}

success() {
    echo -e "${GREEN}✔ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

error() {
    echo -e "${RED}✖ $1${NC}"
    exit 1
}

# ------------------------------------------------------------
# Verificar ejecutor y sudo
# ------------------------------------------------------------

if [ "$EUID" -ne 0 ]; then
    error "Este instalador requiere permisos de administrador.\nEjecuta: sudo bash ./install_all.sh"
fi

# Detectar usuario real tras el sudo
REAL_USER="${SUDO_USER:-$USER}"
REAL_HOME="$(eval echo "~$REAL_USER")"

if [ "$REAL_USER" = "root" ]; then
    warning "Advertencia: Estás ejecutando el instalador directamente como el usuario root."
fi

# Helper para ejecutar comandos como el usuario no-root preservando PATH y HOME
run_as_user() {
    if [ -n "${SUDO_USER:-}" ] && [ "$REAL_USER" != "root" ]; then
        sudo -u "$REAL_USER" env PATH="$PATH" HOME="$REAL_HOME" "$@"
    else
        "$@"
    fi
}

# ------------------------------------------------------------
# Directorio raíz del proyecto
# ------------------------------------------------------------

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR" || exit 1

echo
echo "============================================================"
echo "                  MedicOS Installer v2.3"
echo "============================================================"
echo "Usuario objetivo: $REAL_USER"
echo "Directorio      : $PROJECT_DIR"
echo "============================================================"
echo

# ------------------------------------------------------------
# Verificar estructura del Monorepo
# ------------------------------------------------------------

[ -d "$PROJECT_DIR/apps/api" ] || error "No existe la carpeta apps/api."
[ -d "$PROJECT_DIR/apps/web" ] || error "No existe la carpeta apps/web."
[ -f "$PROJECT_DIR/package.json" ] || error "No existe package.json en la raíz."

success "Estructura del proyecto MedicOS validada."

# ------------------------------------------------------------
# 1. Dependencias del sistema
# ------------------------------------------------------------

log "[1/9] Instalando paquetes base del sistema..."

apt-get update -y

apt-get install -y \
    curl \
    git \
    ca-certificates \
    gnupg \
    lsb-release \
    build-essential \
    lsof \
    openssl \
    postgresql-client

success "Dependencias básicas instaladas."

# ------------------------------------------------------------
# 2. Node.js 22 LTS
# ------------------------------------------------------------

log "[2/9] Verificando entorno Node.js..."

NODE_MAJOR=0

if command -v node >/dev/null 2>&1; then
    NODE_VERSION="$(node -v | sed 's/^v//')"
    NODE_MAJOR="$(echo "$NODE_VERSION" | cut -d. -f1)"
fi

if [ "$NODE_MAJOR" -lt 22 ]; then
    warning "Instalando Node.js 22 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt-get install -y nodejs
fi

# Exportar PATH de Node para asegurar su alcance inmediato
export PATH="$PATH:/usr/bin:/usr/local/bin"

success "Node.js $(node -v) / npm $(npm -v)"

# ------------------------------------------------------------
# 3. Docker Engine y Plugin de Compose
# ------------------------------------------------------------

log "[3/9] Verificando entorno Docker..."

if ! command -v docker >/dev/null 2>&1; then
    warning "Docker no detectado. Instalando Motor de Docker y Compose..."
    apt-get update -y
    apt-get install -y docker.io docker-compose-plugin
fi

systemctl enable docker >/dev/null 2>&1 || true
systemctl start docker >/dev/null 2>&1 || true

if [ -n "${SUDO_USER:-}" ] && [ "$REAL_USER" != "root" ]; then
    usermod -aG docker "$REAL_USER" || true
fi

if ! docker info >/dev/null 2>&1; then
    error "El demonio de Docker no está respondiendo."
fi

# Determinar comando de Docker Compose
DOCKER_COMPOSE=""
if docker compose version >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    DOCKER_COMPOSE="docker-compose"
else
    error "No se encontró el plugin 'docker compose' ni el ejecutable 'docker-compose'."
fi

success "Docker ($DOCKER_COMPOSE) configurado correctamente."

# ------------------------------------------------------------
# Variables de Entorno del Proyecto y Verificación de Puertos
# ------------------------------------------------------------

DB_CONTAINER="medicos_db"
DB_NAME="medicos_db"
DB_USER="medicos_app"
DB_PASSWORD="MedicosDB_2026_Secure"
DB_PORT="5432"

API_PORT="3000"
WEB_PORT="5173"

# Detener servicio local de PostgreSQL en el host si existe para liberar el puerto 5432
if systemctl is-active --quiet postgresql 2>/dev/null; then
    warning "Se detectó un servicio local de PostgreSQL ejecutándose en el sistema host. Deteniendo para evitar conflicto en el puerto ${DB_PORT}..."
    systemctl stop postgresql || true
fi

# ------------------------------------------------------------
# 4. Crear docker-compose.yml
# ------------------------------------------------------------

log "[4/9] Generando archivo docker-compose.yml..."

cat > "$PROJECT_DIR/docker-compose.yml" <<EOF
services:
  postgres:
    image: postgres:16-alpine
    container_name: ${DB_CONTAINER}
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "${DB_PORT}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 3s
      timeout: 5s
      retries: 20

volumes:
  postgres_data:
EOF

success "docker-compose.yml generado."

# ------------------------------------------------------------
# 5. Generar .env para API y WEB
# ------------------------------------------------------------

log "[5/9] Generando archivos de entorno (.env)..."

JWT_SECRET=""
if [ -f "$PROJECT_DIR/apps/api/.env" ]; then
    JWT_SECRET="$(grep '^JWT_SECRET=' "$PROJECT_DIR/apps/api/.env" | cut -d'=' -f2- || true)"
fi
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET="$(openssl rand -hex 64)"
fi

# API .env
API_ENV="$PROJECT_DIR/apps/api/.env"
cat > "$API_ENV" <<EOF
PORT=${API_PORT}
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}?schema=public"
JWT_SECRET=${JWT_SECRET}
TURNSTILE_SECRET_KEY=0x4AAAAAAD8UiHj9T22_Ygg0IC7wlQayK8Y
EOF

# WEB .env
WEB_ENV="$PROJECT_DIR/apps/web/.env"
cat > "$WEB_ENV" <<EOF
VITE_API_URL=http://localhost:${API_PORT}
EOF

chmod 644 "$API_ENV" "$WEB_ENV"

success "Archivos de entorno configurados en apps/api/.env y apps/web/.env"

# ------------------------------------------------------------
# 6. Desplegar e Inicializar PostgreSQL en Docker
# ------------------------------------------------------------

log "[6/9] Desplegando contenedor PostgreSQL..."

$DOCKER_COMPOSE down -v --remove-orphans >/dev/null 2>&1 || true
$DOCKER_COMPOSE up -d

log "Esperando que el motor de base de datos acepte conexiones..."

READY=0
for i in $(seq 1 40); do
    if docker exec "$DB_CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
        READY=1
        break
    fi
    printf "."
    sleep 1
done
echo

if [ "$READY" -ne 1 ]; then
    $DOCKER_COMPOSE ps
    docker logs "$DB_CONTAINER" --tail 30
    error "La base de datos PostgreSQL no respondió a tiempo."
fi

success "PostgreSQL activo y listo en el puerto ${DB_PORT}."

# ------------------------------------------------------------
# Ajuste de Permisos de Archivos
# ------------------------------------------------------------

if [ -n "${SUDO_USER:-}" ] && [ "$REAL_USER" != "root" ]; then
    chown -R "$REAL_USER:$REAL_USER" "$PROJECT_DIR"
fi

# ------------------------------------------------------------
# 7. Instalación de dependencias de Node.js (Monorepo Workspaces)
# ------------------------------------------------------------

log "[7/9] Instalando dependencias npm del proyecto..."

run_as_user npm install || error "Fallo al ejecutar npm install"

success "Dependencias de Node.js instaladas correctamente."

# ------------------------------------------------------------
# 8. Generación de Cliente Prisma, Migraciones y Seed
# ------------------------------------------------------------

log "[8/9] Configurando Prisma ORM (Generate, Migrate Deploy y Seed)..."

cd "$PROJECT_DIR/apps/api" || exit 1

run_as_user npx prisma generate || error "Fallo en npx prisma generate"

# Aplicar las migraciones existentes formalmente en lugar de db push
log "Aplicando migraciones en la base de datos..."
run_as_user npx prisma migrate deploy || {
    warning "Migrate deploy no pudo completarse directamente. Ejecutando db push como alternativa de sincronización..."
    run_as_user npx prisma db push || error "Fallo en la sincronización del esquema con Prisma."
}

if [ -f "$PROJECT_DIR/dump.sql" ]; then
    log "Restaurando copia de respaldo desde dump.sql..."
    docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < "$PROJECT_DIR/dump.sql" >/dev/null 2>&1 || warning "Advertencia al procesar dump.sql, continuando..."
    success "Copia de respaldo dump.sql restaurada."
else
    log "Ejecutando sembrado de datos iniciales con Prisma Seed..."
    run_as_user npx prisma db seed || error "Fallo en npx prisma db seed"
    success "Sembrado de datos iniciales completado."
fi

cd "$PROJECT_DIR" || exit 1

success "Base de datos sincronizada y poblada exitosamente."

# ------------------------------------------------------------
# 9. Corrección Final de Permisos y Ejecución
# ------------------------------------------------------------

if [ -n "${SUDO_USER:-}" ] && [ "$REAL_USER" != "root" ]; then
    chown -R "$REAL_USER:$REAL_USER" "$PROJECT_DIR"
fi

echo
echo "============================================================"
echo "          INSTALACIÓN COMPLETADA EXITOSAMENTE"
echo "============================================================"
echo "Servicios configurados:"
echo "  • Base de Datos : postgresql://${DB_USER}:****@localhost:${DB_PORT}/${DB_NAME}"
echo "  • API Backend   : http://localhost:${API_PORT}"
echo "  • Web Frontend  : http://localhost:${WEB_PORT}"
echo "============================================================"
echo "Iniciando MedicOS en modo desarrollo como el usuario '$REAL_USER'..."
echo "Presiona Ctrl + C para detener la aplicación."
echo

# Ejecutar el servidor de desarrollo como usuario no-root
run_as_user npm run dev