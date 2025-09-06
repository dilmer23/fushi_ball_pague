export interface CarouselImage {
  id: string;
  title?: string;
  description?: string;
  image_url: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}