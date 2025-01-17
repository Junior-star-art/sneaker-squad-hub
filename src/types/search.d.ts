export interface SearchResult {
  id: string; // Changed from number to string
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