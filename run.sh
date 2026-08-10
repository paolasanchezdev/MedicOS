```bash
#!/usr/bin/env bash

# ============================================================
# MedicOS - Launcher
# Sistema Inteligente para Brigadas Médicas Comunitarias
#
# Estructura:
#   MedicOS/
#   ├── apps/
#   │   ├── api/
#   │   └── web/
#   ├── packages/
#   ├── docker-compose.yml
#   ├── package.json
#   ├── turbo.json
#   └── run.sh
#
# Funciones:
#   1. Verificar requisitos
#   2. Levantar PostgreSQL mediante Docker
#   3. Instalar dependencias
#   4. Configurar variables de entorno
#   5. Generar Prisma Client
#   6. Aplicar migraciones
#   7. Crear administrador inicial si no existe
#   8. Levantar API + Frontend mediante Turbo
# ============================================================

set -Eeuo pipefail

# ============================================================
# COLORES
# ============================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m'

# ============================================================
# CONFIGURACIÓN
# ============================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

API_DIR="$PROJECT_DIR/apps/api"
WEB_DIR="$PROJECT_DIR/apps/web"

ENV_FILE="$API_DIR/.env"

DB_CONTAINER="medicos_db"
DB_NAME="medicos_db"
DB_USER="postgres"
DB_PASSWORD="postgres"

API_PORT=3000
WEB_PORT=5173

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"

# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

port_in_use() {
    local port="$1"

    if command_exists lsof; then
        lsof -Pi :"$port" -sTCP:LISTEN -t >/dev/null 2>&1
    elif command_exists ss; then
        ss -ltn "( sport = :$port )" 2>/dev/null | grep -q ":$port"
    else
        return 1
    fi
}

cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Deteniendo MedicOS...${NC}"
    echo -e "${CYAN}PostgreSQL permanecerá ejecutándose en Docker.${NC}"
    echo ""
}

trap cleanup INT TERM

# ============================================================
# ENCABEZADO
# ============================================================

clear

echo -e "${BLUE}"
echo "============================================================"
echo "                 MedicOS Launcher v1.0"
echo "============================================================"
echo -e "${NC}"

echo -e "${CYAN}"
echo " Sistema Inteligente para Brigadas Médicas Comunitarias"
echo "============================================================"
echo -e "${NC}"

# ============================================================
# 1. COMPROBAR DIRECTORIO
# ============================================================

echo -e "${YELLOW}[1/8] Verificando proyecto...${NC}"

cd "$PROJECT_DIR"

if [ ! -f "$PROJECT_DIR/package.json" ]; then
    print_error "No se encontró package.json en la raíz del proyecto."
    exit 1
fi

if [ ! -d "$API_DIR" ]; then
    print_error "No se encontró apps/api."
    exit 1
fi

if [ ! -d "$WEB_DIR" ]; then
    print_error "No se encontró apps/web."
    exit 1
fi

if [ ! -f "$PROJECT_DIR/docker-compose.yml" ]; then
    print_error "No se encontró docker-compose.yml."
    exit 1
fi

print_success "Estructura de MedicOS detectada."

# ============================================================
# 2. VERIFICAR NODE / NPM / DOCKER
# ============================================================

echo ""
echo -e "${YELLOW}[2/8] Verificando requisitos del sistema...${NC}"

if ! command_exists node; then
    print_error "Node.js no está instalado."
    echo "Instala Node.js 20 LTS o superior."
    exit 1
fi

print_success "Node.js $(node -v) detectado."

if ! command_exists npm; then
    print_error "npm no está instalado."
    exit 1
fi

print_success "npm $(npm -v) detectado."

if ! command_exists docker; then
    print_error "Docker no está instalado."
    echo "Instala Docker antes de ejecutar MedicOS."
    exit 1
fi

print_success "Docker $(docker --version | awk '{print $3}' | tr -d ',') detectado."

if ! docker info >/dev/null 2>&1; then
    print_error "Docker está instalado pero el servicio no está disponible."
    echo ""
    echo "Intenta iniciar Docker con:"
    echo "  sudo systemctl start docker"
    exit 1
fi

print_success "Servicio Docker disponible."

# ============================================================
# 3. VERIFICAR PUERTOS
# ============================================================

echo ""
echo -e "${YELLOW}[3/8] Verificando puertos...${NC}"

if port_in_use "$API_PORT"; then
    print_warning "El puerto $API_PORT ya está ocupado."

    echo ""
    echo "MedicOS necesita el puerto $API_PORT para la API."
    echo "Proceso que utiliza el puerto:"

    if command_exists lsof; then
        lsof -Pi :"$API_PORT" -sTCP:LISTEN || true
    fi

    echo ""
    read -r -p "¿Deseas continuar de todos modos? [s/N]: " CONTINUE

    if [[ ! "$CONTINUE" =~ ^[SsYy]$ ]]; then
        exit 1
    fi
else
    print_success "Puerto $API_PORT disponible."
fi

if port_in_use "$WEB_PORT"; then
    print_warning "El puerto $WEB_PORT ya está ocupado."

    echo ""
    echo "MedicOS necesita el puerto $WEB_PORT para el frontend."

    if command_exists lsof; then
        lsof -Pi :"$WEB_PORT" -sTCP:LISTEN || true
    fi

    echo ""
    read -r -p "¿Deseas continuar de todos modos? [s/N]: " CONTINUE

    if [[ ! "$CONTINUE" =~ ^[SsYy]$ ]]; then
        exit 1
    fi
else
    print_success "Puerto $WEB_PORT disponible."
fi

# ============================================================
# 4. INSTALAR DEPENDENCIAS
# ============================================================

echo ""
echo -e "${YELLOW}[4/8] Verificando dependencias del proyecto...${NC}"

if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    print_info "Instalando dependencias del monorepo..."

    npm install

    print_success "Dependencias instaladas."
else
    print_success "Dependencias del monorepo ya instaladas."
fi

# ============================================================
# 5. CONFIGURAR VARIABLES DE ENTORNO
# ============================================================

echo ""
echo -e "${YELLOW}[5/8] Configurando variables de entorno...${NC}"

if [ ! -f "$ENV_FILE" ]; then

    if [ -f "$API_DIR/.env.example" ]; then

        cp "$API_DIR/.env.example" "$ENV_FILE"

        print_info "Se creó apps/api/.env desde .env.example."

    elif [ -f "$PROJECT_DIR/.env.example" ]; then

        cp "$PROJECT_DIR/.env.example" "$ENV_FILE"

        print_info "Se creó apps/api/.env desde .env.example."

    else

        print_info "Creando apps/api/.env..."

        cat > "$ENV_FILE" <<EOF
DATABASE_URL="${DATABASE_URL}"
PORT=${API_PORT}
JWT_SECRET="medicos-development-secret-change-in-production"
EOF

    fi

else

    print_success "apps/api/.env ya existe."

fi

# ============================================================
# ASEGURAR DATABASE_URL
# ============================================================

if grep -q "^DATABASE_URL=" "$ENV_FILE"; then

    sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"${DATABASE_URL}\"|" "$ENV_FILE"

else

    echo "DATABASE_URL=\"${DATABASE_URL}\"" >> "$ENV_FILE"

fi

# Asegurar puerto de API si no existe

if grep -q "^PORT=" "$ENV_FILE"; then

    sed -i "s|^PORT=.*|PORT=${API_PORT}|" "$ENV_FILE"

else

    echo "PORT=${API_PORT}" >> "$ENV_FILE"

fi

print_success "Variables de entorno configuradas."

# ============================================================
# 6. LEVANTAR POSTGRESQL
# ============================================================

echo ""
echo -e "${YELLOW}[6/8] Preparando PostgreSQL...${NC}"

cd "$PROJECT_DIR"

if docker compose version >/dev/null 2>&1; then

    print_info "Iniciando PostgreSQL con Docker Compose..."

    docker compose up -d

else

    print_error "Docker Compose no está disponible."
    exit 1

fi

echo ""
echo -e "${CYAN}⏳ Esperando a que PostgreSQL esté listo...${NC}"

MAX_RETRIES=30
RETRY_COUNT=0

until docker exec "$DB_CONTAINER" pg_isready \
    -U "$DB_USER" \
    -d "$DB_NAME" >/dev/null 2>&1
do

    RETRY_COUNT=$((RETRY_COUNT + 1))

    if [ "$RETRY_COUNT" -ge "$MAX_RETRIES" ]; then

        echo ""

        print_error "PostgreSQL no respondió a tiempo."

        echo ""
        echo "Estado del contenedor:"
        docker ps -a --filter "name=$DB_CONTAINER"

        echo ""
        echo "Logs:"
        docker logs "$DB_CONTAINER" --tail 50 || true

        exit 1
    fi

    echo -n "."
    sleep 1

done

echo ""

print_success "PostgreSQL está listo."

# ============================================================
# 7. PRISMA + BASE DE DATOS + ADMIN
# ============================================================

echo ""
echo -e "${YELLOW}[7/8] Preparando base de datos MedicOS...${NC}"

cd "$PROJECT_DIR"

# ------------------------------------------------------------
# Prisma Generate
# ------------------------------------------------------------

echo -e "${CYAN}⚙ Generando Prisma Client...${NC}"

if npm --prefix "$API_DIR" run prisma:generate >/dev/null 2>&1; then

    print_success "Prisma Client generado."

else

    print_warning "El script prisma:generate no está definido."
    print_info "Intentando ejecutar Prisma directamente..."

    (
        cd "$API_DIR"
        npx prisma generate
    )

    print_success "Prisma Client generado."

fi

# ------------------------------------------------------------
# Base de datos
# ------------------------------------------------------------

echo ""
echo -e "${CYAN}⚙ Aplicando estructura de base de datos...${NC}"

if npm --prefix "$API_DIR" run prisma:migrate:deploy >/dev/null 2>&1; then

    print_success "Migraciones Prisma aplicadas."

elif npm --prefix "$API_DIR" run prisma:push >/dev/null 2>&1; then

    print_success "Esquema Prisma sincronizado."

else

    print_warning "No se encontraron scripts Prisma configurados."
    print_info "Ejecutando Prisma directamente..."

    (
        cd "$API_DIR"
        npx prisma migrate deploy
    ) || (
        cd "$API_DIR"
        npx prisma db push
    )

    print_success "Base de datos preparada."

fi

# ============================================================
# CREAR ADMINISTRADOR INICIAL
# ============================================================

echo ""
echo -e "${CYAN}🔐 Verificando administrador inicial...${NC}"

ADMIN_EXISTS=$(
    cd "$API_DIR" && \
    npx tsx -e "
        import { PrismaClient } from '@prisma/client';
        import { PrismaPg } from '@prisma/adapter-pg';
        import pg from 'pg';

        const pool = new pg.Pool({
          connectionString: process.env.DATABASE_URL
        });

        const adapter = new PrismaPg(pool);
        const prisma = new PrismaClient({ adapter });

        const run = async () => {
          const admin = await prisma.user.findFirst({
            where: {
              role: 'ADMIN',
              deletedAt: null
            },
            select: {
              id: true
            }
          });

          console.log(admin ? 'EXISTS' : 'MISSING');

          await prisma.\$disconnect();
          await pool.end();
        };

        run().catch(async () => {
          await prisma.\$disconnect();
          await pool.end();
          process.exit(1);
        });
    " 2>/dev/null
) || ADMIN_EXISTS="MISSING"

if [ "$ADMIN_EXISTS" = "EXISTS" ]; then

    print_success "Administrador existente detectado."
    echo "No es necesario crear otro usuario."

else

    echo ""
    echo -e "${BLUE}"
    echo "=========================================="
    echo "     CONFIGURACIÓN INICIAL DE MedicOS"
    echo "=========================================="
    echo -e "${NC}"

    echo "No se encontró un administrador."
    echo "Crea el administrador inicial del sistema."
    echo ""

    cd "$API_DIR"

    if [ ! -f "$API_DIR/src/scripts/create-admin.ts" ]; then
        print_error "No se encontró:"
        echo "$API_DIR/src/scripts/create-admin.ts"
        exit 1
    fi

    npx tsx src/scripts/create-admin.ts

    echo ""

    print_success "Administrador inicial configurado."

fi

# ============================================================
# 8. INICIAR MEDICOS
# ============================================================

echo ""
echo -e "${YELLOW}[8/8] Iniciando ecosistema MedicOS...${NC}"

cd "$PROJECT_DIR"

echo ""
echo -e "${GREEN}"
echo "============================================================"
echo "                 🚀 MedicOS ESTÁ LISTO"
echo "============================================================"
echo -e "${NC}"

echo -e " 🐘 PostgreSQL: ${GREEN}http://localhost:5432${NC}"
echo -e " 🔧 Backend API: ${CYAN}http://localhost:${API_PORT}${NC}"
echo -e " 🌐 Frontend Web: ${CYAN}http://localhost:${WEB_PORT}${NC}"

echo ""
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}              Sistema iniciado correctamente${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""

echo -e "${YELLOW}Para acceder a MedicOS:${NC}"
echo -e "  ${CYAN}http://localhost:${WEB_PORT}${NC}"
echo ""

echo -e "${YELLOW}Presiona Ctrl+C para detener API y Frontend.${NC}"
echo ""

# ============================================================
# ARRANCAR TURBO
# ============================================================

npm run dev
```
