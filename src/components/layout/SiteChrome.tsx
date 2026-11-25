'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { business } from '../../config/business';
import { services } from '../../data/services';

const links = [
  { href: '/', text: 'Início' }, { href: '/servicos/', text: 'Serviços' },
  { href: '/#diferenciais', text: 'Diferenciais' }, { href: '/galeria/', text: 'Galeria' },
  { href: '/sobre/', text: 'Sobre nós' }, { href: '/perguntas-frequentes/', text: 'Perguntas frequentes' },
  { href: '/contato/', text: 'Contato' }
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { document.body.classList.toggle('menu-open', open); return () => document.body.classList.remove('menu-open'); }, [open]);
  return <header id="site-header" className={`site-header ${scrolled || open ? 'scrolled' : ''}`}>
    <div className="container nav-inner">
      <a className="brand" href="/" aria-label="Alpha Fumê e Faróis, início"><img src={business.logoPath} alt="Alpha Fumê e Faróis" width={150} height={100} /></a>
      <nav className="desktop-nav" aria-label="Navegação principal">{links.map(link => <a key={link.href} href={link.href}>{link.text}</a>)}<a className="instagram-nav" href={business.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram ${business.instagramHandle}`}><Instagram size={18}/></a></nav>
      <a className="btn btn-red nav-cta" href="/agendamento/">AGENDAR SERVIÇO</a>
      <button className="menu-toggle" type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}><span/><span/><span/></button>
    </div>
    <nav id="mobile-menu" className="mobile-menu" aria-label="Menu para celular" hidden={!open}>
      {links.map(link => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.text}</a>)}
      {services.map(service => <a className="mobile-sub" key={service.slug} href={`/servicos/${service.slug}/`} onClick={() => setOpen(false)}>{service.name}</a>)}
      <a href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram {business.instagramHandle}</a>
      <a className="btn btn-red" href="/agendamento/" onClick={() => setOpen(false)}>Agendar serviço</a>
    </nav>
  </header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="container footer-main">
    <div className="footer-intro"><a className="brand" href="/"><img src={business.logoPath} alt="Alpha Fumê e Faróis" width={210} height={140} loading="lazy" /></a><p>Proteção, estética, vidros e iluminação automotiva. Cuidado em cada detalhe do seu veículo.</p></div>
    <div><h2>Explore</h2><a href="/servicos/">Serviços</a><a href="/galeria/">Galeria</a><a href="/sobre/">Sobre nós</a><a href="/perguntas-frequentes/">Perguntas frequentes</a><a href="/blog/">Blog</a></div>
    <div><h2>Serviços</h2>{services.map(service => <a key={service.slug} href={`/servicos/${service.slug}/`}>{service.name}</a>)}</div>
    <div><h2>Contato</h2><a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp {business.phoneDisplay}</a><a href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram {business.instagramHandle}</a><a href="/contato/">Fale com a Alpha</a></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Alpha Fumê e Faróis. Todos os direitos reservados.</span><div><a href="/politica-de-privacidade/">Privacidade</a><a href="/termos-de-uso/">Termos de uso</a></div></div></footer>;
}

export function Intro() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (reduced || sessionStorage.getItem('alpha_intro_seen')) return;
    sessionStorage.setItem('alpha_intro_seen', 'yes');
    const start = window.setTimeout(() => setShow(true), 0);
    const stop = window.setTimeout(() => setShow(false), 1050);
    return () => { clearTimeout(start); clearTimeout(stop); };
  }, [reduced]);
  return <AnimatePresence>{show && <motion.div className="next-intro" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .18 }}>
    <span className="intro-beam"/><motion.img src={business.logoPath} alt="" width={420} height={280} initial={{ opacity: 0, scale: .93 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .25, duration: .42 }}/><span className="intro-trace"/>
  </motion.div>}</AnimatePresence>;
}

export function FloatingActions() {
  return <><a className="floating-whatsapp" href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Falar com a Alpha pelo WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.5 0 .1 5.4.1 12c0 2.1.6 4.2 1.7 6L0 24l6.2-1.6A12 12 0 0 0 12 24h.1C18.7 24 24 18.6 24 12c0-3.2-1.2-6.2-3.5-8.5ZM12.1 22a10 10 0 0 1-5.1-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A10 10 0 1 1 12.1 22Zm5.5-7.5c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.3-.7.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.5.2-.7l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.8s1.2 3.1 1.4 3.3c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.6.8.1 1.5.1 2.1 0 .6-.1 1.8-.8 2-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.5Z"/></svg></a><nav className="mobile-bottom" aria-label="Acesso rápido"><a href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="/agendamento/">Agendar serviço</a></nav></>;
}
