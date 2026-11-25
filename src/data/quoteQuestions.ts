export type QuickQuestion = { key: string; label: string; prompt: string; options: string[]; multi?: boolean };

export const quickQuestions: Record<string, QuickQuestion> = {
  insulfilm: { key: 'tipo_pelicula', label: 'Tipo de película', prompt: 'Já tem uma película em mente?', options: ['Convencional', 'Carbono', 'Nanocerâmica', 'Não sei qual escolher'] },
  'reparo-de-parabrisa': { key: 'tipo_dano', label: 'Tipo de dano', prompt: 'O que aconteceu com o vidro?', options: ['Marca de pedra', 'Trinca', 'Pequena rachadura', 'Não sei identificar'] },
  'instalacao-de-parabrisa': { key: 'tipo_servico', label: 'Atendimento desejado', prompt: 'Qual atendimento você precisa?', options: ['Remoção e instalação', 'Substituição do para-brisa', 'Preciso de orientação'] },
  ppf: { key: 'areas', label: 'Áreas de aplicação', prompt: 'Quais áreas quer proteger?', options: ['Capô', 'Para-choque dianteiro', 'Faróis', 'Veículo completo'], multi: true },
  'restauracao-de-farois': { key: 'problemas', label: 'Condição dos faróis', prompt: 'Como estão os faróis?', options: ['Amarelamento', 'Opacidade', 'Riscos', 'Perda de transparência'], multi: true },
  'abertura-de-farois': { key: 'motivo', label: 'Motivo da avaliação', prompt: 'Qual é o motivo da avaliação?', options: ['Umidade interna', 'Limpeza interna', 'Falha de iluminação', 'Outro'] }
};
