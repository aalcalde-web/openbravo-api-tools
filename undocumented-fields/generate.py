#!/usr/bin/env python3
"""Generates public/js/data.js from the undocumented fields CSVs."""
import csv, json, os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def parse_csv(filepath):
    rows = []
    with open(filepath, 'r', encoding='utf-8') as f:
        for row in csv.DictReader(f):
            rows.append({
                'endpoint': row.get('Endpoint', '').strip(),
                'direction': row.get('Direction', '').strip(),
                'level': row.get('Level', '').strip(),
                'path': row.get('Field Path', '').strip(),
                'name': row.get('Field Name', '').strip(),
                'type': row.get('Type', '').strip(),
                'description': row.get('Description', '').strip(),
                'howItWorks': row.get('How it works', '').strip(),
                'codeRef': row.get('Code Reference', '').strip(),
            })
    return rows

if __name__ == '__main__':
    data_dir = os.path.join(SCRIPT_DIR, 'data')
    out_js = os.path.join(SCRIPT_DIR, 'public', 'js', 'data.js')

    orders = parse_csv(os.path.join(data_dir, 'EXTERNAL_ORDERS_API_undocumented_fields.csv'))
    discounts = parse_csv(os.path.join(data_dir, 'EXTERNAL_DISCOUNTS_API_undocumented_fields.csv'))

    js = 'var DATA_ORDERS = %s;\n\nvar DATA_DISCOUNTS = %s;\n' % (
        json.dumps(orders, ensure_ascii=False, indent=2),
        json.dumps(discounts, ensure_ascii=False, indent=2)
    )

    with open(out_js, 'w', encoding='utf-8') as f:
        f.write(js)

    print('Generated: %s (%d orders, %d discounts)' % (out_js, len(orders), len(discounts)))
