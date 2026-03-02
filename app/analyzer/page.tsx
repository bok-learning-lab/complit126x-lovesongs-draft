'use client';

import { useState } from 'react';
import { PoemInput } from '../components/PoemInput';
import { TraitEditor } from '../components/TraitEditor';
import { ResultsRadar } from '../components/ResultsRadar';
import { Trait, PoemAnalysis, AveragedScore } from '../types';

const COLORS = [
  '#a855f7', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444',
  '#ec4899', '#14b8a6', '#8b5cf6', '#f97316', '#06b6d4',
];

const DEFAULT_POEM = `Shall I compare thee to a summer's day?
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
So long lives this, and this gives life to thee.`;

const DEFAULT_TRAITS: Trait[] = [
  {
    id: 'trait-1',
    name: 'Melancholy',
    description: 'The presence of sadness, longing, or wistfulness in the poem',
    rubric: '1-3: No sadness present, 4-6: Some wistful moments, 7-10: Deeply melancholic',
  },
  {
    id: 'trait-2',
    name: 'Romanticism',
    description: 'Expression of love, passion, or deep emotional connection',
    rubric: '1-3: No romantic elements, 4-6: Some romantic undertones, 7-10: Intensely romantic',
  },
  {
    id: 'trait-3',
    name: 'Nature Imagery',
    description: 'Use of the natural world as metaphor, symbol, or setting',
    rubric: '1-3: No nature references, 4-6: Some natural imagery, 7-10: Rich with nature',
  },
  {
    id: 'trait-4',
    name: 'Mortality',
    description: 'Awareness of death, the passage of time, or impermanence',
    rubric: '1-3: No mortality themes, 4-6: Subtle references to time/death, 7-10: Central theme',
  },
  {
    id: 'trait-5',
    name: 'Optimism',
    description: 'Hopeful outlook, positive resolution, or uplifting tone',
    rubric: '1-3: Pessimistic or dark, 4-6: Neutral or mixed, 7-10: Triumphant or hopeful',
  },
];

function extractPoemName(poem: string): string {
  const firstLine = poem.trim().split('\n')[0].trim();
  if (firstLine.length > 30) {
    return firstLine.substring(0, 30) + '...';
  }
  return firstLine;
}

export default function PoemPersonalityPage() {
  const [poem, setPoem] = useState(DEFAULT_POEM);
  const [traits, setTraits] = useState<Trait[]>(DEFAULT_TRAITS);
  const [analyses, setAnalyses] = useState<PoemAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedSonnet, setGeneratedSonnet] = useState<string | null>(null);
  const [generatingSonnet, setGeneratingSonnet] = useState(false);
  const [sonnetError, setSonnetError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poem, traits }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      const newAnalysis: PoemAnalysis = {
        id: `analysis-${Date.now()}`,
        name: extractPoemName(poem),
        poemSnippet: poem.substring(0, 100) + (poem.length > 100 ? '...' : ''),
        scores: data.analysis,
        color: COLORS[analyses.length % COLORS.length],
      };

      setAnalyses((prev) => [...prev, newAnalysis]);
      setSelectedAnalysis(newAnalysis.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAnalysis = (id: string) => {
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAnalysis === id) {
      setSelectedAnalysis(null);
    }
  };

  const handleClearAll = () => {
    setAnalyses([]);
    setSelectedAnalysis(null);
  };

  const currentAnalysis = analyses.find((a) => a.id === selectedAnalysis);

  function computeAveragedScores(allAnalyses: PoemAnalysis[]): AveragedScore[] {
    if (allAnalyses.length === 0) return [];
    const traitMap: { [trait: string]: number[] } = {};
    for (const analysis of allAnalyses) {
      for (const score of analysis.scores) {
        if (!traitMap[score.trait]) traitMap[score.trait] = [];
        traitMap[score.trait].push(score.score);
      }
    }
    return Object.entries(traitMap).map(([trait, scores]) => ({
      trait,
      score: scores.reduce((a, b) => a + b, 0) / scores.length,
    }));
  }

  const handleGenerateSonnet = async () => {
    const averagedScores = computeAveragedScores(analyses);
    setGeneratingSonnet(true);
    setSonnetError(null);
    setGeneratedSonnet(null);
    try {
      const response = await fetch('/api/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ averagedScores }),
      });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      setGeneratedSonnet(data.sonnet);
    } catch (err) {
      setSonnetError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setGeneratingSonnet(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-3">Demo 1 — Pre-Workshop</p>
        <h1 className="text-3xl font-bold text-zinc-100">The Spider Chart</h1>
        <p className="text-zinc-400 mt-3 max-w-2xl leading-relaxed">
          Score poems across traits you define, then generate lyrics from those scores alone — no poem text, no quotations, no author&apos;s name. Just the numbers.
        </p>
        <p className="text-zinc-500 mt-2 max-w-2xl text-sm leading-relaxed">
          This is roughly what music recommendation systems do: a song becomes a point in trait-space, and the system finds other songs nearby. Run it and see what comes out. The output will probably feel like it&apos;s in the right mood — without sounding like anyone in particular. That&apos;s the point.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Input */}
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <PoemInput value={poem} onChange={setPoem} />
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <TraitEditor traits={traits} onChange={setTraits} />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !poem.trim() || traits.some((t) => !t.name.trim())}
            className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Analyzing...' : 'Analyze Poem'}
          </button>

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="space-y-6">
          {analyses.length > 0 ? (
            <>
              {/* Radar Chart */}
              <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-zinc-200">
                    Comparison ({analyses.length} poem{analyses.length !== 1 ? 's' : ''})
                  </h2>
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <ResultsRadar analyses={analyses} />
              </div>

              {/* Poem List */}
              <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                <h3 className="text-sm font-medium text-zinc-400 mb-3">Analyzed Poems</h3>
                <div className="space-y-2">
                  {analyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      onClick={() => setSelectedAnalysis(analysis.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                        selectedAnalysis === analysis.id
                          ? 'bg-zinc-800 border border-zinc-600'
                          : 'bg-zinc-800/50 border border-transparent hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: analysis.color }}
                        />
                        <span className="text-sm text-zinc-200">{analysis.name}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAnalysis(analysis.id);
                        }}
                        className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Analysis Details */}
              {currentAnalysis && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-zinc-400">
                    Details: {currentAnalysis.name}
                  </h3>
                  {currentAnalysis.scores.map((result) => (
                    <div
                      key={result.trait}
                      className="bg-zinc-900 rounded-lg p-4 border border-zinc-800"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-zinc-200">{result.trait}</h4>
                        <span
                          className="text-2xl font-bold"
                          style={{ color: currentAnalysis.color }}
                        >
                          {result.score}/10
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400">{result.reasoning}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 h-full min-h-[400px] flex items-center justify-center">
              <p className="text-zinc-500 text-center">
                Enter a poem and define traits, then click &quot;Analyze Poem&quot; to see results.
                <br />
                <span className="text-zinc-600 text-sm">
                  Analyze multiple poems to compare them!
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Generate Lyrics from Spider Chart */}
      {analyses.length > 0 && (
        <div className="mt-16 border-t border-zinc-700 pt-12">

          {/* Section header */}
          <div className="mb-10">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-2">Step 2</p>
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">From Spider Chart to Sonnet</h2>
            <p className="text-zinc-400 max-w-2xl text-base leading-relaxed">
              Below is the <em>complete</em> prompt the model will receive to write a sonnet —
              nothing else. No poem text, no style examples, no author&apos;s name.
              Just the averaged scores from your chart, expressed as numbers.
            </p>
          </div>

          {/* Two-column: scores visual + prompt text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* Left: averaged scores */}
            <div className="bg-zinc-900 rounded-xl p-7 border border-zinc-800">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-5">
                Averaged across {analyses.length} poem{analyses.length !== 1 ? 's' : ''}
              </p>
              <div className="space-y-4">
                {computeAveragedScores(analyses).map(({ trait, score }) => (
                  <div key={trait}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-zinc-200">{trait}</span>
                      <span className="text-xl font-bold text-purple-400">{score.toFixed(1)}<span className="text-sm text-zinc-600 font-normal">/10</span></span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${score * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: actual prompt */}
            <div className="bg-zinc-950 rounded-xl p-7 border border-zinc-800 flex flex-col">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-5">
                The complete prompt sent to the model
              </p>
              <pre className="text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap flex-1">
                {`Write a sonnet with the following trait scores (scale of 1-10):\n\n${computeAveragedScores(analyses).map(s => `- ${s.trait}: ${s.score.toFixed(1)}/10`).join('\n')}\n\nWrite exactly 14 lines in iambic pentameter with an ABAB CDCD EFEF GG rhyme scheme. Do not include a title.`}
              </pre>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerateSonnet}
            disabled={generatingSonnet}
            className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-semibold text-base rounded-xl transition-colors"
          >
            {generatingSonnet ? 'Generating…' : 'Generate a Sonnet'}
          </button>

          {sonnetError && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {sonnetError}
            </div>
          )}

          {/* Sonnet output */}
          {generatedSonnet && (
            <div className="mt-8">
              <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="px-7 py-4 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-200">Generated sonnet</span>
                  <span className="text-xs text-zinc-600 italic">from scores only — no poem text</span>
                </div>
                <div className="px-8 py-8">
                  <pre className="text-zinc-200 text-base whitespace-pre-wrap font-serif leading-loose">
                    {generatedSonnet}
                  </pre>
                </div>
                <div className="px-7 py-5 border-t border-zinc-800 bg-zinc-950/50">
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    <span className="font-medium text-zinc-300">Reflect:</span> What does this get right?
                    What did the compression lose? The sonnet form is constrained — 14 lines, fixed rhyme scheme — but everything inside those constraints was underdetermined by the scores. What would the model need to replicate the choices a specific poet actually made?
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Demo CTA */}
          <div className="mt-12 pt-10 border-t border-zinc-800">
            <a
              href="/demo-sonnet"
              className="group flex items-center justify-between w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-purple-700 rounded-xl px-8 py-7 transition-all"
            >
              <div>
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">Demo 2</p>
                <p className="text-xl font-bold text-zinc-100 mb-1">
                  Stuffing the Prompt
                </p>
                <p className="text-sm text-zinc-400">
                  Skip the abstraction — feed poems directly and see what comes out.
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
