import type { Metadata } from 'next';
import '../styles/global.css';
import '../styles/quote.css';
import { Header, Footer, FloatingActions } from '../components/layout/SiteChrome';
import { AnalyticsConsent } from '../components/layout/AnalyticsConsent';
import { business } from '../config/business';
import { pageMetadata } from '../lib/metadata';

export const metadata: Metadata = {
  ...pageMetadata('Alpha Fumê e Faróis | Proteção e Estética Automotiva', 'Películas automotivas, PPF, para-brisas e faróis com atendimento personalizado.', '/'),
  metadataBase: new URL(business.siteUrl),
  icons: { icon: '/favicon-alpha.png' }
};

const organization = {
  '@context': 'https://schema.org', '@type': 'Organization',
  name: business.name, url: business.siteUrl, telephone: `+${business.whatsapp}`,
  logo: new URL(business.logoPath, business.siteUrl).toString(), sameAs: [business.instagram]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>
    <a className="skip-link" href="#main">Pular para o conteúdo</a>
    <Header/><main id="main">{children}</main><Footer/><FloatingActions/><AnalyticsConsent/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}/>
  </body></html>;
}
