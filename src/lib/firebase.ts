
import { createClient } from '@supabase/supabase-js'
import type { Product, Category, Order } from './types';

// Add your Supabase types here
export type Tables<T> = {
  public: {
    Tables: {
      [K in keyof T]: T[K]
    }
  }
}

export type Database = Tables<{
  products: Product;
  categories: Category;
  orders: Order;
  customers: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    created_at: string;
  };
}>

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
