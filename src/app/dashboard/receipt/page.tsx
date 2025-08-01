'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTransactionById } from '@/lib/transactionService';
import { Transaction, CartItem } from '@/types';

export default function ReceiptPage() {
  const router = useRouter();
  const params = useSearchParams();
  const transactionId = params.get('id');
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const trans = await getTransactionById(transactionId);
        setTransaction(trans);
      } catch (error) {
        console.error('Failed to fetch transaction:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransaction();
  }, [transactionId]);

  const handleBack = () => {
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>Memuat struk...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Struk Tidak Ditemukan</h1>
        <button
          onClick={handleBack}
          className="w-full py-4 bg-ice-cream-500 text-white rounded-lg font-bold"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-6">Struk Pembayaran</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center mb-4">
          <div className="font-bold">🍦 Creamsy Ice Cream</div>
          <div className="text-sm">Jl. Es Krim No. 123</div>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 my-4">
          <div className="flex justify-between">
            <span>ID Transaksi:</span>
            <span>{transaction.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{transaction.timestamp.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mb-4">
          {transaction.items.map((item, index) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between">
                <span>{item.name} ({item.container})</span>
                <span>Rp {item.totalPrice.toLocaleString()}</span>
              </div>
              {item.toppings.length > 0 && (
                <div className="pl-4 text-sm">
                  {item.toppings.map((topping, i) => (
                    <div key={i} className="flex justify-between">
                      <span>+ {topping.name}</span>
                      <span>Rp {topping.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-300 pt-2 mb-4">
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>Rp {transaction.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Metode:</span>
            <span className="capitalize">{transaction.payment.method}</span>
          </div>
          {transaction.payment.method === 'cash' && (
            <>
              <div className="flex justify-between">
                <span>Tunai:</span>
                <span>Rp {transaction.payment.cashReceived?.toLocaleString() ?? '0'}</span>
              </div>
              <div className="flex justify-between">
                <span>Kembalian:</span>
                <span>Rp {transaction.payment.change?.toLocaleString() ?? '0'}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="text-center text-sm mt-8">
          Terima kasih telah berbelanja
        </div>
      </div>
      
      <button
        onClick={handleBack}
        className="w-full py-4 bg-ice-cream-500 text-white rounded-lg font-bold mt-6"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}