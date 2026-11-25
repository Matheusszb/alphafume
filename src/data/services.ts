import type { Service } from '../types/content';

export const services: Service[] = [
  {
    slug: 'insulfilm', name: 'Aplicação de Insulfilm', kicker: 'PELÍCULAS AUTOMOTIVAS', icon: 'film',
    summary: 'Conforto térmico, privacidade e estética com a película adequada ao seu veículo.',
    description: 'A aplicação de película automotiva combina acabamento visual, controle da entrada de luz e conforto na cabine. A escolha depende do tipo de película, da transparência desejada, dos vidros do veículo e da finalidade de uso. A Alpha avalia esses fatores antes de indicar a solução.',
    image: '/images/insulfilm.webp', imageAlt: 'Veículo escuro com vidros em destaque, imagem ilustrativa',
    benefits: ['Mais conforto na cabine', 'Privacidade conforme a transparência escolhida', 'Acabamento visual uniforme', 'Proteção solar de acordo com a película'],
    process: ['Entendemos o objetivo e as áreas desejadas.', 'Avaliamos o veículo e a película existente.', 'Orientamos sobre opções e transparência compatíveis.', 'Realizamos a aplicação e informamos os cuidados posteriores.'],
    indicated: 'Para motoristas que buscam conforto, privacidade ou uma nova aparência para os vidros.',
    limitations: 'A transparência permitida depende da legislação vigente e da transmitância do conjunto vidro e película. Desempenho térmico e proteção variam conforme o produto efetivamente utilizado.',
    care: 'A orientação de limpeza e o tempo antes de movimentar os vidros devem ser confirmados após a aplicação, conforme a película escolhida.',
    faqs: [
      { question: 'Qual película escolher?', answer: 'A escolha depende de conforto térmico, privacidade, aparência e características dos vidros. Podemos orientar após conhecer o veículo.' },
      { question: 'Posso usar qualquer tonalidade?', answer: 'Não. É necessário respeitar a legislação e a transmitância luminosa do conjunto vidro e película.' }
    ],
    seoTitle: 'Aplicação de Insulfilm Automotivo | Alpha Fumê e Faróis',
    seoDescription: 'Películas automotivas para conforto, privacidade e estética. Conheça as opções e solicite uma avaliação à Alpha Fumê e Faróis.'
  },
  {
    slug: 'reparo-de-parabrisa', name: 'Reparo de Para-brisa', kicker: 'VIDROS AUTOMOTIVOS', icon: 'shield',
    summary: 'Avaliação de pequenos danos para verificar a possibilidade técnica de reparo.',
    description: 'Pequenas marcas e trincas no para-brisa devem ser examinadas antes que se agravem. O tamanho, a posição, a profundidade e o histórico do dano influenciam a possibilidade de reparo. A avaliação presencial determina a alternativa adequada.',
    image: '/images/parabrisa.webp', imageAlt: 'Detalhe de para-brisa automotivo, imagem ilustrativa',
    benefits: ['Avaliação cuidadosa do dano', 'Possibilidade de preservar o vidro quando viável', 'Orientação sobre próximos passos'],
    process: ['Recebemos a descrição e fotos do dano.', 'Analisamos o para-brisa presencialmente.', 'Explicamos se o reparo é tecnicamente possível.', 'Executamos o serviço adequado após sua aprovação.'],
    indicated: 'Para pequenos danos localizados que ainda precisam de avaliação técnica.',
    limitations: 'Nem toda trinca pode ser reparada. O formulário e as fotografias não substituem a inspeção presencial.',
    care: 'Evite pressionar a área danificada e procure uma avaliação assim que possível.',
    faqs: [{ question: 'Toda trinca pode ser reparada?', answer: 'Não. A viabilidade depende das características e da localização do dano, avaliadas tecnicamente.' }],
    seoTitle: 'Reparo de Para-brisa | Alpha Fumê e Faróis', seoDescription: 'Avaliação e reparo de pequenos danos em para-brisas quando tecnicamente possível. Solicite orientação pelo WhatsApp.'
  },
  {
    slug: 'instalacao-de-parabrisa', name: 'Remoção e Instalação de Para-brisa', kicker: 'VIDROS AUTOMOTIVOS', icon: 'car',
    summary: 'Remoção e instalação com atenção ao encaixe, acabamento e vedação.',
    description: 'A substituição ou reinstalação de um para-brisa exige atenção ao vidro correto, à preparação da superfície e aos sistemas presentes no veículo. A Alpha avalia as condições do conjunto para orientar o serviço necessário.',
    image: '/images/instalacao.webp', imageAlt: 'Para-brisa de automóvel em oficina, imagem ilustrativa',
    benefits: ['Atenção ao encaixe e à vedação', 'Avaliação dos componentes presentes', 'Orientação conforme o modelo do veículo'],
    process: ['Identificamos veículo e tipo de atendimento.', 'Verificamos vidro, sensores e condições de instalação.', 'Explicamos o serviço recomendado.', 'Realizamos a remoção ou instalação após alinhamento.'],
    indicated: 'Para veículos com vidro danificado, necessidade de substituição ou suspeita de infiltração.',
    limitations: 'Veículos com sistemas de assistência à condução podem exigir avaliação e calibração específica após a substituição. A disponibilidade do vidro precisa ser confirmada.',
    care: 'Siga as orientações recebidas após o serviço sobre uso do veículo e cuidados com a vedação.',
    faqs: [{ question: 'Sensores interferem na troca?', answer: 'Câmeras e sensores precisam ser identificados. Alguns sistemas podem necessitar de avaliação e calibração adequada.' }],
    seoTitle: 'Instalação de Para-brisa | Alpha Fumê e Faróis', seoDescription: 'Remoção, instalação e avaliação de para-brisas automotivos com atenção a encaixe, vedação e sensores.'
  },
  {
    slug: 'ppf', name: 'Aplicação de PPF', kicker: 'PROTEÇÃO DE PINTURA', icon: 'sparkles',
    summary: 'Proteção de áreas expostas da pintura com acabamento alinhado ao veículo.',
    description: 'PPF é uma película de proteção aplicada sobre regiões selecionadas da carroceria. Ela ajuda a preservar a pintura contra marcas superficiais e desgaste cotidiano. O projeto pode abranger desde pontos específicos até áreas mais amplas, conforme a necessidade e as condições da pintura.',
    image: '/images/ppf.webp', imageAlt: 'Carroceria de veículo esportivo em destaque, imagem ilustrativa',
    benefits: ['Ajuda a preservar áreas expostas', 'Proteção direcionada por região', 'Acabamento visual discreto'],
    process: ['Definimos as áreas de interesse.', 'Avaliamos as condições da pintura.', 'Orientamos sobre acabamento e cobertura.', 'Aplicamos a película com atenção às bordas.'],
    indicated: 'Para quem deseja cuidar de regiões mais suscetíveis a marcas de uso.',
    limitations: 'PPF não elimina todos os riscos de dano e seu desempenho depende do produto e da situação de uso.',
    care: 'As orientações de limpeza e manutenção variam conforme a película utilizada e serão informadas após a aplicação.',
    faqs: [{ question: 'PPF protege contra qualquer risco?', answer: 'Não. Ele ajuda na proteção contra desgastes e marcas superficiais, mas não oferece proteção absoluta.' }],
    seoTitle: 'Aplicação de PPF Automotivo | Alpha Fumê e Faróis', seoDescription: 'Película de proteção de pintura em áreas selecionadas do veículo. Saiba como funciona e solicite orientação.'
  },
  {
    slug: 'restauracao-de-farois', name: 'Restauração de Faróis', kicker: 'ILUMINAÇÃO AUTOMOTIVA', icon: 'sun',
    summary: 'Tratamento de lentes opacas ou amareladas para recuperar a aparência.',
    description: 'A exposição e o uso podem deixar as lentes dos faróis opacas, amareladas ou desgastadas. A restauração trata a superfície externa, buscando recuperar transparência e melhorar o aspecto do conjunto. A condição da lente deve ser avaliada antes do procedimento.',
    image: '/images/farois.webp', imageAlt: 'Farol aceso de automóvel escuro, imagem ilustrativa',
    benefits: ['Melhora da aparência', 'Tratamento de opacidade superficial', 'Avaliação do estado das lentes'],
    process: ['Verificamos as lentes e os dois conjuntos.', 'Identificamos desgaste externo e possíveis danos internos.', 'Indicamos o tratamento compatível.', 'Orientamos sobre conservação após o serviço.'],
    indicated: 'Para faróis com amarelamento, opacidade ou desgaste superficial.',
    limitations: 'Trincas, danos internos e falhas de iluminação podem exigir outros serviços. O resultado depende da condição do farol.',
    care: 'Evite produtos abrasivos sem orientação e siga as recomendações de conservação recebidas.',
    faqs: [{ question: 'Farol amarelado pode ser recuperado?', answer: 'Muitos casos permitem tratamento, mas é preciso avaliar a condição da lente e eventuais danos internos.' }],
    seoTitle: 'Restauração de Faróis | Alpha Fumê e Faróis', seoDescription: 'Tratamento de faróis amarelados e opacos para recuperar transparência e aparência. Solicite avaliação.'
  },
  {
    slug: 'abertura-de-farois', name: 'Abertura de Faróis', kicker: 'ILUMINAÇÃO AUTOMOTIVA', icon: 'scan',
    summary: 'Abertura técnica do conjunto óptico para avaliação dos componentes internos.',
    description: 'Umidade, infiltração ou falhas podem exigir acesso ao interior do conjunto óptico. A abertura permite examinar componentes e condições de vedação conforme o modelo do farol. O serviço aplicável é definido somente após a avaliação.',
    image: '/images/abertura.webp', imageAlt: 'Conjunto óptico automotivo em detalhe, imagem ilustrativa',
    benefits: ['Acesso técnico para avaliação interna', 'Investigação de umidade e vedação', 'Orientação específica para o conjunto'],
    process: ['Identificamos o modelo e o problema relatado.', 'Avaliamos o conjunto externamente.', 'Explicamos a viabilidade da abertura.', 'Realizamos o procedimento compatível após aprovação.'],
    indicated: 'Para conjuntos ópticos que precisam de avaliação interna por umidade, infiltração ou falha.',
    limitations: 'A abertura e eventuais reparos dependem da construção e do estado do farol. Nenhuma modificação específica é garantida sem inspeção.',
    care: 'Relate reparos anteriores e envie fotos para ajudar na avaliação inicial.',
    faqs: [{ question: 'O farol pode ser aberto em qualquer caso?', answer: 'A viabilidade depende da construção e do estado do conjunto. É necessária avaliação.' }],
    seoTitle: 'Abertura de Faróis | Alpha Fumê e Faróis', seoDescription: 'Avaliação técnica e abertura de conjuntos ópticos automotivos para investigar umidade, vedação e componentes internos.'
  }
];

export const serviceBySlug = (slug: string) => services.find((service) => service.slug === slug);
