'use client';

import { useState } from 'react';

const SONNETS = [
  {
    id: 'sonnet-18',
    title: 'Sonnet 18',
    opening: 'Shall I compare thee to a summer\'s day?',
    text: `Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date:
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance, or nature's changing course untrimm'd;
But thy eternal summer shall not fade,
Nor lose possession of that fair thou ow'st;
Nor shall death brag thou wander'st in his shade,
When in eternal lines to time thou grow'st:
  So long as men can breathe, or eyes can see,
  So long lives this, and this gives life to thee.`,
  },
  {
    id: 'sonnet-29',
    title: 'Sonnet 29',
    opening: 'When, in disgrace with fortune and men\'s eyes,',
    text: `When, in disgrace with fortune and men's eyes,
I all alone beweep my outcast state,
And trouble deaf heaven with my bootless cries,
And look upon myself, and curse my fate,
Wishing me like to one more rich in hope,
Featur'd like him, like him with friends possess'd,
Desiring this man's art and that man's scope,
With what I most enjoy contented least;
Yet in these thoughts myself almost despising,
Haply I think on thee, and then my state,
Like to the lark at break of day arising
From sullen earth, sings hymns at heaven's gate;
  For thy sweet love remember'd such wealth brings
  That then I scorn to change my state with kings.`,
  },
  {
    id: 'sonnet-55',
    title: 'Sonnet 55',
    opening: 'Not marble, nor the gilded monuments',
    text: `Not marble, nor the gilded monuments
Of princes, shall outlive this powerful rhyme;
But you shall shine more bright in these contents
Than unswept stone, besmear'd with sluttish time.
When wasteful war shall statues overturn,
And broils root out the work of masonry,
Nor Mars his sword nor war's quick fire shall burn
The living record of your memory.
'Gainst death and all-oblivious enmity
Shall you pace forth; your praise shall still find room
Even in the eyes of all posterity
That wear this world out to the ending doom.
  So, till the judgment that yourself arise,
  You live in this, and dwell in lovers' eyes.`,
  },
  {
    id: 'sonnet-73',
    title: 'Sonnet 73',
    opening: 'That time of year thou mayst in me behold',
    text: `That time of year thou mayst in me behold
When yellow leaves, or none, or few, do hang
Upon those boughs which shake against the cold,
Bare ruin'd choirs, where late the sweet birds sang.
In me thou see'st the twilight of such day
As after sunset fadeth in the west,
Which by and by black night doth take away,
Death's second self, that seals up all in rest.
In me thou see'st the glowing of such fire
That on the ashes of his youth doth lie,
As the death-bed whereon it must expire,
Consum'd with that which it was nourish'd by.
  This thou perceiv'st, which makes thy love more strong,
  To love that well which thou must leave ere long.`,
  },
  {
    id: 'sonnet-116',
    title: 'Sonnet 116',
    opening: 'Let me not to the marriage of true minds',
    text: `Let me not to the marriage of true minds
Admit impediments. Love is not love
Which alters when it alteration finds,
Or bends with the remover to remove:
O, no! it is an ever-fixed mark,
That looks on tempests and is never shaken;
It is the star to every wandering bark,
Whose worth's unknown, although his height be taken.
Love's not Time's fool, though rosy lips and cheeks
Within his bending sickle's compass come;
Love alters not with his brief hours and weeks,
But bears it out even to the edge of doom.
  If this be error and upon me proved,
  I never writ, nor no man ever loved.`,
  },
  {
    id: 'sonnet-130',
    title: 'Sonnet 130',
    opening: 'My mistress\' eyes are nothing like the sun',
    text: `My mistress' eyes are nothing like the sun;
Coral is far more red than her lips' red;
If snow be white, why then her breasts are dun;
If hairs be wires, black wires grow on her head.
I have seen roses damasked, red and white,
But no such roses see I in her cheeks;
And in some perfumes is there more delight
Than in the breath that from my mistress reeks.
I love to hear her speak, yet well I know
That music hath a far more pleasing sound;
I grant I never saw a goddess go;
My mistress, when she walks, treads on the ground.
  And yet, by heaven, I think my love as rare
  As any she belied with false compare.`,
  },
];

export default function DemoSonnetPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const selectedTexts = SONNETS.filter((s) => selected.includes(s.id)).map((s) => s.text);
      const res = await fetch('/api/demo-sonnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sonnets: selectedTexts }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setResult(data.sonnet);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-10">
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">Demo 2 — Pre-Workshop</p>
        <h1 className="text-3xl font-bold text-zinc-100">Stuffing the Prompt</h1>
        <p className="text-zinc-400 mt-3 max-w-2xl leading-relaxed">
          Instead of scoring poems into numbers, this demo passes the poems directly — all of them, in full — and asks the model to write something new in the same style.
        </p>
        <p className="text-zinc-500 mt-2 max-w-2xl text-sm leading-relaxed">
          Pick exactly 3 sonnets below, then generate. The output will probably feel more Shakespearean than what the spider chart produced — but look closely at what it borrows and what it misses.
        </p>
      </header>

      {/* Sonnet selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {SONNETS.map((sonnet) => {
          const isSelected = selected.includes(sonnet.id);
          const isDisabled = !isSelected && selected.length >= 3;
          return (
            <button
              key={sonnet.id}
              onClick={() => !isDisabled && toggle(sonnet.id)}
              disabled={isDisabled}
              className={`text-left p-5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-purple-900/30 border-purple-600 text-zinc-100'
                  : isDisabled
                  ? 'bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-sm mb-1">{sonnet.title}</p>
                  <p className="text-xs text-zinc-500 italic leading-relaxed">{sonnet.opening}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center ${
                  isSelected ? 'border-purple-400 bg-purple-400' : 'border-zinc-600'
                }`}>
                  {isSelected && <span className="text-xs text-white font-bold">✓</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-4 text-sm text-zinc-500">
        {selected.length === 0 && 'Select 3 sonnets to continue.'}
        {selected.length > 0 && selected.length < 3 && `${3 - selected.length} more to go.`}
        {selected.length === 3 && 'Ready.'}
      </div>

      <button
        onClick={handleGenerate}
        disabled={selected.length !== 3 || loading}
        className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold text-base rounded-xl transition-colors mb-8"
      >
        {loading ? 'Generating…' : 'Generate a New Sonnet'}
      </button>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm mb-8">
          {error}
        </div>
      )}

      {result && (
        <div className="mb-16">
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="px-7 py-4 border-b border-zinc-800">
              <span className="text-sm font-semibold text-zinc-200">Generated sonnet</span>
              <span className="text-xs text-zinc-600 italic ml-4">
                from {SONNETS.filter((s) => selected.includes(s.id)).map((s) => s.title).join(', ')}
              </span>
            </div>
            <div className="px-8 py-8">
              <pre className="text-zinc-200 text-base whitespace-pre-wrap font-serif leading-loose">
                {result}
              </pre>
            </div>
            <div className="px-7 py-5 border-t border-zinc-800 bg-zinc-950/50">
              <p className="text-sm text-zinc-400 leading-relaxed">
                <span className="font-medium text-zinc-300">Reflect:</span> Is this more or less Shakespearean than the spider chart output? What did it borrow directly — images, phrases, rhymes? What feels generic despite having the full text to work from?
              </p>
            </div>
          </div>

          {/* Next demo CTA */}
          <div className="mt-12 pt-10 border-t border-zinc-800">
            <a
              href="/demo-voice"
              className="group flex items-center justify-between w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-purple-700 rounded-xl px-8 py-7 transition-all"
            >
              <div>
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">Demo 3</p>
                <p className="text-xl font-bold text-zinc-100 mb-1">
                  Is Voice Textual — or Multimodal?
                </p>
                <p className="text-sm text-zinc-400">
                  Hear a generated sonnet read aloud in a real voice. Does that change anything?
                </p>
              </div>
              <span className="text-2xl text-zinc-500 group-hover:text-purple-400 transition-colors ml-6 shrink-0">→</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
