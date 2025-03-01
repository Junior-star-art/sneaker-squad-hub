
export interface CartItem {
  id: string;
  name: string;
  price: string | number;
  image: string;
  quantity: number;
  size?: string;
}

export interface CartContextType {
  items: CartItem[];
  savedItems: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  saveForLater: (id: string) => Promise<void>;
  moveToCart: (id: string) => Promise<void>;
  removeSavedItem: (id: string) => Promise<void>;
  clearCart: () => void;
  total: string;
}
