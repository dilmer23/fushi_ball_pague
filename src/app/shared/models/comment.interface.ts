export interface Comment {
  id: number;
  user: string;
  text: string;
  rating: number; // 1-5 estrellas
  date: Date;
}
