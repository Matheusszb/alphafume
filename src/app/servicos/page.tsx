import type { Metadata } from 'next';
import { CTA, PageHero, ServiceCard } from '../../components/PageParts';
import { services } from '../../data/services';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata('Serviços Automotivos | Alpha Fumê e Faróis', 'Conheça os serviços de Insulfilm, PPF, para-brisas e faróis da Alpha.', '/servicos/');
export default function ServicesPage() { return <><PageHero kicker="NOSSO TRABALHO" title="SERVIÇOS PARA QUEM VALORIZA CADA DETALHE." description="Proteção, vidros e iluminação automotiva com uma solução pensada para o seu veículo." crumbs={[{ label: 'Serviços' }]}/><section className="section section-dark"><div className="container"><div className="service-grid">{services.map((service, index) => <ServiceCard key={service.slug} service={service} index={index}/>)}</div></div></section><CTA/></>; }
