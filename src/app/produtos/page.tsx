import type { Metadata } from 'next';
import ProductCatalog from '../../components/products/ProductCatalog';
import { PageHero } from '../../components/PageParts';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata('Produtos Automotivos | Alpha Fumê e Faróis', 'Catálogo de produtos automotivos da Alpha. Consulte opções e disponibilidade pelo WhatsApp.', '/produtos/');
export default function ProductsPage() { return <><PageHero kicker="CATÁLOGO ALPHA" title="PRODUTOS PARA CUIDAR DO SEU VEÍCULO." description="Consulte os produtos disponíveis e monte uma lista para conversar diretamente com a equipe." crumbs={[{ label: 'Produtos' }]}/><section className="section section-dark"><div className="container"><ProductCatalog/></div></section></>; }
