#!/usr/bin/env python3
"""
API Auto-Discovery Module
Scans the Openbravo source tree to find all available APIs with their YAML specs and JS sources.
"""
import os
import re
import yaml
from pathlib import Path

OB_ROOT = '/home/openbravo/EspacioDeTrabajo/Projects/AUX/openbravo'

# Categories for organizing APIs
CATEGORIES = {
    'events': {'label': 'Client APIs (Events)', 'icon': '⚡'},
    'pos2': {'label': 'POS2 APIs', 'icon': '🖥️'},
    'retail': {'label': 'Retail APIs', 'icon': '🛒'},
    'core': {'label': 'Core APIs', 'icon': '⚙️'},
    'reporting': {'label': 'Reporting', 'icon': '📊'},
    'custom': {'label': 'Custom', 'icon': '🔧'},
}


def _categorize_module(module_name):
    """Assign a category based on module name."""
    if 'events.' in module_name:
        return 'events'
    if 'pos2' in module_name:
        return 'pos2'
    if 'retail' in module_name or 'giftcards' in module_name or 'discounts.coupons' in module_name:
        return 'retail'
    if 'core2' in module_name or 'org.openbravo.api' in module_name or 'advpaymentmngt' in module_name:
        return 'core'
    if 'reporting' in module_name:
        return 'reporting'
    return 'custom'


def _extract_api_name(yaml_filename):
    """Extract a human-readable API name from the YAML filename."""
    name = yaml_filename.replace('.yml', '')
    # Remove module prefix pattern like "org.openbravo.xxx-"
    match = re.match(r'^[\w.]+-(.*)', name)
    if match:
        return match.group(1)
    return name


def _find_js_dirs(module_path):
    """Find JS source directories within a module."""
    js_dirs = []
    candidates = [
        'web-jspack',
        'web',
        os.path.join('src', 'main', 'javascript'),
    ]
    for candidate in candidates:
        full = os.path.join(module_path, candidate)
        if os.path.isdir(full):
            js_dirs.append(candidate)
    # Also check for app/model dirs under web/
    module_name = os.path.basename(module_path)
    web_app = os.path.join(module_path, 'web', module_name, 'app')
    if os.path.isdir(web_app):
        js_dirs.append(os.path.join('web', module_name, 'app'))
    return js_dirs


def _find_section_files(api_dir):
    """Find section YAML files (schemas, examples) in the sections/ subfolder."""
    sections_dir = os.path.join(api_dir, 'sections')
    if not os.path.isdir(sections_dir):
        return []
    return [f for f in os.listdir(sections_dir) if f.endswith('.yml')]


def discover_apis():
    """
    Scan the Openbravo source tree and return all discovered APIs.
    Returns a list of dicts with: key, label, module, category, main_yaml, yaml_sections, js_dirs, available
    """
    apis = []

    # 1. Scan modules/*/api/
    modules_dir = os.path.join(OB_ROOT, 'modules')
    if os.path.isdir(modules_dir):
        for module_name in sorted(os.listdir(modules_dir)):
            module_path = os.path.join(modules_dir, module_name)
            api_dir = os.path.join(module_path, 'api')
            if not os.path.isdir(api_dir):
                continue

            # Find main YAML files (not in sections/)
            main_yamls = [f for f in os.listdir(api_dir)
                          if f.endswith('.yml') and os.path.isfile(os.path.join(api_dir, f))]

            for yml_file in main_yamls:
                api_name = _extract_api_name(yml_file)
                key = f"{module_name}::{api_name}".replace(' ', '_')
                category = _categorize_module(module_name)
                section_files = _find_section_files(api_dir)
                js_dirs = _find_js_dirs(module_path)

                apis.append({
                    'key': key,
                    'label': api_name,
                    'module': module_name,
                    'category': category,
                    'main_yaml': os.path.join(api_dir, yml_file),
                    'yaml_dir': os.path.join(api_dir, 'sections'),
                    'yaml_sections': section_files,
                    'js_dirs': [os.path.join(module_path, d) for d in js_dirs],
                    'module_path': module_path,
                    'available': True,
                })

    # 2. Scan root api/ folder
    root_api_dir = os.path.join(OB_ROOT, 'api')
    if os.path.isdir(root_api_dir):
        main_yamls = [f for f in os.listdir(root_api_dir)
                      if f.endswith('.yml') and os.path.isfile(os.path.join(root_api_dir, f))]
        for yml_file in main_yamls:
            api_name = _extract_api_name(yml_file)
            key = f"root::{api_name}".replace(' ', '_')
            section_files = _find_section_files(root_api_dir)

            apis.append({
                'key': key,
                'label': api_name,
                'module': 'openbravo (root)',
                'category': 'core',
                'main_yaml': os.path.join(root_api_dir, yml_file),
                'yaml_dir': os.path.join(root_api_dir, 'sections'),
                'yaml_sections': section_files,
                'js_dirs': [],
                'module_path': OB_ROOT,
                'available': True,
            })

    return apis


def get_apis_grouped():
    """Return APIs grouped by category for the UI."""
    apis = discover_apis()
    grouped = {}
    for api in apis:
        cat = api['category']
        if cat not in grouped:
            grouped[cat] = {
                'label': CATEGORIES.get(cat, {}).get('label', cat),
                'icon': CATEGORIES.get(cat, {}).get('icon', '📄'),
                'apis': [],
            }
        grouped[cat]['apis'].append({
            'key': api['key'],
            'label': api['label'],
            'module': api['module'],
            'available': api['available'],
            'hasSections': len(api['yaml_sections']) > 0,
            'hasJsSources': len(api['js_dirs']) > 0,
        })
    return grouped


def get_api_config(api_key):
    """Get full config for a specific API by its key."""
    apis = discover_apis()
    for api in apis:
        if api['key'] == api_key:
            return api
    return None


if __name__ == '__main__':
    import json
    grouped = get_apis_grouped()
    for cat_key, cat_data in grouped.items():
        print(f"\n{cat_data['icon']} {cat_data['label']} ({len(cat_data['apis'])} APIs)")
        for api in cat_data['apis']:
            sections = '✓ schemas' if api['hasSections'] else '✗ no schemas'
            js = '✓ JS' if api['hasJsSources'] else '✗ no JS'
            print(f"   • {api['label']} [{api['module']}] ({sections}, {js})")
