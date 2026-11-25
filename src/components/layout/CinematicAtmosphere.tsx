'use client';

import { useEffect, useRef } from 'react';

const particles = Array.from({ length: 18 }, (_, index) => index);

export default function CinematicAtmosphere() {
  const spotlight = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let frame = 0;
    let pointerX = window.innerWidth * .72;
    let pointerY = window.innerHeight * .34;

    const paint = () => {
      frame = 0;
      spotlight.current?.style.setProperty('--pointer-x', `${pointerX}px`);
      spotlight.current?.style.setProperty('--pointer-y', `${pointerY}px`);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onCardMove = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      const card = (event.target as Element).closest<HTMLElement>('.cinematic-card, .contact-card, .empty-state, .product-card, .info-panel');
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--card-x', `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
      card.style.setProperty('--card-y', `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
      card.style.setProperty('--tilt-x', `${((.5 - (event.clientY - bounds.top) / bounds.height) * 6).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${((((event.clientX - bounds.left) / bounds.width) - .5) * 7).toFixed(2)}deg`);
    };
    const onCardLeave = (event: PointerEvent) => {
      const card = (event.target as Element).closest<HTMLElement>('.cinematic-card, .contact-card, .empty-state, .product-card, .info-panel');
      if (!card || (event.relatedTarget instanceof Node && card.contains(event.relatedTarget))) return;
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointermove', onCardMove, { passive: true });
    document.addEventListener('pointerout', onCardLeave, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointermove', onCardMove);
      document.removeEventListener('pointerout', onCardLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="cinematic-atmosphere" aria-hidden="true">
    <div className="cinematic-spotlight" ref={spotlight}/>
    <div className="cinematic-beam cinematic-beam-one"/>
    <div className="cinematic-beam cinematic-beam-two"/>
    <div className="cinematic-particles">{particles.map(index => <i key={index} style={{
      '--particle-index': index,
      '--particle-x': `${(index * 47 + 13) % 100}%`,
      '--particle-y': `${(index * 31 + 7) % 100}%`,
      '--particle-depth': `${index % 5}`
    } as React.CSSProperties}/>)}</div>
  </div>;
}
