import { supabase } from './supabase';
import { Product } from '@/types';

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name');

  if (error) throw error;
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    type: item.type,
    image: item.image_url
  })) as Product[];
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      name: product.name,
      price: product.price,
      type: product.type,
      image_url: product.image
    }])
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
};

export const updateProduct = async (id: string, product: Partial<Omit<Product, 'id'>>): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({
      name: product.name,
      price: product.price,
      type: product.type,
      image_url: product.image
    })
    .eq('id', id);

  if (error) throw error;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};