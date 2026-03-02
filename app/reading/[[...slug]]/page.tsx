import { notFound, redirect } from 'next/navigation';
import { compile, run } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import * as runtime from 'react/jsx-runtime';
import { getDoc, getAllDocPaths, getContentNavigation } from '../../../lib/content';
import { DocsLayout } from '../../../components/docs-layout';

export async function generateStaticParams() {
  const paths = getAllDocPaths();
  return paths.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;
  const doc = getDoc(slug);
  return {
    title: doc?.metadata.title
      ? `${doc.metadata.title} — CompLit 126x`
      : 'Reading — CompLit 126x',
    description: doc?.metadata.description ?? '',
  };
}

export default async function ReadingPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug = [] } = await params;

  // Skip the overview — go straight to the first reading
  if (slug.length === 0) {
    redirect('/reading/overview');
  }

  const doc = getDoc(slug);
  if (!doc) notFound();

  const nav = getContentNavigation();

  // Compile markdown to a React component
  let MDXContent: React.ComponentType;
  try {
    const compiled = await compile(doc.content, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkGfm],
    });
    const mod = await run(String(compiled), {
      ...(runtime as Parameters<typeof run>[1]),
    });
    MDXContent = mod.default as React.ComponentType;
  } catch (err) {
    console.error('MDX compile error:', err);
    notFound();
  }

  const currentPath = slug.join('/');

  // Resolve next-page doc for CTA
  const nextPageDoc = doc.metadata.next_page ? getDoc([doc.metadata.next_page]) : null;

  return (
    <DocsLayout nav={nav} currentPath={currentPath}>
      <article>
        {/* Tags */}
        {doc.metadata.tags && doc.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 not-prose">
            {doc.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-purple-900/40 text-purple-300 border border-purple-800/60"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* MDX content */}
        <div className="prose">
          <MDXContent />
        </div>

        {/* Next-page CTA */}
        {nextPageDoc && (
          <div className="mt-16 pt-10 border-t border-zinc-800 not-prose">
            <a
              href={`/reading/${doc.metadata.next_page}`}
              className="group flex items-center justify-between w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-purple-700 rounded-xl px-8 py-7 transition-all"
            >
              <div>
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1">Next</p>
                <p className="text-xl font-bold text-zinc-100 mb-1">
                  {nextPageDoc.metadata.title}
                </p>
                {nextPageDoc.metadata.description && (
                  <p className="text-sm text-zinc-400">{nextPageDoc.metadata.description}</p>
                )}
              </div>
              <span className="text-2xl text-zinc-500 group-hover:text-purple-400 transition-colors ml-6 shrink-0">→</span>
            </a>
          </div>
        )}
      </article>
    </DocsLayout>
  );
}
