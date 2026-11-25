import { test, expect } from '@playwright/test';

test('home links to services and the service preselects the quote form', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level:1 })).toContainText('PROTEÇÃO, ESTÉTICA E PERFORMANCE');
  const logo = page.locator('.site-header .brand img');
  await expect(logo).toHaveAttribute('src', '/images/logo-alpha.webp');
  expect(await logo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.goto('/servicos/insulfilm');
  await expect(page.getByRole('heading', { level:1 })).toHaveText('APLICAÇÃO DE INSULFILM');
  await page.getByRole('link', { name:'SELECIONAR ESTE SERVIÇO' }).click();
  await expect(page).toHaveURL(/\/agendamento\/\?servico=insulfilm/);
  await expect(page.getByRole('button', { name:/Aplicação de Insulfilm/ })).toHaveAttribute('aria-pressed','true');
});

test('form requires service, vehicle and service answers', async ({ page }) => {
  await page.goto('/orcamento');
  await page.getByRole('button', { name:/Continuar/i }).click();
  await expect(page.locator('.form-errors')).toContainText('Selecione pelo menos um serviço');
  await page.getByRole('button', { name:/Aplicação de Insulfilm/ }).click();
  await page.getByRole('button', { name:/Continuar/i }).click();
  await page.getByRole('button', { name:'Sedan', exact:true }).click();
  await page.getByLabel('Marca *').selectOption('Toyota');
  await page.getByLabel('Modelo *').fill('Corolla');
  await page.getByLabel('Ano *').fill('2022');
  await page.getByRole('button', { name:/Continuar/i }).click();
  await expect(page.getByRole('heading', { name:'Tipo de película' })).toBeVisible();
  await page.getByRole('button', { name:/Continuar/i }).click();
  await expect(page.locator('.form-errors')).toContainText('Qual tipo de película interessa');
  await page.getByRole('button', { name:'Nanocerâmica', exact:true }).click();
  await page.getByRole('button', { name:/Continuar/i }).click();
  await expect(page.getByRole('heading', { name:'Transparência' })).toBeVisible();
});

test('selected services survive navigation within the session', async ({ page }) => {
  await page.goto('/orcamento');
  await page.getByRole('button', { name: /Aplicação de Insulfilm/ }).click();
  await page.goto('/servicos');
  await page.goto('/agendamento');
  await expect(page.getByRole('button', { name: /Aplicação de Insulfilm/ })).toHaveAttribute('aria-pressed', 'true');
});

test('empty catalog and gallery avoid invented items', async ({ page }) => {
  await page.goto('/produtos');
  await expect(page.getByText('CATÁLOGO EM PREPARAÇÃO.')).toBeVisible();
  await page.goto('/galeria');
  await expect(page.getByText('GALERIA EM PREPARAÇÃO.')).toBeVisible();
});

test('quote reaches review and builds WhatsApp URL without navigating externally', async ({ page }) => {
  await page.addInitScript(() => { (window as typeof window & { __opened?: string }).open = ((url: string) => { (window as typeof window & { __opened?: string }).__opened = url; return null; }) as typeof window.open; });
  await page.goto('/orcamento?servico=insulfilm');
  const next = page.getByRole('button', { name:/Continuar/i });
  await next.click();
  await page.getByRole('button', {name:'Sedan', exact:true}).click();
  await page.getByLabel('Marca *').selectOption('Toyota');
  await page.getByLabel('Modelo *').fill('Corolla');
  await page.getByLabel('Ano *').fill('2022');
  await next.click();
  await page.getByRole('button', {name:'Nanocerâmica',exact:true}).click();
  await next.click();
  await page.getByRole('button', {name:'G35',exact:true}).click();
  await next.click();
  await page.getByRole('button', {name:'Veículo completo',exact:true}).click();
  await next.click();
  await page.locator('.question').filter({hasText:'Já possui película?'}).getByRole('button',{name:'Sim'}).click();
  await expect(page.getByText('Deseja remover a película antiga?')).toBeVisible();
  await page.locator('.question').filter({hasText:'Deseja remover a película antiga?'}).getByRole('button',{name:'Sim'}).click();
  await next.click();
  await page.getByRole('button',{name:'Redução de calor'}).click();
  await page.getByRole('button',{name:'Privacidade'}).click();
  await next.click();
  await page.getByLabel('Nome completo *').fill('João Silva');
  await page.getByLabel('WhatsApp com DDD *').fill('79999999999');
  await page.getByLabel('Cidade *').fill('Aracaju');
  await next.click();
  await expect(page.getByRole('heading',{name:'Tudo certo?'})).toBeVisible();
  await page.getByText('Ver mensagem completa').click();
  await expect(page.locator('.message-preview pre')).toContainText('Nanocerâmica');
  await page.getByRole('button',{name:/ENVIAR SOLICITAÇÃO PELO WHATSAPP/}).click();
  const opened = await page.evaluate(() => (window as typeof window & {__opened?:string}).__opened);
  expect(opened).toMatch(/^https:\/\/wa\.me\/5579999503508\?text=/);
  expect(decodeURIComponent(opened!)).toContain('João Silva');
});

test('mobile menu and narrow layout stay usable', async ({page}) => {
  test.skip((page.viewportSize()?.width || 1000) > 500);
  await page.goto('/');
  const menu = page.getByRole('button',{name:'Abrir menu'});
  await menu.click();
  await expect(page.getByRole('navigation',{name:'Menu para celular'})).toBeVisible();
  await page.getByRole('navigation',{name:'Menu para celular'}).getByRole('link',{name:'Galeria'}).click();
  await expect(page).toHaveURL(/\/galeria/);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test('common viewport widths have no horizontal overflow', async ({page}) => {
  for (const width of [320,375,390,430,768,1024,1440,1920]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow, `Overflow at ${width}px`).toBe(false);
  }
});

test('booking asks for a date before review', async ({page}) => {
  await page.goto('/agendamento?servico=restauracao-de-farois');
  const next = page.getByRole('button',{name:/Continuar/i});
  await next.click();
  await page.getByRole('button',{name:'Hatch',exact:true}).click();
  await page.getByLabel('Marca *').selectOption('Fiat');
  await page.getByLabel('Modelo *').fill('Argo');
  await page.getByLabel('Ano *').fill('2023');
  await next.click();
  await page.getByRole('button',{name:'Amarelamento'}).click();
  await page.getByRole('button',{name:'Ambos',exact:true}).click();
  await next.click();
  await next.click();
  await page.getByLabel('Nome completo *').fill('Maria Silva');
  await page.getByLabel('WhatsApp com DDD *').fill('79999999999');
  await page.getByLabel('Cidade *').fill('Aracaju');
  await next.click();
  await expect(page.locator('.form-errors')).toContainText('Escolha uma data de preferência');
  await page.locator('input[type="date"]').fill('2099-01-01');
  await next.click();
  await expect(page.getByRole('heading',{name:'Tudo certo?'})).toBeVisible();
});
