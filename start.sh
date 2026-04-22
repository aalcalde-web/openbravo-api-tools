#!/bin/bash
cd "$(dirname "$0")"

# Kill existing server on port 8888
fuser -k 8888/tcp 2>/dev/null

echo "🔄 Generating API field data..."
python3 api-field-reference/generate.py

echo "🔄 Generating undocumented fields data..."
python3 undocumented-fields/generate.py

echo "🚀 Starting server on http://localhost:8888/portal/"
python3 -m http.server 8888
