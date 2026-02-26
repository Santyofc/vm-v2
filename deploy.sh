#!/bin/bash
# Salir inmediatamente si un comando falla
set -e

echo "🚀 Iniciando despliegue seguro..."

# 1. Traer los últimos cambios
echo "📥 Obteniendo código fuente..."
git pull origin main

# 2. Reconstruir contenedores
echo "📦 Construyendo imagen de Next.js..."
docker compose build

# 3. Migrar base de datos ANTES de levantar la app
echo "🔄 Aplicando migraciones de Prisma..."
docker compose run --rm nextjs npx prisma migrate deploy

# 4. Asegurar que el SuperAdmin exista
echo "🌱 Ejecutando seeder..."
docker compose run --rm nextjs npx prisma db seed

# 5. Levantar el ecosistema
echo "🟢 Levantando servicios..."
docker compose up -d

# 6. Limpieza de sistema
echo "🧹 Limpiando imágenes antiguas..."
docker image prune -f

echo "✅ ¡Despliegue exitoso en producción!"
