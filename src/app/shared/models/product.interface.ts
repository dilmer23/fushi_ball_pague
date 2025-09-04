// src/app/product.interface.ts
export interface Product {
  id: number;
  name: string;
  description: string; 
  imageUrl: string;
  price: number;
  oldPrice?: number; 
  rating: number; 
  reviews: number;
  tag?: string; 
}