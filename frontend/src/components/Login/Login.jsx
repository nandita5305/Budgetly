import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 antialiased selection:bg-orange-500 selection:text-white bg-[#050505] relative">
      
      {/* Background System */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-20 transform perspective-500 rotateX-12 scale-110"></div>
        <div className="absolute top-1/4 -left-1/4 w-[400px] h-[400px] bg-[color:var(--accent)]/10 blur-[100px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-[#FFD580]/5 blur-[100px] rounded-full mix-blend-screen"></div>
        <div className="noise-overlay absolute inset-0 opacity-50"></div>
      </div>

      {/* Ultra-Compact Main Box */}
      <div className="w-full max-w-[800px] bg-[color:var(--bg-main)]/95 backdrop-blur-2xl rounded-[1.5rem] border border-[color:var(--border)] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row overflow-hidden relative z-10 min-h-[500px] max-h-[85vh]">
        
        {/* LEFT PANE: Scaled Down Virtual Card */}
        <div className="hidden lg:flex w-[45%] relative flex-col items-center justify-center p-6 border-r border-[color:var(--border)] bg-[color:var(--bg-card)]/40">
          
          <Link to="/" className="absolute top-5 left-5 flex items-center gap-1.5 text-[color:var(--text-subtle)] hover:text-[color:var(--text)] transition-colors group">
            <div className="w-6 h-6 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-surface)] flex items-center justify-center group-hover:border-[color:var(--accent)] transition-colors">
              <iconify-icon icon="solar:arrow-left-linear" className="text-sm"></iconify-icon>
            </div>
            <span className="text-[8px] font-mono uppercase tracking-widest font-medium">Back</span>
          </Link>

          <div className="absolute top-5 right-5 flex gap-1.5 items-center px-2 py-1 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-surface)]/50">
            <div className="w-1 h-1 rounded-full bg-[color:var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]"></div>
            <span className="text-[8px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)]">
              Secure
            </span>
          </div>

          <div className="w-full max-w-[240px] relative mt-4">
            <div className="card-float relative h-40 w-full rounded-2xl bg-gradient-to-br from-[color:var(--accent)] to-orange-400 p-4 shadow-[0_15px_40px_-10px_rgba(249,115,22,0.4)] border border-white/20 overflow-hidden text-white flex flex-col justify-between group">
              <div className="absolute -inset-full h-[300%] w-[300%] rotate-45 bg-gradient-to-t from-transparent via-white/10 to-transparent translate-x-[-50%] translate-y-[-50%] transition-all duration-1000 group-hover:translate-x-[50%] group-hover:translate-y-[50%] pointer-events-none"></div>
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/20 blur-2xl pointer-events-none"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                  <iconify-icon icon="solar:sim-card-minimalistic-bold" className="text-2xl text-orange-200 drop-shadow-sm"></iconify-icon>
                  <span className="font-display tracking-widest text-sm font-medium uppercase drop-shadow-sm">Budgetly</span>
              </div>
              
              <div className="relative z-10">
                  <div className="font-mono text-base tracking-[0.15em] mb-1 drop-shadow-md text-white/90">**** **** 8429</div>
                  <div className="flex justify-between font-mono text-[8px] uppercase opacity-90 tracking-widest">
                      <span>A. Johnson</span>
                      <span>12/28</span>
                  </div>
              </div>
            </div>

            <div className="absolute -bottom-3 -right-3 bg-[#111111] border border-[color:var(--border)] p-2 rounded-xl flex items-center gap-2.5 shadow-lg z-20 backdrop-blur-md transform transition-all duration-500 hover:-translate-y-1">
                <div className="w-6 h-6 rounded-full bg-[color:var(--accent-soft)] flex items-center justify-center border border-[color:var(--accent)]/20">
                    <iconify-icon icon="solar:lock-keyhole-minimalistic-bold" className="text-[color:var(--accent)] text-xs"></iconify-icon>
                </div>
                <div className="pr-1.5">
                    <div className="text-[10px] text-white font-semibold tracking-tight">AES-256</div>
                    <div className="text-[7px] text-[color:var(--text-subtle)] font-mono uppercase">Encrypted</div>
                </div>
            </div>
          </div>

          <div className="mt-12 text-center max-w-[200px]">
            <h3 className="text-sm font-display text-[color:var(--text)] uppercase tracking-tight mb-1.5">Master Your Money</h3>
            <p className="text-[9px] font-light text-[color:var(--text-muted)] leading-relaxed">
              Modernizing personal finance with automated budgeting and insights.
            </p>
          </div>
        </div>

        {/* RIGHT PANE: Compact Form */}
        <div className="w-full lg:w-[55%] flex items-center justify-center relative z-10 p-6 overflow-y-auto">
          
          <Link to="/" className="lg:hidden absolute top-4 left-4 w-7 h-7 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-card)] flex items-center justify-center text-[color:var(--text-subtle)] hover:text-[color:var(--text)] transition-colors">
            <iconify-icon icon="solar:arrow-left-linear" className="text-sm"></iconify-icon>
          </Link>

          <div className="w-full max-w-[280px] my-auto">
            <div className="mb-6 text-center lg:text-left mt-6 lg:mt-0">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <div className="w-1 h-1 rounded-full bg-[color:var(--accent)] shadow-[0_0_8px_var(--accent)]"></div>
                <span className="text-[8px] font-mono font-medium uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
                  {isLogin ? 'Welcome Back' : 'Start Journey'}
                </span>
              </div>
              <h2 className="text-2xl font-display uppercase tracking-tighter leading-none text-[color:var(--text)] font-medium">
                {isLogin ? 'Log In To' : 'Create'} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--accent)] to-[#FFD580]">
                   {isLogin ? 'Budgetly' : 'Account'}
                </span>
              </h2>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-[color:var(--border)] bg-[color:var(--bg-surface)] hover:bg-[color:var(--bg-card-hover)] text-[11px] font-medium text-[color:var(--text)] rounded transition-all group mb-5">
              <iconify-icon icon="logos:google-icon" className="text-sm"></iconify-icon>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-5 opacity-60">
              <div className="flex-1 h-px bg-[color:var(--border)]"></div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)]">Or email</span>
              <div className="flex-1 h-px bg-[color:var(--border)]"></div>
            </div>

            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono uppercase tracking-wide text-[color:var(--text-muted)] ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[color:var(--text-subtle)] group-focus-within:text-[color:var(--accent)] transition-colors">
                      <iconify-icon icon="solar:user-linear" className="text-base"></iconify-icon>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Alex Johnson"
                      className="w-full bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded py-2 pl-9 pr-3 text-[11px] text-[color:var(--text)] placeholder-[color:var(--text-subtle)]/50 focus:outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)] transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono uppercase tracking-wide text-[color:var(--text-muted)] ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[color:var(--text-subtle)] group-focus-within:text-[color:var(--accent)] transition-colors">
                    <iconify-icon icon="solar:letter-linear" className="text-base"></iconify-icon>
                  </div>
                  <input 
                    type="email" 
                    placeholder="alex@example.com"
                    className="w-full bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded py-2 pl-9 pr-3 text-[11px] text-[color:var(--text)] placeholder-[color:var(--text-subtle)]/50 focus:outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[9px] font-mono uppercase tracking-wide text-[color:var(--text-muted)]">Password</label>
                  {isLogin && (
                    <a href="#" className="text-[8px] font-mono text-[color:var(--text-subtle)] hover:text-[color:var(--accent)] transition-colors uppercase tracking-widest">
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[color:var(--text-subtle)] group-focus-within:text-[color:var(--accent)] transition-colors">
                    <iconify-icon icon="solar:lock-keyhole-linear" className="text-base"></iconify-icon>
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded py-2 pl-9 pr-3 text-[11px] text-[color:var(--text)] placeholder-[color:var(--text-subtle)]/50 focus:outline-none focus:border-[color:var(--accent)] focus:ring-1 focus:ring-[color:var(--accent)] transition-all font-mono"
                  />
                </div>
              </div>

              <button type="submit" className="mt-2 w-full px-4 py-2.5 bg-[color:var(--accent)] text-white text-[11px] font-semibold rounded tracking-tight transition-all duration-300 hover:bg-[color:var(--accent-hover)] shadow-[0_0_15px_-5px_rgba(249,115,22,0.4)] border border-[color:var(--accent)] uppercase font-display">
                {isLogin ? 'Access Account' : 'Create Account'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-[10px] text-[color:var(--text-muted)]">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-1.5 font-medium text-[color:var(--text)] hover:text-[color:var(--accent)] underline decoration-[color:var(--border)] underline-offset-4 transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}