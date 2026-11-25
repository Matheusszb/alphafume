export type GalleryItem = { id: string; category: 'Insulfilm' | 'Para-brisas' | 'PPF' | 'Faróis'; title: string; image: string; alt: string; before?: string; after?: string };
// Fotos de trabalhos reais somente após autorização e identificação correta.
export const gallery: GalleryItem[] = [];
