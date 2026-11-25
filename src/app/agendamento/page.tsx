import type { Metadata } from 'next';
import DynamicServiceForm from '../../components/forms/DynamicServiceForm';
import { RequestHero } from '../../components/PageParts';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata('Solicitar Agendamento | Alpha Fumê e Faróis', 'Escolha um ou mais serviços e informe sua data de preferência. A disponibilidade será confirmada pelo WhatsApp.', '/agendamento/');
export default function BookingPage() { return <><RequestHero mode="agendamento"/><section className="request-workspace"><div className="container"><DynamicServiceForm mode="agendamento"/></div></section></>; }
