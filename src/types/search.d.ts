export interface SearchResult {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
}

export interface VisualSearchData {
  type: 'image' | 'color' | 'camera';
  data: string;
}

export interface RecentSearch {
  query: string;
  timestamp: number;
}

export interface SearchFilters {
  category?: string;
  categories?: string[];
  priceRange?: [number, number];
  colors?: string[];
  sizes?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
}