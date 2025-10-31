export interface Partner {
  name: string;
  partner_slug: string;
  location: string;
  price_original: string;
  price_discount: string;
  savings: string;
  discount_label: string;
  code: string;
  official_url: string;
  images: string[];
  icon: string;
  detailed_description?: string;
}

export interface Experience {
  slug: string;
  title: string;
  badge: string;
  description: string;
  partners: Partner[];
}