// src/app/product.interface.ts
export interface Product {
  id: number;
  name: string;
  description: string; 
  image_url: string;
  price: number;
  oldPrice?: number; 
  rating: number; 
  reviews: number;
  tag?: string;
  is_popular?: boolean;
  created_at?: any;
  sizes?: string[]; 
}