export interface User {
  id: string;
  email: string;
  created_at: string;
  full_name?: string;
  shipping_address?: string;
  billing_address?: string;
  user_metadata?: {
    full_name?: string;
  };
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  created_at: string;
  shipping_address: string;
  billing_address: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  quantity: number;
  price: number;
}

export interface ProductReview {
  id: string;
  product_id: number;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}
