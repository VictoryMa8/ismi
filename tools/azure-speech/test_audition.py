import copy
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import wave

import synthesize as audition
import correct
import endings
import cluster
import lesson_batch
import polish


def wav_bytes(rate=24000):
    data = io.BytesIO()
    with wave.open(data, 'wb') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(b'\x01\x00' * 2400)
    return data.getvalue()


class AuditionTests(unittest.TestCase):
    def test_polish_scope_keeps_single_ana_and_feminine_source(self):
        import xml.etree.ElementTree as ET
        requests=polish.prepared()
        self.assertEqual(len(requests),4)
        self.assertEqual([r['stepId'] for r,_ in requests].count('e01-02'),3)
        for record,body in requests:
            text=''.join(ET.fromstring(body).itertext())
            self.assertEqual(text,record['transcript'])
            self.assertEqual(text.count('أنا'),1)
            self.assertIn(record['stepId'],('e01-02','e01-08'))

    def test_lesson_batch_is_pinned_and_only_generates_four_new_prompts(self):
        import xml.etree.ElementTree as ET
        requests=lesson_batch.prepared()
        self.assertEqual({r['stepId'] for r,_ in requests},{'e01-01','e01-02','e01-03','e01-08'})
        self.assertEqual(len(requests),4)
        for record,body in requests:
            self.assertEqual(''.join(ET.fromstring(body).itertext()),record['transcript'])
            self.assertEqual(record['sourcePackageSha256'],lesson_batch.PACKAGE_SHA)
        self.assertEqual(len(lesson_batch.lesson()['steps']),8)
        with patch.object(lesson_batch,'PACKAGE_SHA','stale'),self.assertRaises(ValueError):
            lesson_batch.prepared()

    def test_alias_probes_preserve_source_and_bound_synthesis_hint(self):
        import xml.etree.ElementTree as ET
        requests=cluster.prepared(aliases=True)
        self.assertEqual(len(requests),3)
        for record,body in requests:
            parsed=ET.fromstring(body)
            self.assertEqual(''.join(parsed.itertext()),'شو عاملة؟')
            aliases=parsed.findall('.//{http://www.w3.org/2001/10/synthesis}sub')
            self.assertEqual(len(aliases),2)
            self.assertEqual(aliases[1].attrib['alias'],record['synthesisAlias'])
            self.assertIsNone(record['ipaWords'])

    def test_cluster_probes_are_male_only_and_keep_vowel_after_l(self):
        import xml.etree.ElementTree as ET
        requests=cluster.prepared()
        self.assertEqual(len(requests),3)
        for record,body in requests:
            self.assertEqual(record['voice'],'ar-JO-TaimNeural')
            self.assertEqual(record['stepId'],'e01-04')
            self.assertIn('mlɛ',record['ipaWords'][1])
            self.assertEqual(''.join(ET.fromstring(body).itertext()),'شو عاملة؟')

    def test_ending_probes_keep_full_text_and_one_phoneme_per_word(self):
        import xml.etree.ElementTree as ET
        requests=endings.prepared()
        self.assertEqual(len(requests),6)
        for record,body in requests:
            parsed=ET.fromstring(body)
            self.assertEqual(''.join(parsed.itertext()),'شو عاملة؟')
            phones=parsed.findall('.//{http://www.w3.org/2001/10/synthesis}phoneme')
            self.assertEqual(len(phones),2)
            self.assertEqual([p.text for p in phones],['شو','عاملة'])
            self.assertTrue(all(' ' not in p.attrib['ph'] for p in phones))
            self.assertEqual(record['stepId'],'e01-04')

    def test_correction_scope_and_transcript_separation(self):
        import xml.etree.ElementTree as ET
        requests = correct.prepared()
        self.assertEqual(len(requests),16)
        self.assertEqual(len({r['requestFile'] for r,_ in requests}),16)
        for request, body in requests:
            self.assertEqual(request['transcript'],correct.TARGETS[request['stepId']]['text'])
            self.assertEqual(audition.digest(body),request['ssmlSha256'])
            self.assertEqual(''.join(ET.fromstring(body).itertext()),request['synthesisText'])
            self.assertIn(request['stepId'],('e01-04','e01-06'))
        self.assertTrue(all(r['method']=='phonemes-normal' for r,_ in requests[-4:]))

    def test_correction_provider_failure_preserves_attempt(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            cache=root/'.cache'
            cache.mkdir()
            config=self.config(cache)
            config.rename(cache/'resource.json')
            voices=json.dumps([dict(ShortName=v) for v in audition.VOICES]).encode()
            out=root/'outputs'
            with patch.object(correct,'HERE',root),patch.object(correct,'OUTPUT',out),patch.object(correct,'prepared',return_value=correct.prepared()[:1]),patch.object(correct,'fetch',side_effect=[voices,ValueError('Azure HTTP 400; stopped without retry')]) as fetch:
                with self.assertRaises(ValueError):
                    correct.run()
                self.assertEqual(fetch.call_count,2)
                record=json.loads(next(out.glob('*.json')).read_text())
                self.assertEqual(record['status'],'failed-no-retry')
                with self.assertRaises(ValueError):
                    correct.run()
                self.assertEqual(fetch.call_count,2)

    def test_offline_inputs(self):
        with patch.object(audition, 'fetch', side_effect=AssertionError('network')):
            self.assertEqual(len(audition.requests()), 6)

    def test_changed_request_is_rejected(self):
        original = Path.read_bytes
        def changed(path):
            data = original(path)
            return data.replace(b'-20%', b'-10%') if path.suffix == '.ssml' else data
        with patch.object(Path, 'read_bytes', changed), self.assertRaises(ValueError):
            audition.requests()

    def test_duplicate_request_is_rejected(self):
        manifest = json.loads((audition.HERE / 'requests/manifest.json').read_text())
        manifest['requests'][1] = copy.deepcopy(manifest['requests'][0])
        original = Path.read_text
        def changed(path, *args, **kwargs):
            return json.dumps(manifest) if path.name == 'manifest.json' else original(path, *args, **kwargs)
        with patch.object(Path, 'read_text', changed), self.assertRaises(ValueError):
            audition.requests()

    def test_reject_wrong_format_and_truncation(self):
        for data in (wav_bytes(16000), wav_bytes()[:-1], b'not audio'):
            with self.assertRaises((ValueError, wave.Error, EOFError)):
                audition.audio_info(data)

    def config(self, root, tier='F0'):
        path = root / 'config.json'
        path.write_text(json.dumps(dict(tier=tier, verifiedAt='2026-10-17', region='eastus', key='testkey')))
        path.chmod(0o600)
        return path

    def test_paid_tier_rejected_before_network(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            with patch.object(audition, 'fetch') as fetch, self.assertRaises(ValueError):
                audition.run(self.config(root, 'S0'), root / 'out')
            fetch.assert_not_called()

    def test_six_sequential_outputs_and_no_repeat(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            config = self.config(root)
            out = root / 'out'
            voices = json.dumps([dict(ShortName=v) for v in audition.VOICES]).encode()
            with patch.object(audition, 'fetch', side_effect=[voices] + [wav_bytes()] * 6) as fetch:
                audition.run(config, out)
                self.assertEqual(fetch.call_count, 7)
                self.assertEqual(len(list(out.glob('*.wav'))), 6)
                self.assertNotIn('testkey', (out / 'index.html').read_text())
                for sidecar in out.glob('*.json'):
                    record = json.loads(sidecar.read_text())
                    self.assertEqual(record['review']['ownerListening'], 'pending')
                    self.assertEqual(record['output']['sha256'], audition.digest(wav_bytes()))
                with self.assertRaises(ValueError):
                    audition.run(config, out)
                self.assertEqual(fetch.call_count, 7)

    def test_failure_stops_without_retry_and_leaves_attempt(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            out = root / 'out'
            config = self.config(root)
            voices = json.dumps([dict(ShortName=v) for v in audition.VOICES]).encode()
            with patch.object(audition, 'fetch', side_effect=[voices, ValueError('provider failed')]) as fetch:
                with self.assertRaises(ValueError):
                    audition.run(config, out)
                self.assertEqual(fetch.call_count, 2)
                self.assertEqual(json.loads(next(out.glob('*.json')).read_text())['status'], 'attempt-started')
                with self.assertRaises(ValueError):
                    audition.run(config, out)
                self.assertEqual(fetch.call_count, 2)


if __name__ == '__main__':
    unittest.main()
