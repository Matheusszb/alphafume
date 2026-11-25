import { describe, expect, it } from 'vitest';
import { questionVisible, serviceForms } from '../src/data/formQuestions';
import { buildQuoteMessage, customerSchema, validateStepQuestions, whatsappUrl, type Quote } from '../src/lib/quote';

const quote: Quote = {
  mode: 'orcamento',
  customer: { name:'João Silva', phone:'(79) 99999-9999', city:'Aracaju', period:'Manhã', date:'2026-12-05' },
  vehicle: { type:'Sedan', brand:'Toyota', model:'Corolla', year:'2022' },
  services: ['insulfilm','reparo-de-parabrisa'],
  answers: {
    insulfilm: { tipo_pelicula:'Nanocerâmica', transparencia:'G35', areas:['Vidros laterais dianteiros','Vidro traseiro'], pelicula_antiga:'Não', remover_antiga:'Sim', objetivos:['Conforto térmico','Privacidade'] },
    'reparo-de-parabrisa': { tipo_dano:'Marca de pedra', tamanho:'Até 1 cm', local:'Lado do passageiro' }
  }
};

describe('motor de perguntas', () => {
  it('só mostra perguntas condicionais quando a condição é atendida', () => {
    const removal = serviceForms[0].steps[3].questions.find(question => question.key === 'remover_antiga')!;
    expect(questionVisible(removal,{ pelicula_antiga:'Não' })).toBe(false);
    expect(questionVisible(removal,{ pelicula_antiga:'Sim' })).toBe(true);
  });
  it('bloqueia avanço quando falta resposta obrigatória', () => {
    expect(validateStepQuestions('insulfilm',0,{})).toContain('Selecione ou preencha: Qual tipo de película interessa?');
    expect(validateStepQuestions('insulfilm',0,{tipo_pelicula:'Carbono'})).toEqual([]);
  });
  it('exige descrição apenas quando a opção condicional foi escolhida', () => {
    expect(validateStepQuestions('insulfilm',2,{areas:['Veículo completo']})).toEqual([]);
    expect(validateStepQuestions('insulfilm',2,{areas:['Área específica']})).toContain('Selecione ou preencha: Descreva a área');
  });
  it('valida telefone com DDD', () => {
    expect(customerSchema.safeParse({name:'João Silva',phone:'123',city:'Aracaju',period:'Manhã'}).success).toBe(false);
  });
});

describe('mensagem de WhatsApp', () => {
  it('organiza múltiplos serviços e omite respostas ocultas', () => {
    const message = buildQuoteMessage(quote);
    expect(message).toContain('*APLICAÇÃO DE INSULFILM*');
    expect(message).toContain('*REPARO DE PARA-BRISA*');
    expect(message).toContain('João Silva');
    expect(message).toContain('05/12/2026');
    expect(message).not.toContain('Deseja remover a película antiga?');
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
});
