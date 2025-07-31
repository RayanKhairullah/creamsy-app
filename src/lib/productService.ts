import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import { Product } from '@/types';

const productsCollection = collection(db, 'products');

export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(productsCollection);
  return querySnapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  })) as Product[];
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<string> => {
  const docRef = await addDoc(productsCollection, product);
  return docRef.id;
};

export const updateProduct = async (id: string, product: Partial<Omit<Product, 'id'>>): Promise<void> => {
  const productRef = doc(db, 'products', id);
  await updateDoc(productRef, product);
};

export const deleteProduct = async (id: string): Promise<void> => {
  const productRef = doc(db, 'products', id);
  await deleteDoc(productRef);
};
