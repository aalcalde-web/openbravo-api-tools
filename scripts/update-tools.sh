#!/usr/bin/env bash
# Actualiza los datos de todas las herramientas desde el código fuente de Openbravo
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔄 Actualizando herramientas desde código fuente..."
echo ""

# GET → POST Converter
echo "━━━ GET → POST/PATCH Converter ━━━"
python3 "$REPO_ROOT/get-to-post-converter/scripts/extract_schemas.py"
echo ""

echo "✅ Actualización completada"
