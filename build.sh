#!/bin/bash
set -e

echo "🔧 Habilitando pnpm con Corepack..."
corepack enable
corepack prepare pnpm@latest --activate

echo "Instalando dependencias del monorepo (solo para el server)..."
pnpm install --filter ./server...

echo "Compilando el backend..."
pnpm --filter ./server run build

echo "Build completado correctamente"
