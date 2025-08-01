'use client';
import { useState, useEffect } from 'react';
import ProductGrid from '@/components/ProductGrid';
import Cart from '@/components/Cart';
import VariationModal from '@/components/VariationModal';
import { getProducts } from '@/lib/productService';
import { Product, CartItem, Topping } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [pendingBase, setPendingBase] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'base' | 'topping'>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Gagal memuat produk. Periksa koneksi Anda atau coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (product.type === 'base') {
      setPendingBase(product);
      setShowVariationModal(true);
    } else if (product.type === 'topping' && cartItems.length > 0) {
      const lastItem = cartItems[cartItems.length - 1];
      const updatedItem: CartItem = {
        ...lastItem,
        toppings: [...lastItem.toppings, product],
        totalPrice: lastItem.totalPrice + product.price
      };
      
      setCartItems(prev => {
        const newItems = [...prev];
        newItems[newItems.length - 1] = updatedItem;
        return newItems;
      });
    }
  };

  const handleCloseVariation = () => {
    setShowVariationModal(false);
    setPendingBase(null);
  };

  const handleConfirmVariation = (variation: { container: string; toppings: Topping[] }) => {
    if (pendingBase) {
      const toppingTotal = variation.toppings.reduce((sum, t) => sum + t.price, 0);
      setCartItems(prev => [
        ...prev,
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

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.type === activeCategory);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Category Filters */}
      <div className="px-4 py-3 bg-white border-b">
        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'all' 
                ? 'bg-ice-cream-500 text-gray-500 shadow-sm' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveCategory('base')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'base' 
                ? 'bg-ice-cream-500 text-gray-500 shadow-sm' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Base
          </button>
          <button
            onClick={() => setActiveCategory('topping')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'topping' 
                ? 'bg-ice-cream-500 text-gray-500 shadow-sm' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Topping
          </button>
        </div>
      </div>

      {/* Products Area */}
      <div className="flex-grow overflow-hidden">
        {loading ? (
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full aspect-square mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-gray-700">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-ice-cream-500 hover:bg-ice-cream-600 focus:outline-none"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="bg-gray-50 border border-dashed rounded-lg p-6 max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada produk</h3>
              <p className="text-gray-500 mb-4">Belum ada produk yang tersedia dalam kategori ini.</p>
              {activeCategory !== 'all' && (
                <button 
                  onClick={() => setActiveCategory('all')}
                  className="text-ice-cream-500 hover:text-ice-cream-600 font-medium"
                >
                  Lihat semua produk
                </button>
              )}
            </div>
          </div>
        ) : (
          <ProductGrid 
            products={filteredProducts} 
            onAddToCart={handleAddToCart} 
            className="p-4"
          />
        )}
      </div>

      {/* Cart */}
      <AnimatePresence>
        {cartItems.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="z-20"
          >
            <Cart 
              items={cartItems} 
              onRemoveItem={(index) => {
                setCartItems(prev => prev.filter((_, i) => i !== index));
              }}
              onClearCart={() => setCartItems([])}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Variation Modal */}
      <AnimatePresence>
        {showVariationModal && pendingBase && (
          <VariationModal
            open={showVariationModal}
            onClose={handleCloseVariation}
            onConfirm={handleConfirmVariation}
            toppings={products.filter(p => p.type === 'topping').map(({id, name, price}) => ({id, name, price}))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}