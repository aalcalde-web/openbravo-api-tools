#!/usr/bin/env python3
"""
Undocumented Fields Analyzer
Compares fields used in JS source code against fields documented in OpenAPI YAML schemas.
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

IGNORE_FIELDS = {
    'length', 'map', 'filter', 'reduce', 'forEach', 'find', 'some', 'every',
    'push', 'pop', 'shift', 'unshift', 'splice', 'slice', 'concat', 'join',
    'indexOf', 'includes', 'keys', 'values', 'entries', 'toString', 'valueOf',
    'constructor', 'prototype', 'hasOwnProperty', 'then', 'catch', 'finally',
    'default', 'exports', 'module', 'require', 'import', 'from',
    'id', 'type', 'name', 'key', 'index', 'value', 'error', 'message',
    'state', 'props', 'context', 'dispatch', 'getState', 'setState',
    'log', 'warn', 'info', 'debug', 'trace',
    'style', 'className', 'children', 'ref', 'current',
    'test', 'expect', 'describe', 'it', 'beforeEach', 'afterEach',
    'resolve', 'reject', 'async', 'await',
}


def extract_yaml_fields(api_config):
    """Extract all documented field names from YAML schemas."""
    fields = set()

    # Parse section YAML files
    yaml_dir = api_config['yaml_dir']
    if os.path.isdir(yaml_dir):
        for yml_file in api_config['yaml_sections']:
            yml_path = os.path.join(yaml_dir, yml_file)
            if os.path.exists(yml_path):
                _extract_fields_from_yaml(yml_path, fields)

    # Parse main YAML
    main_yml = api_config['main_yaml']
    if os.path.exists(main_yml):
        _extract_fields_from_main_yaml(main_yml, fields)

    return fields


def _extract_fields_from_yaml(filepath, fields):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        content = re.sub(r'\$\{[^}]+\}', '""', content)
        schema = yaml.safe_load(content)
        if schema:
            _walk_schema(schema, fields)
    except Exception:
        pass


def _extract_fields_from_main_yaml(filepath, fields):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        content = re.sub(r'\$\{[^}]+\}', '""', content)
        content = re.sub(r'^\s*""\s*$', '', content, flags=re.MULTILINE)
        schema = yaml.safe_load(content)
        if not schema:
            return
        # Walk components/schemas
        if 'components' in schema and 'schemas' in schema['components']:
            for _, schema_def in schema['components']['schemas'].items():
                _walk_schema(schema_def, fields)
        # Walk paths for inline schemas
        if 'paths' in schema:
            for _, methods in schema['paths'].items():
                if isinstance(methods, dict):
                    for _, op in methods.items():
                        if isinstance(op, dict):
                            _walk_schema(op.get('requestBody', {}), fields)
                            for _, resp in op.get('responses', {}).items():
                                if isinstance(resp, dict):
                                    _walk_schema(resp, fields)
    except Exception:
        pass


def _walk_schema(schema, fields):
    if not isinstance(schema, dict):
        return
    if 'properties' in schema:
        for prop_name, prop_def in schema['properties'].items():
            fields.add(prop_name)
            if isinstance(prop_def, dict):
                _walk_schema(prop_def, fields)
    if 'items' in schema and isinstance(schema['items'], dict):
        _walk_schema(schema['items'], fields)
    if 'content' in schema and isinstance(schema['content'], dict):
        for _, media in schema['content'].items():
            if isinstance(media, dict) and 'schema' in media:
                _walk_schema(media['schema'], fields)
    for combiner in ('allOf', 'oneOf', 'anyOf'):
        if combiner in schema:
            for sub in schema[combiner]:
                if isinstance(sub, dict):
                    _walk_schema(sub, fields)


def extract_js_fields(api_config):
    """Extract field accesses from JS source files."""
    field_refs = {}

    for js_dir in api_config['js_dirs']:
        if not os.path.exists(js_dir):
            continue
        for root, dirs, files in os.walk(js_dir):
            dirs[:] = [d for d in dirs if d not in ('__test__', '__mock__', 'node_modules', '.git')]
            for fname in files:
                if not fname.endswith(('.js', '.ts', '.jsx', '.tsx')):
                    continue
                fpath = os.path.join(root, fname)
                _extract_fields_from_js(fpath, field_refs, fname)

    return field_refs


def _extract_fields_from_js(filepath, field_refs, filename):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception:
        return

    dot_pattern = re.compile(
        r'(?:newTicket|ticket|line|order|response|data|payload|discount|promotion|promo|item|result|record|obj|entity|m|r)\.'
        r'([a-zA-Z_][a-zA-Z0-9_]*)'
    )
    destruct_pattern = re.compile(r'\{\s*([^}]+)\}\s*=\s*(?:newTicket|ticket|line|order|response|data|payload|result|record)')
    bracket_pattern = re.compile(
        r'(?:newTicket|ticket|line|order|response|data|payload|discount|item|result|record)\[[\'"]'
        r'([a-zA-Z_][a-zA-Z0-9_]*)'
        r'[\'"]\]'
    )

    for line_no, line_text in enumerate(lines, 1):
        stripped = line_text.strip()
        if stripped.startswith('//') or stripped.startswith('*') or stripped.startswith('/*'):
            continue

        for match in dot_pattern.finditer(line_text):
            _add_field_ref(field_refs, match.group(1), filename, line_no, stripped)

        for match in destruct_pattern.finditer(line_text):
            for part in match.group(1).split(','):
                field = part.strip().split(':')[0].split('=')[0].strip()
                if field and field.isidentifier():
                    _add_field_ref(field_refs, field, filename, line_no, stripped)

        for match in bracket_pattern.finditer(line_text):
            _add_field_ref(field_refs, match.group(1), filename, line_no, stripped)


def _add_field_ref(field_refs, field, filename, line_no, context):
    if field in IGNORE_FIELDS or field.startswith('_') or field.isupper() or len(field) < 3:
        return
    if field not in field_refs:
        field_refs[field] = {'files': set(), 'refs': []}
    field_refs[field]['files'].add(filename)
    if len(field_refs[field]['refs']) < 3:
        field_refs[field]['refs'].append(f"{filename} L{line_no}")


def analyze(api_key):
    """Run analysis for a given API key. Returns (csv_content, undoc_count, yaml_count, js_count)."""
    api_config = get_api_config(api_key)
    if not api_config:
        raise ValueError(f"API not found: {api_key}")

    yaml_fields = extract_yaml_fields(api_config)
    js_fields = extract_js_fields(api_config)

    undocumented = []
    for field_name, refs in sorted(js_fields.items()):
        if field_name not in yaml_fields:
            undocumented.append({
                'Field Name': field_name,
                'Files': ', '.join(sorted(refs['files'])),
                'Code References': ' | '.join(refs['refs']),
                'Occurrences': len(refs['files']),
            })

    undocumented.sort(key=lambda x: -x['Occurrences'])

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=['Field Name', 'Files', 'Code References', 'Occurrences'])
    writer.writeheader()
    writer.writerows(undocumented)

    return output.getvalue(), len(undocumented), len(yaml_fields), len(js_fields)


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
            js = '✓' if api['hasJsSources'] else '✗'
            print(f"  [{js}] {api['key']} - {api['label']}")
        sys.exit(0)

    csv_content, undoc_count, yaml_count, js_count = analyze(api_key)
    print(f"YAML documented fields: {yaml_count}")
    print(f"JS referenced fields: {js_count}")
    print(f"Undocumented fields found: {undoc_count}")
    print("---")
    print(csv_content)
