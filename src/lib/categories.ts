/**
 * Číselník kategorií portfolia — jediné místo, kde se definují
 * popisky a odkazy na související službu.
 */
export type Category = 'ai' | 'infrastruktura' | 'vyvoj';

export const CATEGORIES: Record<Category, { label: string; serviceHref: string }> = {
  ai: { label: 'AI & vyhledávání', serviceHref: '/sluzby/elasticsearch-rag' },
  infrastruktura: { label: 'Infrastruktura', serviceHref: '/sluzby/kubernetes' },
  vyvoj: { label: 'Vývoj', serviceHref: '/sluzby/vyvoj-na-miru' },
};

export const categoryLabel = (category: Category) => CATEGORIES[category].label;
export const categoryServiceHref = (category: Category) => CATEGORIES[category].serviceHref;
