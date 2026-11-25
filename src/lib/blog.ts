import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

export type BlogArticle = { slug: string; title: string; description: string; category: string; image: string; publishedAt: string; relatedServices: string[]; faq: { question: string; answer: string }[]; html: string };
const directory = path.join(process.cwd(), 'src', 'content', 'blog');

export function getArticles(): BlogArticle[] {
  return readdirSync(directory).filter(name => name.endsWith('.md')).map(name => {
    const source = readFileSync(path.join(directory, name), 'utf8');
    const { data, content } = matter(source);
    return {
      slug: name.slice(0, -3), title: data.title, description: data.description,
      category: data.category, image: data.image,
      publishedAt: data.publishedAt instanceof Date ? data.publishedAt.toISOString() : String(data.publishedAt),
      relatedServices: data.relatedServices || [], faq: data.faq || [],
      html: marked.parse(content, { async: false }) as string
    };
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
