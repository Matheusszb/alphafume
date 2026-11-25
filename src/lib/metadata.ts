import type { Metadata } from 'next';
import { business } from '../config/business';
import { seo } from '../config/seo';

const configured = seo.indexEnabled;
const absolute = (path: string) => new URL(path, business.siteUrl).toString();

export function pageMetadata(title: string, description: string, path: string, image = seo.defaultImage): Metadata {
  return {
    title,
    description,
    robots: configured ? { index: true, follow: true } : { index: false, follow: true },
    ...(configured ? { alternates: { canonical: absolute(path) } } : {}),
    openGraph: { title, description, type: 'website', locale: 'pt_BR', siteName: business.name, images: [{ url: absolute(image) }], ...(configured ? { url: absolute(path) } : {}) },
    twitter: { card: 'summary_large_image', title, description, images: [absolute(image)] }
  };
}
