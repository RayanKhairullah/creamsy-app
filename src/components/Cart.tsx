'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CartItem } from '@/types';

interface CartProps {
  items: CartItem[];
}

export default function Cart({ items }: CartProps) {
  const router = useRouter();
  const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  if (items.length === 0) return null;
  
  const handleCheckout = () => {
    localStorage.setItem('creamsy_cart', JSON.stringify(items));
    router.push('/dashboard/payment');
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg"
    >
      <div className="flex justify-between items-center text-black mb-4">
        <div>
          <div className="font-bold">Keranjang ({items.length})</div>
          <div className="text-lg">Rp {total.toLocaleString()}</div>
        </div>
        <button
          onClick={handleCheckout}
          className="px-6 py-3 bg-ice-cream-500 text-black rounded-lg font-semibold"
        >
          Bayar
        </button>
      </div>
    </motion.div>
  );
}