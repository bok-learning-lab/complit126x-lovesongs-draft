'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, ArrowLeft, BarChart2 } from 'lucide-react';
import { ContentItem } from '../lib/content';

interface DocsSidebarProps {
  nav: ContentItem[];
  currentPath: string;
  onNavigate?: () => void;
}

const PHASE_LABELS: Record<number, string> = {
  1: 'Pre-Workshop',
  2: 'Workshop',
  3: 'Post-Workshop',
};

export function DocsSidebar({ nav, onNavigate }: DocsSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const navByPhase = nav.reduce<Record<number, ContentItem[]>>((acc, item) => {
    const p = item.phase ?? 1;
    if (!acc[p]) acc[p] = [];
    acc[p].push(item);
    return acc;
  }, {});

  // Only show pre-workshop content for now; workshop + post-workshop hidden until session
  const phases = [1];

  return (
    <div className="h-full overflow-y-auto p-5 flex flex-col gap-6">
      {/* Back link */}
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft size={13} />
        Back to Start
      </Link>

      {phases.map((phase) => (
        <div key={phase}>
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            {PHASE_LABELS[phase]}
          </div>

          <nav className="space-y-0.5">
            {/* Phase 1 gets hardcoded Overview + Spider Chart at the top */}
            {phase === 1 && (
              <>
                <Link
                  href="/reading/overview"
                  onClick={onNavigate}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/reading/overview')
                      ? 'bg-purple-900/40 text-purple-300 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <FileText size={14} className="shrink-0" />
                  Overview
                </Link>

                <Link
                  href="/analyzer"
                  onClick={onNavigate}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/analyzer')
                      ? 'bg-purple-900/40 text-purple-300 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <BarChart2 size={14} className="shrink-0" />
                  Spider Chart
                </Link>

                <Link
                  href="/demo-sonnet"
                  onClick={onNavigate}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/demo-sonnet')
                      ? 'bg-purple-900/40 text-purple-300 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <FileText size={14} className="shrink-0" />
                  Shakespeare Sonnets
                </Link>

                <Link
                  href="/demo-voice"
                  onClick={onNavigate}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive('/demo-voice')
                      ? 'bg-purple-900/40 text-purple-300 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <FileText size={14} className="shrink-0" />
                  Moira&apos;s Voice
                </Link>
              </>
            )}

            {/* Dynamic items for this phase */}
            {(navByPhase[phase] ?? []).map((item) => {
              const href = `/reading/${item.path}`;
              return (
                <Link
                  key={item.slug}
                  href={href}
                  onClick={onNavigate}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive(href)
                      ? 'bg-purple-900/40 text-purple-300 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <FileText size={14} className="shrink-0" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}
