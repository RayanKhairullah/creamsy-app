import { supabase } from './supabase';
import imageCompression from 'browser-image-compression';

export const uploadImage = async (file: File): Promise<string> => {
  const options = {
    maxSizeMB: 0.5, // Max size 500KB
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: 'image/webp'
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const fileName = `products/${Date.now()}_${file.name.split('.').slice(0, -1).join('.')}.webp`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, compressedFile);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Image compression or upload failed:', error);
    throw error;
  }
};