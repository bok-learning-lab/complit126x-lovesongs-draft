import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_ROOT = path.join(process.cwd(), '_content');

export interface ContentItem {
  slug: string;
  title: string;
  path: string;
  position: number;
  phase: number;
}

export interface DocMetadata {
  title?: string;
  nav_title?: string;
  sidebar_position?: number;
  phase?: number;
  tags?: string[];
  description?: string;
  next_page?: string;
}

export interface Doc {
  slug: string;
  content: string;
  metadata: DocMetadata;
  path: string;
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getContentNavigation(): ContentItem[] {
  const files = fs.readdirSync(CONTENT_ROOT);
  const items: ContentItem[] = [];

  for (const file of files) {
    const isMarkdown = file.endsWith('.md') || file.endsWith('.mdx');
    if (!isMarkdown) continue;

    const slug = file.replace(/\.(mdx?)$/, '');
    // Skip non-nav files: index files, merged workshop-overview, hardcoded overview, and intro (duplicative of workshop)
    if (slug === 'README' || slug === 'index' || slug === 'workshop-overview' || slug === 'overview' || slug === 'learning-lab-intro-to-context-engineering') continue;

    const filePath = path.join(CONTENT_ROOT, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    const meta = data as DocMetadata;

    items.push({
      slug,
      title: meta.nav_title || meta.title || slugToTitle(slug),
      path: slug,
      position: meta.sidebar_position ?? 999,
      phase: meta.phase ?? 1,
    });
  }

  items.sort((a, b) => a.position - b.position);
  return items;
}

export function getAllDocPaths(): string[][] {
  const nav = getContentNavigation();
  const paths: string[][] = [[], ['overview']]; // [] = index redirect, overview = special home
  for (const item of nav) {
    paths.push([item.slug]);
  }
  return paths;
}

export function getDoc(slugArray: string[]): Doc | null {
  let filePath: string;
  let slugStr: string;

  if (slugArray.length === 0) {
    filePath = path.join(CONTENT_ROOT, 'README.md');
    slugStr = '';
    if (!fs.existsSync(filePath)) {
      filePath = path.join(CONTENT_ROOT, 'index.md');
      if (!fs.existsSync(filePath)) return null;
    }
  } else {
    slugStr = slugArray.join('/');
    const mdxPath = path.join(CONTENT_ROOT, `${slugStr}.mdx`);
    const mdPath = path.join(CONTENT_ROOT, `${slugStr}.md`);
    if (fs.existsSync(mdxPath)) {
      filePath = mdxPath;
    } else if (fs.existsSync(mdPath)) {
      filePath = mdPath;
    } else {
      return null;
    }
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const meta = data as DocMetadata;

  return {
    slug: slugStr,
    content,
    metadata: {
      title: meta.title || slugToTitle(slugStr || 'Overview'),
      nav_title: meta.nav_title,
      sidebar_position: meta.sidebar_position,
      tags: meta.tags,
      description: meta.description,
      next_page: meta.next_page,
    },
    path: slugStr,
  };
}
