export type Page = 'HOME' | 'CATEGORIES' | 'PRODUCT' | 'CART' | 'PROFILE' | 'ORDERS' | 'ADMIN' | 'HELP' | 'EXCHANGES' | 'CONTACT' | 'PRIVACY';

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  subcategory?: string; // Added for filtering
  isNew?: boolean;
  images?: string[];
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
  total: number;
  items: CartItem[]; // Changed to hold full items
}

export interface Address {
  id: number;
  name: string;
  street: string;
  district: string;
  city: string;
  zip: string;
  isDefault: boolean;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  addresses: Address[];
}

export interface Client {
  id: number;
  name: string;
  email: string;
  totalSpent: number;
  ordersCount: number;
  lastOrder: string;
}