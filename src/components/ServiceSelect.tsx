'use client';

import { useEffect, useState } from 'react';

export default function ServiceSelect({ slug, name }: { slug: string; name: string }) {
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    try { setSelected(JSON.parse(sessionStorage.getItem('alpha_selected_services') || '[]').includes(slug)); } catch { setSelected(false); }
  }, [slug]);
  function choose() {
    let saved: string[] = [];
    try { const value = JSON.parse(sessionStorage.getItem('alpha_selected_services') || '[]'); if (Array.isArray(value)) saved = value.filter(item => typeof item === 'string'); } catch { /* Ignore stale browser data. */ }
    sessionStorage.setItem('alpha_selected_services', JSON.stringify(Array.from(new Set([...saved, slug]))));
    setSelected(true);
  }
  return <a className={`text-link subtle ${selected ? 'service-is-selected' : ''}`} href={`/agendamento/?servico=${slug}`} onClick={choose} aria-label={`${selected ? 'Selecionado' : 'Selecionar'}: ${name}`}>{selected ? 'SELECIONADO' : 'SELECIONAR SERVIÇO'}</a>;
}
