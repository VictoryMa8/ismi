"""Audio selection reconciliation must reject timing and speech-signal changes."""
import array
import io
import math
import unittest
import wave
from regenerate_selected import comparison


def wav(samples):
    output = io.BytesIO()
    with wave.open(output, 'wb') as writer:
        writer.setnchannels(1)
        writer.setsampwidth(2)
        writer.setframerate(24000)
        writer.writeframes(array.array('h', samples).tobytes())
    return output.getvalue()


class SelectionComparisonTests(unittest.TestCase):
    def setUp(self):
        self.signal = [int(9000*math.sin(i*.09)) for i in range(2400)]

    def test_small_quantization_difference_can_preserve_selection(self):
        changed = [value+(i%3-1) for i,value in enumerate(self.signal)]
        result = comparison(wav(self.signal), wav(changed))
        self.assertTrue(result['equivalent'])
        self.assertFalse(result['identicalPcm'])

    def test_duration_change_requires_new_acceptance(self):
        self.assertFalse(comparison(wav(self.signal), wav(self.signal+[0]))['equivalent'])

    def test_shifted_speech_signal_requires_new_acceptance(self):
        self.assertFalse(comparison(wav(self.signal), wav([0]*20+self.signal[:-20]))['equivalent'])
