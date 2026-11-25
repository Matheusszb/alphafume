import type { Metadata } from 'next';
import GalleryView from '../../components/gallery/GalleryView';
import { PageHero } from '../../components/PageParts';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata('Galeria de Trabalhos | Alpha Fumê e Faróis', 'Galeria de fotografias autorizadas de trabalhos da Alpha Fumê e Faróis.', '/galeria/');
export default function GalleryPage() { return <><PageHero kicker="TRABALHOS ALPHA" title="DETALHES QUE MERECEM SER VISTOS." description="Um espaço reservado para registrar serviços reais, com autorização dos proprietários." crumbs={[{ label: 'Galeria' }]}/><section className="section section-dark"><div className="container"><GalleryView/></div></section></>; }
