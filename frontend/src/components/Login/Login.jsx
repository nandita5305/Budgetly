import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // --- BACKEND INTEGRATION ---
    // try {
    //   const response = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password })
    //   });
    //   if (response.ok) {
    //     // Redirect to dashboard
    //   }
    // } catch (error) { ... }

    setTimeout(() => {
      setIsLoading(false);
      alert('Login submitted! (Mock)');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 selection:bg-orange-500 selection:text-white antialiased overflow-hidden">
      
      {/* Shared Background Elements */}
      <div className="fixed inset-0 w-full h-full bg-[color:var(--bg-main)] -z-20"></div>
      <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none">
        <div className="bg-grid absolute inset-0 opacity-40"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(249,115,22,0.15)_0%,transparent_70%)] rounded-full blur-[60px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,transparent_70%)] rounded-full blur-[80px]"></div>
      </div>
      <div className="noise-overlay fixed inset-0 z-50 pointer-events-none opacity-[0.04]"></div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-[color:var(--bg-card)]/70 backdrop-blur-xl border border-[color:var(--border)] p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] relative z-10">
        
        {/* Logo / Home Link */}
        <div className="flex justify-center mb-10">
          <a href="/" className="flex items-center group transition-opacity hover:opacity-80">
            <iconify-icon icon="solar:wallet-bold" className="text-[color:var(--accent)] text-2xl mr-2 group-hover:scale-110 transition-transform"></iconify-icon>
            <span className="text-[color:var(--text)] font-display text-2xl uppercase tracking-tighter">Budgetly</span>
          </a>
        </div>

        <h2 className="text-3xl font-display uppercase font-medium text-[color:var(--text)] tracking-tight mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-[color:var(--text-muted)] font-light mb-8">
          Enter your credentials to access your financial dashboard.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)] mb-2 pl-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <iconify-icon icon="solar:letter-linear" className="text-[color:var(--text-subtle)] text-lg"></iconify-icon>
              </div>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[color:var(--bg-main)]/50 border border-[color:var(--border)] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[color:var(--text)] placeholder-[color:var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30 focus:border-[color:var(--accent)] transition-all shadow-inner" 
                placeholder="alex@example.com" 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 pl-1 pr-1">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)]">
                Password
              </label>
              <a href="/forgot-password" className="text-[10px] text-[color:var(--accent)] hover:text-[color:var(--accent-hover)] font-mono uppercase tracking-wider transition-colors">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <iconify-icon icon="solar:lock-keyhole-linear" className="text-[color:var(--text-subtle)] text-lg"></iconify-icon>
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[color:var(--bg-main)]/50 border border-[color:var(--border)] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[color:var(--text)] placeholder-[color:var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30 focus:border-[color:var(--accent)] transition-all shadow-inner" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 px-6 py-4 bg-[color:var(--accent)] text-white text-sm font-semibold rounded-xl tracking-tight shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)] hover:bg-[color:var(--accent-hover)] hover:shadow-[0_0_25px_-5px_rgba(249,115,22,0.5)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-[color:var(--border)]/50">
          <p className="text-xs text-[color:var(--text-muted)] font-light">
            Don't have an account?
            <a href="/signup" className="ml-2 text-[color:var(--text)] hover:text-[color:var(--accent)] font-medium transition-colors">
              Create one for free
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}