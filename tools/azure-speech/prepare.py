"""Prepare exact-text Azure audition requests without making network calls."""
import hashlib
import json
from pathlib import Path
import sys
from xml.sax.saxutils import escape
import xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / 'chatterbox'))
from audition import AUDITION, EXPECTED, inputs


def main():
    lesson, clips = inputs()
    records = []
    for voice in ['ar-JO-SanaNeural', 'ar-JO-TaimNeural']:
        for step in AUDITION:
            clip = clips[step]
            ssml = (f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-JO">'
                    f'<voice name="{voice}"><prosody rate="-20%">'
                    f'{escape(clip["transcript"])}</prosody></voice></speak>')
            parsed = ET.fromstring(ssml)
            if ''.join(parsed.itertext()) != clip['transcript']:
                raise ValueError('SSML changed approved text')
            filename = f'{voice}-{step}.ssml'
            (HERE / 'requests' / filename).write_text(ssml, encoding='utf-8')
            records.append(dict(stepId=step, transcript=clip['transcript'],
                                speakerRole=clip['speakerRole'], addresseeRole=clip['addresseeRole'],
                                voice=voice, locale='ar-JO', rate='-20%', requestFile=filename,
                                ssmlSha256=hashlib.sha256(ssml.encode()).hexdigest()))
    manifest = dict(status='prepared-not-generated', lessonId=lesson['id'],
                    packageSha256=EXPECTED, provider='Microsoft Azure Speech',
                    requiredTier='F0', outputFormat='riff-24khz-16bit-mono-pcm',
                    totalRequests=len(records), requests=records,
                    review=dict(ownerListening='pending', palestinianPronunciation='unverified'),
                    boundaries='Audition only. No S0, paid upgrades, publication or deployment authorized.')
    (HERE / 'requests' / 'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print(f'Prepared {len(records)} SSML requests; exact text and package hash verified. No network requests made.')


if __name__ == '__main__':
    main()
