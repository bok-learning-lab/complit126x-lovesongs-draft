'use client';

// Sonnet generated in the style of [professor] — hardcode the actual text here when ready
const GENERATED_SONNET = `[A sonnet generated in the style of your professor will appear here.
Replace this placeholder with the actual generated text before class.]`;

export default function DemoVoicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-10">
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">Demo 3 — Pre-Workshop</p>
        <h1 className="text-3xl font-bold text-zinc-100">Is Voice Textual — or Multimodal?</h1>
        <p className="text-zinc-400 mt-3 max-w-2xl leading-relaxed">
          The model was given examples of your professor&apos;s writing and asked to produce a new sonnet in her style. Below is what it generated. Read it first, then listen.
        </p>
      </header>

      {/* The sonnet */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-8">
        <div className="px-7 py-4 border-b border-zinc-800">
          <span className="text-sm font-semibold text-zinc-200">Generated sonnet</span>
          <span className="text-xs text-zinc-600 italic ml-4">in the style of Prof. Moira Fradinger</span>
        </div>
        <div className="px-8 py-8">
          <pre className="text-zinc-200 text-base whitespace-pre-wrap font-serif leading-loose">
            {GENERATED_SONNET}
          </pre>
        </div>
      </div>

      {/* Audio player */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-7 mb-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-zinc-200">Audio — read aloud in Prof. Fradinger&apos;s voice</p>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">Coming soon</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-lg h-12 flex items-center px-4 gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
            <span className="text-zinc-500 text-xs">▶</span>
          </div>
          <div className="flex-1 h-1 bg-zinc-700 rounded-full" />
          <span className="text-xs text-zinc-600">0:00</span>
        </div>
        <p className="text-xs text-zinc-600 mt-3">
          Audio will be added before class using ElevenLabs voice synthesis.
        </p>
      </div>

      {/* The question */}
      <div className="border border-zinc-700 rounded-xl p-8 mb-10">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">The question</h2>
        <p className="text-zinc-300 leading-relaxed mb-4">
          Before listening: does the text feel like it could have been written by your professor? Does it capture something of how she writes — her diction, her concerns, her way of turning a line?
        </p>
        <p className="text-zinc-300 leading-relaxed mb-4">
          After listening: does hearing her voice change your answer? Does the same text feel more or less like hers when it&apos;s delivered in her voice rather than read silently?
        </p>
        <p className="text-zinc-400 leading-relaxed text-sm">
          Voice — in the literary sense this unit has been examining — is usually understood as a textual phenomenon: a quality of word choice, syntax, rhythm, perspective. But what happens when you add a literal voice? Is that voice hers, or the model&apos;s, or neither? And what does the gap between the two tell you about what &quot;voice&quot; actually consists of?
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
