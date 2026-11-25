type EventName = 'view_service' | 'view_product' | 'select_service' | 'form_start' | 'form_step' | 'form_review' | 'whatsapp_click' | 'instagram_click' | 'product_add' | 'quote_whatsapp' | 'booking_whatsapp';
export function track(name: EventName, data: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  if (window.localStorage.getItem('alpha_analytics_consent') !== 'yes') return;
  const stored = window.sessionStorage.getItem('alpha_utm');
  const utm = stored ? JSON.parse(stored) : Object.fromEntries(new URLSearchParams(window.location.search).entries().filter(([key]) => /^utm_(source|medium|campaign|content|term)$/.test(key)));
  const payload = { event: name, ...utm, ...data };
  const target = window as typeof window & { dataLayer?: Record<string, unknown>[]; gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void };
  target.dataLayer?.push(payload);
  target.gtag?.('event', name, { ...utm, ...data });
  target.fbq?.('trackCustom', name, { ...utm, ...data });
}
