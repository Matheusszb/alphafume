# Alpha Fumê e Faróis

Site institucional e comercial estático para proteção, estética, vidros e iluminação automotiva. Orçamentos e preferências de agendamento são montados no navegador e enviados **somente quando o visitante confirma a mensagem no WhatsApp**. Não há banco de dados, login, painel administrativo ou backend de solicitações.

## Tecnologias

Astro 7 para páginas estáticas, TypeScript, React em ilhas interativas (configurador, catálogo com produtos e galeria com fotos), Tailwind CSS 4, CSS autoral, Lucide Icons, Zod, Vitest e Playwright. As imagens ilustrativas geradas para este projeto estão em `public/images` no formato WebP. As fontes locais e suas licenças OFL estão em `public/fonts`. A marca em texto exibida provisoriamente não substitui a logo original da empresa.

## Instalação e comandos

Requer Node.js 22 ou superior.

```bash
npm install
npm run dev
npm run check
npm run lint
npm run test
npx playwright install chromium
npm run test:e2e
npm run build
npm run preview
```

O build estático fica em `dist/`. Não é necessário servidor Node em produção. O projeto foi verificado no Windows usando `npm.cmd` porque a política local do PowerShell bloqueava o script `npm.ps1`.

## Estrutura

| Pasta ou arquivo | Conteúdo |
| --- | --- |
| `src/config/business.ts` | Nome, WhatsApp, Instagram, logo e informações comerciais confirmadas |
| `src/config/tracking.ts` | IDs opcionais de analytics e verificação |
| `src/config/seo.ts` | Imagem padrão, idioma e controle de indexação |
| `src/data/services.ts` | Seis serviços, textos, benefícios, limitações, imagens e SEO |
| `src/data/formQuestions.ts` | Perguntas e etapas específicas de cada serviço, condições de exibição |
| `src/data/vehicles.ts` | Categorias, marcas e opções de película |
| `src/data/products.ts` | Produtos reais e ativos; começa vazio |
| `src/data/gallery.ts` | Fotos autorizadas de trabalhos reais; começa vazio |
| `src/data/faq.ts` | Perguntas frequentes |
| `src/content/blog/*.md` | Artigos estáticos e metadados |
| `src/lib/quote.ts` | Validação, formatação da mensagem e link WhatsApp |
| `src/lib/analytics.ts` | Eventos sem dados pessoais |
| `src/pages` | Rotas, inclusive páginas dinâmicas de serviços, produtos e artigos |
| `public/_headers` | Headers de segurança e cache para Cloudflare Pages |

## Configuração antes da publicação

1. **Logo:** copie a logo original, sem alterações, para `public/images/`, por exemplo `logo-alpha.svg` ou `logo-alpha.webp`. Defina `logoPath: '/images/logo-alpha.svg'` em `src/config/business.ts`. Até isso ser feito, o cabeçalho usa apenas o nome tipográfico provisório.
2. **Domínio:** defina `PUBLIC_SITE_URL=https://dominio-confirmado.com.br` nas variáveis de build do Cloudflare. Sem essa variável, o site usa `example.com` como placeholder, publica `noindex` e bloqueia robôs em `robots.txt` para evitar indexação incorreta.
3. **Dados comerciais:** preencha apenas valores confirmados em `src/config/business.ts`: endereço, cidade, região, horários, Maps e Perfil da Empresa no Google. Dados locais estruturados só aparecem quando endereço e cidade forem informados.
4. **Textos legais:** revise e aprove `src/pages/politica-de-privacidade.astro` e `src/pages/termos-de-uso.astro`, especialmente a identidade jurídica, contato para pedidos de titulares e retenção de conversas.
5. **Conteúdo real:** cadastre produtos e fotografias autorizadas. O catálogo e a galeria mostram um estado de preparação enquanto seus arquivos de dados estiverem vazios. Nenhum produto, preço, estoque ou serviço concluído foi inventado.

Para alterar WhatsApp e Instagram, edite os valores em `src/config/business.ts`. O número do WhatsApp deve estar no formato internacional, somente com dígitos.

## Manutenção de serviços e formulários

Um serviço é cadastrado em `src/data/services.ts` com slug, nome, conteúdo, imagem, FAQ e metadados SEO. A página `/servicos/[slug]` é gerada automaticamente. Para incluir perguntas, adicione uma entrada correspondente em `src/data/formQuestions.ts`, com o mesmo slug.

Cada serviço possui `steps`, e cada etapa tem `questions`. Os campos `single`, `multi`, `cards`, `text`, `textarea`, `number`, `date` e `select` são suportados pelo componente `DynamicServiceForm`. Use `required: true` para bloquear o avanço sem resposta. Para lógica condicional, use `condition: { key: 'pelicula_antiga', equals: 'Sim' }`, `notEquals` ou `includes` (para seleção múltipla). Respostas ocultas são excluídas da mensagem do WhatsApp. Adicione testes em `tests/quote.test.ts` quando alterar regras importantes.

O visitante pode escolher vários serviços; marca, modelo, ano e dados de contato são pedidos uma vez. A mensagem pode ser copiada ou aberta no WhatsApp. Nenhuma ação confirma automaticamente orçamento ou agendamento.

## Produtos, galeria e blog

- Cadastre produtos reais em `src/data/products.ts` seguindo o tipo `Product` em `src/types/content.ts`. Somente itens com `active: true` geram páginas. A busca, os filtros, a ordenação e a lista de consulta funcionam em memória, sem estoque em tempo real.
- Adicione fotos autorizadas em `public/images/` e seus registros em `src/data/gallery.ts`. `before` e `after` opcionais ativam o comparador interativo. Não use imagens ilustrativas como registro de resultados reais.
- Crie artigos Markdown em `src/content/blog/` com título, descrição, categoria, imagem, data real de publicação, serviços relacionados e FAQ. O schema está em `src/content.config.ts`. Uma página individual é gerada para cada arquivo.
- Imagens devem ser otimizadas e ter descrição alternativa correspondente ao seu conteúdo. Os arquivos atuais são material ilustrativo local.

## SEO, rastreamento e privacidade

As páginas incluem títulos, descrições, Open Graph, Twitter Cards, canonical após configuração do domínio, sitemap, robots, breadcrumbs, JSON-LD pertinente e `llms.txt` informativo. O sitemap usa `PUBLIC_SITE_URL`; reconstrua o projeto depois de mudar o domínio. A estrutura local somente ativa dados de endereço quando confirmados.

IDs opcionais são definidos por variáveis de build listadas em `.env.example`: GA4, GTM, Meta Pixel, Google Ads e verificações do Google/Bing. Scripts de métricas só são carregados após consentimento. Os eventos cobrem visualização e seleção de serviços, avanço do formulário e cliques comerciais. Nenhum evento envia nome ou telefone e nenhum clique é tratado como compra. Parâmetros UTM são preservados na sessão do navegador quando presentes.

As respostas do formulário ficam na memória da página. A escolha sobre métricas fica no `localStorage`; a animação de entrada e a origem UTM usam `sessionStorage`. O navegador abre um link `wa.me` com a mensagem codificada; o visitante precisa confirmar o envio no WhatsApp.

## Cloudflare Pages

1. Conecte o repositório ao Cloudflare Pages.
2. Configure **Build command:** `npm run build`; **Build output directory:** `dist`; **Root directory:** raiz do repositório; **Node version:** 22 ou superior.
3. Cadastre `PUBLIC_SITE_URL` com o domínio definitivo. Cadastre IDs de rastreamento apenas se a empresa decidir usar essas ferramentas.
4. Faça o primeiro deploy e confira a página inicial, `robots.txt`, `sitemap-index.xml`, páginas de serviço, formulário e headers.
5. Em **Custom domains**, vincule o domínio confirmado e configure o DNS conforme as instruções exibidas pela Cloudflare. Aguarde o HTTPS ativo e reconstrua com a URL final, se necessário.

`public/_headers` é copiado para `dist/` e define CSP, proteção contra embedding e cache de assets. A Cloudflare Pages serve a página `404.html`. O projeto não requer `wrangler.jsonc` para Pages. Para Workers Static Assets, configure `dist` como diretório de assets no Wrangler e mantenha o mesmo comando de build; valide o domínio e os headers na plataforma escolhida.

## Estado de verificação

Execute `npm run check`, `npm run lint`, `npm run test`, `npm run test:e2e`, `npm audit` e `npm run build` após alterações. Os testes Playwright usam Chromium em desktop e viewport móvel e **interceptam `window.open`** no fluxo de formulário: nenhuma mensagem é enviada à empresa durante os testes. Lighthouse e Core Web Vitals devem ser medidos novamente no domínio publicado, com as imagens, logo e ferramentas de terceiros definitivas.

Na verificação local de 24/11/2026, `astro check` retornou 0 erros, 0 avisos e 0 dicas; ESLint passou; Vitest passou em 7 testes; Playwright passou em 13 casos, com 1 caso móvel corretamente ignorado no projeto desktop; `npm audit` apontou 0 vulnerabilidades; e o build gerou 21 páginas. Lighthouse no preview de produção: **desktop 98/100/100** e **móvel 77/100/100** em desempenho/acessibilidade/boas práticas. LCP móvel de 2,3 s e CLS de 0,012. O desempenho móvel ainda fica abaixo da meta de 95 nessa simulação. O SEO local é 66 enquanto o domínio permanece sem configuração e a indexação está bloqueada; um build de verificação com URL configurada obteve **SEO 100**, sem representar um domínio publicado.
