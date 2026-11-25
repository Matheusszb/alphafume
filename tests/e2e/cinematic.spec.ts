import { test, expect } from '@playwright/test';

const routes = [
  '/', '/agendamento/', '/orcamento/', '/servicos/', '/servicos/abertura-de-farois/',
  '/servicos/instalacao-de-parabrisa/', '/servicos/insulfilm/', '/servicos/ppf/',
  '/servicos/reparo-de-parabrisa/', '/servicos/restauracao-de-farois/',
  '/sobre/', '/galeria/', '/produtos/', '/produtos/catalogo-em-preparacao/',
  '/blog/', '/blog/como-escolher-pelicula-automotiva/',
  '/blog/quando-parabrisa-pode-ser-reparado/', '/perguntas-frequentes/',
  '/contato/', '/politica-de-privacidade/', '/termos-de-uso/', '/caminho-inexistente/'
];

test('every page renders the Alpha logo and moving cinematic scene', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('#main h1')).toBeVisible();
    const logo = page.locator('.site-header .brand img');
    await expect(logo).toBeVisible();
    expect(await logo.evaluate(image => (image as HTMLImageElement).naturalWidth), `Logo on ${route}`).toBeGreaterThan(0);
    const particle = page.locator('.cinematic-particles i').first();
    await expect(particle).toHaveCSS('animation-play-state', 'running');
    const before = await particle.evaluate(element => getComputedStyle(element).transform);
    await page.waitForTimeout(260);
    const after = await particle.evaluate(element => getComputedStyle(element).transform);
    expect(after, `Particle must move on ${route}`).not.toBe(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow on ${route}`).toBe(true);
    const name = route === '/' ? 'home' : route.replaceAll('/', '_').replace(/^_|_$/g, '');
    await page.screenshot({ path: testInfo.outputPath(`${name}.png`), animations: 'allow' });
  }
  expect(errors).toEqual([]);
});

test('request cards tilt, progress glows, and step transitions animate', async ({ page }, testInfo) => {
  await page.goto('/agendamento/');
  const card = page.locator('.quote-service').first();
  await card.scrollIntoViewIfNeeded();
  if ((page.viewportSize()?.width || 0) > 760) {
    const spotlight = page.locator('.cinematic-spotlight');
    await page.mouse.move(100, 150);
    const firstLight = await spotlight.evaluate(element => (element as HTMLElement).style.getPropertyValue('--pointer-x'));
    await page.mouse.move(420, 280);
    await expect.poll(() => spotlight.evaluate(element => (element as HTMLElement).style.getPropertyValue('--pointer-x'))).not.toBe(firstLight);
    await card.hover({ position: { x: 30, y: 30 } });
    await expect(card).not.toHaveCSS('transform', 'none');
    expect(await card.evaluate(element => (element as HTMLElement).style.getPropertyValue('--tilt-x'))).not.toBe('');
  }
  await expect(page.locator('.quote-progress-rail span')).toHaveCSS('width', /.+/);
  await card.click();
  await page.getByRole('button', { name: /CONTINUAR PARA VEÍCULO/ }).click();
  await expect(page.getByRole('heading', { name: 'Fale um pouco sobre o veículo.' })).toBeVisible();
  expect(await page.locator('.quote-step-scene').count()).toBe(1);
  await expect(page.locator('.quote-progress-rail span')).toHaveAttribute('style', 'width: 50%;');
  await expect(page.locator('.quote-step-scene')).toHaveCSS('filter', 'blur(0px)');
  await page.screenshot({ path: testInfo.outputPath('booking-vehicle.png'), animations: 'allow' });
});

test('reduced motion keeps the form usable without ambient effects', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/agendamento/');
  await expect(page.locator('.cinematic-atmosphere')).toBeHidden();
  await page.getByRole('button', { name: /CONTINUAR PARA VEÍCULO/ }).click();
  await expect(page.locator('.quote-errors')).toContainText('Escolha pelo menos um serviço');
});
