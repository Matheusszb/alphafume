import type { Metadata } from 'next';
import { CTA, PageHero } from '../../components/PageParts';
import { faqs } from '../../data/faq';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata('Perguntas Frequentes | Alpha Fumê e Faróis', 'Respostas sobre Insulfilm, PPF, para-brisas, faróis, orçamentos e agendamento.', '/perguntas-frequentes/');
export default function FaqPage() { const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }; return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/><PageHero kicker="TIRE SUAS DÚVIDAS" title="PERGUNTAS FREQUENTES." description="Informações claras para ajudar você a escolher o próximo passo." crumbs={[{ label: 'Perguntas frequentes' }]}/><section className="section section-dark"><div className="container"><div className="faq-list">{faqs.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></div></section><CTA/></>; }
