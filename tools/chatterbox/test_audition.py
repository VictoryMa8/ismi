import copy
import json
from pathlib import Path
import tempfile
import unittest
import wave
import audition


class AuditionChecks(unittest.TestCase):
    def test_approved_ids_text_and_roles(self):
        _, clips = audition.inputs()
        self.assertEqual([clips[s]['transcript'] for s in audition.AUDITION],
                         ['شو عامل؟', 'شو عاملة؟', 'بدك ترتاح؟'])
        self.assertEqual(clips['e01-04']['addresseeRole'], 'fattoush')

    def test_stale_package_is_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / 'stale.json'
            p.write_bytes(audition.PACKAGE.read_bytes() + b' ')
            with self.assertRaisesRegex(ValueError, 'Stale'):
                audition.inputs(package=p)

    def test_changed_batch_text_and_roles_rejected(self):
        for key, value in [('transcript', 'changed'), ('speakerRole', 'knafeh')]:
            with tempfile.TemporaryDirectory() as d:
                data = json.loads(audition.BATCH.read_text())
                data['clips'][0][key] = value
                p = Path(d) / 'batch.json'
                p.write_text(json.dumps(data))
                with self.assertRaisesRegex(ValueError, 'mismatch'):
                    audition.inputs(batch=p)

    def wav(self, p, frames=b'\x01\x00' * 240, width=2):
        with wave.open(str(p), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(width); w.setframerate(24000)
            w.writeframes(frames)

    def test_empty_and_wrong_format_rejected(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / 'x.wav'
            for frames, width in [(b'', 2), (b'\x01' * 240, 1)]:
                self.wav(p, frames, width)
                with self.assertRaisesRegex(ValueError, 'Unsupported'):
                    audition.wav_info(p)

    def test_resume_checks_settings_and_actual_bytes(self):
        with tempfile.TemporaryDirectory() as d:
            p = Path(d) / 'x.wav'
            self.wav(p)
            record = dict(identity={'seed': 19}, output=audition.wav_info(p))
            before = p.read_bytes()
            audition.verify_record(record, p, {'seed': 19})
            self.assertEqual(p.read_bytes(), before)
            with self.assertRaisesRegex(ValueError, 'different inputs'):
                audition.verify_record(record, p, {'seed': 20})
            self.wav(p, b'\x02\x00' * 240)
            with self.assertRaisesRegex(ValueError, 'verification'):
                audition.verify_record(record, p, {'seed': 19})


if __name__ == '__main__':
    unittest.main()
