import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';
import { supabase } from './supabaseClient';
import { Comment } from '../models/comment.interface';
import { ProductFilter } from '../models/filter.interface';
import { CarouselImage } from '../models/carousel.interface';

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
      image_url: product.image_url,
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
      image_url: data.image_url,
      rating: data.rating,
      reviews: data.reviews,
      tag: data.tag
    } as Product;
  }

  // async getProducts(): Promise<Product[]> {
  //   const { data, error } = await supabase
  //     .from('products')
  //     .select('*')
  //     .order('created_at', { ascending: false });

  //   if (error) {
  //     console.error('❌ Error obteniendo productos:', error.message);
  //     return [];
  //   }

  //   return data.map((item: any) => ({
  //     id: item.id,
  //     name: item.name,
  //     description: item.description,
  //     price: item.price,
  //     oldPrice: item.old_price,
  //     image_url: item.image_url,
  //     rating: item.rating,
  //     reviews: item.reviews,
  //     tag: item.tag,
  //     sizes: item.sizes ?? []
  //   })) as Product[];
  // }

  async getProductById(id: number): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
      *,
      product_sizes(size)
    `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Error obteniendo producto:', error.message);
      return null;
    }

    // Convertir "s,l,m,xl,xxl" → ["s","l","m","xl","xxl"]
    const sizes: string[] = data.product_sizes?.[0]?.size
      ? data.product_sizes[0].size.split(',').map((s: string) => s.trim())
      : [];

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      oldPrice: data.old_price,
      image_url: data.image_url,
      rating: data.rating,
      reviews: data.reviews,
      tag: data.tag,
      sizes
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

  async getUserRole(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('❌ Error obteniendo rol:', error.message);
      return null;
    }

    return data?.role ?? null;
  }

  async getUserFavorites(userId: string): Promise<number[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', userId);

    if (error) {
      console.error('❌ obteniendo favoritos:', error);
      return [];
    }
    return (data || []).map(f => f.product_id);
  }

  async addFavorite(userId: string, productId: number): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, product_id: productId });
    if (error) console.error('❌ add favorite:', error);
  }

  async removeFavorite(userId: string, productId: number): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) console.error('❌ remove favorite:', error);
  }

  async toggleFavorite(userId: string, productId: number, isFav: boolean): Promise<void> {
    return isFav
      ? this.removeFavorite(userId, productId)
      : this.addFavorite(userId, productId);
  }


  async getUserFavoriteProducts(userId: string): Promise<Product[]> {
    const { data: favRows, error: favErr } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', userId);
    if (favErr || !favRows?.length) return [];
    const ids = favRows.map(f => f.product_id);
    const { data: prodRows, error: prodErr } = await supabase
      .from('products')
      .select('*')
      .in('id', ids)
      .order('created_at', { ascending: false });
    if (prodErr) {
      console.error('❌ obteniendo productos favoritos:', prodErr);
      return [];
    }
    return (prodRows || []) as Product[];
  }

  async softDeleteProduct(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .update({ visible: false })
      .eq('id', id);

    if (error) {
      console.error('❌ Error ocultando producto:', error.message);
      return false;
    }
    return true;
  }

  async getProducts(filter?: ProductFilter): Promise<Product[]> {
    // Iniciar la consulta
    let query = supabase
      .from('products')
      .select('*')
      .eq('visible', true);

    // Aplicar filtros
    if (filter) {
      // Filtrar por categoría (si implementas categorías en el futuro)
      if (filter.category) {
        query = query.eq('category', filter.category);
      }

      // Filtrar por rango de precio
      if (filter.minPrice !== undefined) {
        query = query.gte('price', filter.minPrice);
      }
      if (filter.maxPrice !== undefined) {
        query = query.lte('price', filter.maxPrice);
      }

      // Filtrar por rating mínimo
      if (filter.minRating !== undefined) {
        query = query.gte('rating', filter.minRating);
      }

      // Filtrar por tags
      if (filter.tags && filter.tags.length > 0) {
        query = query.in('tag', filter.tags);
      }

      // Filtrar por productos populares
      if (filter.isPopular !== undefined) {
        query = query.eq('is_popular', filter.isPopular);
      }

      // Filtrar por término de búsqueda
      if (filter.searchTerm) {
        query = query.ilike('name', `%${filter.searchTerm}%`);
      }

      // Ordenar
      if (filter.sortBy) {
        query = query.order(filter.sortBy, {
          ascending: filter.sortOrder === 'asc'
        });
      } else {
        // Orden por defecto
        query = query.order('created_at', { ascending: false });
      }

      // Límite de resultados
      if (filter.limit) {
        query = query.limit(filter.limit);
      }
    } else {
      // Orden por defecto si no hay filtros
      query = query.order('created_at', { ascending: false });
    }

    // Ejecutar la consulta
    const { data, error } = await query;

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
      image_url: item.image_url,
      rating: item.rating,
      reviews: item.reviews,
      tag: item.tag,
      sizes: item.sizes ?? [],
      is_popular: item.is_popular || false
    })) as Product[];
  }

  // En product.service.ts, modifica el método updateProduct
  async updateProduct(id: number, productData: any): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          old_price: productData.oldPrice,
          image_url: productData.imageUrl,
          rating: productData.rating,
          reviews: productData.reviews,
          tag: productData.tag,
          sizes: productData.sizes,
          updated_at: new Date()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        return null;
      }

      // Mapear los datos de la respuesta a la interfaz Product
      return this.mapProduct(data);
    } catch (error) {
      console.error('Error in updateProduct:', error);
      return null;
    }
  }

  // Añade el método mapProduct si no existe
  private mapProduct(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      oldPrice: data.old_price,
      image_url: data.image_url,
      rating: data.rating,
      reviews: data.reviews,
      tag: data.tag,
      sizes: data.sizes || []
    } as Product;
  }

  async getActiveImages(): Promise<CarouselImage[]> {
    const { data, error } = await supabase
      .from('carousel_images')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('❌ Error cargando carrusel:', error.message);
      return [];
    }

    return data as CarouselImage[];
  }

}
