#!/usr/bin/env python3
"""Check roadmap records/queues and local document links; no network or app writes."""
import re
from collections import Counter
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
STATES = {'Partial', 'Review pending', 'Input needed', 'Decision needed',
          'Verification pending', 'Planned', 'Delivery pending', 'Deferred',
          'Complete', 'Cancelled'}
FIELDS = ['Work state', 'Readiness', 'Delivery', 'Scope', 'Next action',
          'Authorization', 'Completion gate / evidence']
HEAD = re.compile(r'(?m)^#{3,5} (F\d+(?:\.\d+)*) (.+)$')


def require(value, message):
    if not value:
        raise ValueError(message)


def without_code(text):
    return re.sub(r'```.*?```', '', text, flags=re.S)


def anchors(path):
    text = without_code(path.read_text())
    result, counts = set(), {}
    for title in re.findall(r'(?m)^#{1,6}\s+(.+)$', text):
        title = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', title)
        slug = re.sub(r'[^\w\- ]', '', title.lower()).replace(' ', '-')
        occurrence = counts.get(slug, 0)
        counts[slug] = occurrence + 1
        result.add(slug + (f'-{occurrence}' if occurrence else ''))
    result.update(re.findall(r'<a\s+(?:id|name)=[\"\']([^\"\']+)', text))
    return result


def main():
    text = (ROOT / 'ROADMAP.md').read_text()
    queue = text.split('## Work queues\n', 1)[1].split('## Feature records\n', 1)[0]
    records = text.split('## Feature records\n', 1)[1].split('## Recent roadmap changes\n', 1)[0]
    headings = list(HEAD.finditer(records))
    ids = [h[1] for h in headings]
    require(ids and len(ids) == len(set(ids)), 'Feature IDs must be present and unique.')
    queued = re.findall(r'(?m)^\| \[(F\d+(?:\.\d+)*) ·', queue)
    require(Counter(queued) == Counter(ids), 'Every record needs exactly one work-queue row.')
    queued_state = {}
    for section in re.split(r'(?m)^### ', queue)[1:]:
        state, _, body = section.partition('\n')
        require(state in STATES, f'Unknown queue state: {state}')
        for id in re.findall(r'(?m)^\| \[(F\d+(?:\.\d+)*) ·', body):
            queued_state[id] = state
    for n, h in enumerate(headings):
        body = records[h.end():headings[n + 1].start() if n + 1 < len(headings) else len(records)]
        for field in FIELDS:
            values = re.findall(r'(?m)^- \*\*' + re.escape(field) + r':\*\* (.+)$', body)
            require(len(values) == 1, f'{h[1]} needs one nonempty {field} field.')
        state = re.search(r'\*\*Work state:\*\* ([^.]+)\.', body)
        require(state and state[1] in STATES, f'{h[1]} needs a known Work state.')
        require(state[1] == queued_state[h[1]], f'{h[1]} queue and record states disagree.')
    changes = text.split('## Recent roadmap changes\n', 1)[1]
    require(len(re.findall(r'(?m)^- \*\*', changes)) <= 5, 'Keep at most five roadmap change entries.')

    checked = 0
    for name in ['ROADMAP.md', 'docs/planning-workflow.md', 'docs/planning/feature-scope-reference.md']:
        path = ROOT / name
        for url in re.findall(r'\[[^\]]+\]\(([^)]+)\)', without_code(path.read_text())):
            if re.match(r'\w+://', url) or url.startswith('mailto:'):
                continue
            target, _, fragment = unquote(url).partition('#')
            file = (path.parent / target).resolve() if target else path
            require(file.exists(), f'{name}: missing local target {url}')
            if fragment and file.suffix == '.md':
                require(fragment in anchors(file), f'{name}: missing heading anchor {url}')
            checked += 1
    print(f'{len(ids)} unique feature records; queue/state/schema checks pass; {checked} local links/anchors pass.')


if __name__ == '__main__':
    try:
        main()
    except (ValueError, IndexError, OSError) as error:
        raise SystemExit(f'Roadmap check failed: {error}') from None
