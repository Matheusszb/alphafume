import type { Metadata } from 'next';
import { PageHero } from '../../components/PageParts';
import { business } from '../../config/business';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata('Contato | Alpha Fumê e Faróis', 'Fale com a Alpha Fumê e Faróis pelo WhatsApp ou Instagram.', '/contato/');
export default function ContactPage() { return <><PageHero kicker="FALE COM A GENTE" title="VAMOS CONVERSAR SOBRE O SEU VEÍCULO." description="Escolha o canal que preferir. Para uma solicitação completa, use o configurador." crumbs={[{ label: 'Contato' }]}/><section className="section section-dark"><div className="container"><div className="contact-grid"><div className="contact-card"><h2>WHATSAPP</h2><p>Fale diretamente com a Alpha pelo número {business.phoneDisplay}.</p><a className="btn btn-red" href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer">ABRIR WHATSAPP</a></div><div className="contact-card"><h2>INSTAGRAM</h2><p>Acompanhe a Alpha em {business.instagramHandle}.</p><a className="btn btn-outline" href={business.instagram} target="_blank" rel="noopener noreferrer">ABRIR INSTAGRAM</a></div></div><div style={{ marginTop: 45 }}><a className="btn btn-red" href="/orcamento/">MONTAR SOLICITAÇÃO DE ORÇAMENTO</a></div></div></section></>; }
