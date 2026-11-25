'use client';
import { useState } from 'react';
import type { Product } from '../../types/content';
import { whatsappUrl } from '../../lib/quote';
import { track } from '../../lib/analytics';
export default function ProductInquiry({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [variation, setVariation] = useState('');
  const [error, setError] = useState('');
  function send() {
    if (product.variations.length && !variation) { setError('Selecione uma variação.'); return; }
    const message = ['🛒 *CONSULTA DE PRODUTO — ALPHA*', '', `Olá! Vim pelo site e gostaria de consultar ${product.name}.`, `• Quantidade: ${quantity}`, ...(variation ? [`• Variação: ${variation}`] : []), '', 'Gostaria de confirmar valor e disponibilidade.'].join('\n');
    track('quote_whatsapp', { source:'product', product:product.id });
    window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
  }
  return <div className="product-inquiry"><div className="field-grid"><label className="field">Quantidade<input type="number" min="1" max="99" value={quantity} onChange={(event) => setQuantity(Math.min(99,Math.max(1,Number(event.target.value)||1)))}/></label>{product.variations.length>0 && <label className="field">Variação<select value={variation} onChange={(event) => {setVariation(event.target.value);setError('');}}><option value="">Selecione</option>{product.variations.map((item) => <option key={item}>{item}</option>)}</select></label>}</div>{error && <p role="alert" className="form-errors">{error}</p>}<button className="btn btn-red" type="button" onClick={send}>CONSULTAR PELO WHATSAPP</button><p className="small-note">Valor e disponibilidade serão confirmados pela Alpha na conversa.</p></div>;
}
