import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import process from 'node:process';

const site = process.env.PUBLIC_SITE_URL || 'https://example.com';
export default defineConfig({
  site,
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  trailingSlash: 'never'
});
