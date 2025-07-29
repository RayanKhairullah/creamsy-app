'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Gunakan format: [pin]@creamsy.app
      const email = `${pin}@creamsy.app`;
      // Password: [pin]aa (untuk memenuhi 6 karakter)
      const password = `${pin}aa`;
      
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('PIN salah. Coba lagi.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ice-cream-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xs">
        <h1 className="text-2xl font-bold text-center mb-6 text-black">Creamsy</h1>
        
        <div className="mb-4">
          <label className="block text-black mb-2">Masukkan PIN (4 digit)</label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0,4))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-xl text-black"
            inputMode="numeric"
          />
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <button
          onClick={handleLogin}
          disabled={pin.length !== 4}
          className="w-full py-3 bg-black text-white rounded-lg font-semibold disabled:opacity-50"
        >
          Masuk
        </button>
      </div>
    </div>
  );
}