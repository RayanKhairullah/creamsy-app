// src/app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleLogin = async () => {
    if (pin.length !== 4) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      // Generate email from PIN (format: [pin]@creamsy.app)
      const email = `${pin}@creamsy.app`;
      // Password: [pin]aa (to meet 6 character requirement)
      const password = `${pin}aa`;
      
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) {
        throw new Error('Invalid PIN. Please try again.');
      }
      
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      setTimeout(() => setPin(''), 500);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length === 4) {
      handleLogin();
    }
  };
  
  const handleBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      prevInput?.focus();
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-ice-cream-50 to-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md"
      >
        <div className="bg-gradient-to-r from-ice-cream-500 to-ice-cream-600 p-8 text-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="text-6xl mb-3"
          >
            🍦
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-1">Creamsy POS</h1>
          <p className="text-ice-cream-100">Point of Sale System</p>
        </div>
        
        <div className="p-8">
          <div className="mb-8">
            <label className="block text-gray-700 mb-3 font-medium text-center">
              Enter Your 4-Digit Staff PIN
            </label>
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <motion.input
                  key={index}
                  type="password"
                  maxLength={1}
                  value={pin[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      const newPin = pin.slice(0, index) + value + pin.slice(index + 1);
                      setPin(newPin);
                      if (value && index < 3) {
                        const nextInput = document.getElementById(`pin-input-${index + 1}`);
                        nextInput?.focus();
                      }
                    }
                  }}
                  onKeyDown={(e) => handleBackspace(index, e)}
                  id={`pin-input-${index}`}
                  className="w-16 h-16 text-center text-3xl font-mono border-2 border-gray-300 rounded-xl focus:border-ice-cream-500 focus:outline-none focus:ring-2 focus:ring-ice-500/20 transition-all"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  whileFocus={{ scale: 1.05, borderColor: '#f97316' }}
                />
              ))}
            </div>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            </motion.div>
          )}
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            disabled={pin.length !== 4 || isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center ${
              pin.length === 4 && !isLoading 
                ? 'bg-ice-cream-500 hover:bg-ice-cream-600 shadow-lg shadow-ice-cream-500/20' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Access Dashboard'
            )}
          </motion.button>
          
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              This is for staff members only. Contact store manager if you need access.
            </p>
            <div className="mt-2 flex items-center justify-center text-ice-cream-500 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              PIN format: 4 digits (e.g., 1234)
            </div>
          </div>
        </div>
        
        <div className="px-8 py-4 bg-gray-50 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Version 1.0.0</span>
            <a href="/" className="text-ice-cream-500 hover:text-ice-cream-600 transition-colors">
              ← Back to Shop
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}