import { describe, expect, it } from 'vitest';
import { buildQuoteMessage, customerSchema, vehicleSchema, whatsappUrl, type Quote } from '../src/lib/quote';

const quote: Quote = {
  mode: 'orcamento',
  customer: { name:'João Silva', phone:'(79) 99999-9999', city:'Aracaju', period:'Manhã', date:'2026-12-05' },
  vehicle: { type:'Sedan', brand:'Toyota', model:'Corolla', year:'2022' },
  services: ['insulfilm','reparo-de-parabrisa'],
  answers: {
    insulfilm: { tipo_pelicula:'Nanocerâmica' },
    'reparo-de-parabrisa': { tipo_dano:'Marca de pedra' }
  }
};

describe('dados essenciais', () => {
  it('valida telefone com DDD', () => {
    expect(customerSchema.safeParse({name:'João Silva',phone:'123',city:'Aracaju',period:'Manhã'}).success).toBe(false);
  });
  it('aceita cidade e categoria em branco, mas exige marca, modelo e ano', () => {
    expect(customerSchema.safeParse({name:'João Silva',phone:'79999999999',city:'',period:'Sem preferência'}).success).toBe(true);
    expect(vehicleSchema.safeParse({type:'',brand:'Toyota',model:'Corolla',year:'2022'}).success).toBe(true);
    expect(vehicleSchema.safeParse({type:'',brand:'',model:'Corolla',year:'2022'}).success).toBe(false);
  });
});

describe('mensagem de WhatsApp', () => {
  it('organiza múltiplos serviços e os detalhes escolhidos', () => {
    const message = buildQuoteMessage(quote);
    expect(message).toContain('*APLICAÇÃO DE INSULFILM*');
    expect(message).toContain('*REPARO DE PARA-BRISA*');
    expect(message).toContain('João Silva');
    expect(message).toContain('05/12/2026');
    expect(message).toContain('Nanocerâmica');
    expect(message).toContain('Marca de pedra');
  });
  it('codifica acentos e aponta para o número da empresa', () => {
    const url = whatsappUrl(buildQuoteMessage(quote));
    expect(url).toMatch(/^https:\/\/wa\.me\/5579999503508\?text=/);
    expect(decodeURIComponent(new URL(url).searchParams.get('text')!)).toContain('João');
  });
  it('remove caracteres que quebram a formatação da mensagem', () => {
    const message = buildQuoteMessage({ ...quote, customer:{...quote.customer,name:'*João*\nFalso título'} });
    expect(message).toContain('Nome: João Falso título');
  });
  it('não inclui linhas vazias de campos opcionais', () => {
    const message = buildQuoteMessage({ ...quote, customer: { ...quote.customer, city: '' }, vehicle: { ...quote.vehicle, type: '' } });
    expect(message).not.toContain('• Cidade:');
    expect(message).not.toContain('• Categoria:');
  });
});
