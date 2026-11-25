import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '../../../components/PageParts';
import { business } from '../../../config/business';
import { services } from '../../../data/services';
import { getArticles } from '../../../lib/blog';
import { pageMetadata } from '../../../lib/metadata';

export function generateStaticParams() { return getArticles().map(article => ({ slug: article.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const article = getArticles().find(item => item.slug === slug); return article ? pageMetadata(`${article.title} | Alpha Fumê e Faróis`, article.description, `/blog/${slug}/`, article.image) : {}; }
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const article = getArticles().find(item => item.slug === slug); if (!article) notFound();
  const schema = { '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.description, image: new URL(article.image, business.siteUrl).toString(), datePublished: article.publishedAt, publisher: { '@type': 'Organization', name: business.name } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/><PageHero kicker={article.category} title={article.title} description={article.description} image={article.image} imageAlt="Imagem ilustrativa do artigo" crumbs={[{ label: 'Blog', href: '/blog/' }, { label: article.title }]}/><section className="section section-dark"><div className="container"><article className="prose" dangerouslySetInnerHTML={{ __html: article.html }}/>{article.faq.length > 0 && <div style={{ marginTop: 70 }}><h2>PERGUNTAS FREQUENTES</h2><div className="faq-list">{article.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div>}{article.relatedServices.length > 0 && <div style={{ marginTop: 70 }}><p className="eyebrow">SERVIÇOS RELACIONADOS</p><div className="filters">{article.relatedServices.map(slug => { const service = services.find(item => item.slug === slug); return service && <a key={slug} className="btn btn-outline" href={`/servicos/${slug}/`}>{service.name}</a>; })}</div></div>}</div></section></>;
}
