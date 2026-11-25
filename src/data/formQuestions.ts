export type QuestionType = 'single' | 'multi' | 'text' | 'textarea' | 'number' | 'date' | 'select' | 'cards' | 'info';
export type Condition = { key: string; equals?: string; includes?: string; notEquals?: string };
export type Question = { key: string; label: string; type: QuestionType; options?: string[]; required?: boolean; help?: string; condition?: Condition; placeholder?: string };
export type QuestionStep = { title: string; description?: string; questions: Question[] };
export type ServiceForm = { slug: string; title: string; emoji: string; steps: QuestionStep[]; note?: string };
const yesNo = ['Sim', 'Não', 'Não sei'];
const q = (key: string, label: string, options: string[], required = false, type: QuestionType = 'single'): Question => ({ key, label, options, required, type });
const yn = (key: string, label: string, condition?: Condition): Question => ({ ...q(key, label, yesNo), condition });
const notes: Question = { key: 'observacoes', label: 'Observações adicionais', type: 'textarea', placeholder: 'Conte o que mais devemos saber' };

export const serviceForms: ServiceForm[] = [
  { slug: 'insulfilm', title: 'Aplicação de Insulfilm', emoji: '🎞️', note: 'A transparência deverá respeitar a legislação vigente e a transmitância luminosa do conjunto vidro e película.', steps: [
    { title: 'Tipo de película', questions: [q('tipo_pelicula', 'Qual tipo de película interessa?', ['Convencional', 'Carbono', 'Nanocerâmica', 'Proteção térmica', 'Segurança', 'Transparente', 'Não sei qual escolher'], true, 'cards')] },
    { title: 'Transparência', questions: [q('transparencia', 'Transparência desejada', ['G5', 'G20', 'G35', 'G50', 'G70', 'Transparente', 'Preciso de orientação'], true, 'cards')] },
    { title: 'Área de aplicação', questions: [q('areas', 'Onde deseja aplicar?', ['Veículo completo', 'Vidros laterais dianteiros', 'Vidros laterais traseiros', 'Vidro traseiro', 'Para-brisa', 'Teto solar', 'Área específica'], true, 'multi'), { key: 'area_especifica', label: 'Descreva a área', type: 'text', required: true, condition: { key: 'areas', includes: 'Área específica' } }] },
    { title: 'Película atual', questions: [q('pelicula_antiga', 'Já possui película?', yesNo, true), yn('remover_antiga', 'Deseja remover a película antiga?', { key: 'pelicula_antiga', equals: 'Sim' }), yn('bolhas', 'Apresenta bolhas?', { key: 'pelicula_antiga', equals: 'Sim' }), yn('desbotada', 'Está desbotada?', { key: 'pelicula_antiga', equals: 'Sim' }), yn('descascando', 'Está descascando?', { key: 'pelicula_antiga', equals: 'Sim' }), yn('visibilidade', 'Dificulta a visibilidade?', { key: 'pelicula_antiga', equals: 'Sim' })] },
    { title: 'Seu objetivo', questions: [q('objetivos', 'O que você busca?', ['Redução de calor', 'Privacidade', 'Proteção solar', 'Estética', 'Substituição de película antiga', 'Segurança', 'Outros'], true, 'multi'), { key: 'outro_objetivo', label: 'Descreva seu objetivo', type: 'text', required: true, condition: { key: 'objetivos', includes: 'Outros' } }, notes] }
  ] },
  { slug: 'reparo-de-parabrisa', title: 'Reparo de Para-brisa', emoji: '🛡️', note: 'As respostas não substituem a avaliação técnica. Envie fotografias do dano na conversa do WhatsApp.', steps: [
    { title: 'O dano', questions: [q('tipo_dano', 'Qual é o tipo de dano?', ['Marca de pedra', 'Trinca', 'Pequena rachadura', 'Dano circular', 'Outro', 'Não sei identificar'], true), { key: 'outro_dano', label: 'Descreva o dano', type: 'text', required: true, condition: { key: 'tipo_dano', equals: 'Outro' } }, q('tamanho', 'Tamanho aproximado', ['Até 1 cm', 'Entre 1 e 3 cm', 'Entre 3 e 5 cm', 'Acima de 5 cm', 'Não sei informar'], true), q('local', 'Onde está o dano?', ['Lado do motorista', 'Lado do passageiro', 'Região central', 'Extremidade do vidro', 'Outro'], true)] },
    { title: 'Detalhes', questions: [yn('varios_pontos', 'Há mais de um ponto danificado?'), yn('aumentando', 'O dano está aumentando?'), { key: 'quando', label: 'Há quanto tempo ocorreu?', type: 'text' }, yn('reparo_anterior', 'Já foi reparado?'), yn('prejudica_visibilidade', 'Prejudica a visibilidade?'), notes] }
  ] },
  { slug: 'instalacao-de-parabrisa', title: 'Remoção e Instalação de Para-brisa', emoji: '🚗', note: 'Sistemas de assistência à condução podem requerer avaliação e calibração após a substituição do vidro.', steps: [
    { title: 'Atendimento', questions: [q('tipo_servico', 'Qual serviço deseja?', ['Apenas remoção', 'Apenas instalação', 'Remoção e instalação', 'Substituição do para-brisa', 'Avaliação de infiltração', 'Preciso de orientação'], true), yn('possui_vidro', 'Já possui o vidro novo?', { key: 'tipo_servico', notEquals: 'Apenas remoção' })] },
    { title: 'Condição do vidro', questions: [yn('trincado', 'O vidro atual está trincado?'), yn('quebrado', 'Está quebrado?'), yn('infiltracao', 'Apresenta infiltração?'), yn('substituido', 'Já foi substituído antes?')] },
    { title: 'Tecnologia do veículo', questions: [yn('camera', 'Possui câmera de assistência à condução?'), yn('sensor_chuva', 'Possui sensor de chuva?'), yn('sensor_luz', 'Possui sensor de luminosidade?'), yn('outros_sensores', 'Possui outros sensores?'), notes] }
  ] },
  { slug: 'ppf', title: 'Aplicação de PPF', emoji: '✨', note: 'O PPF ajuda na proteção contra desgastes superficiais; não oferece proteção absoluta.', steps: [
    { title: 'Cobertura', questions: [q('areas', 'Quais áreas deseja proteger?', ['Capô', 'Para-choque dianteiro', 'Para-choque traseiro', 'Faróis', 'Retrovisores', 'Maçanetas', 'Soleiras', 'Portas', 'Para-lamas', 'Veículo completo', 'Área personalizada'], true, 'multi'), { key: 'area_personalizada', label: 'Descreva a área', type: 'text', required: true, condition: { key: 'areas', includes: 'Área personalizada' } }, q('acabamento', 'Qual acabamento deseja?', ['Transparente brilhante', 'Fosco', 'Preciso de orientação'], true)] },
    { title: 'Condição da pintura', questions: [yn('ppf_antigo', 'O veículo possui PPF antigo?'), yn('remover_ppf', 'Deseja remover o PPF antigo?', { key: 'ppf_antigo', equals: 'Sim' }), yn('riscos', 'A pintura apresenta riscos?'), yn('repintura', 'O veículo passou por repintura?'), yn('veiculo_novo', 'O veículo é novo?'), { key: 'objetivo', label: 'Qual o principal objetivo da proteção?', type: 'text' }, notes] }
  ] },
  { slug: 'restauracao-de-farois', title: 'Restauração de Faróis', emoji: '💡', note: 'Envie fotografias dos faróis diretamente no WhatsApp para ajudar na avaliação inicial.', steps: [
    { title: 'Estado dos faróis', questions: [q('problemas', 'Quais problemas apresentam?', ['Amarelamento', 'Opacidade', 'Riscos', 'Desgaste externo', 'Perda de transparência', 'Outro'], true, 'multi'), { key: 'outro_problema', label: 'Descreva o problema', type: 'text', required: true, condition: { key: 'problemas', includes: 'Outro' } }, q('lado', 'Qual farol precisa de atendimento?', ['Esquerdo', 'Direito', 'Ambos'], true)] },
    { title: 'Histórico', questions: [yn('restaurados', 'Já foram restaurados?'), yn('umidade', 'Existe umidade interna?'), yn('trincas', 'Apresentam trincas?'), yn('iluminacao', 'A iluminação está prejudicada?'), yn('protecao', 'Deseja avaliar proteção após a restauração?'), notes] }
  ] },
  { slug: 'abertura-de-farois', title: 'Abertura de Faróis', emoji: '🔦', note: 'A viabilidade da abertura e de eventuais reparos depende de avaliação técnica do conjunto.', steps: [
    { title: 'O que acontece?', questions: [q('motivo', 'Qual o motivo da abertura?', ['Limpeza interna', 'Umidade interna', 'Infiltração', 'Avaliação de componentes', 'Problema de vedação', 'Falha de iluminação', 'Outro'], true), { key: 'outro_motivo', label: 'Descreva o motivo', type: 'text', required: true, condition: { key: 'motivo', equals: 'Outro' } }, q('lado', 'Qual farol?', ['Esquerdo', 'Direito', 'Ambos'], true), q('iluminacao', 'Tipo de iluminação', ['Halógena', 'LED', 'Xenon', 'Não sei'], true)] },
    { title: 'Histórico', questions: [yn('aberto_antes', 'Já foi aberto antes?'), yn('umidade', 'Apresenta umidade interna?'), yn('falha', 'Apresenta falhas de iluminação?'), yn('lente_danificada', 'Possui danos na lente?'), yn('reparo_anterior', 'Já passou por reparo?'), notes] }
  ] }
];

export const serviceFormBySlug = (slug: string) => serviceForms.find((form) => form.slug === slug);
export function questionVisible(question: Question, answers: Record<string, unknown>): boolean {
  if (!question.condition) return true;
  const value = answers[question.condition.key];
  if (question.condition.equals !== undefined) return value === question.condition.equals;
  if (question.condition.notEquals !== undefined) return value !== question.condition.notEquals;
  if (question.condition.includes !== undefined) return Array.isArray(value) && value.includes(question.condition.includes);
  return true;
}
