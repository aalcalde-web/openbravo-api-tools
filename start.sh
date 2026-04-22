#!/bin/bash
cd "$(dirname "$0")"

echo "🔄 Generating API field data..."
python3 api-field-reference/generate.py

echo "🚀 Starting server on http://localhost:8888/portal/"
python3 -m http.server 8888
