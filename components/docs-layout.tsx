'use client';

import { useState } from 'react';
import { DocsSidebar } from './docs-sidebar';
import { ContentItem } from '../lib/content';
import { Menu, X } from 'lucide-react';

interface DocsLayoutProps {
  nav: ContentItem[];
  currentPath: string;
  children: React.ReactNode;
}

export function DocsLayout({ nav, currentPath, children }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen((v) => !v)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200"
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-800 bg-zinc-950 transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:sticky md:top-0 md:h-screen print:hidden`}
      >
        <DocsSidebar nav={nav} currentPath={currentPath} onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 px-6 pt-16 pb-20 md:px-10 md:pt-12">
        <div className="max-w-3xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
