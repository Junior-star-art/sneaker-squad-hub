export interface SearchResult {
  id: number;
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