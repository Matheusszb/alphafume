import { test, expect } from '@playwright/test';

test('service page opens a request with that service selected', async ({ page }) => {
  await page.goto('/servicos/insulfilm/');
  await page.getByRole('link', { name: 'SELECIONAR ESTE SERVIÇO' }).click();
  await expect(page).toHaveURL(/\/agendamento\/\?servico=insulfilm/);
  await expect(page.getByRole('button', { name: /Aplicação de Insulfilm/ })).toHaveAttribute('aria-pressed', 'true');
});

test('the fixed four-step flow explains only essential requirements', async ({ page }) => {
  await page.goto('/orcamento/');
  await expect(page.locator('.quote-stepper li')).toHaveCount(4);
  await page.getByRole('button', { name: /CONTINUAR PARA VEÍCULO/ }).click();
  await expect(page.locator('.quote-errors')).toContainText('Escolha pelo menos um serviço');
  await page.getByRole('button', { name: /Aplicação de Insulfilm/ }).click();
  await page.getByRole('button', { name: /CONTINUAR PARA VEÍCULO/ }).click();
  await page.getByRole('button', { name: /CONTINUAR PARA CONTATO/ }).click();
  await expect(page.locator('.quote-errors')).toContainText('Informe a marca');
  await page.getByLabel('Marca *').fill('Toyota');
  await page.getByLabel('Modelo *').fill('Corolla');
  await page.getByLabel('Ano *').fill('2022');
  await page.getByRole('button', { name: /CONTINUAR PARA CONTATO/ }).click();
  await page.getByRole('button', { name: /REVISAR SOLICITAÇÃO/ }).click();
  await expect(page.locator('.quote-errors')).toContainText('Informe seu nome completo');
});

test('selected services remain after navigating to another page', async ({ page }) => {
  await page.goto('/orcamento/');
  await page.getByRole('button', { name: /Aplicação de Insulfilm/ }).click();
  await page.goto('/servicos/');
  await page.goto('/agendamento/');
  await expect(page.getByRole('button', { name: /Aplicação de Insulfilm/ })).toHaveAttribute('aria-pressed', 'true');
});

test('quote can include an optional detail and opens the prepared WhatsApp message', async ({ page }) => {
  await page.addInitScript(() => {
    (window as typeof window & { __opened?: string }).open = ((url: string) => {
      (window as typeof window & { __opened?: string }).__opened = url;
      return null;
    }) as typeof window.open;
  });
  await page.goto('/orcamento/?servico=insulfilm');
  await page.getByRole('button', { name: /CONTINUAR PARA VEÍCULO/ }).click();
  await page.getByLabel('Marca *').fill('Toyota');
  await page.getByLabel('Modelo *').fill('Corolla');
  await page.getByLabel('Ano *').fill('2022');
  await page.locator('.quote-quick-details summary').click();
  await page.getByRole('button', { name: 'Nanocerâmica', exact: true }).click();
  await page.getByRole('button', { name: /CONTINUAR PARA CONTATO/ }).click();
  await page.getByLabel('Nome completo *').fill('João Silva');
  await page.getByLabel('WhatsApp com DDD *').fill('79999999999');
  await page.getByRole('button', { name: /REVISAR SOLICITAÇÃO/ }).click();
  await expect(page.getByRole('heading', { name: 'Confira antes de abrir o WhatsApp.' })).toBeVisible();
  await page.getByText('Ver mensagem completa').click();
  await expect(page.locator('.quote-message pre')).toContainText('Nanocerâmica');
  await page.getByRole('button', { name: /ABRIR WHATSAPP COM MEU PEDIDO/ }).click();
  const opened = await page.evaluate(() => (window as typeof window & { __opened?: string }).__opened);
  expect(opened).toMatch(/^https:\/\/wa\.me\/5579999503508\?text=/);
  expect(decodeURIComponent(opened!)).toContain('João Silva');
});

test('booking requires a preferred date and does not claim a confirmed slot', async ({ page }) => {
  await page.goto('/agendamento/?servico=restauracao-de-farois');
  await page.getByRole('button', { name: /CONTINUAR PARA VEÍCULO/ }).click();
  await page.getByLabel('Marca *').fill('Fiat');
  await page.getByLabel('Modelo *').fill('Argo');
  await page.getByLabel('Ano *').fill('2023');
  await page.getByRole('button', { name: /CONTINUAR PARA CONTATO/ }).click();
  await page.getByLabel('Nome completo *').fill('Maria Silva');
  await page.getByLabel('WhatsApp com DDD *').fill('79999999999');
  await page.getByRole('button', { name: /REVISAR SOLICITAÇÃO/ }).click();
  await expect(page.locator('.quote-errors')).toContainText('Escolha uma data de preferência');
  await page.getByLabel('Data de preferência *').fill('2099-01-01');
  await page.getByRole('button', { name: /REVISAR SOLICITAÇÃO/ }).click();
  await expect(page.locator('.quote-assurance')).toContainText('disponibilidade e agendamento serão confirmados pela empresa');
});

test('catalog and gallery do not invent products or completed work', async ({ page }) => {
  await page.goto('/produtos/');
  await expect(page.getByText('CATÁLOGO EM PREPARAÇÃO.')).toBeVisible();
  await page.goto('/galeria/');
  await expect(page.getByText('GALERIA EM PREPARAÇÃO.')).toBeVisible();
});

test('mobile menu remains usable', async ({ page }) => {
  test.skip((page.viewportSize()?.width || 1000) > 500);
  await page.goto('/');
  await page.getByRole('button', { name: 'Abrir menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Menu para celular' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Menu para celular' }).getByRole('link', { name: 'Galeria' }).click();
  await expect(page).toHaveURL(/\/galeria/);
});

test('common widths have no horizontal overflow on home and request pages', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/orcamento/']) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
      expect(overflow, `Overflow on ${path} at ${width}px`).toBe(false);
    }
  }
});
