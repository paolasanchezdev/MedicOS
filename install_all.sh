#!/usr/bin/env bash

# Detener el script si ocurre algún error crítico
set -e

# Verificación de superusuario
if [ "$EUID" -ne 0 ]; then
  echo "⚠️ Este script necesita permisos de administrador."
  echo "Por favor ejecútalo con sudo:"
  echo "👉 sudo ./install_all.sh"
  exit 1
fi

REAL_USER=${SUDO_USER:-$USER}
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=================================================="
echo " 🚀 INSTALADOR AUTÓNOMO Y EQUIPO - MEDICOS"
echo "=================================================="

# 1. Actualizar sistema e instalar utilidades básicas
echo "🔄 [1/7] Actualizando repositorios e instalando dependencias base..."
apt-get update -y
apt-get install -y curl git ca-certificates gnupg lsb-release build-essential

# 2. Instalar Node.js v20 LTS si no existe
if ! command -v node &> /dev/null; then
    echo "📦 [2/7] Node.js no detectado. Instalando Node.js v20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "✅ [2/7] Node.js ya está instalado ($(node -v))."
fi

# 3. Instalar Docker y Docker Compose si no existen
if ! command -v docker &> /dev/null; then
    echo "🐳 [3/7] Docker no detectado. Instalando Docker Engine y Compose..."
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
    chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    systemctl start docker
    systemctl enable docker
    usermod -aG docker $REAL_USER
else
    echo "✅ [3/7] Docker ya está instalado."
fi

# 4. Crear archivo .env si no existe con credenciales genéricas para el equipo
cd "$PROJECT_DIR"
if [ ! -f .env ]; then
    echo "📄 [4/7] Generando archivo de variables de entorno (.env)..."
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        cat <<EOT > .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/medicos_db?schema=public"
JWT_SECRET="clave_super_secreta_medicos_2026"
PORT=3000
EOT
    fi
    chown $REAL_USER:$REAL_USER .env
else
    echo "✅ [4/7] Archivo .env existente detectado."
fi

# 5. Instalar paquetes Node.js del monorepo
echo "📦 [5/7] Instalando paquetes del monorepo (npm install)..."
su - $REAL_USER -c "cd '$PROJECT_DIR' && npm install"

# 6. Iniciar PostgreSQL en Docker
echo "🐘 [6/7] Iniciando contenedor de PostgreSQL..."
# Liberar el puerto 5432 si PostgreSQL nativo está corriendo
systemctl stop postgresql 2>/dev/null || true

docker compose up -d || docker-compose up -d

echo "⏳ Esperando 8 segundos a que la base de datos PostgreSQL inicie..."
sleep 8

# 7. Despliegue de estructura de base de datos
echo "🛠️ [7/7] Configurando tablas y usuarios iniciales..."
su - $REAL_USER -c "cd '$PROJECT_DIR/apps/api' && npx prisma generate"
su - $REAL_USER -c "cd '$PROJECT_DIR/apps/api' && npx prisma migrate deploy"

# Detección de respaldo .sql en el directorio raíz
SQL_FILE=""
if [ -f "$PROJECT_DIR/respaldo_medicos.sql" ]; then
    SQL_FILE="$PROJECT_DIR/respaldo_medicos.sql"
elif [ -f "$PROJECT_DIR/respaldos_medicos.sql" ]; then
    SQL_FILE="$PROJECT_DIR/respaldos_medicos.sql"
fi

if [ -n "$SQL_FILE" ]; then
    echo "📦 Detectado respaldo '$(basename "$SQL_FILE")'. Importando datos..."
    sed 's/OWNER TO paola;/OWNER TO postgres;/g' "$SQL_FILE" | docker exec -i medicos_db psql -U postgres -d medicos_db || true
    echo "✅ Respaldo importado correctamente."
else
    echo "👤 Creando usuarios iniciales por defecto..."
    su - $REAL_USER -c "cd '$PROJECT_DIR/apps/api' && npx tsx src/scripts/create-admin.ts" || true
    su - $REAL_USER -c "cd '$PROJECT_DIR/apps/api' && npx tsx src/scripts/create-authority-user.ts" || true
fi

echo "=================================================="
echo " 🎉 ¡INSTALACIÓN Y CONFIGURACIÓN COMPLETADAS!"
echo "=================================================="
echo "Para iniciar la aplicación:"
echo " 1. Reinicia tu sesión de terminal o ejecuta: newgrp docker"
echo " 2. Ejecuta: npm run dev"
echo "=================================================="