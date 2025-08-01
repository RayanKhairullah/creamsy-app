// src/app/page.tsx
import { getProducts } from '@/lib/productService';
import PublicProductGrid from '@/components/PublicProductGrid';
import { Product } from '@/types';

export const metadata = {
  title: 'Creamsy - Fresh Ice Cream Shop',
  description: 'Fresh ice cream with customizable toppings. Visit our shop today!',
};

export default async function HomePage() {
  let products: Product[] = [];
  
  try {
    products = await getProducts();
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  return (
    <div className="min-h-screen bg-white from-ice-cream-50 to-white">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center text-black">
          <div className="flex items-center space-x-2">
            <div className="text-3xl">🍦</div>
            <h1 className="text-2xl font-bold">Creamsy</h1>
          </div>
          <a 
            href="/login" 
            className="bg-ice-cream-500 hover:bg-ice-cream-600 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Staff Login
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-black mb-4">Fresh Handcrafted Ice Cream</h2>
          <p className="text-xl text-black">
            Made with love using premium ingredients. Choose from our wide selection of flavors and toppings.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
          <PublicProductGrid products={products} />
          
          <div className="mt-10 text-center">
            <a 
              href="/login" 
              className="inline-flex items-center bg-ice-cream-500 hover:bg-ice-cream-600 text-white px-6 py-3 rounded-xl font-bold text-lg transition-colors transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              place an order
            </a>
            <p className="mt-3 text-gray-500 text-sm">Visit the nearest creamsy store</p>
          </div>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-xl font-bold mb-2">Premium Ingredients</h3>
            <p className="text-gray-600">We use only the finest ingredients for our ice cream</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-3">🍦</div>
            <h3 className="text-xl font-bold mb-2">Handcrafted Daily</h3>
            <p className="text-gray-600">Fresh batches made every morning with love</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-3">🌟</div>
            <h3 className="text-xl font-bold mb-2">Custom Creations</h3>
            <p className="text-gray-600">Create your perfect ice cream with our toppings</p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 py-8 mt-16 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-black">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="text-2xl mr-2">🍦</div>
              <span className="font-bold text-lg">Creamsy Ice Cream</span>
            </div>
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Creamsy. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 text-gray-600">
              <a href="/login" className="hover:text-ice-cream-500 transition-colors">Staff Login</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}