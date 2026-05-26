#!/bin/bash
cd "$(dirname "$0")"

# Kill existing servers
fuser -k 8888/tcp 2>/dev/null
fuser -k 8889/tcp 2>/dev/null
fuser -k 8890/tcp 2>/dev/null

echo "🔄 Generating API field data..."
python3 api-field-reference/generate.py

echo "🔄 Generating undocumented fields data..."
python3 undocumented-fields/generate.py

echo "🔧 Starting Undocumented Analyzer on http://localhost:8889"
python3 tools/undocumented-analyzer/scripts/server.py &

echo "📝 Starting Description Analyzer on http://localhost:8890"
python3 tools/description-analyzer/scripts/server.py &

echo "🚀 Starting portal on http://localhost:8888/portal/"
xdg-open http://localhost:8888/portal/ 2>/dev/null &
python3 -m http.server 8888
