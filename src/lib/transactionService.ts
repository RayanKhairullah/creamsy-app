import { supabase } from './supabase';
import { CartItem, Transaction } from '@/types';

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
    // Start transaction
    await supabase.rpc('begin_transaction');
    
    // Insert main transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        id: transactionId,
        total,
        payment_method: payment.method,
        cash_received: payment.cashReceived,
        change: payment.change
      }]);
      
    if (transactionError) throw transactionError;
    
    // Insert transaction items
    for (const item of cartItems) {
      const { data: itemData, error: itemError } = await supabase
        .from('transaction_items')
        .insert([{
          transaction_id: transactionId,
          product_id: item.id,
          base_price: item.basePrice,
          container: item.container,
          total_price: item.totalPrice
        }])
        .select('id')
        .single();
        
      if (itemError) throw itemError;
      
      // Insert toppings for this item
      for (const topping of item.toppings) {
        const { error: toppingError } = await supabase
          .from('transaction_item_toppings')
          .insert([{
            transaction_item_id: itemData.id,
            topping_id: topping.id
          }]);
          
        if (toppingError) throw toppingError;
      }
    }
    
    // Commit transaction
    await supabase.rpc('commit_transaction');
    
    return transactionId;
  } catch (e) {
    // Rollback on error
    await supabase.rpc('rollback_transaction');
    console.error("Error adding transaction: ", e);
    throw new Error("Gagal menyimpan transaksi");
  }
};

export const getTransactionById = async (id: string): Promise<Transaction | null> => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      id,
      total,
      payment_method,
      cash_received,
      change,
      created_at,
      transaction_items (
        id,
        product_id,
        base_price,
        container,
        total_price,
        products (
          id,
          name,
          price,
          type,
          image_url
        ),
        transaction_item_toppings (
          topping_id,
          products (
            id,
            name,
            price
          )
        )
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  if (!data) return null;

  const items = data.transaction_items.map((item: any) => {
    const product = Array.isArray(item.products) ? item.products[0] : item.products;
    const toppings = (item.transaction_item_toppings || []).map((toppingItem: any) => {
      const toppingProduct = Array.isArray(toppingItem.products) ? toppingItem.products[0] : toppingItem.products;
      return {
        id: toppingProduct?.id ?? '',
        name: toppingProduct?.name ?? '',
        price: toppingProduct?.price ?? 0
      };
    });
    return {
      id: product?.id ?? '',
      name: product?.name ?? '',
      basePrice: item.base_price,
      container: item.container,
      toppings,
      totalPrice: item.total_price,
      image: product?.image_url ?? undefined,
      type: product?.type ?? undefined
    };
  });

  return {
    id: data.id,
    items,
    total: data.total,
    payment: {
      method: data.payment_method,
      cashReceived: data.cash_received,
      change: data.change
    },
    timestamp: new Date(data.created_at)
  };
};

export const getTransactions = async (): Promise<Transaction[]> => {
  // This is more complex as we need to join multiple tables
  const { data: transactionsData, error: transactionsError } = await supabase
    .from('transactions')
    .select(`
      id,
      total,
      payment_method,
      cash_received,
      change,
      created_at,
      transaction_items (
        id,
        product_id,
        base_price,
        container,
        total_price,
        products (
          id,
          name,
          price,
          type,
          image_url
        ),
        transaction_item_toppings (
          topping_id,
          products (
            id,
            name,
            price
          )
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (transactionsError) throw transactionsError;

  return transactionsData.map(transaction => {
    const items = transaction.transaction_items.map(item => {
      // Process toppings
      // Normalize product (sometimes Supabase join returns array)
      const product = Array.isArray(item.products) ? item.products[0] : item.products;
      const toppings = (item.transaction_item_toppings || []).map((toppingItem: any) => {
        const toppingProduct = Array.isArray(toppingItem.products) ? toppingItem.products[0] : toppingItem.products;
        return {
          id: toppingProduct?.id ?? '',
          name: toppingProduct?.name ?? '',
          price: toppingProduct?.price ?? 0
        };
      });
      return {
        id: product?.id ?? '',
        name: product?.name ?? '',
        basePrice: item.base_price,
        container: item.container,
        toppings,
        totalPrice: item.total_price,
        image: product?.image_url ?? undefined,
        type: product?.type ?? undefined
      };
    });

    return {
      id: transaction.id,
      items,
      total: transaction.total,
      payment: {
        method: transaction.payment_method,
        cashReceived: transaction.cash_received,
        change: transaction.change
      },
      timestamp: new Date(transaction.created_at)
    };
  });
};