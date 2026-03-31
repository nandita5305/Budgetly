import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroPanel, setHeroPanel] = useState('input'); 
  const [activePipeline, setActivePipeline] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReducedMotion) {
        gsap.set(".hero-eyebrow, .hero-title, .hero-subtitle, .hero-actions, .hero-panel, .section-content, .spotlight, .animate-on-scroll", { opacity: 1, y: 0, visibility: "visible" });
      } else {
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

        heroTl
          .from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8, delay: 0.2 })
          .from(".hero-title", { y: 30, opacity: 0, duration: 1, skewY: 1 }, "-=0.6")
          .from(".hero-subtitle", { y: 20, opacity: 0, duration: 0.8 }, "-=0.7")
          .from(".hero-actions", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
          .from(".hero-panel", { y: 40, opacity: 0, duration: 1.2, filter: "blur(10px)" }, "-=0.6");

        const sections = gsap.utils.toArray(".section");

        sections.forEach((section) => {
          if (section.querySelector('.hero-title')) return;

          const spotlight = section.querySelector(".spotlight");
          const content = section.querySelector(".section-content");
          const children = section.querySelectorAll(".animate-on-scroll");

          const stTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none reverse",
            }
          });

          if (spotlight) stTl.from(spotlight, { opacity: 0, duration: 1.2 });
          if (content) stTl.from(content, { y: 30, opacity: 0, duration: 0.8 }, "<+=0.1");
          if (children.length > 0) {
            stTl.from(children, {
              y: 20,
              opacity: 0,
              duration: 0.6,
              stagger: 0.08,
              clearProps: "all"
            }, "-=0.5");
          }
        });
      }

    });

    return () => {
      ctx.revert();
    };
  }, []);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const pipelineTags = ['LOG::ACTIVE', 'ANALYZE::ACTIVE', 'FORECAST::ACTIVE'];

  return (
    <div className="antialiased overflow-x-hidden selection:bg-orange-500 selection:text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(249,115,22,0.28),transparent_70%),linear-gradient(to_bottom,#0b0b0b,#050505)]"></div>
      <div className="parallax-wrapper">
        <div className="bg-grid" style={{ opacity: 0.22 }}></div>
      </div>
      <div className="noise-overlay" style={{ zIndex: -1, opacity: 0.055 }}></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-[color:var(--bg-main)]/80 backdrop-blur-md border-b border-[color:var(--border)]">
        <div className="sm:px-6 flex h-16 max-w-7xl mr-auto ml-auto pr-4 pl-4 items-center justify-between">
          <div className="flex items-center flex-shrink-0 md:mr-4">
            <iconify-icon icon="solar:wallet-bold" className="text-[color:var(--accent)] text-xl mr-2"></iconify-icon>
            <a href="#home" className="text-[color:var(--text)] font-display text-lg sm:text-xl uppercase tracking-tighter cursor-pointer hover:opacity-80 transition-opacity">
              Budgetly
            </a>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 -translate-x-1/2">
            <a href="#features" className="group relative px-1 py-2 text-[13px] font-medium text-[color:var(--text)] transition-colors tracking-tight hover:text-[color:var(--accent)]">
              Core Engine
            </a>
            <a href="#analytics" className="px-1 py-2 text-[13px] font-normal text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors tracking-tight">
              AI Forecasting
            </a>
            <a href="#security" className="px-1 py-2 text-[13px] font-normal text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors tracking-tight">
              Ledger Security
            </a>
            <a href="#workflow" className="px-1 py-2 text-[13px] font-normal text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors tracking-tight">
              Architecture
            </a>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={toggleMenu}
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border border-[color:var(--border)] bg-[color:var(--bg-card)] hover:bg-[color:var(--bg-card-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/20"
            >
              <iconify-icon icon="solar:hamburger-menu-linear" className="text-[color:var(--text)] text-lg"></iconify-icon>
            </button>
            <Link to="/login" className="hidden sm:block text-[13px] text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors">
              Node Login
            </Link>
            <Link to="/signup" className="text-xs px-5 py-2.5 bg-[color:var(--text)] text-[color:var(--bg-main)] font-semibold rounded tracking-tight transition-all duration-300 hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Initialize Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-[color:var(--bg-main)]/95 backdrop-blur-xl transition-transform duration-300 md:hidden flex flex-col items-center justify-center gap-8 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <button onClick={toggleMenu} className="absolute top-4 right-4 p-2 text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors">
          <iconify-icon icon="solar:close-circle-linear" className="text-3xl"></iconify-icon>
        </button>
        <a href="#features" onClick={toggleMenu} className="text-2xl font-display uppercase tracking-tight text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors">Engine</a>
        <a href="#analytics" onClick={toggleMenu} className="text-2xl font-display uppercase tracking-tight text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors">Forecasting</a>
        <a href="#security" onClick={toggleMenu} className="text-2xl font-display uppercase tracking-tight text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors">Security</a>
        <a href="#workflow" onClick={toggleMenu} className="text-2xl font-display uppercase tracking-tight text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors">Architecture</a>
        <Link to="/signup" onClick={toggleMenu} className="text-xl font-medium text-[color:var(--bg-main)] bg-[color:var(--accent)] px-8 py-3 rounded hover:bg-[color:var(--accent-hover)] transition-colors mt-4">Start Free</Link>
      </div>

      {/* Hero Section */}
      <main id="home" className="section section--main overflow-hidden min-h-screen flex flex-col px-8 sm:px-16 lg:px-24 xl:px-32 pt-36 pb-24 sm:pt-40 z-10 relative">
        <div className="mx-auto relative max-w-7xl flex-1 flex flex-col justify-center w-full">
          <div className="absolute -top-20 sm:-top-32 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[600px] h-[200px] sm:h-[300px] blur-[100px] rounded-full pointer-events-none bg-[color:var(--accent)]/20 mix-blend-screen"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full" data-speed="0.9">
            
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="hero-eyebrow flex items-center justify-center lg:justify-start gap-3 mb-6 w-full">
                <div className="w-1 h-1 rounded-full bg-[color:var(--accent)] shadow-[0_0_8px_var(--accent)]"></div>
                <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
                  Linear Regression Analysis Engine
                </span>
                <div className="w-1 h-1 rounded-full bg-[color:var(--accent)] shadow-[0_0_8px_var(--accent)]"></div>
              </div>

              <h1 className="hero-title text-4xl sm:text-5xl md:text-4xl uppercase leading-[0.95] font-medium text-[color:var(--text)] tracking-tighter font-display mb-6 drop-shadow-2xl">
                Master Your Velocity.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--accent)] to-[#FFD580] font-semibold glow-text">
                  Predict Your Wealth.
                </span>
              </h1>
              
              <p className="hero-subtitle text-[color:var(--text-muted)] text-base sm:text-lg font-normal tracking-tight mb-8 leading-tight max-w-2xl lg:max-w-sm mx-auto lg:mx-0">
                A high-performance ledger utilizing linear forecasting to visualize spending trends, 
                daily burn rates, and automated envelope allocations.
              </p>

              <div className="hero-actions flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 w-full sm:w-auto px-4 lg:px-0">
                <Link to="/signup" className="flex items-center justify-center w-full sm:w-auto px-7 py-3 bg-[color:var(--accent)] text-white text-sm font-semibold rounded tracking-tight transition-all duration-300 hover:bg-[color:var(--accent-hover)] shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)] border border-[color:var(--accent)]">
                  Initialize Dashboard
                </Link>
                <a href="#features" className="w-full sm:w-auto px-6 py-3 bg-transparent text-[color:var(--text)] border border-[color:var(--border)] hover:bg-[color:var(--bg-card)] text-sm font-medium rounded transition-all flex items-center justify-center gap-2 group hover:border-[color:var(--text-subtle)]">
                  Algorithm Spec
                </a>
              </div>
            </div>

            <div className="w-full max-w-lg mx-auto lg:ml-auto lg:mr-0">
              <div className="hero-panel w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-card)]/50 backdrop-blur-xl shadow-[var(--shadow)] overflow-hidden relative group" style={{ filter: 'none' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--border)] bg-[color:var(--bg-card)]/80 backdrop-blur-md z-20 relative">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#333] border border-[#444]"></div>
                      <div className="w-2 h-2 rounded-full bg-[#333] border border-[#444]"></div>
                      <div className="w-2 h-2 rounded-full bg-[#333] border border-[#444]"></div>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)] ml-2">
                      Forecasting_Engine::v1
                    </span>
                  </div>
                  <div className="flex bg-[color:var(--bg-surface)] rounded p-1 border border-[color:var(--border)]">
                    <button 
                      onClick={() => setHeroPanel('input')} 
                      className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider font-medium rounded transition-all ${heroPanel === 'input' ? 'bg-[color:var(--bg-card)] text-[color:var(--text)] border border-[color:var(--border)] shadow-sm' : 'text-[color:var(--text-subtle)] border border-transparent hover:text-[color:var(--text)]'}`}
                    >
                      Raw Data
                    </button>
                    <button 
                      onClick={() => setHeroPanel('output')} 
                      className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider font-medium rounded transition-all ${heroPanel === 'output' ? 'bg-[color:var(--bg-card)] text-[color:var(--text)] border border-[color:var(--border)] shadow-sm' : 'text-[color:var(--text-subtle)] border border-transparent hover:text-[color:var(--text)]'}`}
                    >
                      AI Visual
                    </button>
                  </div>
                </div>

                <div className="relative h-[320px] bg-[color:var(--bg-card)]/40 group overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>

                  {/* Setup / JSON View */}
                  <div className={`absolute inset-0 p-6 sm:p-8 transition-all duration-500 flex flex-col justify-center ${heroPanel === 'input' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 z-0'}`}>
                    <div className="font-mono text-[11px] sm:text-xs leading-loose text-[color:var(--text-muted)]">
                      <div className="flex gap-3">
                        <span className="text-[color:var(--accent)]">Regression</span>
                        <span className="text-[color:var(--text)]">Model</span>
                        = {'{'}
                      </div>
                      <div className="pl-6">
                        <span className="text-[color:var(--text)]">velocity_m</span>: <span className="text-[color:var(--text-subtle)]">"12.40/day"</span>,
                      </div>
                      <div className="pl-6">
                        <span className="text-[color:var(--text)]">daily_burn</span>: <span className="text-[color:var(--accent)]">"$45.20"</span>,
                      </div>
                      <div className="pl-6">
                        <span className="text-[color:var(--text)]">intercept_b</span>: <span className="text-[color:var(--text-subtle)]">"240.50"</span>,
                      </div>
                      <div className="pl-6">
                        <span className="text-[color:var(--text)]">eom_forecast</span>: {'{'}
                      </div>
                      <div className="pl-12">
                        <span className="text-[color:var(--text)]">projected_total</span>: <span className="text-[color:var(--accent)]">"$1,240"</span>,
                      </div>
                      <div className="pl-12">
                        <span className="text-[color:var(--text)]">status</span>: <span className="text-[#10b981]">"Nominal"</span>
                      </div>
                      <div className="pl-6">{'}'}</div>
                      <div>{'};'}</div>
                    </div>
                    <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]"></span>
                      <span className="text-[9px] font-mono text-[color:var(--text-subtle)] uppercase tracking-widest">
                        Sync: Optimal
                      </span>
                    </div>
                  </div>

                  {/* Live Card Component */}
                  <div className={`absolute inset-0 transition-all duration-500 flex items-center justify-center ${heroPanel === 'output' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 z-0'}`}>
                    <div className={`w-full max-w-[280px] relative transition-transform duration-500 ${heroPanel === 'output' ? 'scale-100' : 'scale-95'}`}>
                      <div className="card-float relative h-48 w-full rounded-2xl bg-gradient-to-br from-[color:var(--accent)] to-orange-400 p-5 shadow-[0_20px_50px_-15px_rgba(249,115,22,0.4)] border border-white/20 overflow-hidden text-white flex flex-col justify-between transform transition-transform duration-700 hover:scale-[1.02]">
                          <div className="absolute -inset-full h-[300%] w-[300%] rotate-45 bg-gradient-to-t from-transparent via-white/10 to-transparent translate-x-[-50%] translate-y-[-50%] transition-all duration-1000 group-hover:translate-x-[50%] group-hover:translate-y-[50%] pointer-events-none"></div>
                          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20 blur-3xl pointer-events-none"></div>
                          
                          <div className="relative z-10 flex justify-between items-start">
                              <iconify-icon icon="solar:chart-square-bold-duotone" className="text-3xl text-orange-200 drop-shadow-sm"></iconify-icon>
                              <span className="font-display tracking-widest text-base font-medium uppercase drop-shadow-sm">Forecast</span>
                          </div>
                          
                          <div className="relative z-10">
                              <div className="font-mono text-lg tracking-[0.2em] mb-2 drop-shadow-md text-white/90">BURN RATE: $45/D</div>
                              <div className="flex justify-between font-mono text-[9px] uppercase opacity-90 tracking-widest">
                                  <span>Velocity Trend</span>
                                  <span>Step 31/31</span>
                              </div>
                          </div>
                      </div>

                      <div className="absolute -bottom-6 -right-4 bg-[#111111] border border-[color:var(--border)] p-3 rounded-xl flex items-center gap-3 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)] z-20 backdrop-blur-md transform transition-all duration-500 hover:-translate-y-1">
                          <div className="w-8 h-8 rounded-full bg-[color:var(--accent-soft)] flex items-center justify-center border border-[color:var(--accent)]/20">
                              <iconify-icon icon="solar:graph-up-bold" className="text-[color:var(--accent)] text-sm"></iconify-icon>
                          </div>
                          <div>
                              <div className="text-xs text-white font-semibold tracking-tight">AI Prediction</div>
                              <div className="text-[9px] text-[color:var(--text-subtle)] font-mono uppercase">On-Track</div>
                          </div>
                          <div className="ml-3 text-right">
                              <div className="text-xs text-[#10b981] font-mono font-medium">Safe</div>
                              <div className="text-[8px] text-[color:var(--text-subtle)] font-mono">Status</div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Workflow Pipeline */}
      <section id="workflow" className="section section--surface py-24 md:py-32">
        <div className="spotlight"></div>
        <div className="section-content max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative z-10 animate-on-scroll" data-speed="1.1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)] mb-3 block">
                Analysis Pipeline Logic
              </span>
              <h2 className="text-3xl md:text-5xl font-display text-[color:var(--text)] uppercase tracking-tighter leading-none mb-4 font-medium">
                INPUT
                <br />
                <span className="font-semibold text-[color:var(--accent)]">
                  → <span className="font-semibold text-white">FORECAST</span>
                </span>
              </h2>
              <p className="text-[color:var(--text-muted)] text-sm font-light leading-relaxed mb-12 max-w-md">
                From your manual ledger entries to high-level trends, our pipeline 
                cleanses data and applies linear regression to predict your future spending.
              </p>

              <div className="relative flex flex-col gap-0" id="pipeline-controls">
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[color:var(--border)]"></div>
                <div 
                  className="absolute left-0 w-[2px] bg-[color:var(--accent)] h-[33.33%] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[0_0_10px_var(--accent)]"
                  style={{ top: `${activePipeline * 33.33}%` }}
                ></div>

                <button onClick={() => setActivePipeline(0)} className={`pipeline-btn group text-left pl-8 py-6 relative transition-all duration-300 outline-none focus:outline-none ${activePipeline === 0 ? 'active' : ''}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-lg font-semibold transition-colors ${activePipeline === 0 ? 'text-[color:var(--text)]' : 'text-[color:var(--text-subtle)] group-hover:text-[color:var(--text)]'}`}>
                      LOG EXPENSES
                    </h3>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded opacity-100 transition-all tag-label border ${activePipeline === 0 ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)] border-[color:var(--border)]' : 'text-[color:var(--text-subtle)] bg-[color:var(--bg-card)] border-[color:var(--border)]'}`}>
                      ENTRY
                    </span>
                  </div>
                  <p className={`text-sm font-light leading-relaxed max-w-sm transition-colors ${activePipeline === 0 ? 'text-[color:var(--text-muted)]' : 'text-[color:var(--text-subtle)] group-hover:text-[color:var(--text-muted)]'}`}>
                    Record your daily spending across categories like Food, Rent, and Tech with ease.
                  </p>
                </button>

                <button onClick={() => setActivePipeline(1)} className={`pipeline-btn group text-left pl-8 py-6 relative transition-all duration-300 outline-none focus:outline-none ${activePipeline === 1 ? 'active' : ''}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-lg font-semibold transition-colors ${activePipeline === 1 ? 'text-[color:var(--text)]' : 'text-[color:var(--text-subtle)] group-hover:text-[color:var(--text)]'}`}>
                      LEDGER HISTORY
                    </h3>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded opacity-100 transition-all tag-label border ${activePipeline === 1 ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)] border-[color:var(--border)]' : 'text-[color:var(--text-subtle)] bg-[color:var(--bg-card)] border-[color:var(--border)]'}`}>
                      RECORD
                    </span>
                  </div>
                  <p className={`text-sm font-light leading-relaxed max-w-sm transition-colors ${activePipeline === 1 ? 'text-[color:var(--text-muted)]' : 'text-[color:var(--text-subtle)] group-hover:text-[color:var(--text-muted)]'}`}>
                    Access your secure transaction ledger to track, edit, or terminate past entries instantly.
                  </p>
                </button>

                <button onClick={() => setActivePipeline(2)} className={`pipeline-btn group text-left pl-8 py-6 relative transition-all duration-300 outline-none focus:outline-none ${activePipeline === 2 ? 'active' : ''}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-lg font-semibold transition-colors ${activePipeline === 2 ? 'text-[color:var(--text)]' : 'text-[color:var(--text-subtle)] group-hover:text-[color:var(--text)]'}`}>
                      AI PROJECTIONS
                    </h3>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded opacity-100 transition-all tag-label border ${activePipeline === 2 ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)] border-[color:var(--border)]' : 'text-[color:var(--text-subtle)] bg-[color:var(--bg-card)] border-[color:var(--border)]'}`}>
                      FORECAST
                    </span>
                  </div>
                  <p className={`text-sm font-light leading-relaxed max-w-sm transition-colors ${activePipeline === 2 ? 'text-[color:var(--text-muted)]' : 'text-[color:var(--text-subtle)] group-hover:text-[color:var(--text-muted)]'}`}>
                    View mathematical forecasts based on your velocity. Anticipate end-of-month totals before they happen.
                  </p>
                </button>
              </div>
            </div>

            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square bg-[color:var(--bg-card)] rounded-2xl border border-[color:var(--border)] overflow-hidden shadow-[var(--shadow)] flex flex-col group animate-on-scroll">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--border)] bg-[color:var(--bg-card)]/70 backdrop-blur-md z-20">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[color:var(--bg-surface)] border border-[color:var(--border)]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[color:var(--bg-surface)] border border-[color:var(--border)]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[color:var(--bg-surface)] border border-[color:var(--border)]"></div>
                </div>
                <span className="text-[10px] font-mono text-[color:var(--text-subtle)] uppercase tracking-widest">
                  ALGORITHM :: ACTIVE
                </span>
                <div className="text-[9px] font-mono font-semibold text-[color:var(--accent)] bg-[color:var(--accent-soft)] px-2 py-1 rounded border border-[color:var(--border)] transition-all duration-300">
                  {pipelineTags[activePipeline]}
                </div>
              </div>

              <div className="relative flex-1 w-full bg-[#050505]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>

                {/* View 1: LOG */}
                <div className={`pipeline-visual absolute inset-0 p-8 flex flex-col transition-all duration-500 ${activePipeline === 0 ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-4 pointer-events-none z-0'}`}>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[color:var(--border)]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]"></div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text)]">
                        Commit Ledger Entry
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-1">
                        Form Input
                      </span>
                      <div className="px-3 py-2 rounded border border-[color:var(--border)] bg-[color:var(--bg-card)] text-[10px] text-[color:var(--text-muted)] font-mono border-l-2 border-l-[color:var(--accent)]">
                        Amount: $45.20
                      </div>
                      <div className="px-3 py-2 rounded border border-[color:var(--border)] bg-[color:var(--bg-card)] text-[10px] text-[color:var(--text-muted)] font-mono">
                        Category: Food
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 relative pl-4 border-l border-[color:var(--border)] border-dashed">
                      <span className="text-[9px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-1">
                        Processing
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[color:var(--bg-surface)] text-[9px] flex items-center justify-center text-[color:var(--text)] border border-[color:var(--border)]">1</div>
                        <span className="text-[10px] text-[color:var(--text)]">Validation...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[color:var(--bg-surface)] text-[9px] flex items-center justify-center text-[color:var(--text)] border border-[color:var(--border)]">2</div>
                        <span className="text-[10px] text-[color:var(--text)]">Commiting Entry</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View 2: LEDGER */}
                <div className={`pipeline-visual absolute inset-0 p-8 flex flex-col transition-all duration-500 ${activePipeline === 1 ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'}`}>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[color:var(--border)]">
                    <div className="flex items-center gap-2">
                      <iconify-icon icon="solar:reorder-bold" className="text-[color:var(--text)]"></iconify-icon>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text)]">
                        Ledger Verification
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center relative my-2">
                    <div className="w-full bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-xl p-5 relative z-10 shadow-[var(--shadow)] flex flex-col gap-3 group">
                      <div className="flex items-center justify-between border-b border-[color:var(--border)] pb-2 mb-1">
                        <span className="text-[9px] uppercase tracking-wider text-[color:var(--accent)]">Entry #042</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[color:var(--text)]">
                        <span>Apple Subscription</span>
                        <span className="font-mono">-$9.99</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[color:var(--text)]">
                        <span>Dinner - Thai</span>
                        <span className="font-mono">-$42.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* View 3: FORECAST */}
                <div className={`pipeline-visual absolute inset-0 p-8 flex flex-col transition-all duration-500 ${activePipeline === 2 ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 pointer-events-none z-0'}`}>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[color:var(--border)]">
                    <div className="flex items-center gap-2">
                      <iconify-icon icon="solar:graph-up-bold" className="text-[color:var(--text)]"></iconify-icon>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text)]">
                        Slope Calculation
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-5">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-2 block">Projection Metrics</span>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-[color:var(--accent-soft)] border border-[color:var(--border)] p-2.5 rounded text-center">
                          <span className="text-[10px] text-[color:var(--text)] font-semibold block">Velocity (m)</span>
                          <span className="text-[9px] text-[color:var(--accent)] font-mono">1.25</span>
                        </div>
                        <div className="flex-1 bg-[color:var(--bg-card)] border border-[color:var(--border)] p-2.5 rounded text-center">
                          <span className="text-[10px] text-[color:var(--text)] font-semibold block">Forecast</span>
                          <span className="text-[9px] text-white font-mono">$1,240</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="surface-seam" aria-hidden="true"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="section section--main py-28 md:py-36">
        <div className="spotlight"></div>
        <div className="section-content max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20 animate-on-scroll" data-speed="1.05">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-1 h-1 rounded-full bg-[color:var(--accent)]"></div>
              <span className="text-[11px] font-medium font-mono uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
                Node Interface
              </span>
              <div className="w-1 h-1 rounded-full bg-[color:var(--accent)]"></div>
            </div>
            <h2 className="text-4xl md:text-6xl font-display text-[color:var(--text)] uppercase tracking-tighter leading-[0.95] mb-6 font-medium">
              Simplified Finance.
              <span className="text-[color:var(--accent)] font-semibold ml-2">
                → Real Logic.
              </span>
            </h2>
            <p className="text-base text-[color:var(--text-muted)] leading-relaxed font-light mb-8 max-w-2xl mx-auto">
              Budgetly replaces messy spreadsheets with a high-performance console designed 
              to give you total visibility over your monthly burn rate.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">
            <div className="group relative flex flex-col p-8 rounded-2xl bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-[var(--shadow)] hover:bg-[color:var(--bg-card-hover)] transition-all duration-300 h-full overflow-hidden animate-on-scroll transform hover:scale-105">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[color:var(--text)] border-b border-[color:var(--accent)]/30 pb-0.5">
                  LOGGING
                </span>
                <span className="text-[10px] font-mono text-[color:var(--text-subtle)]">01</span>
              </div>
              <h3 className="text-xl text-[color:var(--text)] font-display uppercase tracking-tight mb-3">Commit Entries</h3>
              <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8 flex-1">
                Fast, manual expense entry with category classification. No fluff, just rapid record-keeping for your financial ledger.
              </p>
            </div>

            <div className="group relative flex flex-col p-8 rounded-2xl bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-[var(--shadow)] hover:bg-[color:var(--bg-card-hover)] transition-all duration-300 h-full overflow-hidden animate-on-scroll transform hover:scale-105">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[color:var(--text-subtle)] group-hover:text-[color:var(--text)] transition-colors">
                  DISTRIBUTION
                </span>
                <span className="text-[10px] font-mono text-[color:var(--text-subtle)]">02</span>
              </div>
              <h3 className="text-xl text-[color:var(--text)] font-display uppercase tracking-tight mb-3">Envelope Math</h3>
              <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8 flex-1">
                Visual category distributions showing exactly how much of your budget is allocated to Food, Rent, Tech, and more.
              </p>
            </div>

            <div className="group relative flex flex-col p-8 rounded-2xl bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-[var(--shadow)] hover:bg-[color:var(--bg-card-hover)] transition-all duration-300 h-full overflow-hidden animate-on-scroll transform hover:scale-105">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[color:var(--text-subtle)] group-hover:text-[color:var(--text)] transition-colors">
                  VERIFICATION
                </span>
                <span className="text-[10px] font-mono text-[color:var(--text-subtle)]">03</span>
              </div>
              <h3 className="text-xl text-[color:var(--text)] font-display uppercase tracking-tight mb-3">Ledger Sync</h3>
              <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8 flex-1">
                A chronological transaction history that gives you a birds-eye view of every magnitude change in your balance.
              </p>
            </div>
          </div>
        </div>
        <div className="surface-seam" aria-hidden="true"></div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="section section--surface py-24 md:py-32">
        <div className="spotlight"></div>
        <div className="section-content max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-3 block">
                // Intelligent Analytics
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-[color:var(--text)] uppercase tracking-tighter leading-none mb-4">
                THE POWER OF
                <br />
                <span className="text-[color:var(--accent)] font-semibold">
                  → FORECASTING
                </span>
              </h2>
              <p className="text-sm text-[color:var(--text-muted)] leading-relaxed font-light">
                Why wait for the end of the month? Our system analyzes your velocity 
                to predict your end-of-month status in real-time.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-hidden bg-[color:var(--border)] border border-[color:var(--border)] rounded-[2rem] shadow-[var(--shadow)] gap-px">
            <div className="group bg-[color:var(--bg-card)] hover:bg-[color:var(--bg-card-hover)] transition-colors p-8 flex flex-col justify-between h-full relative">
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)] mb-4 block">
                  // REGRESSION
                </span>
                <h3 className="text-lg font-semibold text-[color:var(--text)] mb-2 tracking-tight">
                  Linear Projections
                </h3>
                <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8">
                  Uses $y = mx + b$ to calculate your spending trajectory based on day-to-day magnitude.
                </p>
              </div>
            </div>

            <div className="group bg-[color:var(--bg-card)] hover:bg-[color:var(--bg-card-hover)] transition-colors p-8 flex flex-col justify-between h-full relative">
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)] mb-4 block">
                  // VELOCITY
                </span>
                <h3 className="text-lg font-semibold text-[color:var(--text)] mb-2 tracking-tight">
                  Daily Burn Rate
                </h3>
                <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8">
                  Understand your spending speed. We calculate exactly how many dollars are leaving your node per day.
                </p>
              </div>
            </div>

            <div className="group bg-[color:var(--bg-card)] hover:bg-[color:var(--bg-card-hover)] transition-colors p-8 flex flex-col justify-between h-full relative">
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)] mb-4 block">
                  // SYSTEM
                </span>
                <h3 className="text-lg font-semibold text-[color:var(--text)] mb-2 tracking-tight">
                  Envelope Allocation
                </h3>
                <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8">
                  Automatically balances your expenses against your monthly target to ensure you stay under the threshold.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Ledger Security Section */}
      <section id="security" className="section section--main py-28 md:py-36">
        <div className="spotlight"></div>
        <div className="section-content max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20 animate-on-scroll" data-speed="1.05">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-1 h-1 rounded-full bg-[color:var(--accent)]"></div>
              <span className="text-[11px] font-medium font-mono uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
                Ledger Security
              </span>
              <div className="w-1 h-1 rounded-full bg-[color:var(--accent)]"></div>
            </div>
            <h2 className="text-4xl md:text-6xl font-display text-[color:var(--text)] uppercase tracking-tighter leading-[0.95] mb-6 font-medium">
              Zero-Trust.
              <span className="text-[color:var(--accent)] font-semibold ml-2">
                → 100% Secure.
              </span>
            </h2>
            <p className="text-base text-[color:var(--text-muted)] leading-relaxed font-light mb-8 max-w-2xl mx-auto">
              Forecasting requires deep financial context. Our architecture ensures your ledger data is cryptographically sealed, utilizing bank-level security protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">
            <div className="group relative flex flex-col p-8 rounded-2xl bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-[var(--shadow)] hover:bg-[color:var(--bg-card-hover)] transition-all duration-300 h-full overflow-hidden animate-on-scroll transform hover:scale-105">
              <div className="absolute top-0 right-0 p-5 opacity-20 group-hover:opacity-35 transition-opacity">
                <iconify-icon icon="solar:shield-keyhole-bold" className="text-3xl text-[color:var(--text-subtle)]"></iconify-icon>
              </div>
              <h3 className="text-xl text-[color:var(--text)] font-display uppercase tracking-tight mb-3 mt-4">AES-256 Vault</h3>
              <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed flex-1">
                Your financial records are encrypted at rest. Without the specific cryptographic keys, the database is mathematically impossible to read.
              </p>
            </div>

            <div className="group relative flex flex-col p-8 rounded-2xl bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-[var(--shadow)] hover:bg-[color:var(--bg-card-hover)] transition-all duration-300 h-full overflow-hidden animate-on-scroll transform hover:scale-105">
              <div className="absolute top-0 right-0 p-5 opacity-20 group-hover:opacity-35 transition-opacity">
                <iconify-icon icon="solar:password-minimalistic-bold" className="text-3xl text-[color:var(--text-subtle)]"></iconify-icon>
              </div>
              <h3 className="text-xl text-[color:var(--text)] font-display uppercase tracking-tight mb-3 mt-4">JWT Handshake</h3>
              <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed flex-1">
                Stateless, token-based authentication. Every API request is strictly verified, ensuring absolute isolation of user data nodes.
              </p>
            </div>

            <div className="group relative flex flex-col p-8 rounded-2xl bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-[var(--shadow)] hover:bg-[color:var(--bg-card-hover)] transition-all duration-300 h-full overflow-hidden animate-on-scroll transform hover:scale-105">
              <div className="absolute top-0 right-0 p-5 opacity-20 group-hover:opacity-35 transition-opacity">
                <iconify-icon icon="solar:shield-warning-bold" className="text-3xl text-[color:var(--text-subtle)]"></iconify-icon>
              </div>
              <h3 className="text-xl text-[color:var(--text)] font-display uppercase tracking-tight mb-3 mt-4">Fintelligence</h3>
              <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed flex-1">
                Our AI doesn't just forecast; it protects. By establishing your baseline velocity, anomalies and irregularities are instantly flagged.
              </p>
            </div>
          </div>
        </div>
        <div className="surface-seam" aria-hidden="true"></div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[color:var(--bg-card)] border-t border-[color:var(--border)] pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-6 mb-8">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)]">
              Budgetly :: Intelligent Financial Console
            </span>
            <Link to="/signup" className="px-8 py-3 bg-[color:var(--accent)] text-white rounded-full font-bold uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">
              Boot Dashboard
            </Link>
          </div>
          <div className="pt-4 border-t border-[color:var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-[10px] font-mono text-[color:var(--text-subtle)] uppercase tracking-widest">
              © 2026 Budgetly AI Forecasting Lab
            </span>
            <div className="flex gap-6">
              <span className="text-[10px] font-mono text-[color:var(--text-subtle)] uppercase tracking-widest">
                System: All Nominal
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
