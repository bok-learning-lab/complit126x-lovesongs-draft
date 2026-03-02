'use client';

import { useRef, useState } from 'react';

const GENERATED_SONNET = `The years between a sentence and its eye
are not a silence but a held-out hand.
What time removes, the poem can supply—
the dead speak still, and we still understand.

No hedge or hillside enters what we write;
the only seasons here are those of mind,
the darkness that precedes a burst of light,
when thought completes the circuit left behind.

What's lost in person—warmth, reply, the face
that proves the voice inhabiting the word—
returns in part when readers find their place
in text where some surviving self is heard.

So something holds. The poem can maintain
the absent voice, and hope is what remains.`;

const GENERATION_PROMPT = `Step 1 — Score the full text of the article (pasted below) on the same
five traits used in Demo 1. Use the same rubrics.

Source: Moira Weigel, "Weigel Room: Listen Up! Whitman Wants To Talk,"
The Harvard Crimson, March 8, 2006.
https://www.thecrimson.com/article/2006/3/8/weigel-room-listen-up-whitman-wants/

[full text of article pasted here]

Scored traits (averaged across the full article):
  - Melancholy:       3.0 / 10   (slight wistfulness about unreachable connection, not dark)
  - Romanticism:      3.0 / 10   (about intimacy, not romantic love)
  - Nature Imagery:   1.0 / 10   (almost none — a purely intellectual, urban piece)
  - Mortality:        5.0 / 10   (time, the gap across years, the dead poets)
  - Optimism:         8.0 / 10   ("intimacy with hope" — strongly utopian resolution)

---

Step 2 — The complete prompt sent to the model:

Write a sonnet with the following trait scores (scale of 1-10):

  - Melancholy: 3.0/10
  - Romanticism: 3.0/10
  - Nature Imagery: 1.0/10
  - Mortality: 5.0/10
  - Optimism: 8.0/10

Write exactly 14 lines in iambic pentameter with an ABAB CDCD EFEF GG
rhyme scheme. Do not include a title.`;

// Set to true once ELEVENLABS_VOICE_ID + ELEVENLABS_API_KEY are configured
const AUDIO_ENABLED = true;

export default function DemoVoicePage() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
    if (audioUrl) {
      audioRef.current?.play();
      return;
    }
    setLoadingAudio(true);
    setAudioError(null);
    try {
      const res = await fetch('/api/demo-voice-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: GENERATED_SONNET }),
      });
      if (!res.ok) throw new Error('Audio generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      // autoplay once URL is set — handled by the audio element's onCanPlay
    } catch (e) {
      setAudioError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-10">
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">Demo 3 — Pre-Workshop</p>
        <h1 className="text-3xl font-bold text-zinc-100">Is Voice Textual — or Multimodal?</h1>
        <p className="text-zinc-400 mt-3 max-w-2xl leading-relaxed">
          A sonnet generated from{' '}
          <a
            href="https://www.thecrimson.com/article/2006/3/8/weigel-room-listen-up-whitman-wants/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
          >
            a 2006 Crimson article by Prof. Weigel
          </a>
          {' '}— scored on the same five traits as Demo 1, then fed to the same prompt. Below is the result, the chain that produced it, and a recording in her voice.
        </p>
      </header>

      {/* The sonnet */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-8">
        <div className="px-7 py-4 border-b border-zinc-800">
          <span className="text-sm font-semibold text-zinc-200">Generated sonnet</span>
          <span className="text-xs text-zinc-600 italic ml-4">in the style of Prof. Moira Weigel</span>
        </div>
        <div className="px-8 py-8">
          <pre className="text-zinc-200 text-base whitespace-pre-wrap font-serif leading-loose">
            {GENERATED_SONNET}
          </pre>
        </div>
      </div>

      {/* The prompt chain */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-8">
        <div className="px-7 py-4 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-200">The prompt chain</span>
          <span className="text-xs text-zinc-500">what produced the sonnet above</span>
        </div>
        <div className="px-7 py-6">
          <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-mono leading-relaxed">
            {GENERATION_PROMPT}
          </pre>
        </div>
      </div>

      {/* Audio player */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-7 mb-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-zinc-200">Audio — read aloud in Prof. Weigel&apos;s voice</p>
          {!AUDIO_ENABLED && (
            <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">Coming soon</span>
          )}
        </div>

        {AUDIO_ENABLED ? (
          <div className="space-y-3">
            <div className="w-full bg-zinc-800 rounded-lg h-12 flex items-center px-4 gap-3">
              <button
                onClick={handlePlay}
                disabled={loadingAudio}
                className="w-8 h-8 rounded-full bg-purple-700 hover:bg-purple-600 disabled:bg-zinc-700 flex items-center justify-center shrink-0 transition-colors"
              >
                <span className="text-white text-xs">{loadingAudio ? '…' : '▶'}</span>
              </button>
              {audioUrl ? (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  onCanPlay={() => audioRef.current?.play()}
                  className="flex-1 h-8"
                />
              ) : (
                <div className="flex-1 h-1 bg-zinc-700 rounded-full" />
              )}
            </div>
            {audioError && (
              <p className="text-xs text-red-400">{audioError}</p>
            )}
            <p className="text-xs text-zinc-600">
              Voice synthesis via ElevenLabs. Audio is generated on first play and may take a moment.
            </p>
          </div>
        ) : (
          <div className="w-full bg-zinc-800 rounded-lg h-12 flex items-center px-4 gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
              <span className="text-zinc-500 text-xs">▶</span>
            </div>
            <div className="flex-1 h-1 bg-zinc-700 rounded-full" />
            <span className="text-xs text-zinc-600">0:00</span>
          </div>
        )}
      </div>

      {/* The question */}
      <div className="border border-zinc-700 rounded-xl p-8 mb-10">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">The question</h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Before listening: does the text read as stylistically attributable to Prof. Weigel? Consider diction, syntax, the movement of the argument across the volta, the kinds of images the poem reaches for. On what grounds would a critic make — or contest — that attribution?
        </p>
        <p className="text-zinc-300 leading-relaxed mb-4">
          After listening: does the audio change the critical evaluation? Does the same text become more or less attributable to her when delivered in a synthesized version of her voice?
        </p>
        <p className="text-zinc-400 leading-relaxed text-sm">
          Voice in the literary-critical sense is a textual phenomenon — an effect produced by word choice, syntax, rhythm, the organization of perspective. This unit has been treating it as such. But synthesis introduces a second register: an acoustic one. The question is whether these two registers are separable, or whether the acoustic contaminates the textual reading. If a critic&apos;s judgment shifts on hearing the audio, what does that tell us about what &quot;voice&quot; as a critical category is actually tracking?
        </p>
      </div>

      {/* Workshop CTA */}
      <div className="pt-4 border-t border-zinc-800">
        <a
          href="/reading/prompt-chaining-guide"
          className="group flex items-center justify-between w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-purple-700 rounded-xl px-8 py-7 transition-all"
        >
          <div>
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">Workshop</p>
            <p className="text-xl font-bold text-zinc-100 mb-1">
              Now build something better
            </p>
            <p className="text-sm text-zinc-400">
              The workshop session: frameworks, mechanics, and designing your own prompt chain.
            </p>
          </div>
          <span className="text-2xl text-zinc-500 group-hover:text-purple-400 transition-colors ml-6 shrink-0">→</span>
        </a>
      </div>
    </div>
  );
}
