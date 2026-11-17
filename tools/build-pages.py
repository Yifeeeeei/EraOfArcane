#!/usr/bin/env python3
"""Generate all top-level Markdown reading pages with the shared Pandoc template."""
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def build():
    pandoc = shutil.which('pandoc')
    if not pandoc:
        raise SystemExit('请先安装 pandoc，再运行 sh genmd.sh')
    stories = {s['id']: s for s in json.loads((ROOT / 'world/catalog.json').read_text())['stories']}
    output = ROOT / 'htmls'
    output.mkdir(exist_ok=True)
    sources = sorted((ROOT / 'mds').glob('*.md'))
    for source in sources:
        story = stories.get(source.stem)
        document = json.loads(subprocess.run(
            [pandoc, str(source), '--to=json'], check=True, capture_output=True, text=True
        ).stdout)
        # Ask Pandoc to render the first heading as plain text, including inline markup.
        heading = next((b for b in document['blocks'] if b['t'] == 'Header'), None)
        title = source.stem
        if heading:
            title_doc = dict(document, meta={}, blocks=[{'t': 'Plain', 'c': heading['c'][2]}])
            title = subprocess.run([pandoc, '--from=json', '--to=plain', '--wrap=none'],
                                   input=json.dumps(title_doc), check=True, capture_output=True, text=True).stdout.strip()
        title = {'rules': '游戏规则', 'Keywords': '关键词一览'}.get(source.stem, story['title'] if story else title)
        metadata = {
            'pagetitle': title,
            'section': '故事长廊' if story else '巫师手册',
            'back-url': '../world/#stories' if story else '../',
            'back-label': '返回故事长廊' if story else '返回主页',
        }
        if story and story.get('art'):
            art = story['art']
            metadata.update({'art': art['image'], 'art-x': str(art['position'][0]), 'art-y': str(art['position'][1])})
        command = [pandoc, str(source), '--from=markdown', '--to=html5', '--standalone', '--toc',
                   '--wrap=none', '--template', str(ROOT / 'tools/templates/reader.html'),
                   '--output', str(output / (source.stem + '.html'))]
        for key, value in metadata.items():
            command.extend(['--metadata', f'{key}={value}'])
        subprocess.run(command, check=True)
        print(f'Built htmls/{source.stem}.html')
    print(f'Generated {len(sources)} reading pages.')


if __name__ == '__main__':
    build()
