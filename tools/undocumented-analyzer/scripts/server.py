#!/usr/bin/env python3
"""
Mini HTTP server for the Undocumented Fields Analyzer tool.
"""
import json
import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from analyze import analyze, get_available_apis

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'shared'))
from discovery import get_apis_grouped

PORT = 8889
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')


class AnalyzerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == '/api/apis':
            self._json_response(get_available_apis())
            return

        if parsed.path == '/api/apis-grouped':
            self._json_response(get_apis_grouped())
            return

        if parsed.path == '/api/analyze':
            params = parse_qs(parsed.query)
            api_key = params.get('api', [''])[0]
            if not api_key:
                self._json_response({'error': 'Missing api parameter'}, 400)
                return
            try:
                csv_content, undoc_count, yaml_count, js_count = analyze(api_key)
                self._json_response({
                    'csv': csv_content,
                    'stats': {
                        'yamlFields': yaml_count,
                        'jsFields': js_count,
                        'undocumented': undoc_count,
                    }
                })
            except Exception as e:
                self._json_response({'error': str(e)}, 500)
            return

        super().do_GET()

    def _json_response(self, data, status=200):
        body = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(body))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *args):
        pass


if __name__ == '__main__':
    os.chdir(PUBLIC_DIR)
    server = HTTPServer(('', PORT), AnalyzerHandler)
    print(f"🔧 Undocumented Analyzer running on http://localhost:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
