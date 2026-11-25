'use client';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, CheckCheck, Clipboard, CarFront, Car, Truck, BusFront, CalendarDays, MessageCircle, ShieldCheck } from 'lucide-react';
import { services } from '../../data/services';
import { serviceForms, questionVisible, type Question } from '../../data/formQuestions';
import { vehicleBrands, vehicleTypes } from '../../data/vehicles';
import { buildQuoteMessage, customerSchema, vehicleSchema, validateStepQuestions, whatsappUrl, type Customer, type Vehicle } from '../../lib/quote';
import { track } from '../../lib/analytics';

const emptyVehicle: Vehicle = { type: '', brand: '', model: '', year: '', version: '', color: '' };
const emptyCustomer: Customer = { name: '', phone: '', city: '', neighborhood: '', date: '', period: 'Sem preferência', notes: '' };
const todayLocal = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; };
type Stage = { kind: 'services' | 'vehicle' | 'questions' | 'customer' | 'review'; slug?: string; step?: number };

export default function DynamicServiceForm({ mode = 'orcamento' }: { mode?: 'orcamento' | 'agendamento' }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle>(emptyVehicle);
  const [brandChoice, setBrandChoice] = useState('');
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [answers, setAnswers] = useState<Record<string, Record<string, unknown>>>({});
  const [position, setPosition] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [requestMode, setRequestMode] = useState<'orcamento' | 'agendamento'>(mode);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('servico');
    let saved: string[] = [];
    try { const parsed = JSON.parse(sessionStorage.getItem('alpha_selected_services') || '[]'); if (Array.isArray(parsed)) saved = parsed.filter((item): item is string => typeof item === 'string' && serviceForms.some((form) => form.slug === item)); } catch { /* Ignore stale browser data. */ }
    if (slug && serviceForms.some((form) => form.slug === slug)) saved = Array.from(new Set([...saved, slug]));
    setSelected(saved);
    track('form_start', { mode });
    setReady(true);
  }, [mode]);

  useEffect(() => { if (ready) sessionStorage.setItem('alpha_selected_services', JSON.stringify(selected)); }, [ready, selected]);

  const stages: Stage[] = useMemo(() => [
    { kind: 'services' }, { kind: 'vehicle' },
    ...selected.flatMap((slug) => (serviceForms.find((form) => form.slug === slug)?.steps || []).map((_, step) => ({ kind: 'questions' as const, slug, step }))),
    { kind: 'customer' }, { kind: 'review' }
  ], [selected]);
  const stage = stages[Math.min(position, stages.length - 1)];
  const progress = Math.round(((position + 1) / stages.length) * 100);
  const quote = { mode: requestMode, customer, vehicle, services: selected, answers };
  const message = buildQuoteMessage(quote);

  function updateQuestion(slug: string, key: string, value: unknown) {
    setAnswers((current) => ({ ...current, [slug]: { ...(current[slug] || {}), [key]: value } }));
    setErrors([]);
  }
  function toggleService(slug: string) {
    setSelected((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]);
    setErrors([]);
    track('select_service', { service: slug });
  }
  function validate(): string[] {
    if (stage.kind === 'services') return selected.length ? [] : ['Selecione pelo menos um serviço.'];
    if (stage.kind === 'vehicle') {
      const result = vehicleSchema.safeParse(vehicle);
      return result.success ? [] : result.error.issues.map((issue) => issue.message);
    }
    if (stage.kind === 'questions' && stage.slug !== undefined && stage.step !== undefined) return validateStepQuestions(stage.slug, stage.step, answers[stage.slug] || {});
    if (stage.kind === 'customer') {
      const result = customerSchema.safeParse(customer);
      const issues = result.success ? [] : result.error.issues.map((issue) => issue.message);
      if (requestMode === 'agendamento' && !customer.date) issues.push('Escolha uma data de preferência para agendar.');
      if (customer.date && customer.date < todayLocal()) issues.push('Escolha uma data atual ou futura.');
      return issues;
    }
    return [];
  }
  function next() {
    const issues = validate();
    if (issues.length) { setErrors(issues); return; }
    setErrors([]);
    setPosition((current) => Math.min(current + 1, stages.length - 1));
    track(stage.kind === 'customer' ? 'form_review' : 'form_step', { step: position + 1 });
    document.getElementById('form-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function back() { setErrors([]); setPosition((current) => Math.max(0, current - 1)); }
  function jump(kind: Stage['kind'], slug?: string) {
    const index = stages.findIndex((item) => item.kind === kind && (kind !== 'questions' || item.slug === slug));
    if (index >= 0) { setErrors([]); setPosition(index); }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(message); setCopied(true); window.setTimeout(() => setCopied(false), 2500); }
    catch { setErrors(['Não foi possível copiar. Selecione o texto da mensagem para copiar manualmente.']); }
  }
  function send() {
    track(requestMode === 'agendamento' ? 'booking_whatsapp' : 'quote_whatsapp', { service_count: selected.length });
    track('whatsapp_click', { source: 'form' });
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  }

  return <div id="form-top" className="form-shell" inert={!ready}>
    <div className="form-topline"><span>CONFIGURADOR ALPHA</span><span>ETAPA {position + 1} / {stages.length}</span></div>
    <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do formulário"><span style={{ width: `${progress}%` }} /></div>
    {stage.kind === 'services' && <section aria-labelledby="stage-title">
      <p className="eyebrow">01 / SUA NECESSIDADE</p><h2 id="stage-title">O que vamos cuidar?</h2><p className="muted">Escolha um ou mais serviços. Cada um terá perguntas próprias.</p>
      <div className="choice-grid service-choices">{services.map((service) => <button type="button" key={service.slug} className={`choice-card ${selected.includes(service.slug) ? 'selected' : ''}`} aria-pressed={selected.includes(service.slug)} onClick={() => toggleService(service.slug)}><span className="choice-check">{selected.includes(service.slug) ? <Check size={17} /> : null}</span><strong>{service.name}</strong><small>{service.summary}</small></button>)}</div>
    </section>}
    {stage.kind === 'vehicle' && <section aria-labelledby="stage-title">
      <p className="eyebrow">02 / SEU VEÍCULO</p><h2 id="stage-title">Conte sobre o carro.</h2><p className="muted">Estes dados valem para todos os serviços selecionados.</p>
      <label className="field-label">Categoria do veículo <span>*</span></label><div className="choice-grid vehicle-choices">{vehicleTypes.map((type) => { const Icon = type === 'Caminhão' || type === 'Picape' || type === 'Caminhonete' ? Truck : type === 'Ônibus' || type === 'Van ou utilitário' ? BusFront : type === 'Coupé' || type === 'Sedan' ? Car : CarFront; return <button type="button" key={type} className={`choice-card vehicle-choice ${vehicle.type === type ? 'selected' : ''}`} aria-pressed={vehicle.type === type} onClick={() => setVehicle({ ...vehicle, type })}><Icon size={24} aria-hidden="true"/><strong>{type}</strong></button>; })}</div>
      <div className="field-grid"><label className="field">Marca <span>*</span><select value={brandChoice} onChange={(event) => { setBrandChoice(event.target.value); setVehicle({ ...vehicle, brand: event.target.value === 'Outra' ? '' : event.target.value }); }}><option value="">Selecione</option>{vehicleBrands.map((brand) => <option key={brand}>{brand}</option>)}</select></label>{brandChoice === 'Outra' && <label className="field">Qual marca? <span>*</span><input value={vehicle.brand} onChange={(event) => setVehicle({ ...vehicle, brand: event.target.value })} placeholder="Digite a marca" /></label>}<label className="field">Modelo <span>*</span><input value={vehicle.model} onChange={(event) => setVehicle({ ...vehicle, model: event.target.value })} placeholder="Ex.: Corolla" /></label><label className="field">Ano <span>*</span><input inputMode="numeric" maxLength={4} value={vehicle.year} onChange={(event) => setVehicle({ ...vehicle, year: event.target.value.replace(/\D/g, '') })} placeholder="Ex.: 2022" /></label><label className="field">Versão <small>opcional</small><input value={vehicle.version} onChange={(event) => setVehicle({ ...vehicle, version: event.target.value })} placeholder="Ex.: XEi" /></label><label className="field">Cor <small>opcional</small><input value={vehicle.color} onChange={(event) => setVehicle({ ...vehicle, color: event.target.value })} placeholder="Ex.: Preto" /></label></div>
    </section>}
    {stage.kind === 'questions' && stage.slug && stage.step !== undefined && (() => { const form = serviceForms.find((item) => item.slug === stage.slug)!; const step = form.steps[stage.step!]; const current = answers[form.slug] || {}; return <section aria-labelledby="stage-title"><p className="eyebrow">{form.title.toUpperCase()} / {stage.step! + 1} DE {form.steps.length}</p><h2 id="stage-title">{step.title}</h2>{step.description && <p className="muted">{step.description}</p>}<div className="question-stack">{step.questions.filter((question) => questionVisible(question, current)).map((question) => <QuestionField key={question.key} question={question} value={current[question.key]} onChange={(value) => updateQuestion(form.slug, question.key, value)} />)}</div>{form.note && <p className="form-note"><ShieldCheck size={18} aria-hidden="true" />{form.note}</p>}</section>; })()}
    {stage.kind === 'customer' && <section aria-labelledby="stage-title"><p className="eyebrow">ÚLTIMO PASSO / CONTATO</p><h2 id="stage-title">Como podemos falar com você?</h2><p className="muted">Seus dados entram somente na mensagem que você poderá enviar pelo WhatsApp.</p><div className="choice-grid mode-choices"><button type="button" className={`choice-card ${requestMode === 'orcamento' ? 'selected' : ''}`} onClick={() => setRequestMode('orcamento')} aria-pressed={requestMode === 'orcamento'}><MessageCircle size={22}/><strong>Solicitar orçamento</strong></button><button type="button" className={`choice-card ${requestMode === 'agendamento' ? 'selected' : ''}`} onClick={() => setRequestMode('agendamento')} aria-pressed={requestMode === 'agendamento'}><CalendarDays size={22}/><strong>Solicitar agendamento</strong></button></div><div className="field-grid"><label className="field">Nome completo <span>*</span><input autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} placeholder="Seu nome" /></label><label className="field">WhatsApp com DDD <span>*</span><input type="tel" autoComplete="tel" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: formatPhone(event.target.value) })} placeholder="(79) 99999-9999" /></label><label className="field">Cidade <span>*</span><input autoComplete="address-level2" value={customer.city} onChange={(event) => setCustomer({ ...customer, city: event.target.value })} placeholder="Sua cidade" /></label><label className="field">Bairro <small>opcional</small><input value={customer.neighborhood} onChange={(event) => setCustomer({ ...customer, neighborhood: event.target.value })} placeholder="Seu bairro" /></label><label className="field">Data de preferência {requestMode === 'agendamento' ? <span>*</span> : <small>opcional</small>}<input type="date" value={customer.date} min={todayLocal()} onChange={(event) => setCustomer({ ...customer, date: event.target.value })} /></label><label className="field">Período de preferência<select value={customer.period} onChange={(event) => setCustomer({ ...customer, period: event.target.value as Customer['period'] })}><option>Sem preferência</option><option>Manhã</option><option>Tarde</option></select></label><label className="field full">Observações gerais <small>opcional</small><textarea rows={4} maxLength={500} value={customer.notes} onChange={(event) => setCustomer({ ...customer, notes: event.target.value })} placeholder="Algo mais que devemos saber?" /></label></div><p className="form-note"><ShieldCheck size={18} aria-hidden="true"/>O envio é feito pelo seu WhatsApp. A Alpha só receberá a mensagem se você confirmar o envio na conversa.</p></section>}
    {stage.kind === 'review' && <section aria-labelledby="stage-title"><p className="eyebrow">REVISÃO FINAL</p><h2 id="stage-title">Tudo certo?</h2><p className="muted">Confira os detalhes. O WhatsApp abrirá com a mensagem pronta; confirme o envio por lá.</p><div className="review-grid"><ReviewBlock title="Serviços" onEdit={() => jump('services')}>{selected.map((slug) => <p key={slug}>{serviceForms.find((form) => form.slug === slug)?.title}</p>)}</ReviewBlock><ReviewBlock title="Veículo" onEdit={() => jump('vehicle')}><p>{vehicle.brand} {vehicle.model} · {vehicle.year}</p><p>{vehicle.type}{vehicle.version ? ` · ${vehicle.version}` : ''}{vehicle.color ? ` · ${vehicle.color}` : ''}</p></ReviewBlock>{selected.map((slug) => <ReviewBlock key={slug} title={serviceForms.find((form) => form.slug === slug)?.title || slug} onEdit={() => jump('questions', slug)}>{serviceForms.find((form) => form.slug === slug)?.steps.flatMap((step) => step.questions).filter((question) => questionVisible(question, answers[slug] || {}) && answers[slug]?.[question.key]).map((question) => <p key={question.key}><strong>{question.label}:</strong> {String(Array.isArray(answers[slug][question.key]) ? (answers[slug][question.key] as string[]).join(', ') : answers[slug][question.key])}</p>)}</ReviewBlock>)}<ReviewBlock title="Contato e preferência" onEdit={() => jump('customer')}><p>{customer.name} · {customer.phone}</p><p>{customer.city}{customer.neighborhood ? ` · ${customer.neighborhood}` : ''}</p><p>{requestMode === 'agendamento' ? 'Agendamento' : 'Orçamento'}{customer.date ? ` · ${customer.date.split('-').reverse().join('/')}` : ''} · {customer.period}</p>{customer.notes && <p>{customer.notes}</p>}</ReviewBlock></div><details className="message-preview"><summary>Ver mensagem completa</summary><pre>{message}</pre></details><div className="review-actions"><button type="button" className="btn btn-red" onClick={send}><MessageCircle size={19}/> ENVIAR SOLICITAÇÃO PELO WHATSAPP</button><button type="button" className="btn btn-outline" onClick={copy}>{copied ? <CheckCheck size={18}/> : <Clipboard size={18}/>} {copied ? 'Mensagem copiada' : 'Copiar mensagem'}</button></div><p className="small-note">Valores, disponibilidade e agendamento serão confirmados pela empresa na conversa.</p></section>}
    {errors.length > 0 && <div className="form-errors" role="alert">{errors.map((error) => <p key={error}>{error}</p>)}</div>}
    <div className="form-nav">{position > 0 && <button type="button" className="btn btn-ghost" onClick={back}><ArrowLeft size={18}/> Voltar</button>}{stage.kind !== 'review' && <button type="button" className="btn btn-red" onClick={next}>Continuar <span aria-hidden="true">›</span></button>}</div>
  </div>;
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, digits.length > 10 ? 7 : 6)}-${digits.slice(digits.length > 10 ? 7 : 6)}`;
}

function QuestionField({ question, value, onChange }: { question: Question; value: unknown; onChange: (value: unknown) => void }) {
  const selected = Array.isArray(value) ? value : [];
  function choose(option: string) {
    if (question.type !== 'multi') { onChange(option); return; }
    if (question.key === 'areas' && option === 'Veículo completo') { onChange(selected.includes(option) ? [] : [option]); return; }
    const next = selected.includes(option) ? selected.filter((item) => item !== option) : [...selected.filter((item) => item !== 'Veículo completo'), option];
    onChange(next);
  }
  return <div className="question"><label className="field-label" htmlFor={`q-${question.key}`}>{question.label} {question.required && <span>*</span>}</label>{question.help && <p className="muted">{question.help}</p>}
    {['single', 'multi', 'cards'].includes(question.type) && <div className={`choice-grid ${question.type === 'multi' ? 'multi-choices' : ''}`}>{question.options?.map((option) => <button type="button" key={option} className={`choice-card compact ${question.type === 'multi' ? selected.includes(option) : value === option ? 'selected' : ''}`} aria-pressed={question.type === 'multi' ? selected.includes(option) : value === option} onClick={() => choose(option)}><span className="choice-check">{(question.type === 'multi' ? selected.includes(option) : value === option) && <Check size={15}/>}</span>{question.key === 'transparencia' && <span className={`shade-chip shade-${option.replace(/\D/g, '') || 'clear'}`} aria-hidden="true"/>}<strong>{option}</strong></button>)}</div>}
    {question.type === 'select' && <select id={`q-${question.key}`} value={String(value || '')} onChange={(event) => onChange(event.target.value)}><option value="">Selecione</option>{question.options?.map((option) => <option key={option}>{option}</option>)}</select>}
    {['text', 'number', 'date'].includes(question.type) && <input id={`q-${question.key}`} type={question.type === 'text' ? 'text' : question.type} maxLength={question.type === 'text' ? 120 : undefined} value={String(value || '')} onChange={(event) => onChange(event.target.value)} placeholder={question.placeholder} />}
    {question.type === 'textarea' && <textarea id={`q-${question.key}`} rows={3} maxLength={500} value={String(value || '')} onChange={(event) => onChange(event.target.value)} placeholder={question.placeholder} />}
  </div>;
}
function ReviewBlock({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit: () => void }) { return <div className="review-block"><div><h3>{title}</h3><button type="button" onClick={onEdit}>Editar</button></div>{children}</div>; }
