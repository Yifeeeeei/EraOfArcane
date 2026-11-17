#!/usr/bin/env python3
"""Build the setting atlas from Markdown + catalog; requires pandoc on PATH."""
import json
from pathlib import Path
import subprocess
import shutil

ROOT = Path(__file__).resolve().parents[1]

def build():
    pandoc = shutil.which('pandoc')
    if not pandoc:
        raise SystemExit('Install pandoc, then run: python tools/build-world.py')
    data = json.loads((ROOT / 'world/catalog.json').read_text(encoding='utf-8'))
    chapters = {c['id'] for c in data['chapters']}
    regions = {r['id']: r for r in data['regions']}
    people = {p['id'] for p in data['people']}
    stories = {s['id'] for s in data['stories']}
    eras = {e['id'] for e in data['eras']}
    for key in ('chapters', 'regions', 'people', 'stories', 'eras', 'events'):
        ids = [v['id'] for v in data[key]]
        if len(set(ids)) != len(ids):
            raise ValueError(f'Duplicate IDs in {key}')
    def check_ref(obj):
        for key, values in [('chapter', chapters), ('region', regions), ('person', people), ('story', stories), ('era', eras)]:
            if obj.get(key) and obj[key] not in values:
                raise ValueError(f'Unknown {key}: {obj[key]}')
        for story in obj.get('stories', []):
            if story not in stories:
                raise ValueError(f'Unknown story: {story}')
        if obj.get('feature') and obj['feature'] not in {f['id'] for f in regions[obj['region']]['features']}:
            raise ValueError(f'Unknown feature: {obj["feature"]}')
    for chapter in data['chapters']:
        source = ROOT / chapter['source']
        chapter['html'] = subprocess.run([pandoc, str(source), '--from=markdown', '--to=html5', '--wrap=none'], check=True, capture_output=True, encoding='utf-8').stdout.strip()
    for region in regions.values():
        check_ref(region)
        x, y, w, h = region['bounds']
        for place in region['features']:
            check_ref(place)
            if not x <= place['x'] <= x+w or not y <= place['y'] <= y+h:
                raise ValueError(f'Place outside map: {place["name"]}')
    for obj in data['events'] + data['people'] + data['stories']:
        check_ref(obj)
    for story in data['stories']:
        if not (ROOT/'world'/story['url']).is_file():
            raise ValueError(f'Missing story: {story["url"]}')
        art = story.get('art')
        if not art or not (ROOT/'world/assets/stories'/art['image']).is_file():
            raise ValueError(f'Missing story artwork: {story["id"]}')
        if len(art['position']) != 2 or any(not 0 <= value <= 100 for value in art['position']):
            raise ValueError(f'Invalid story artwork position: {story["id"]}')
    output = ROOT / 'world/data.json'
    output.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print(f'Built {output.relative_to(ROOT)}: {len(chapters)} chapters, {len(regions)} regions, {len(stories)} original stories')

if __name__ == '__main__':
    build()
