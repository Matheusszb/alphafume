import type { APIRoute } from 'astro';
import { business } from '../config/business';
export const GET: APIRoute = () => new Response(
  business.siteUrl === 'https://example.com'
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nSitemap: ${business.siteUrl}/sitemap-index.xml\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
);
