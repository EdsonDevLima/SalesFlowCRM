export interface ISales {
    id?: number;
    userId: number;
    productIds: number[];
    total: number;
}

export type UserRole = 'customer' | 'admin';

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';


export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
}

export interface SalesResult {
  id: number;
  created_at: string;
  user: User;
  products: Product[];
  total: string;
  status: OrderStatus;
}