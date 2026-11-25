import type { MetadataRoute } from 'next';
import { business } from '../config/business';
import { services } from '../data/services';
import { products } from '../data/products';
import { getArticles } from '../lib/blog';
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/servicos/', '/agendamento/', '/orcamento/', '/galeria/', '/sobre/', '/perguntas-frequentes/', '/contato/', '/produtos/', '/blog/', '/politica-de-privacidade/', '/termos-de-uso/', ...services.map(item => `/servicos/${item.slug}/`), ...products.filter(item => item.active).map(item => `/produtos/${item.slug}/`), ...getArticles().map(item => `/blog/${item.slug}/`)];
  return paths.map(path => ({ url: new URL(path, business.siteUrl).toString() }));
}
