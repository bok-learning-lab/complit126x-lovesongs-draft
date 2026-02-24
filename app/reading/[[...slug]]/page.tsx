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
      </article>
    </DocsLayout>
  );
}
