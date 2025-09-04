import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';
import { supabase } from './supabaseClient';
import { Comment } from '../models/comment.interface';

@Injectable({ providedIn: 'root' })
export class ProductService {
  async uploadImage(file: File): Promise<string | null> {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('products')
      .upload(fileName, file);

    if (error) {
      console.error('Error subiendo imagen:', error.message);
      return null;
    }

    return supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    const payload = {
      name: product.name,
      description: product.description,
      price: product.price,
      old_price: product.oldPrice ?? null,
      image_url: product.imageUrl,
      rating: product.rating,
      reviews: product.reviews,
      tag: product.tag ?? null
    };

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando producto:', error.message);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      oldPrice: data.old_price,
      imageUrl: data.image_url,
      rating: data.rating,
      reviews: data.reviews,
      tag: data.tag
    } as Product;
  }

  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo productos:', error.message);
      return [];
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      oldPrice: item.old_price,
      imageUrl: item.image_url,
      rating: item.rating,
      reviews: item.reviews,
      tag: item.tag
    })) as Product[];
  }

  async getProductById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error obteniendo producto:', error.message);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      oldPrice: data.old_price,
      imageUrl: data.image_url,
      rating: data.rating,
      reviews: data.reviews,
      tag: data.tag
    } as Product;
  }

  async getCommentsByProduct(productId: number): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error obteniendo comentarios:', error.message);
      return [];
    }

    return (data ?? []).map(c => ({
      id: c.id,
      user: c.user_name,
      text: c.text,
      rating: c.rating,
      date: new Date(c.created_at)
    }));
  }

  async addComment(productId: number, user: string, text: string, rating: number): Promise<boolean> {
    const { error } = await supabase
      .from('comments')
      .insert([{ product_id: productId, user_name: user, text, rating }]);

    if (error) {
      console.error('❌ Error agregando comentario:', error.message);
      return false;
    }

    return true;
  }

  async register(user: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    age?: number;
  }) {
    // 1️⃣ Crear usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password
    });

    if (authError) throw new Error(authError.message);

    const userId = authData.user?.id;
    if (!userId) throw new Error('No se pudo obtener el ID del usuario');

    // 2️⃣ Guardar info adicional en tabla profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        name: user.name,
        email: user.email,
        phone: user.phone ?? null,
        age: user.age ?? null,
        role: 'comprador'
      }]);

    if (profileError) throw new Error(profileError.message);

    return authData.user;
  }

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw new Error(error.message);
    return data.user;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  }

  async getCurrentUser() {
    return supabase.auth.getUser().then(res => res.data.user);
  }

  // ProductService (o AuthService)
  async verifyEmail(tokenHash: string, type: 'signup' | 'recovery' | 'invite' = 'signup') {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type        // 'signup' cuando viene del correo de confirmación
    });
    if (error) throw new Error(error.message);
    return data.user;   // session también está disponible
  }


}
