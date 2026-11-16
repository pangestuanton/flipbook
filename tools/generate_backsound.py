"""Render the original reading loop. Requires NumPy and FFmpeg to regenerate."""
from pathlib import Path
import subprocess
import tempfile
import wave
import numpy as np

RATE = 44100
BEAT = 0.75
DURATION = 32 * BEAT
song = np.zeros(round(RATE * DURATION), dtype=np.float64)


def note(midi, start, duration, level, bell=False):
    t = np.arange(round(duration * RATE)) / RATE
    frequency = 440 * 2 ** ((midi - 69) / 12)
    if bell:
        tone = (np.sin(2 * np.pi * frequency * t)
                + 0.22 * np.sin(2 * np.pi * frequency * 2 * t)
                + 0.06 * np.sin(2 * np.pi * frequency * 3 * t))
        envelope = (1 - np.exp(-t / 0.018)) * np.exp(-t / 0.65)
    else:
        tone = np.sin(2 * np.pi * frequency * t) + 0.12 * np.sin(4 * np.pi * frequency * t)
        envelope = np.minimum(t / 0.6, 1) * np.minimum((duration - t) / 1.1, 1)
    samples = level * tone * envelope
    positions = (round(start * RATE) + np.arange(len(samples))) % len(song)
    np.add.at(song, positions, samples)


# Cmaj7, Am7, Fmaj7, G6; two variations of a slow pentatonic melody.
chords = [(48, 55, 59, 64), (45, 52, 55, 60), (41, 48, 52, 57), (43, 50, 55, 59)] * 2
melodies = [(76, 79, 81), (79, 76, 72), (77, 76, 72), (74, 79, 76),
            (79, 81, 84), (81, 79, 76), (77, 76, 72), (74, 71, 72)]
for bar, chord in enumerate(chords):
    start = bar * 4 * BEAT
    for pitch in chord:
        note(pitch, start, 4 * BEAT + 1.2, 0.032)
    for beat, pitch in enumerate(chord):
        note(pitch + 12, start + beat * BEAT, 2.1, 0.045, True)
    for beat, pitch in zip((0.5, 2, 3), melodies[bar]):
        note(pitch, start + beat * BEAT, 2.3, 0.055, True)

# Circular tails keep the start and end of the repeating phrase continuous.
song *= 0.72 / max(1, np.max(np.abs(song)))
output = Path(__file__).resolve().parents[1] / 'audio' / 'ruang-baca.mp3'
output.parent.mkdir(exist_ok=True)
with tempfile.TemporaryDirectory() as directory:
    wav = Path(directory) / 'ruang-baca.wav'
    with wave.open(str(wav), 'wb') as handle:
        handle.setparams((1, 2, RATE, 0, 'NONE', 'not compressed'))
        handle.writeframes((song * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(wav),
                    '-codec:a', 'libmp3lame', '-b:a', '128k', '-metadata',
                    'title=Ruang Baca', str(output)], check=True)
print(output)
