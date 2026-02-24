'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, BookOpen, ArrowLeft } from 'lucide-react';
import { ContentItem } from '../lib/content';

interface DocsSidebarProps {
  nav: ContentItem[];
  currentPath: string;
  onNavigate?: () => void;
}

export function DocsSidebar({ nav, onNavigate }: DocsSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <div className="h-full overflow-y-auto p-5 flex flex-col gap-6">
      {/* Back link */}
      <Link
        href="/analyzer"
        onClick={onNavigate}
        className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <ArrowLeft size={13} />
        Back to Analyzer
      </Link>

      {/* Section label */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          <BookOpen size={12} />
          Reading
        </div>

        <nav className="space-y-0.5">
          {/* Overview / README */}
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

          {/* Doc items */}
          {nav.map((item) => {
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
    </div>
  );
}
