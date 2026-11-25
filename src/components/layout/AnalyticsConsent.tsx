'use client';

import { useEffect, useState } from 'react';
import { tracking } from '../../config/tracking';

const enabled = Boolean(tracking.ga4 || tracking.gtm || tracking.metaPixel);

function loadTracking() {
  const global = window as typeof window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; fbq?: ((...args: unknown[]) => void) & { queue?: unknown[][] } };
  if (tracking.gtm) { global.dataLayer = global.dataLayer || []; const script = document.createElement('script'); script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(tracking.gtm)}`; script.async = true; document.head.append(script); }
  else if (tracking.ga4) { global.dataLayer = global.dataLayer || []; global.gtag = (...args) => global.dataLayer?.push(args); global.gtag('js', new Date()); global.gtag('config', tracking.ga4); const script = document.createElement('script'); script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tracking.ga4)}`; script.async = true; document.head.append(script); }
  if (tracking.metaPixel) { global.fbq = function(...args) { (global.fbq!.queue = global.fbq!.queue || []).push(args); }; global.fbq('init', tracking.metaPixel); global.fbq('track', 'PageView'); const script = document.createElement('script'); script.src = 'https://connect.facebook.net/en_US/fbevents.js'; script.async = true; document.head.append(script); }
}

export function AnalyticsConsent() {
  const [decision, setDecision] = useState<string | null>('pending');
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const utm = Object.fromEntries([...params.entries()].filter(([key]) => /^utm_(source|medium|campaign|content|term)$/.test(key)));
    if (Object.keys(utm).length) sessionStorage.setItem('alpha_utm', JSON.stringify(utm));
    const saved = localStorage.getItem('alpha_analytics_consent'); setDecision(saved);
    if (saved === 'yes' && enabled) loadTracking();
  }, []);
  if (!enabled || decision !== null) return null;
  return <div className="consent-banner"><p>Podemos usar métricas anônimas para melhorar o site. Seus dados do formulário não são enviados a essas ferramentas.</p><div><button type="button" onClick={() => { localStorage.setItem('alpha_analytics_consent', 'no'); setDecision('no'); }}>Recusar</button><button type="button" onClick={() => { localStorage.setItem('alpha_analytics_consent', 'yes'); setDecision('yes'); loadTracking(); }}>Aceitar métricas</button></div></div>;
}
