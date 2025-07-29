'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import DashboardNavLink from './DashboardNavLink';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-ice-cream-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Creamsy Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="text-sm bg-ice-cream-700 px-3 py-1 rounded"
        >
          Logout
        </button>
      </header>
      <main className="flex-grow p-4">{children}</main>
      <nav className="bg-gray-100 p-2 flex justify-around border-t">
        <DashboardNavLink href="/dashboard/produk" label="Produk" />
        <DashboardNavLink href="/dashboard/transaksi" label="Transaksi" />
        <DashboardNavLink href="/dashboard/laporan" label="Laporan" />
      </nav>
    </div>
  );
}