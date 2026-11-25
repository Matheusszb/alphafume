# Alpha Fumê e Faróis

Site institucional em Next.js com App Router, TypeScript, React, Tailwind CSS 4, Framer Motion e Lucide. As páginas são geradas estaticamente em `out/` e estão preparadas para publicação na Vercel.

A logo original, com transparência e efeito metálico 3D, está em `public/images/Logo Metálico Alpha Fumê e Faróis.png`. A versão `public/images/logo-alpha.webp` foi reduzida para 768×512 sem perda e é usada no cabeçalho, rodapé e animação de entrada. O arquivo original não foi alterado.

## Executar

Requer Node.js 22 ou superior.

```bash
npm install
npm run dev
```

Abra `http://localhost:4321`. Para validar e gerar a versão estática:

```bash
npm run check
npm run lint
npm run test
npm run test:e2e
npm run build
npm run preview
```

`npm run preview` serve a pasta `out/` na porta 4321. No Windows, use `npm.cmd` caso o PowerShell bloqueie o script `npm.ps1`.

## Conteúdo e fluxo

- Seis páginas de serviços em `src/app/servicos/[slug]/`, alimentadas por `src/data/services.ts`.
- Agendamento e orçamento em `src/app/agendamento/` e `src/app/orcamento/`. O formulário React em `src/components/forms/DynamicServiceForm.tsx` tem quatro etapas fixas: serviços, veículo, contato e revisão. Detalhes específicos por serviço são opcionais e ficam em `src/data/quoteQuestions.ts`.
- A atmosfera cinematográfica em `src/components/layout/CinematicAtmosphere.tsx` e `src/styles/cinematic.css` aparece em todas as rotas. Partículas, luzes e reflexos usam CSS; a luz acompanha o ponteiro em computadores. O efeito respeita `prefers-reduced-motion` e o formulário mantém todo o conteúdo em HTML estático para SEO.
- A mensagem é aberta no WhatsApp do visitante. A solicitação só chega à empresa se ele confirmar o envio lá; a data é uma preferência, não uma reserva confirmada.
- Serviços selecionados são guardados na sessão do navegador para continuar a solicitação entre páginas.
- Galeria e catálogo têm estrutura para conteúdo real, com estado de preparação enquanto `src/data/gallery.ts` e `src/data/products.ts` estiverem vazios. Imagens ilustrativas não são apresentadas como trabalhos realizados pela Alpha.
- Dois artigos em `src/content/blog/` são transformados em páginas estáticas.
- Metadados por rota, Open Graph, Twitter Cards, sitemap, robots, 404, breadcrumbs e dados estruturados.

## Publicação na Vercel

Conecte este repositório à Vercel. O projeto usa `next build`, `output: 'export'` e a pasta de saída `out/`; os cabeçalhos HTTP estão em `vercel.json`.

Configure `NEXT_PUBLIC_SITE_URL` com o domínio definitivo antes do build. Sem ele, o site usa `https://example.com` apenas como marcador, emite `noindex` e bloqueia a indexação em `robots.txt`. Copie `.env.example` para `.env.local` no desenvolvimento local e configure as mesmas variáveis no projeto da Vercel.

IDs opcionais de métricas (`NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`) só carregam scripts após consentimento. O site não envia dados do formulário a essas ferramentas.

## Dados a confirmar

O site não inventa endereço, cidade da empresa, horários, preços, avaliações, garantias nem quantidade de clientes. Antes de uma publicação pública definitiva, confirme o domínio, revise os textos legais em `src/app/politica-de-privacidade/` e `src/app/termos-de-uso/`, e forneça fotos autorizadas e dados de produtos caso deseje preenchê-los.

WhatsApp e Instagram ficam em `src/config/business.ts`. O destino atual de WhatsApp é `5579999503508`.
