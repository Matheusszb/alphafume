'use client';
import { useMemo, useState } from 'react';
import { Search, ShoppingBag, Trash2 } from 'lucide-react';
import { products } from '../../data/products';
import { whatsappUrl } from '../../lib/quote';
import { track } from '../../lib/analytics';
import { business } from '../../config/business';
type Line = { id: string; quantity: number; variation: string };
export default function ProductCatalog() {
  const active = products.filter((item) => item.active);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [brand, setBrand] = useState('Todas');
  const [sort, setSort] = useState('destaques');
  const [list, setList] = useState<Line[]>([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const categories = ['Todos', ...new Set(active.map((item) => item.category))];
  const brands = ['Todas', ...new Set(active.map((item) => item.brand))];
  const filtered = useMemo(() => active.filter((item) => item.name.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')) && (category === 'Todos' || item.category === category) && (brand === 'Todas' || item.brand === brand)).sort((a,b) => sort === 'nome' ? a.name.localeCompare(b.name) : Number(Boolean(b.featured)) - Number(Boolean(a.featured))), [active,query,category,brand,sort]);
  function add(id: string) { setList((current) => current.some((line) => line.id === id) ? current.map((line) => line.id === id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { id, quantity: 1, variation: '' }]); track('product_add', { product: id }); }
  function send() {
    if (!name.trim() || !city.trim() || !list.length) { setError('Informe seu nome, cidade e selecione ao menos um produto.'); return; }
    const lines = ['🛒 *CONSULTA DE PRODUTOS — ALPHA*', '', 'Olá! Vim pelo site e gostaria de consultar os seguintes produtos:', '', '📦 *PRODUTOS DE INTERESSE*'];
    list.forEach((line,index) => { const product = active.find((item) => item.id === line.id); if (!product) return; lines.push(`${index+1}. ${product.name}`,`• Quantidade: ${line.quantity}`); if (line.variation) lines.push(`• Variação: ${line.variation}`); lines.push(''); });
    lines.push('👤 *CLIENTE*',`• Nome: ${name.replace(/[\r\n*]/g,' ').slice(0,100)}`,`• Cidade: ${city.replace(/[\r\n*]/g,' ').slice(0,100)}`);
    if (notes.trim()) lines.push('',`📝 ${notes.replace(/[\r\n*]/g,' ').slice(0,500)}`);
    lines.push('', 'Gostaria de confirmar os valores e a disponibilidade.');
    track('quote_whatsapp', { source: 'products', product_count: list.length });
    window.open(whatsappUrl(lines.join('\n')), '_blank', 'noopener,noreferrer');
  }
  if (!active.length) return <div className="empty-state"><ShoppingBag size={42} style={{ margin:'0 auto 20px',color:'#ed1023' }} /><h2>CATÁLOGO EM PREPARAÇÃO.</h2><p>Os produtos serão exibidos aqui assim que a Alpha confirmar modelos, marcas e detalhes. Para consultar uma opção agora, fale diretamente pelo WhatsApp.</p><a className="btn btn-red" href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer">CONSULTAR PELO WHATSAPP</a></div>;
  return <><div className="catalog-controls"><label><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto" aria-label="Buscar produto" /></label><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar categoria">{categories.map((item) => <option key={item}>{item}</option>)}</select><select value={brand} onChange={(event) => setBrand(event.target.value)} aria-label="Filtrar marca">{brands.map((item) => <option key={item}>{item}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar produtos"><option value="destaques">Destaques</option><option value="nome">Nome A–Z</option></select></div><div className="product-grid">{filtered.map((product) => <article className="product-card" key={product.id}><a href={`/produtos/${product.slug}`}><img src={product.image} alt={product.name} loading="lazy" width="600" height="400" /><h2>{product.name}</h2></a><p>{product.summary}</p><span>Valor sob consulta</span><button className="btn btn-outline" onClick={() => add(product.id)}>ADICIONAR À CONSULTA</button></article>)}</div>{!filtered.length && <p>Nenhum produto encontrado para estes filtros.</p>}{list.length>0 && <section className="product-list"><h2>LISTA DE CONSULTA</h2>{list.map((line) => { const product = active.find((item) => item.id===line.id)!; return <div className="product-line" key={line.id}><strong>{product.name}</strong><label>Quantidade<input type="number" min="1" max="99" value={line.quantity} onChange={(event) => setList((current) => current.map((item) => item.id===line.id ? { ...item, quantity: Math.max(1,Number(event.target.value)||1) } : item))}/></label>{product.variations.length>0 && <label>Variação<select value={line.variation} onChange={(event) => setList((current) => current.map((item) => item.id===line.id ? {...item,variation:event.target.value} : item))}><option value="">Selecione</option>{product.variations.map((variation) => <option key={variation}>{variation}</option>)}</select></label>}<button aria-label={`Remover ${product.name}`} onClick={() => setList((current) => current.filter((item) => item.id!==line.id))}><Trash2 size={18}/></button></div>; })}<div className="field-grid"><label className="field">Seu nome<input value={name} onChange={(event) => setName(event.target.value)}/></label><label className="field">Cidade<input value={city} onChange={(event) => setCity(event.target.value)}/></label><label className="field full">Observações<textarea value={notes} onChange={(event) => setNotes(event.target.value)}/></label></div>{error && <p role="alert" className="form-errors">{error}</p>}<button className="btn btn-red" onClick={send}>SOLICITAR PELO WHATSAPP</button></section>}</>;
}
