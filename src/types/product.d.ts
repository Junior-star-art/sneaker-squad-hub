export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  images?: string[];
  sizes?: string[];
  stock?: number;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
}