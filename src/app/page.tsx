import type { Metadata } from 'next';
import { Intro } from '../components/layout/SiteChrome';
import { CTA, ServiceCard } from '../components/PageParts';
import { services } from '../data/services';
import { faqs } from '../data/faq';
import { pageMetadata } from '../lib/metadata';

export const metadata: Metadata = pageMetadata('Alpha Fumê e Faróis | Proteção, Estética e Performance', 'Películas automotivas, proteção de pintura, para-brisas e faróis. Solicite agendamento pelo WhatsApp.', '/');

const differentiators = [
  ['ATENÇÃO AOS DETALHES', 'Cada superfície, vidro e conjunto óptico merece uma avaliação cuidadosa.'],
  ['ATENDIMENTO PERSONALIZADO', 'A conversa começa pelo que você procura e pelas características do veículo.'],
  ['CUIDADO COM O VEÍCULO', 'Orientação para escolher uma solução adequada às condições e ao objetivo do serviço.'],
  ['ACABAMENTO', 'Proteção e estética conduzidas com foco na apresentação final.']
];

export default function HomePage() {
  return <><Intro/>
    <section className="hero"><img className="hero-image" src="/images/hero.webp" alt="Veículo esportivo escuro com faróis acesos, imagem ilustrativa" width={1600} height={900} fetchPriority="high"/><div className="container"><div className="hero-copy"><p className="eyebrow">ALPHA FUMÊ E FARÓIS · CUIDADO AUTOMOTIVO</p><h1>PROTEÇÃO, ESTÉTICA E PERFORMANCE <em>PARA O SEU VEÍCULO.</em></h1><p className="lead">Serviços especializados em películas automotivas, proteção de pintura, para-brisas e restauração de faróis. Cuide do seu veículo com atenção a cada detalhe.</p><div className="hero-actions"><a className="btn btn-red" href="/agendamento/">AGENDAR MEU SERVIÇO</a><a className="btn btn-outline" href="/servicos/">CONHECER NOSSOS SERVIÇOS</a></div></div><div className="hero-rail">PROTEÇÃO <span>·</span> ESTÉTICA <span>·</span> ILUMINAÇÃO</div></div><span className="hero-side-label" aria-hidden="true">PRECISÃO EM CADA DETALHE</span><div className="hero-slope"/></section>
    <div className="diagonal-divider" aria-hidden="true"/>
    <section className="section section-dark" id="servicos"><div className="container"><div className="section-heading"><p className="eyebrow">O QUE FAZEMOS</p><h2>SOLUÇÕES PARA CADA DETALHE DO SEU VEÍCULO.</h2><p>Do cuidado com os vidros à proteção da pintura e dos faróis. Explore cada serviço e conte o que seu veículo precisa.</p></div><div className="service-grid">{services.map((service, index) => <ServiceCard key={service.slug} service={service} index={index}/>)}</div></div></section>
    <section className="section section-graphite" id="diferenciais"><div className="container"><div className="section-heading"><p className="eyebrow">O JEITO ALPHA</p><h2>ATENÇÃO EM CADA ESCOLHA.</h2><p>Uma proposta de cuidado com o veículo, da conversa inicial ao acabamento.</p></div><div className="feature-strip">{differentiators.map(([title, text]) => <div className="feature-item" key={title}><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>
    <section className="section section-dark" id="galeria"><div className="container split-section"><div className="split-photo"><img src="/images/farois.webp" alt="Farol automotivo iluminado, imagem ilustrativa" width={800} height={600} loading="lazy"/></div><div className="split-copy"><p className="eyebrow">GALERIA DE SERVIÇOS</p><h2>O DETALHE FALA POR SI.</h2><p>A galeria está preparada para receber fotografias autorizadas de trabalhos reais da Alpha. Enquanto isso, conheça as possibilidades para o seu veículo.</p><a className="btn btn-outline" href="/galeria/">VER GALERIA</a></div></div></section>
    <section className="section section-graphite" id="sobre"><div className="container split-section"><div className="split-copy"><p className="eyebrow">SOBRE NÓS</p><h2>SEU VEÍCULO MERECE ATENÇÃO EM CADA DETALHE.</h2><p>A Alpha Fumê e Faróis oferece soluções voltadas à proteção, estética e conservação automotiva. Trabalhamos com aplicação de películas, proteção de pintura, serviços em para-brisas e faróis, buscando proporcionar um atendimento personalizado de acordo com as necessidades de cada veículo.</p><a className="btn btn-outline" href="/sobre/">CONHEÇA A ALPHA</a></div><div className="split-photo"><img src="/images/ppf.webp" alt="Pintura automotiva com reflexos, imagem ilustrativa" width={800} height={600} loading="lazy"/></div></div></section>
    <section className="section section-dark" id="perguntas-frequentes"><div className="container"><div className="section-heading"><p className="eyebrow">DÚVIDAS FREQUENTES</p><h2>RESPOSTAS DIRETAS.</h2></div><div className="faq-list">{faqs.slice(0, 6).map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div><div style={{ marginTop: 38 }}><a className="text-link" href="/perguntas-frequentes/">VER TODAS AS PERGUNTAS</a></div></div></section>
    <CTA/>
  </>;
}
