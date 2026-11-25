import type { Metadata } from 'next';
import DynamicServiceForm from '../../components/forms/DynamicServiceForm';
import { RequestHero } from '../../components/PageParts';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata('Solicitar Orçamento | Alpha Fumê e Faróis', 'Escolha um ou mais serviços e monte uma solicitação personalizada para enviar pelo WhatsApp.', '/orcamento/');
export default function QuotePage() { return <><RequestHero mode="orcamento"/><section className="request-workspace"><div className="container"><DynamicServiceForm mode="orcamento"/></div></section></>; }
