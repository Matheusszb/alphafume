'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CalendarDays, Check, CheckCheck, ChevronRight, Clipboard, MessageCircle, ShieldCheck } from 'lucide-react';
import { services } from '../../data/services';
import { quickQuestions, type QuickQuestion } from '../../data/quoteQuestions';
import { vehicleBrands, vehicleTypes } from '../../data/vehicles';
import { buildQuoteMessage, customerSchema, vehicleSchema, whatsappUrl, type Customer, type Vehicle } from '../../lib/quote';
import { track } from '../../lib/analytics';

type Step = 0 | 1 | 2 | 3;

const steps = ['Serviços', 'Veículo', 'Contato', 'Revisão'] as const;
const emptyVehicle: Vehicle = { type: '', brand: '', model: '', year: '', version: '', color: '' };
const emptyCustomer: Customer = { name: '', phone: '', city: '', neighborhood: '', date: '', period: 'Sem preferência', notes: '' };

const todayLocal = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  const split = digits.length > 10 ? 7 : 6;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, split)}-${digits.slice(split)}`;
}

export default function DynamicServiceForm({ mode = 'orcamento' }: { mode?: 'orcamento' | 'agendamento' }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle>(emptyVehicle);
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [answers, setAnswers] = useState<Record<string, Record<string, unknown>>>({});
  const [step, setStep] = useState<Step>(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('servico');
    let saved: string[] = [];
    try {
      const parsed = JSON.parse(sessionStorage.getItem('alpha_selected_services') || '[]');
      if (Array.isArray(parsed)) saved = parsed.filter((item): item is string => typeof item === 'string' && services.some(service => service.slug === item));
    } catch { /* Ignore stale browser data. */ }
    if (slug && services.some(service => service.slug === slug)) saved = Array.from(new Set([...saved, slug]));
    setSelected(saved);
    setReady(true);
    track('form_start', { mode });
  }, [mode]);

  useEffect(() => { if (ready) sessionStorage.setItem('alpha_selected_services', JSON.stringify(selected)); }, [ready, selected]);
  useEffect(() => { if (errors.length) errorRef.current?.focus(); }, [errors]);

  const quote = { mode, customer, vehicle, services: selected, answers };
  const message = buildQuoteMessage(quote);
  const isBooking = mode === 'agendamento';

  function toggleService(slug: string) {
    setSelected(current => current.includes(slug) ? current.filter(item => item !== slug) : [...current, slug]);
    setErrors([]);
    track('select_service', { service: slug });
  }

  function updateQuick(slug: string, question: QuickQuestion, option: string) {
    setAnswers(current => {
      const prior = current[slug] || {};
      const value = prior[question.key];
      let next: string | string[];
      if (question.multi) {
        const choices = Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
        next = option === 'Veículo completo'
          ? (choices.includes(option) ? [] : [option])
          : (choices.includes(option) ? choices.filter(item => item !== option) : [...choices.filter(item => item !== 'Veículo completo'), option]);
      } else next = value === option ? '' : option;
      return { ...current, [slug]: { ...prior, [question.key]: next } };
    });
  }

  function validate(target: Step): string[] {
    if (target === 0) return selected.length ? [] : ['Escolha pelo menos um serviço para continuar.'];
    if (target === 1) {
      const result = vehicleSchema.safeParse(vehicle);
      return result.success ? [] : result.error.issues.map(issue => issue.message);
    }
    if (target === 2) {
      const result = customerSchema.safeParse(customer);
      const issues = result.success ? [] : result.error.issues.map(issue => issue.message);
      if (isBooking && !customer.date) issues.push('Escolha uma data de preferência para agendar.');
      if (customer.date && customer.date < todayLocal()) issues.push('Escolha uma data atual ou futura.');
      return issues;
    }
    return [];
  }

  function goTo(target: Step) {
    setErrors([]);
    setStep(target);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => document.getElementById('quote-form')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' }));
  }

  function next() {
    const issues = validate(step);
    if (issues.length) { setErrors(issues); return; }
    const target = Math.min(step + 1, 3) as Step;
    goTo(target);
    track(target === 3 ? 'form_review' : 'form_step', { step: target + 1 });
  }

  function send() {
    for (const target of [0, 1, 2] as Step[]) {
      const issues = validate(target);
      if (issues.length) { goTo(target); setErrors(issues); return; }
    }
    track(isBooking ? 'booking_whatsapp' : 'quote_whatsapp', { service_count: selected.length });
    track('whatsapp_click', { source: 'form' });
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch { setErrors(['Não foi possível copiar. Selecione o texto da mensagem para copiar manualmente.']); }
  }

  return <div className="quote-layout" id="quote-form" inert={!ready}>
    <form className="quote-main" noValidate onSubmit={event => { event.preventDefault(); if (step === 3) send(); else next(); }}>
      <ol className="quote-stepper" aria-label="Etapas da solicitação">{steps.map((label, index) => <li key={label} className={`${step === index ? 'current' : ''} ${step > index ? 'done' : ''}`}>
        {index < step ? <button type="button" onClick={() => goTo(index as Step)} aria-label={`Voltar para ${label}`}><span>{index + 1}</span><strong>{label}</strong></button> : <div aria-current={step === index ? 'step' : undefined}><span>{index + 1}</span><strong>{label}</strong></div>}
      </li>)}</ol>

      <div className="quote-panel">
        <div className="quote-panel-top"><span>{isBooking ? 'SOLICITAÇÃO DE AGENDAMENTO' : 'SOLICITAÇÃO DE ORÇAMENTO'}</span><span>ETAPA {step + 1} DE 4</span></div>
        {errors.length > 0 && <div className="quote-errors" role="alert" tabIndex={-1} ref={errorRef}><strong>Confira estes dados para continuar:</strong><ul>{errors.map(error => <li key={error}>{error}</li>)}</ul></div>}

        {step === 0 && <section aria-labelledby="quote-step-title">
          <div className="quote-section-heading"><p className="eyebrow">01 / SERVIÇOS</p><h2 id="quote-step-title">O que seu veículo precisa?</h2><p>Escolha um ou mais serviços. Você poderá explicar os detalhes depois, se quiser.</p></div>
          <div className="quote-service-grid">{services.map(service => {
            const active = selected.includes(service.slug);
            return <button type="button" key={service.slug} className={`quote-service ${active ? 'selected' : ''}`} aria-pressed={active} onClick={() => toggleService(service.slug)}>
              <img src={service.image} alt="" width={280} height={180} loading="lazy"/>
              <span className="quote-service-copy"><small>{service.kicker}</small><strong>{service.name}</strong><span>{service.summary}</span></span>
              <span className="quote-service-check" aria-hidden="true">{active && <Check size={17}/>}</span>
            </button>;
          })}</div>
          <p className="quote-selection-count" aria-live="polite"><Check size={17}/>{selected.length === 0 ? 'Nenhum serviço selecionado' : `${selected.length} ${selected.length === 1 ? 'serviço selecionado' : 'serviços selecionados'}`}</p>
        </section>}

        {step === 1 && <section aria-labelledby="quote-step-title">
          <div className="quote-section-heading"><p className="eyebrow">02 / VEÍCULO</p><h2 id="quote-step-title">Fale um pouco sobre o veículo.</h2><p>Marca, modelo e ano são suficientes para começar. O restante ajuda na avaliação, mas é opcional.</p></div>
          <div className="quote-field-grid">
            <label className="quote-field"><span className="quote-label">Marca <b>*</b></span><input list="quote-brands" autoComplete="off" value={vehicle.brand} onChange={event => setVehicle({ ...vehicle, brand: event.target.value })} placeholder="Ex.: Toyota" required/><datalist id="quote-brands">{vehicleBrands.filter(brand => brand !== 'Outra').map(brand => <option value={brand} key={brand}/>)}</datalist></label>
            <label className="quote-field"><span className="quote-label">Modelo <b>*</b></span><input value={vehicle.model} onChange={event => setVehicle({ ...vehicle, model: event.target.value })} placeholder="Ex.: Corolla" required/></label>
            <label className="quote-field"><span className="quote-label">Ano <b>*</b></span><input inputMode="numeric" maxLength={4} value={vehicle.year} onChange={event => setVehicle({ ...vehicle, year: event.target.value.replace(/\D/g, '') })} placeholder="Ex.: 2022" required/></label>
            <label className="quote-field"><span className="quote-label">Categoria <em>opcional</em></span><select value={vehicle.type} onChange={event => setVehicle({ ...vehicle, type: event.target.value })}><option value="">Selecione se souber</option>{vehicleTypes.map(type => <option value={type} key={type}>{type}</option>)}</select></label>
          </div>
          <details className="quote-optional"><summary>Adicionar versão e cor do veículo <span>opcional</span></summary><div className="quote-field-grid"><label className="quote-field"><span className="quote-label">Versão</span><input value={vehicle.version} onChange={event => setVehicle({ ...vehicle, version: event.target.value })} placeholder="Ex.: XEi"/></label><label className="quote-field"><span className="quote-label">Cor</span><input value={vehicle.color} onChange={event => setVehicle({ ...vehicle, color: event.target.value })} placeholder="Ex.: Preto"/></label></div></details>
          <details className="quote-optional quote-quick-details"><summary>Adicionar detalhes dos serviços <span>opcional</span></summary><div className="quote-quick-list">{selected.map(slug => { const service = services.find(item => item.slug === slug)!; const question = quickQuestions[slug]; const value = answers[slug]?.[question.key]; return <div className="quote-quick-item" key={slug}><h3>{service.name}</h3><p>{question.prompt}</p><div className="quote-chip-row" role="group" aria-label={question.prompt}>{question.options.map(option => { const active = question.multi ? Array.isArray(value) && value.includes(option) : value === option; return <button type="button" key={option} className={`quote-chip ${active ? 'selected' : ''}`} aria-pressed={active} onClick={() => updateQuick(slug, question, option)}>{option}</button>; })}</div></div>; })}</div><p className="quote-help">Pode deixar em branco. A equipe ajuda você a escolher na conversa.</p></details>
        </section>}

        {step === 2 && <section aria-labelledby="quote-step-title">
          <div className="quote-section-heading"><p className="eyebrow">03 / CONTATO</p><h2 id="quote-step-title">Como podemos falar com você?</h2><p>Esses dados entram apenas na mensagem que você poderá enviar pelo seu WhatsApp.</p></div>
          <div className="quote-field-grid">
            <label className="quote-field"><span className="quote-label">Nome completo <b>*</b></span><input autoComplete="name" value={customer.name} onChange={event => setCustomer({ ...customer, name: event.target.value })} placeholder="Seu nome" required/></label>
            <label className="quote-field"><span className="quote-label">WhatsApp com DDD <b>*</b></span><input type="tel" inputMode="tel" autoComplete="tel" value={customer.phone} onChange={event => setCustomer({ ...customer, phone: formatPhone(event.target.value) })} placeholder="(79) 99999-9999" required/></label>
            <label className="quote-field"><span className="quote-label">Cidade <em>opcional</em></span><input autoComplete="address-level2" value={customer.city} onChange={event => setCustomer({ ...customer, city: event.target.value })} placeholder="Sua cidade"/></label>
            {isBooking && <label className="quote-field"><span className="quote-label">Data de preferência <b>*</b></span><input type="date" value={customer.date} min={todayLocal()} onChange={event => setCustomer({ ...customer, date: event.target.value })} required/></label>}
            {isBooking && <label className="quote-field"><span className="quote-label">Período <em>opcional</em></span><select value={customer.period} onChange={event => setCustomer({ ...customer, period: event.target.value as Customer['period'] })}><option>Sem preferência</option><option>Manhã</option><option>Tarde</option></select></label>}
            <label className="quote-field full"><span className="quote-label">Algo mais que devemos saber? <em>opcional</em></span><textarea rows={4} maxLength={500} value={customer.notes} onChange={event => setCustomer({ ...customer, notes: event.target.value })} placeholder="Ex.: Tenho fotos do dano e posso enviar na conversa."/></label>
          </div>
          <p className="quote-assurance"><ShieldCheck size={19} aria-hidden="true"/>O pedido não é enviado automaticamente. Você confirma o envio no WhatsApp.</p>
        </section>}

        {step === 3 && <section aria-labelledby="quote-step-title">
          <div className="quote-section-heading"><p className="eyebrow">04 / REVISÃO</p><h2 id="quote-step-title">Confira antes de abrir o WhatsApp.</h2><p>O texto está pronto. Você decide se deseja enviá-lo na conversa com a Alpha.</p></div>
          <div className="quote-review-grid">
            <div className="quote-review-card"><div><h3>Serviços</h3><button type="button" onClick={() => goTo(0)}>Editar</button></div><ul>{selected.map(slug => { const service = services.find(item => item.slug === slug)!; const question = quickQuestions[slug]; const value = answers[slug]?.[question.key]; const hasValue = value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0); return <li key={slug}><strong>{service.name}</strong>{hasValue && <span>{Array.isArray(value) ? value.join(', ') : String(value)}</span>}</li>; })}</ul></div>
            <div className="quote-review-card"><div><h3>Veículo</h3><button type="button" onClick={() => goTo(1)}>Editar</button></div><p><strong>{vehicle.brand} {vehicle.model}</strong> · {vehicle.year}</p>{vehicle.type && <p>{vehicle.type}</p>}{vehicle.version && <p>Versão: {vehicle.version}</p>}{vehicle.color && <p>Cor: {vehicle.color}</p>}</div>
            <div className="quote-review-card"><div><h3>Contato</h3><button type="button" onClick={() => goTo(2)}>Editar</button></div><p><strong>{customer.name}</strong></p><p>{customer.phone}</p>{customer.city && <p>{customer.city}</p>}{isBooking && <p>Preferência: {customer.date ? customer.date.split('-').reverse().join('/') : '—'} · {customer.period}</p>}{customer.notes && <p>{customer.notes}</p>}</div>
          </div>
          <details className="quote-message"><summary>Ver mensagem completa</summary><pre>{message}</pre></details>
          <div className="quote-send"><button type="submit" className="btn btn-red"><MessageCircle size={20} aria-hidden="true"/> ABRIR WHATSAPP COM MEU PEDIDO</button><button type="button" className="quote-copy" onClick={copy}>{copied ? <CheckCheck size={18}/> : <Clipboard size={18}/>} {copied ? 'Mensagem copiada' : 'Copiar mensagem'}</button></div>
          <p className="quote-assurance"><ShieldCheck size={19} aria-hidden="true"/>Valores, disponibilidade e agendamento serão confirmados pela empresa na conversa.</p>
        </section>}

        {step < 3 && <div className="quote-actions">{step > 0 && <button type="button" className="quote-back" onClick={() => goTo((step - 1) as Step)}><ArrowLeft size={18}/> Voltar</button>}<button type="submit" className="btn btn-red">{step === 0 ? 'CONTINUAR PARA VEÍCULO' : step === 1 ? 'CONTINUAR PARA CONTATO' : 'REVISAR SOLICITAÇÃO'}<ChevronRight size={19} aria-hidden="true"/></button></div>}
      </div>
    </form>

    <aside className="quote-sidebar" aria-label="Resumo do pedido"><div className="quote-sidebar-visual"><img src="/images/farois.webp" alt="" width={520} height={350} loading="lazy"/><span>ALPHA FUMÊ E FARÓIS</span><strong>CUIDADO EM CADA DETALHE.</strong></div><div className="quote-sidebar-body"><p className="eyebrow">SEU PEDIDO</p><h2>{selected.length === 0 ? 'Comece escolhendo um serviço' : `${selected.length} ${selected.length === 1 ? 'serviço escolhido' : 'serviços escolhidos'}`}</h2>{selected.length > 0 && <ul className="quote-sidebar-services">{selected.map(slug => <li key={slug}><Check size={15}/>{services.find(service => service.slug === slug)?.name}</li>)}</ul>}{vehicle.brand && <p className="quote-sidebar-car">{vehicle.brand} {vehicle.model} {vehicle.year}</p>}<div className="quote-sidebar-rule"/><p className="quote-sidebar-how"><CalendarDays size={18}/> {isBooking ? 'A data é uma preferência. A Alpha confirma a disponibilidade no WhatsApp.' : 'Você revisa a mensagem antes de abrir o WhatsApp.'}</p></div></aside>
  </div>;
}
