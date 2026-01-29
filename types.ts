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
  inventory?: Record<string, number>; // {"P": 10, "M": 5}
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
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
  number?: string;
  district: string;
  city: string;
  state: string;
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

export interface Banner {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_primary_text: string;
  button_primary_link: string;
  button_secondary_text: string;
  button_secondary_link: string;
  priority: number;
  active: boolean;
  display_duration: number;
}