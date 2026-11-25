import type { MetadataRoute } from 'next';
import { business } from '../config/business';
import { seo } from '../config/seo';
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', ...(seo.indexEnabled ? { allow: '/' } : { disallow: '/' }) }, ...(seo.indexEnabled ? { sitemap: `${business.siteUrl}/sitemap.xml` } : {}) }; }
