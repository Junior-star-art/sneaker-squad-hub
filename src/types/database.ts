export interface User {
  id: string;
  email: string;
  created_at: string;
  full_name?: string;
  shipping_address?: string;
  billing_address?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
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
  product_id: string;
  quantity: number;
  price: number;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface TrackingUpdate {
  id: string;
  order_id: string;
  status: string;
  location: string | null;
  description: string | null;
  created_at: string;
  carrier: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  latitude: number | null;
  longitude: number | null;
  email_sent: boolean | null;
}

export interface InventoryLog {
  id: string;
  product_id: string;
  quantity_change: number;
  type: 'restock' | 'adjustment';
  notes: string | null;
  created_at: string;
  created_by: string | null;
}

export interface InventoryStatus {
  stock: number;
  low_stock_threshold: number;
  inventory_status: 'in_stock' | 'low_stock' | 'out_of_stock';
}
