import { notFound } from 'next/navigation';
import { compile, run } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import * as runtime from 'react/jsx-runtime';
import { getDoc } from '../lib/content';
import './reading/styles.css';

export const metadata = {
  title: 'Love Songs at the Learning Lab — CompLit 126x',
  description: 'Workshop Overview — Unit II: Voice, Style, and Form',
};

export default async function HomePage() {
  const doc = getDoc(['overview']);
  if (!doc) notFound();

  const compiled = await compile(doc.content, {
    outputFormat: 'function-body',
    remarkPlugins: [remarkGfm],
  });
  const mod = await run(String(compiled), {
    ...(runtime as Parameters<typeof run>[1]),
  });
  const MDXContent = mod.default as React.ComponentType;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="prose">
          <MDXContent />
        </div>

        {/* CTA to Analyzer */}
        <div className="mt-16 pt-10 border-t border-zinc-800">
          <a
            href="/analyzer"
            className="group flex items-center justify-between w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-purple-700 rounded-xl px-8 py-7 transition-all"
          >
            <div>
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">Begin</p>
              <p className="text-xl font-bold text-zinc-100 mb-1">
                Open the Poem Personality Analyzer
              </p>
              <p className="text-sm text-zinc-400">
                Feed in poems, build a spider chart, generate a first draft from scores only.
              </p>
            </div>
            <span className="text-2xl text-zinc-500 group-hover:text-purple-400 transition-colors ml-6 shrink-0">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
