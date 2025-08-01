'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { saveTransaction } from '@/lib/transactionService';
import { CartItem } from '@/types';

export default function PaymentPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Get cart items from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    const savedCart = localStorage.getItem('creamsy_cart');
    if (savedCart) {
      const parsedCart: CartItem[] = JSON.parse(savedCart);
      setCartItems(parsedCart);
      
      const calculatedTotal = parsedCart.reduce(
        (sum, item) => sum + item.totalPrice, 
        0
      );
      setTotal(calculatedTotal);
    }
  }, []);

  const handleSubmit = async () => {
    setIsSaving(true);
    
    try {
      const transactionId = await saveTransaction(cartItems, {
        method: paymentMethod,
        cashReceived: paymentMethod === 'cash' ? Number(cashReceived) : 0,
        change: paymentMethod === 'cash' ? (Number(cashReceived) - total) : 0
      });
      
      if (transactionId) {
        // Clear cart
        localStorage.removeItem('creamsy_cart');
        // Redirect to receipt page
        router.push(`/dashboard/receipt?id=${transactionId}`);
      } else {
        throw new Error('Transaction ID not returned');
      }
    } catch (error) {
      console.error("Error saving transaction: ", error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 text-black">
      <h1 className="text-xl font-bold mb-6">Pembayaran</h1>
      
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Total: Rp {total.toLocaleString()}</h2>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Metode Pembayaran</label>
        <div className="flex gap-2">
          <button
            className={`flex-1 py-3 rounded-lg border ${
              paymentMethod === 'cash' ? 'border-ice-cream-500 bg-ice-cream-100' : 'border-gray-300'
            }`}
            onClick={() => setPaymentMethod('cash')}
          >
            Tunai
          </button>
          <button
            className={`flex-1 py-3 rounded-lg border ${
              paymentMethod === 'qris' ? 'border-ice-cream-500 bg-ice-cream-100' : 'border-gray-300'
            }`}
            onClick={() => setPaymentMethod('qris')}
          >
            QRIS
          </button>
        </div>
      </div>
      
      {paymentMethod === 'cash' && (
        <div className="mb-6">
          <label className="block mb-2 font-medium">Uang Diterima</label>
          <input
            type="number"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg text-lg"
            placeholder="0"
          />
          
          {cashReceived && Number(cashReceived) > 0 && (
            <div className="mt-2 text-lg">
              Kembalian: Rp {(Number(cashReceived) - total).toLocaleString()}
            </div>
          )}
        </div>
      )}
      
      {paymentMethod === 'qris' && (
        <div className="mb-6 text-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-48 h-48 mx-auto" />
          <p className="mt-2 text-sm">Scan QR code untuk pembayaran</p>
        </div>
      )}
      
      <button
        onClick={handleSubmit}
        disabled={isSaving || (paymentMethod === 'cash' && (!cashReceived || Number(cashReceived) < total))}
        className={`w-full py-4 bg-ice-cream-500 text-white rounded-lg font-bold ${
          isSaving ? 'opacity-70' : ''
        }`}
      >
        {isSaving ? 'Menyimpan transaksi...' : 'Proses Pembayaran'}
      </button>
    </div>
  );
}