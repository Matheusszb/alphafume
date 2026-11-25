import { z } from 'zod';
import { services } from '../data/services';
import { quickQuestions } from '../data/quoteQuestions';
import { business } from '../config/business';

const clean = (value: string) => value.replace(/[\r\n]+/g, ' ').replace(/[*`_~]/g, '').replace(/\s+/g, ' ').trim().slice(0, 500);
export const customerSchema = z.object({
  name: z.string().trim().min(3, 'Informe seu nome completo.').max(100),
  phone: z.string().refine((value) => value.replace(/\D/g, '').length >= 10 && value.replace(/\D/g, '').length <= 11, 'Informe um WhatsApp com DDD.'),
  city: z.string().trim().max(100),
  neighborhood: z.string().trim().max(100).optional(),
  date: z.string().optional(),
  period: z.enum(['Manhã', 'Tarde', 'Sem preferência']),
  notes: z.string().max(500).optional()
});
export const vehicleSchema = z.object({
  type: z.string(),
  brand: z.string().min(2, 'Informe a marca.'),
  model: z.string().min(2, 'Informe o modelo.'),
  year: z.string().regex(/^(19|20)\d{2}$/, 'Informe um ano válido.'),
  version: z.string().optional(),
  color: z.string().optional()
});
export type Customer = z.infer<typeof customerSchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
export type Quote = { mode: 'orcamento' | 'agendamento'; customer: Customer; vehicle: Vehicle; services: string[]; answers: Record<string, Record<string, unknown>> };

function formatDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return clean(value);
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

export function buildQuoteMessage(quote: Quote): string {
  const { customer, vehicle } = quote;
  const lines = [
    '🚘 *ALPHA FUMÊ E FARÓIS*',
    '',
    `Olá! Vim pelo site e gostaria de solicitar ${quote.mode === 'agendamento' ? 'um agendamento' : 'um orçamento'}.`,
    '', '━━━━━━━━━━━━━━━━', '👤 *DADOS DO CLIENTE*',
    `• Nome: ${clean(customer.name)}`, `• WhatsApp: ${clean(customer.phone)}`,
    ...(customer.city ? [`• Cidade: ${clean(customer.city)}`] : []),
    ...(customer.neighborhood ? [`• Bairro: ${clean(customer.neighborhood)}`] : []),
    '', '🚗 *DADOS DO VEÍCULO*',
    ...(vehicle.type ? [`• Categoria: ${clean(vehicle.type)}`] : []),
    `• Marca: ${clean(vehicle.brand)}`, `• Modelo: ${clean(vehicle.model)}`, `• Ano: ${clean(vehicle.year)}`,
    ...(vehicle.version ? [`• Versão: ${clean(vehicle.version)}`] : []),
    ...(vehicle.color ? [`• Cor: ${clean(vehicle.color)}`] : [])
  ];
  quote.services.forEach((slug) => {
    const service = services.find((item) => item.slug === slug);
    const question = quickQuestions[slug];
    if (!service || !question) return;
    const answers = quote.answers[slug] || {};
    lines.push('', '━━━━━━━━━━━━━━━━', `*${service.name.toUpperCase()}*`);
    const value = answers[question.key];
    if (value !== undefined && value !== '' && (!Array.isArray(value) || value.length)) {
      lines.push(`• ${clean(question.label)}: ${clean(Array.isArray(value) ? value.join(', ') : String(value))}`);
    }
  });
  if (customer.date || customer.period !== 'Sem preferência') {
    lines.push('', '📅 *PREFERÊNCIA DE ATENDIMENTO*');
    if (customer.date) lines.push(`• Data: ${formatDate(customer.date)}`);
    lines.push(`• Período: ${customer.period}`);
  }
  if (customer.notes) lines.push('', '📝 *OBSERVAÇÕES GERAIS*', clean(customer.notes));
  lines.push('', '━━━━━━━━━━━━━━━━', '📲 Aguardo retorno para confirmar valores e disponibilidade. Obrigado!');
  return lines.join('\n');
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(message)}`;
}
