'use client';
import { useState, useEffect } from 'react';
import ProductGrid from '@/components/ProductGrid';
import Cart from '@/components/Cart';
import VariationModal from '@/components/VariationModal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, CartItem, Topping } from '@/types';

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [pendingBase, setPendingBase] = useState<Product | null>(null);

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

  const handleAddToCart = (product: Product) => {
    if (product.type === 'base') {
      setPendingBase(product);
      setShowVariationModal(true);
    } else if (product.type === 'topping') {
      if (cartItems.length > 0) {
        const lastItem = cartItems[cartItems.length - 1];
        const updatedItem: CartItem = {
          ...lastItem,
          toppings: [...lastItem.toppings, product],
          totalPrice: lastItem.totalPrice + product.price
        };
        const newCartItems = [...cartItems];
        newCartItems[newCartItems.length - 1] = updatedItem;
        setCartItems(newCartItems);
      }
    }
  };

  const handleCloseVariation = () => {
    setShowVariationModal(false);
    setPendingBase(null);
  };

  const handleConfirmVariation = (variation: { container: string; toppings: Topping[] }) => {
    if (pendingBase) {
      const toppingTotal = variation.toppings.reduce((sum, t) => sum + t.price, 0);
      setCartItems([
        ...cartItems,
        {
          id: pendingBase.id,
          name: pendingBase.name,
          basePrice: pendingBase.price,
          container: variation.container,
          toppings: variation.toppings,
          totalPrice: pendingBase.price + toppingTotal
        }
      ]);
    }
    setShowVariationModal(false);
    setPendingBase(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        <ProductGrid 
          products={products} 
          onAddToCart={handleAddToCart} 
        />
      </div>
      <Cart items={cartItems} />
      {showVariationModal && pendingBase && (
        <VariationModal
          open={showVariationModal}
          onClose={handleCloseVariation}
          onConfirm={handleConfirmVariation}
          toppings={products.filter((p) => p.type === 'topping').map(({id, name, price}) => ({id, name, price}))} // convert Product[] to Topping[]
        />
      )}
    </div>
  );
}