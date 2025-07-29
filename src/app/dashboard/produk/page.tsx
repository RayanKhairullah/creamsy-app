"use client";
import ProductGrid from '@/components/ProductGrid';
import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Daftar Produk</h1>
      <ProductGrid products={products} onAddToCart={() => {}} />
    </div>
  );
}
