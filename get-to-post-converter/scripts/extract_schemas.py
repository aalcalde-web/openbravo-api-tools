#!/usr/bin/env python3
"""
Extract Business API schemas from Openbravo source XML.
Generates data/schemas.json with Export/Import/Mergeable field mappings per entity.
"""
import re
import glob
import json
import os
from pathlib import Path

OB_ROOT = '/home/openbravo/EspacioDeTrabajo/Projects/AUX/openbravo'
OUTPUT = Path(__file__).parent.parent / 'data' / 'schemas.json'


def parse_xml_blocks(filepath, tag):
    """Parse all blocks of a given XML tag from file."""
    with open(filepath) as f:
        content = f.read()
    return re.findall(rf'<{tag}>.*?</{tag}>', content, re.DOTALL)


def extract_tags(block):
    """Extract all CDATA tag values from an XML block."""
    return dict(re.findall(r'<([A-Z_]+)><!\[CDATA\[(.*?)\]\]>', block))


def load_entity_mappings():
    """Load all API_Connector entity mappings."""
    files = glob.glob(os.path.join(OB_ROOT, '**', 'OBEI_ENTITY_MAPPING.xml'), recursive=True)
    entities = {}
    for f in files:
        for block in parse_xml_blocks(f, 'OBEI_ENTITY_MAPPING'):
            if 'API_Connector' not in block:
                continue
            tags = extract_tags(block)
            eid = tags.get('OBEI_ENTITY_MAPPING_ID')
            if not eid:
                continue
            entities[eid] = {
                'entity': tags.get('MAPPED_ENTITY', '?'),
                'direction': tags.get('INTEGRATION_DIRECTION', '?'),
                'firstLevel': tags.get('ISFIRSTLEVEL', 'N') == 'Y',
                'active': tags.get('ISACTIVE', 'Y') == 'Y',
                'category': tags.get('EM_API_CATEGORY', 'MD'),
                'description': tags.get('DESCRIPTION', ''),
                'hierarchy': tags.get('ISHIERARCHY_VIEW_ENABLED', 'N') == 'Y',
            }
    return entities


def load_property_mappings():
    """Load all property mapping instances."""
    files = glob.glob(os.path.join(OB_ROOT, '**', 'OBEI_PROP_MAP_INSTANCE.xml'), recursive=True)
    props = {}  # entity_mapping_id -> [prop, ...]
    for f in files:
        for block in parse_xml_blocks(f, 'OBEI_PROP_MAP_INSTANCE'):
            tags = extract_tags(block)
            if tags.get('ISACTIVE', 'Y') != 'Y':
                continue
            em_id = tags.get('OBEI_ENTITY_MAPPING_ID')
            if not em_id:
                continue
            props.setdefault(em_id, []).append({
                'name': tags.get('MAPPING_NAME', '?'),
                'identifies': tags.get('IDENTIFIES_UNIVOCALLY', 'N') == 'Y',
                'required': tags.get('ACCEPT_NULL_VALUES', 'Y') == 'N',
                'refEntity': tags.get('REFERENCED_ENTITY_MAPPING'),
                'selectOn': tags.get('SELECT_ON_ENTITY_REFERENCING'),
                'childMergePolicy': tags.get('EM_API_CHILD_MERGE_POLICY'),
            })
    return props


def build_schemas():
    """Build the final schemas.json structure."""
    entities = load_entity_mappings()
    props = load_property_mappings()

    # Group first-level MD entities by name
    md_first_level = {}
    for eid, info in entities.items():
        if info['category'] == 'MD' and info['firstLevel'] and info['active']:
            name = info['entity']
            md_first_level.setdefault(name, {})[info['direction']] = eid

    result = {}
    for entity_name in sorted(md_first_level.keys()):
        directions = md_first_level[entity_name]
        export_id = directions.get('ObToExternalSystem')
        import_id = directions.get('ExternalSystemToOb')

        entry = {
            'description': '',
            'export': {'fields': []},
            'import': {'fields': [], 'identifiers': []},
            'mergeable': {'fields': []},
        }

        # Export fields
        if export_id:
            entry['description'] = entities[export_id]['description']
            export_props = sorted(props.get(export_id, []), key=lambda x: x['name'])
            for p in export_props:
                field = {'name': p['name']}
                if p['refEntity']:
                    ref_info = entities.get(p['refEntity'], {})
                    field['ref'] = ref_info.get('entity', p['refEntity'])
                    # Get sub-fields of referenced entity
                    ref_props = props.get(p['refEntity'], [])
                    if ref_props:
                        field['refFields'] = [rp['name'] for rp in sorted(ref_props, key=lambda x: x['name'])]
                entry['export']['fields'].append(field)

        # Import fields
        if import_id:
            if not entry['description']:
                entry['description'] = entities[import_id]['description']
            import_props = sorted(props.get(import_id, []), key=lambda x: x['name'])
            for p in import_props:
                field = {'name': p['name']}
                if p['identifies']:
                    field['identifier'] = True
                    entry['import']['identifiers'].append(p['name'])
                if p['required']:
                    field['required'] = True
                if p['refEntity']:
                    ref_info = entities.get(p['refEntity'], {})
                    field['ref'] = ref_info.get('entity', p['refEntity'])
                    ref_props = props.get(p['refEntity'], [])
                    if ref_props:
                        field['refFields'] = sorted([
                            {
                                'name': rp['name'],
                                'identifier': rp['identifies'],
                                'ref': entities.get(rp['refEntity'], {}).get('entity') if rp['refEntity'] else None,
                            }
                            for rp in ref_props
                        ], key=lambda x: x['name'])
                if p['childMergePolicy']:
                    field['childMergePolicy'] = p['childMergePolicy']
                entry['import']['fields'].append(field)

            # Mergeable = import fields that are applicable for MERGE mode
            # In practice, all import fields are mergeable (the difference is the PATCH semantics)
            entry['mergeable']['fields'] = [f['name'] for f in entry['import']['fields']]

        result[entity_name] = entry

    return result


def main():
    print("Extracting schemas from Openbravo source...")
    schemas = build_schemas()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT, 'w') as f:
        json.dump(schemas, f, indent=2)
    print(f"Generated {OUTPUT} with {len(schemas)} entities")
    for name in sorted(schemas.keys()):
        exp = len(schemas[name]['export']['fields'])
        imp = len(schemas[name]['import']['fields'])
        print(f"  {name:30} export={exp:3} import={imp:3}")


if __name__ == '__main__':
    main()
