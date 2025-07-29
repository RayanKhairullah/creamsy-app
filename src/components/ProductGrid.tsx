'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import Confetti from 'react-confetti';
import { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1000);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {products
          .filter((p) => p.type === 'base')
          .map((product) => (
            <motion.button
              key={product.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAdd(product)}
              className="bg-ice-cream-100 rounded-xl p-2 hover:bg-ice-cream-300 transition shadow-md flex flex-col items-center"
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-full mb-1"
                  unoptimized={false}
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mb-1" />
              )}
              <div className="font-bold text-center text-sm">{product.name}</div>
              <div className="text-xs">Rp {product.price.toLocaleString()}</div>
            </motion.button>
          ))}
      </div>

      <h2 className="mt-6 mb-3 font-semibold text-lg">Topping</h2>
      <div className="grid grid-cols-3 gap-4">
        {products
          .filter((p) => p.type === 'topping')
          .map((product) => (
            <motion.button
              key={product.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAdd(product)}
              className="bg-ice-cream-50 rounded-xl p-2 hover:bg-ice-cream-200 transition shadow flex flex-col items-center"
            >
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-cover rounded-full mb-1"
                  unoptimized={false}
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 mb-1" />
              )}
              <div className="text-center text-xs">{product.name}</div>
              <div className="text-xs">+Rp {product.price.toLocaleString()}</div>
            </motion.button>
          ))}
      </div>
      
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={100}
        />
      )}
    </div>
  );
}