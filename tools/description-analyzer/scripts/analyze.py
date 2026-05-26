#!/usr/bin/env python3
"""
Field Description Analyzer
Parses OpenAPI YAML schemas, finds how each field is used in JS source code,
generates a real description from code context, and compares with the YAML description.
Works with any API discovered automatically from the Openbravo source tree.
"""
import csv
import io
import os
import re
import sys
import yaml

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'shared'))
from discovery import discover_apis, get_api_config, get_apis_grouped


def _load_yaml(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        content = re.sub(r'\$\{[^}]+\}', '""', content)
        content = re.sub(r'^\s*""\s*$', '', content, flags=re.MULTILINE)
        return yaml.safe_load(content)
    except Exception:
        return None


def _walk_and_collect(schema, fields, endpoint='', section='', prefix=''):
    if not isinstance(schema, dict):
        return

    props = schema.get('properties', {})
    for prop_name, prop_def in props.items():
        if not isinstance(prop_def, dict):
            continue

        field_path = f"{prefix}.{prop_name}" if prefix else prop_name
        field_type = prop_def.get('type', 'object')
        fmt = prop_def.get('format', '')
        if fmt:
            field_type = f"{field_type} ({fmt})"
        enum = prop_def.get('enum')
        if enum:
            field_type = f"{field_type} (enum: {', '.join(str(e) for e in enum[:5])})"

        description = prop_def.get('description', '')

        fields.append({
            'endpoint': endpoint,
            'section': section,
            'tree': prop_name,
            'field_path': field_path,
            'field_name': prop_name,
            'type': field_type,
            'yml_description': description.strip() if description else '',
        })

        if prop_def.get('type') == 'object' or 'properties' in prop_def:
            _walk_and_collect(prop_def, fields, endpoint, section, field_path)
        if prop_def.get('type') == 'array' and 'items' in prop_def:
            items = prop_def['items']
            if isinstance(items, dict):
                _walk_and_collect(items, fields, endpoint, section, f"{field_path}[]")

    for combiner in ('allOf', 'oneOf', 'anyOf'):
        if combiner in schema:
            for sub in schema[combiner]:
                if isinstance(sub, dict):
                    _walk_and_collect(sub, fields, endpoint, section, prefix)


def parse_all_schemas(api_config):
    """Parse all YAML schemas and return a flat list of fields with metadata."""
    fields = []

    # Parse section YAML files
    yaml_dir = api_config['yaml_dir']
    if os.path.isdir(yaml_dir):
        for yml_file in api_config['yaml_sections']:
            if 'example' in yml_file:
                continue
            yml_path = os.path.join(yaml_dir, yml_file)
            schema = _load_yaml(yml_path)
            if schema:
                section_name = yml_file.replace('.yml', '').replace('-schema', '')
                _walk_and_collect(schema, fields, section_name, 'SCHEMA')

    # Parse main YAML
    main_yml = api_config['main_yaml']
    schema = _load_yaml(main_yml)
    if schema:
        if 'components' in schema and 'schemas' in schema.get('components', {}):
            for schema_name, schema_def in schema['components']['schemas'].items():
                _walk_and_collect(schema_def, fields, schema_name, 'COMPONENT')
        if 'paths' in schema:
            for path_name, methods in schema['paths'].items():
                if not isinstance(methods, dict):
                    continue
                for method, op in methods.items():
                    if not isinstance(op, dict):
                        continue
                    endpoint_label = f"{method.upper()} {path_name}"
                    # Request body
                    rb = op.get('requestBody', {})
                    if isinstance(rb, dict) and 'content' in rb:
                        for _, media in rb['content'].items():
                            if isinstance(media, dict) and 'schema' in media:
                                _walk_and_collect(media['schema'], fields, endpoint_label, 'REQUEST')
                    # Responses
                    for code, resp in op.get('responses', {}).items():
                        if isinstance(resp, dict) and 'content' in resp:
                            for _, media in resp['content'].items():
                                if isinstance(media, dict) and 'schema' in media:
                                    _walk_and_collect(media['schema'], fields, endpoint_label, 'RESPONSE')

    # Deduplicate
    seen = set()
    unique = []
    for f in fields:
        key = (f['endpoint'], f['section'], f['field_path'])
        if key not in seen:
            seen.add(key)
            unique.append(f)
    return unique


def load_js_sources(api_config):
    """Load all JS source files into memory."""
    sources = {}
    for js_dir in api_config['js_dirs']:
        if not os.path.exists(js_dir):
            continue
        for root, dirs, files in os.walk(js_dir):
            dirs[:] = [d for d in dirs if d not in ('__test__', '__mock__', 'node_modules', '.git')]
            for fname in files:
                if not fname.endswith(('.js', '.ts', '.jsx', '.tsx')):
                    continue
                fpath = os.path.join(root, fname)
                try:
                    with open(fpath, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                    sources[fname] = (fpath, lines)
                except Exception:
                    pass
    return sources


def find_field_usage(field_name, sources):
    usages = []
    patterns = [
        re.compile(r'(?<![.\w])' + re.escape(field_name) + r'(?:\s*[=:,;\)\]\}]|\s*$)', re.MULTILINE),
        re.compile(r'\.' + re.escape(field_name) + r'(?:\s*[=:,;\)\]\}.\[]|\s*$)', re.MULTILINE),
        re.compile(r'[\'"]' + re.escape(field_name) + r'[\'"]'),
    ]
    for fname, (fpath, lines) in sources.items():
        for line_no, line_text in enumerate(lines, 1):
            stripped = line_text.strip()
            if stripped.startswith('//') or stripped.startswith('*'):
                continue
            for pat in patterns:
                if pat.search(line_text):
                    usages.append((fname, line_no, stripped))
                    break
    return usages


def assess_severity(yml_desc, usages):
    if not yml_desc:
        if usages:
            return '🐛 BUG', 'Missing', 'No description in YAML schema but field is used in code.'
        return '🐛 BUG', 'Missing', 'No description in YAML schema.'

    if not usages:
        return '✅ OK', 'OK', 'Documented but no code usage found (may be passthrough).'

    yml_lower = yml_desc.lower()
    if len(yml_desc) < 20 and len(usages) > 3:
        return 'ℹ️ MEJORABLE', 'Parcial', 'Description too short for a heavily-used field.'
    if 'to be defined' in yml_lower or 'tbd' in yml_lower or 'todo' in yml_lower:
        return 'ℹ️ MEJORABLE', 'Parcial', 'Description contains TODO/TBD.'
    if 'not used' in yml_lower and len(usages) > 2:
        return '⚠️ ERROR DESC', 'Parcial', 'YAML says "not used" but field is referenced in code.'

    return '✅ OK', 'OK', 'Description appears adequate.'


def analyze(api_key):
    """Run the full analysis."""
    api_config = get_api_config(api_key)
    if not api_config:
        raise ValueError(f"API not found: {api_key}")

    fields = parse_all_schemas(api_config)
    sources = load_js_sources(api_config)

    results = []
    for field in fields:
        usages = find_field_usage(field['field_name'], sources)
        code_refs = [f"{fname}#L{ln}" for fname, ln, _ in usages[:4]]
        severity, match, notes = assess_severity(field['yml_description'], usages)

        results.append({
            'Issue Severity': severity,
            'Endpoint': field['endpoint'],
            'Section': field['section'],
            'Field Path': field['field_path'],
            'Field Name': field['field_name'],
            'Type': field['type'],
            'YML Description': field['yml_description'],
            'Code Reference': ' | '.join(code_refs),
            'Match?': match,
            'Notes': notes,
        })

    output = io.StringIO()
    headers = ['Issue Severity', 'Endpoint', 'Section', 'Field Path',
               'Field Name', 'Type', 'YML Description', 'Code Reference', 'Match?', 'Notes']
    writer = csv.DictWriter(output, fieldnames=headers, quoting=csv.QUOTE_ALL)
    writer.writeheader()
    writer.writerows(results)

    stats = {
        'total': len(results),
        'ok': sum(1 for r in results if r['Match?'] == 'OK'),
        'issues': sum(1 for r in results if r['Match?'] != 'OK'),
        'bugs': sum(1 for r in results if 'BUG' in r['Issue Severity']),
        'errors': sum(1 for r in results if 'ERROR' in r['Issue Severity']),
        'improvable': sum(1 for r in results if 'MEJORABLE' in r['Issue Severity']),
    }

    return output.getvalue(), stats


def get_available_apis():
    """Return flat list of available APIs for the UI."""
    grouped = get_apis_grouped()
    result = []
    for cat_key, cat_data in grouped.items():
        for api in cat_data['apis']:
            result.append({
                'key': api['key'],
                'label': api['label'],
                'module': api['module'],
                'category': cat_data['label'],
                'categoryIcon': cat_data['icon'],
                'available': api['available'],
                'hasJsSources': api['hasJsSources'],
                'hasSections': api['hasSections'],
            })
    return result


if __name__ == '__main__':
    api_key = sys.argv[1] if len(sys.argv) > 1 else None
    if not api_key:
        print("Available APIs:")
        for api in get_available_apis():
            print(f"  {api['key']} - {api['label']}")
        sys.exit(0)

    csv_content, stats = analyze(api_key)
    print(f"Total: {stats['total']} | OK: {stats['ok']} | Bugs: {stats['bugs']} | Errors: {stats['errors']} | Mejorable: {stats['improvable']}")
    print("---")
    print(csv_content[:2000])
