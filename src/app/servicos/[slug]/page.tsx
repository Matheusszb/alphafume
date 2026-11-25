import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CTA, PageHero } from '../../../components/PageParts';
import { services } from '../../../data/services';
import { pageMetadata } from '../../../lib/metadata';

export function generateStaticParams() { return services.map(service => ({ slug: service.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const service = services.find(item => item.slug === slug);
  return service ? pageMetadata(service.seoTitle, service.seoDescription, `/servicos/${slug}/`, service.image) : {};
}
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const service = services.find(item => item.slug === slug); if (!service) notFound();
  return <><PageHero kicker={service.kicker} title={service.name.toUpperCase()} description={service.summary} image={service.image} imageAlt={service.imageAlt} crumbs={[{ label: 'Serviços', href: '/servicos/' }, { label: service.name }]}/>
    <section className="section section-dark"><div className="container split-section"><div className="split-copy"><p className="eyebrow">O SERVIÇO</p><h2>ENTENDA COMO FUNCIONA.</h2><p>{service.description}</p><h3>Indicado para</h3><p>{service.indicated}</p><a className="btn btn-red" href={`/agendamento/?servico=${service.slug}`}>SELECIONAR ESTE SERVIÇO</a></div><div className="split-photo"><img src={service.image} alt={service.imageAlt} width={800} height={600}/></div></div></section>
    <section className="section section-graphite"><div className="container"><div className="section-heading"><p className="eyebrow">O QUE CONSIDERAR</p><h2>BENEFÍCIOS E ETAPAS.</h2></div><div className="info-columns"><div><h3>Benefícios</h3><ul>{service.benefits.map(item => <li key={item}>{item}</li>)}</ul></div><div><h3>Como trabalhamos</h3><ol>{service.process.map(item => <li key={item}>{item}</li>)}</ol></div></div><div className="form-note"><p>{service.limitations}</p></div></div></section>
    <section className="section section-dark"><div className="container"><div className="section-heading"><p className="eyebrow">PERGUNTAS SOBRE O SERVIÇO</p><h2>ANTES DE DECIDIR.</h2></div><div className="faq-list">{service.faqs.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div><p className="muted" style={{ marginTop: 30 }}>{service.care}</p></div></section><CTA/>
  </>;
}
