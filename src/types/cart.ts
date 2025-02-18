
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
};

export type CartContextType = {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  saveForLater: (id: string) => Promise<void>;
  moveToCart: (id: string) => Promise<void>;
  removeSavedItem: (id: string) => Promise<void>;
  total: string;
};

export type SavedCartItemResponse = {
  product_id: string;
  size: string | null;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
};
