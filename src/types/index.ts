export interface Product {
  id: string;
  name: string;
  price: number;
  type: 'base' | 'topping';
  image?: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  container: string;
  toppings: Topping[];
  totalPrice: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  total: number;
  payment: {
    method: string;
    cashReceived?: number;
    change?: number;
  };
  timestamp: Date;
}