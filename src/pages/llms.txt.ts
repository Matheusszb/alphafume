import type { APIRoute } from 'astro';
import { business } from '../config/business';
import { services } from '../data/services';
export const GET: APIRoute = () => new Response(`# ${business.name}\n\nProteção, estética, vidros e iluminação automotiva. Informações públicas do site.\n\n- Site: ${business.siteUrl}\n- WhatsApp: https://wa.me/${business.whatsapp}\n- Instagram: ${business.instagram}\n\n## Serviços\n${services.map(service => `- ${service.name}: ${business.siteUrl}/servicos/${service.slug}`).join('\n')}\n\nSolicitações de orçamento e agendamento são feitas diretamente pelo WhatsApp. Preços, endereço e horários não estão publicados até confirmação.\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
