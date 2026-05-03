#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Instalando dependencias do backend..."
cd "$ROOT_DIR/atlas-crm-api"
npm install

echo "Instalando dependencias do frontend..."
cd "$ROOT_DIR/atlas-crm-front"
npm install

cd "$ROOT_DIR"
echo "Instalacao concluida."
echo "Arquivo de ambiente central: $ROOT_DIR/.env"
