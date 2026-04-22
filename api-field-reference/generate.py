#!/usr/bin/env python3
"""
Generates public/js/data.js from the CSV field reference files in data/.
Run from the project root: python3 generate.py
"""
import csv, json, os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def parse_csv(filepath):
    groups = []
    current_key = None
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            endpoint = row.get('Endpoint','').strip()
            section = row.get('Section','').strip()
            key = f"{endpoint}_{section}"
            if key != current_key:
                current_key = key
                groups.append({'endpoint': endpoint, 'section': section, 'rows': []})
            yml_desc = row.get('YML Description','').strip()
            real_desc = row.get('Real Description (from code)','').strip()
            sev = row.get('Issue Severity','').strip()
            if '🔴' in sev or 'BUG' in sev.upper():
                icon = '🔴'
            elif '⚠' in sev or 'ERROR' in sev.upper():
                icon = '⚠️'
            elif 'ℹ' in sev or 'MEJORABLE' in sev.upper():
                icon = 'ℹ️'
            else:
                icon = '✅'
            desc = icon + ' ' + yml_desc + '<br><span class="desc-code">' + real_desc + '</span>'
            groups[-1]['rows'].append({
                'path': row.get('Field Path','').strip(),
                'name': row.get('Field Name','').strip(),
                'type': row.get('Type','').strip(),
                'desc': desc,
                'severity': sev,
            })

    for g in groups:
        has_data_node = any(r['path'] == 'data' for r in g['rows'])
        has_data_children = any(r['path'].startswith('data.') for r in g['rows'])
        if has_data_children and not has_data_node:
            insert_idx = 0
            for i, r in enumerate(g['rows']):
                if not r['path'].startswith('data'):
                    insert_idx = i + 1
                else:
                    break
            g['rows'].insert(insert_idx, {
                'path': 'data',
                'name': 'data',
                'type': 'object',
                'desc': '✅ Contains the request/response data.<br><span class="desc-code">Data payload object.</span>',
                'severity': '✅ OK',
            })
    return groups

def tree_depth_from_path(path):
    if not path:
        return 0
    clean = path.replace('[]', '')
    return len(clean.split('.')) - 1

def is_child_path(child_path, parent_path):
    if not parent_path:
        return True
    parent_prefix = parent_path.replace('[]', '') + '.'
    child_clean = child_path.replace('[]', '')
    return child_clean.startswith(parent_prefix)

def build_tree(rows):
    root = []
    stack = [(root, -1, '')]
    for row in rows:
        depth = tree_depth_from_path(row['path'])
        node = {
            'name': row['name'],
            'path': row['path'],
            'type': row['type'],
            'desc': row['desc'],
            'severity': row['severity'],
            'children': []
        }
        while len(stack) > 1 and (stack[-1][1] >= depth or not is_child_path(row['path'], stack[-1][2])):
            stack.pop()
        stack[-1][0].append(node)
        stack.append((node['children'], depth, row['path']))
    return root

def node_to_json(node):
    d = {
        'name': node['name'],
        'path': node['path'],
        'type': node['type'],
        'desc': node['desc'],
        'severity': node['severity']
    }
    if node['children']:
        d['children'] = [node_to_json(c) for c in node['children']]
    return d

def groups_to_data(groups):
    data = []
    for g in groups:
        tree = build_tree(g['rows'])
        data.append({
            'endpoint': g['endpoint'],
            'section': g['section'],
            'fields': [node_to_json(n) for n in tree]
        })
    return data

if __name__ == '__main__':
    data_dir = os.path.join(SCRIPT_DIR, 'data')
    out_js = os.path.join(SCRIPT_DIR, 'public', 'js', 'data.js')

    orders = groups_to_data(parse_csv(os.path.join(data_dir, 'EXTERNAL_ORDERS_API_fields.csv')))
    discounts = groups_to_data(parse_csv(os.path.join(data_dir, 'EXTERNAL_DISCOUNTS_API_fields.csv')))

    orders_json = json.dumps(orders, ensure_ascii=False, indent=2)
    discounts_json = json.dumps(discounts, ensure_ascii=False, indent=2)

    js_content = f"window.DATA_ORDERS = {orders_json};\n\nwindow.DATA_DISCOUNTS = {discounts_json};\n"

    with open(out_js, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"Generated: {out_js}")
    print(f"  Orders: {len(orders)} groups")
    print(f"  Discounts: {len(discounts)} groups")
