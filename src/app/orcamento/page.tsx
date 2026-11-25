import type { Metadata } from 'next';
import DynamicServiceForm from '../../components/forms/DynamicServiceForm';
import { PageHero } from '../../components/PageParts';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata('Solicitar Orçamento | Alpha Fumê e Faróis', 'Escolha um ou mais serviços e monte uma solicitação personalizada para enviar pelo WhatsApp.', '/orcamento/');
export default function QuotePage() { return <><PageHero kicker="ORÇAMENTO PERSONALIZADO" title="CONTE O QUE SEU VEÍCULO PRECISA." description="Selecione serviços, responda às perguntas e revise sua mensagem antes de enviá-la pelo WhatsApp." crumbs={[{ label: 'Orçamento' }]}/><section className="section section-dark"><div className="container"><DynamicServiceForm mode="orcamento"/></div></section></>; }
