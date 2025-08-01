'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardNavLink from './DashboardNavLink';
import { motion } from 'framer-motion';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!session) {
          router.push('/login');
          return;
        }
        
        setUser({ email: session.user.email || 'User' });
      } catch (err) {
        console.error('Session check error:', err);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login');
      } else {
        setUser({ email: session.user.email || 'User' });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ice-cream-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Creamsy POS</h1>
              {user && (
                <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {user.email.split('@')[0]}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Keluar
              </button>
              
              <button 
                className="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Mobile Navigation */}
      <motion.nav
        initial={{ y: "100%" }}
        animate={{ y: showMobileMenu ? 0 : "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50"
      >
        <div className="flex justify-around p-2">
          <DashboardNavLink href="/dashboard" label="Produk" mobile />
          <DashboardNavLink href="/dashboard/products" label="Kelola" mobile />
          <DashboardNavLink href="/dashboard/transaksi" label="Transaksi" mobile />
          <DashboardNavLink href="/dashboard/laporan" label="Laporan" mobile />
        </div>
      </motion.nav>

      {/* Desktop Navigation */}
      <nav className="hidden sm:block bg-white border-t shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-around p-2">
            <DashboardNavLink href="/dashboard" label="Produk" />
            <DashboardNavLink href="/dashboard/products" label="Kelola Produk" />
            <DashboardNavLink href="/dashboard/transaksi" label="Transaksi" />
            <DashboardNavLink href="/dashboard/laporan" label="Laporan" />
          </div>
        </div>
      </nav>
    </div>
  );
}