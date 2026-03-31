import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous errors

    try {
      // --- BACKEND INTEGRATION ---
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        // This catches the "Email already exists" error from your auth.ts
        throw new Error(data.error || 'Registration failed');
      }

      // Success: Redirect to login
      alert('Account created successfully! Please log in.');
      navigate('/login');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 selection:bg-orange-500 selection:text-white antialiased overflow-hidden py-12">
      
      {/* Background Decor */}
      <div className="fixed inset-0 w-full h-full bg-[#050505] -z-20"></div>
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none">
        <div className="bg-grid absolute inset-0 opacity-40"></div>
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(249,115,22,0.12)_0%,transparent_70%)] rounded-full blur-[70px]"></div>
      </div>
      <div className="noise-overlay fixed inset-0 z-50 pointer-events-none opacity-[0.04]"></div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-[#0A0A0A]/70 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] relative z-10">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <a href="/" className="flex items-center group transition-opacity hover:opacity-80">
            <iconify-icon icon="solar:wallet-bold" className="text-orange-500 text-2xl mr-2 group-hover:scale-110 transition-transform"></iconify-icon>
            <span className="text-white font-display text-2xl uppercase tracking-tighter">Budgetly</span>
          </a>
        </div>

        <h2 className="text-3xl font-display uppercase font-medium text-white tracking-tight mb-2">
          Create Account
        </h2>
        
        {/* Error Message Display */}
        {error ? (
          <p className="text-xs font-mono text-orange-500 uppercase tracking-widest mb-6">
            Error: {error}
          </p>
        ) : (
          <p className="text-sm text-gray-400 font-light mb-8">
            Join thousands mastering their wealth.
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2 pl-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <iconify-icon icon="solar:user-linear" className="text-gray-500 text-lg"></iconify-icon>
              </div>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#050505]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-all shadow-inner" 
                placeholder="Alex Johnson" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2 pl-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <iconify-icon icon="solar:letter-linear" className="text-gray-500 text-lg"></iconify-icon>
              </div>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050505]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-all shadow-inner" 
                placeholder="alex@example.com" 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2 pl-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <iconify-icon icon="solar:lock-keyhole-linear" className="text-gray-500 text-lg"></iconify-icon>
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#050505]/50 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-all shadow-inner" 
                placeholder="••••••••" 
                minLength={8}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 px-6 py-4 bg-orange-500 text-white text-sm font-semibold rounded-xl tracking-tight shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Create My Account'
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/5">
          <p className="text-xs text-gray-500 font-light">
            Already have an account?
            <button 
              onClick={() => navigate('/login')}
              className="ml-2 text-white hover:text-orange-500 font-medium transition-colors"
            >
              Log in instead
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}