import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { CartItem } from '@/types';
import { Transaction } from '@/types';

interface PaymentData {
  method: string;
  cashReceived: number;
  change: number;
}

export const saveTransaction = async (cartItems: CartItem[], payment: PaymentData) => {
  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  
  // Generate transaction ID
  const now = new Date();
  const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}`;
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const transactionId = `IC-${dateStr}-${randomNum}`;
  
  try {
    await addDoc(collection(db, "transactions"), {
      id: transactionId,
      items: cartItems,
      total,
      payment: {
        method: payment.method,
        cashReceived: payment.cashReceived,
        change: payment.change
      },
      timestamp: serverTimestamp()
    });
    
    return transactionId;
  } catch (e) {
    console.error("Error adding transaction: ", e);
    throw new Error("Gagal menyimpan transaksi");
  }
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const querySnapshot = await getDocs(collection(db, 'transactions'));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: data.id,
      items: data.items,
      total: data.total,
      payment: data.payment,
      timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date()
    } as Transaction;
  });
};