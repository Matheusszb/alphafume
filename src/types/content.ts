export type FAQ = { question: string; answer: string };
export type Service = {
  slug: string; name: string; kicker: string; summary: string; description: string;
  image: string; imageAlt: string; icon: string; benefits: string[];
  process: string[]; indicated: string; limitations: string; care: string;
  faqs: FAQ[]; seoTitle: string; seoDescription: string;
};
export type Product = {
  id: string; slug: string; name: string; category: string; brand: string;
  summary: string; description: string; image: string; images: string[];
  features: string[]; benefits: string[]; variations: string[];
  price?: number; featured?: boolean; active: boolean;
  seoTitle: string; seoDescription: string;
};
