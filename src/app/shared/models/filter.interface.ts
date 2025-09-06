// En models/filter.interface.ts o en product.interface.ts
export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  tags?: string[];
  isPopular?: boolean;
  searchTerm?: string;
  sortBy?: 'price' | 'rating' | 'name' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}