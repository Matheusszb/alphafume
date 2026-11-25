import type { Service } from '../types/content';
import ServiceSelect from './ServiceSelect';

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Caminho"><a href="/">Início</a>{items.map((item, i) => <span key={`${item.label}-${i}`} className="breadcrumb-part"><span aria-hidden="true">/</span>{item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}</span>)}</nav>;
}

export function PageHero({ kicker, title, description, image, imageAlt, crumbs }: { kicker: string; title: string; description: string; image?: string; imageAlt?: string; crumbs: { label: string; href?: string }[] }) {
  return <section className={`page-hero ${image ? 'has-image' : ''}`}>{image && <img src={image} alt={imageAlt || 'Imagem automotiva ilustrativa'} width={1600} height={900}/>}<div className="container"><Breadcrumbs items={crumbs}/><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{description}</p></div></section>;
}

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  return <article className="service-card"><a href={`/servicos/${service.slug}/`} className="service-card-image" aria-label={`Conheça ${service.name}`}><img src={service.image} alt={service.imageAlt} loading="lazy" width={800} height={500}/><span className="image-overlay"/></a><div className="service-card-body"><div className="card-meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{service.kicker}</span></div><h3><a href={`/servicos/${service.slug}/`}>{service.name}</a></h3><p>{service.summary}</p><ul className="service-card-benefits">{service.benefits.slice(0, 2).map(item => <li key={item}>{item}</li>)}</ul><div className="service-card-actions"><a className="text-link" href={`/servicos/${service.slug}/`}>SAIBA MAIS</a><ServiceSelect slug={service.slug} name={service.name}/></div></div></article>;
}

export function CTA() {
  return <section className="cta-band"><div className="container cta-inner"><div><p className="eyebrow">SEU VEÍCULO, NOSSA ATENÇÃO</p><h2>VAMOS CUIDAR DO PRÓXIMO DETALHE?</h2><p>Conte o que precisa e fale diretamente com a Alpha.</p></div><div className="cta-actions"><a className="btn btn-red" href="/agendamento/">AGENDAR SERVIÇO</a><a className="btn btn-outline" href="/contato/">FALE COM A ALPHA</a></div></div></section>;
}
