import type { Metadata } from 'next';
import DynamicServiceForm from '../../components/forms/DynamicServiceForm';
import { PageHero } from '../../components/PageParts';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata('Solicitar Agendamento | Alpha Fumê e Faróis', 'Escolha um ou mais serviços e informe sua data de preferência. A disponibilidade será confirmada pelo WhatsApp.', '/agendamento/');
export default function BookingPage() { return <><PageHero kicker="SUA PREFERÊNCIA" title="AGENDE O CUIDADO DO SEU VEÍCULO." description="Informe uma data de preferência. A disponibilidade será confirmada na conversa pelo WhatsApp." crumbs={[{ label: 'Agendamento' }]}/><section className="section section-dark"><div className="container"><DynamicServiceForm mode="agendamento"/></div></section></>; }
