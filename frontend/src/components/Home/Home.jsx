import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroPanel, setHeroPanel] = useState('input'); // 'input' | 'output'
  const [activePipeline, setActivePipeline] = useState(0);

  // Initialize GSAP animations and Unicorn Studio script
  useEffect(() => {
    // 1. Initialize Unicorn Studio Script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
    script.async = true;
    script.onload = () => {
      if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
        window.UnicornStudio.init();
        window.UnicornStudio.isInitialized = true;
      }
    };
    document.body.appendChild(script);

    // 2. Initialize GSAP & ScrollTrigger with React cleanup context
    const ctx = gsap.context(() => {
      const parallaxGrid = document.getElementById('parallax-grid');
      const glow1 = document.getElementById('parallax-glow-1');
      const glow2 = document.getElementById('parallax-glow-2');

      const handleScroll = () => {
        const scrolled = window.scrollY;
        if (parallaxGrid) parallaxGrid.style.transform = `perspective(500px) rotateX(20deg) translateY(${scrolled * 0.2}px)`;
        if (glow1) glow1.style.transform = `translateY(${scrolled * 0.4}px)`;
        if (glow2) glow2.style.transform = `translateY(${scrolled * 0.15}px)`;
      };

      window.addEventListener('scroll', handleScroll);

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

      return () => window.removeEventListener('scroll', handleScroll);
    });

    return () => {
      ctx.revert();
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const pipelineTags = ['SYNC::ACTIVE', 'TRACK::ACTIVE', 'GROW::ACTIVE'];

  return (
    <div className="antialiased overflow-x-hidden selection:bg-orange-500 selection:text-white">
      {/* Background Component */}
      <div 
        className="aura-background-component fixed top-0 w-full h-screen -z-10" 
        data-alpha-mask="80" 
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)', 
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)'
        }}
      >
        <div className="aura-background-component top-0 w-full -z-10 absolute h-full">
          <div data-us-project="4gq2Yrv2p0bIa0hdLPQx" className="absolute w-full h-full left-0 top-0 -z-10"></div>
        </div>
      </div>
          
      {/* Parallax Background System */}
      <div className="parallax-wrapper">
        <div className="bg-grid" id="parallax-grid"></div>
        <div className="bg-glow-1" id="parallax-glow-1"></div>
        <div className="bg-glow-2" id="parallax-glow-2"></div>
      </div>
      
      <div className="noise-overlay"></div>

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
              Features
            </a>
            <a href="#analytics" className="px-1 py-2 text-[13px] font-normal text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors tracking-tight">
              Analytics
            </a>
            <a href="#security" className="px-1 py-2 text-[13px] font-normal text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors tracking-tight">
              Security
            </a>
            <a href="#workflow" className="px-1 py-2 text-[13px] font-normal text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors tracking-tight">
              How it Works
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
              Log in
            </Link>
            <Link to="/signup" className="text-xs px-5 py-2.5 bg-[color:var(--text)] text-[color:var(--bg-main)] font-semibold rounded tracking-tight transition-all duration-300 hover:bg-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Start Free
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
        <a href="#features" onClick={toggleMenu} className="text-2xl font-display uppercase tracking-tight text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors">Features</a>
        <a href="#analytics" onClick={toggleMenu} className="text-2xl font-display uppercase tracking-tight text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors">Analytics</a>
        <a href="#security" onClick={toggleMenu} className="text-2xl font-display uppercase tracking-tight text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors">Security</a>
        <a href="#workflow" onClick={toggleMenu} className="text-2xl font-display uppercase tracking-tight text-[color:var(--text)] hover:text-[color:var(--accent)] transition-colors">How it Works</a>
        <a href="#quote" onClick={toggleMenu} className="text-xl font-medium text-[color:var(--bg-main)] bg-[color:var(--accent)] px-8 py-3 rounded hover:bg-[color:var(--accent-hover)] transition-colors mt-4">Start Free</a>
      </div>

      {/* Hero Section */}
      <main id="home" className="section section--main overflow-hidden min-h-screen flex flex-col px-8 sm:px-16 lg:px-24 xl:px-32 pt-36 pb-24 sm:pt-40 z-10 relative">
        <div className="mx-auto relative max-w-7xl flex-1 flex flex-col justify-center w-full">
          {/* Background Glow */}
          <div className="absolute -top-20 sm:-top-32 left-1/2 -translate-x-1/2 w-[90vw] sm:w-[600px] h-[200px] sm:h-[300px] blur-[100px] rounded-full pointer-events-none bg-[color:var(--accent)]/20 mix-blend-screen"></div>

          {/* TWO COLUMN GRID LAYOUT */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full" data-speed="0.9">
            
            {/* LEFT COLUMN: Text & Actions */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="hero-eyebrow flex items-center justify-center lg:justify-start gap-3 mb-6 w-full">
                <div className="w-1 h-1 rounded-full bg-[color:var(--accent)] shadow-[0_0_8px_var(--accent)]"></div>
                <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-[color:var(--text-subtle)]">
                  Intelligent Financial Planning
                </span>
                <div className="w-1 h-1 rounded-full bg-[color:var(--accent)] shadow-[0_0_8px_var(--accent)]"></div>
              </div>

              <h1 className="hero-title text-4xl sm:text-5xl md:text-4xl uppercase leading-[0.95] font-medium text-[color:var(--text)] tracking-tighter font-display mb-6 drop-shadow-2xl">
                Master Your Money
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--accent)] to-[#FFD580] font-semibold glow-text">
                  Without The Stress.
                </span>
              </h1>
              
              <p className="hero-subtitle text-[color:var(--text-muted)] text-base sm:text-lg font-normal tracking-tight mb-8 leading-tight max-w-2xl lg:max-w-sm mx-auto lg:mx-0">
                Modernizing personal finance with automated budgeting, 
                real-time bank sync, and intelligent spending insights.
              </p>

              <div className="hero-actions flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 w-full sm:w-auto px-4 lg:px-0">
                <a href="#quote" className="flex items-center justify-center w-full sm:w-auto px-7 py-3 bg-[color:var(--accent)] text-white text-sm font-semibold rounded tracking-tight transition-all duration-300 hover:bg-[color:var(--accent-hover)] shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)] border border-[color:var(--accent)]">
                  Connect Your Bank
                </a>
                <a href="#workflow" className="w-full sm:w-auto px-6 py-3 bg-transparent text-[color:var(--text)] border border-[color:var(--border)] hover:bg-[color:var(--bg-card)] text-sm font-medium rounded transition-all flex items-center justify-center gap-2 group hover:border-[color:var(--text-subtle)]">
                  Explore Features
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Interactive Panel */}
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
                      Budgetly_Engine::Core
                    </span>
                  </div>
                  <div className="flex bg-[color:var(--bg-surface)] rounded p-1 border border-[color:var(--border)]">
                    <button 
                      onClick={() => setHeroPanel('input')} 
                      className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider font-medium rounded transition-all ${heroPanel === 'input' ? 'bg-[color:var(--bg-card)] text-[color:var(--text)] border border-[color:var(--border)] shadow-sm' : 'text-[color:var(--text-subtle)] border border-transparent hover:text-[color:var(--text)]'}`}
                    >
                      Profile Data
                    </button>
                    <button 
                      onClick={() => setHeroPanel('output')} 
                      className={`px-3 py-1 text-[9px] font-mono uppercase tracking-wider font-medium rounded transition-all ${heroPanel === 'output' ? 'bg-[color:var(--bg-card)] text-[color:var(--text)] border border-[color:var(--border)] shadow-sm' : 'text-[color:var(--text-subtle)] border border-transparent hover:text-[color:var(--text)]'}`}
                    >
                      Virtual Card
                    </button>
                  </div>
                </div>

                <div className="relative h-[320px] bg-[color:var(--bg-card)]/40 group overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>

                  {/* Setup / JSON View */}
                  <div className={`absolute inset-0 p-6 sm:p-8 transition-all duration-500 flex flex-col justify-center ${heroPanel === 'input' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 z-0'}`}>
                    <div className="font-mono text-[11px] sm:text-xs leading-loose text-[color:var(--text-muted)]">
                      <div className="flex gap-3">
                        <span className="text-[color:var(--accent)]">Account</span>
                        <span className="text-[color:var(--text)]">Sync</span>
                        = {'{'}
                      </div>
                      <div className="pl-6">
                        <span className="text-[color:var(--text)]">user_id</span>: <span className="text-[color:var(--text-subtle)]">'US-89240'</span>,
                      </div>
                      <div className="pl-6">
                        <span className="text-[color:var(--text)]">primary_bank</span>: <span className="text-[color:var(--accent)]">"Chase Sapphire"</span>,
                      </div>
                      <div className="pl-6">
                        <span className="text-[color:var(--text)]">safe_to_spend</span>: <span className="text-[color:var(--text-subtle)]">"$1,420.50"</span>,
                      </div>
                      <div className="pl-6">
                        <span className="text-[color:var(--text)]">budget</span>: {'{'}
                      </div>
                      <div className="pl-12">
                        <span className="text-[color:var(--text)]">monthly_target</span>: <span className="text-[color:var(--accent)]">"$4,000"</span>,
                      </div>
                      <div className="pl-12">
                        <span className="text-[color:var(--text)]">status</span>: <span className="text-[#10b981]">"On Track"</span>
                      </div>
                      <div className="pl-6">{'}'}</div>
                      <div>{'};'}</div>
                    </div>
                    <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]"></span>
                      <span className="text-[9px] font-mono text-[color:var(--text-subtle)] uppercase tracking-widest">
                        Plaid Connected
                      </span>
                    </div>
                  </div>

                  {/* Live Card Component */}
                  <div className={`absolute inset-0 transition-all duration-500 flex items-center justify-center ${heroPanel === 'output' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 z-0'}`}>
                    <div className={`w-full max-w-[280px] relative transition-transform duration-500 ${heroPanel === 'output' ? 'scale-100' : 'scale-95'}`}>
                      <div className="card-float relative h-48 w-full rounded-2xl bg-gradient-to-br from-[color:var(--accent)] to-orange-400 p-5 shadow-[0_20px_50px_-15px_rgba(249,115,22,0.4)] border border-white/20 overflow-hidden text-white flex flex-col justify-between transform transition-transform duration-700 hover:scale-[1.02]">
                          <div className="absolute -inset-full h-[300%] w-[300%] rotate-45 bg-gradient-to-t from-transparent via-white/10 to-transparent translate-x-[-50%] translate-y-[-50%] transition-all duration-1000 group-hover:translate-x-[50%] group-hover:translate-y-[50%] pointer-events-none"></div>
                          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/20 blur-3xl pointer-events-none"></div>
                          <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-black/10 blur-2xl pointer-events-none"></div>
                          
                          <div className="relative z-10 flex justify-between items-start">
                              <iconify-icon icon="solar:sim-card-minimalistic-bold" className="text-3xl text-orange-200 drop-shadow-sm"></iconify-icon>
                              <span className="font-display tracking-widest text-base font-medium uppercase drop-shadow-sm">Budgetly</span>
                          </div>
                          
                          <div className="relative z-10">
                              <div className="font-mono text-lg tracking-[0.2em] mb-2 drop-shadow-md text-white/90">**** **** **** 8429</div>
                              <div className="flex justify-between font-mono text-[9px] uppercase opacity-90 tracking-widest">
                                  <span>Alex Johnson</span>
                                  <span>Exp 12/28</span>
                              </div>
                          </div>
                      </div>

                      <div className="absolute -bottom-6 -right-4 bg-[#111111] border border-[color:var(--border)] p-3 rounded-xl flex items-center gap-3 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)] z-20 backdrop-blur-md transform transition-all duration-500 hover:-translate-y-1">
                          <div className="w-8 h-8 rounded-full bg-[color:var(--accent-soft)] flex items-center justify-center border border-[color:var(--accent)]/20">
                              <iconify-icon icon="solar:cart-large-minimalistic-bold" className="text-[color:var(--accent)] text-sm"></iconify-icon>
                          </div>
                          <div>
                              <div className="text-xs text-white font-semibold tracking-tight">Whole Foods</div>
                              <div className="text-[9px] text-[color:var(--text-subtle)] font-mono uppercase">Groceries</div>
                          </div>
                          <div className="ml-3 text-right">
                              <div className="text-xs text-white font-mono font-medium">-$84.20</div>
                              <div className="text-[8px] text-[#10b981] font-mono">Approved</div>
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
                Budget Automation Core
              </span>
              <h2 className="text-3xl md:text-5xl font-display text-[color:var(--text)] uppercase tracking-tighter leading-none mb-4 font-medium">
                INCOME
                <br />
                <span className="font-semibold text-[color:var(--accent)]">
                  → <span className="font-semibold text-white">GROWTH</span>
                </span>
              </h2>
              <p className="text-[color:var(--text-muted)] text-sm font-light leading-relaxed mb-12 max-w-md">
                From the moment your paycheck hits to allocating your savings, 
                our algorithm categorizes, tracks, and protects your wealth automatically.
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
                      CONNECT & SYNC
                    </h3>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded opacity-100 transition-all tag-label border ${activePipeline === 0 ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)] border-[color:var(--border)]' : 'text-[color:var(--text-subtle)] bg-[color:var(--bg-card)] border-[color:var(--border)]'}`}>
                      INITIATE
                    </span>
                  </div>
                  <p className={`text-sm font-light leading-relaxed max-w-sm transition-colors ${activePipeline === 0 ? 'text-[color:var(--text-muted)]' : 'text-[color:var(--text-subtle)] group-hover:text-[color:var(--text-muted)]'}`}>
                    Securely link your bank accounts. Transactions pull in seamlessly with zero manual entry.
                  </p>
                </button>

                <button onClick={() => setActivePipeline(1)} className={`pipeline-btn group text-left pl-8 py-6 relative transition-all duration-300 outline-none focus:outline-none ${activePipeline === 1 ? 'active' : ''}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-lg font-semibold transition-colors ${activePipeline === 1 ? 'text-[color:var(--text)]' : 'text-[color:var(--text-subtle)] group-hover:text-[color:var(--text)]'}`}>
                      AUTO-CATEGORIZE
                    </h3>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded opacity-100 transition-all tag-label border ${activePipeline === 1 ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)] border-[color:var(--border)]' : 'text-[color:var(--text-subtle)] bg-[color:var(--bg-card)] border-[color:var(--border)]'}`}>
                      TRACK
                    </span>
                  </div>
                  <p className={`text-sm font-light leading-relaxed max-w-sm transition-colors ${activePipeline === 1 ? 'text-[color:var(--text-muted)]' : 'text-[color:var(--text-subtle)] group-hover:text-[color:var(--text-muted)]'}`}>
                    Our AI identifies merchants, tags categories, and assigns expenses to your designated envelopes.
                  </p>
                </button>

                <button onClick={() => setActivePipeline(2)} className={`pipeline-btn group text-left pl-8 py-6 relative transition-all duration-300 outline-none focus:outline-none ${activePipeline === 2 ? 'active' : ''}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-lg font-semibold transition-colors ${activePipeline === 2 ? 'text-[color:var(--text)]' : 'text-[color:var(--text-subtle)] group-hover:text-[color:var(--text)]'}`}>
                      GOALS & SAVINGS
                    </h3>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded opacity-100 transition-all tag-label border ${activePipeline === 2 ? 'text-[color:var(--accent)] bg-[color:var(--accent-soft)] border-[color:var(--border)]' : 'text-[color:var(--text-subtle)] bg-[color:var(--bg-card)] border-[color:var(--border)]'}`}>
                      GROW
                    </span>
                  </div>
                  <p className={`text-sm font-light leading-relaxed max-w-sm transition-colors ${activePipeline === 2 ? 'text-[color:var(--text-muted)]' : 'text-[color:var(--text-subtle)] group-hover:text-[color:var(--text-muted)]'}`}>
                    Visualize your progress. Extra funds are instantly highlighted to push toward debt payoff or savings.
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

                {/* View 1: SYNC */}
                <div className={`pipeline-visual absolute inset-0 p-8 flex flex-col transition-all duration-500 ${activePipeline === 0 ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 -translate-x-4 pointer-events-none z-0'}`}>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[color:var(--border)]">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]"></div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text)]">
                        Institution Link
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[color:var(--text-subtle)]">
                      Step 01
                    </span>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
                    <div className="flex flex-col gap-2">
                      <span className="text-[9px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-1">
                        Connected Accts
                      </span>
                      <div className="px-3 py-2 rounded border border-[color:var(--border)] bg-[color:var(--bg-card)] text-[10px] text-[color:var(--text-muted)] font-mono border-l-2 border-l-[color:var(--accent)] shadow-[var(--shadow)] flex items-center justify-between">
                        <span>Chase Checking</span>
                        <span className="text-white">...4021</span>
                      </div>
                      <div className="px-3 py-2 rounded border border-[color:var(--border)] bg-[color:var(--bg-card)] text-[10px] text-[color:var(--text-muted)] font-mono flex items-center justify-between">
                        <span>Amex Platinum</span>
                        <span className="text-white">...9923</span>
                      </div>
                      <div className="px-3 py-2 rounded border border-[color:var(--border)] bg-[color:var(--bg-card)] text-[10px] text-[color:var(--text-muted)] font-mono flex items-center justify-between opacity-50">
                        <span>Add Account +</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 relative pl-4 border-l border-[color:var(--border)] border-dashed">
                      <span className="text-[9px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-1">
                        Data Pull
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[color:var(--bg-surface)] text-[9px] flex items-center justify-center text-[color:var(--text)] border border-[color:var(--border)]">
                          1
                        </div>
                        <span className="text-[10px] text-[color:var(--text)]">
                          Handshake Established
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[color:var(--bg-surface)] text-[9px] flex items-center justify-center text-[color:var(--text)] border border-[color:var(--border)]">
                          2
                        </div>
                        <span className="text-[10px] text-[color:var(--text)]">
                          Importing 30 Days
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[color:var(--bg-surface)] text-[9px] flex items-center justify-center text-[color:var(--text)] border border-[color:var(--border)]">
                          3
                        </div>
                        <span className="text-[10px] text-[color:var(--text)]">
                          Balancing Ledgers
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-[color:var(--border)]">
                    <span className="text-[9px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-2 block">
                      Status
                    </span>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded bg-[color:var(--accent-soft)] border border-[color:var(--border)] text-[9px] text-[color:var(--accent)] font-mono flex items-center gap-1.5">
                        <iconify-icon icon="solar:check-circle-bold" className="text-xs"></iconify-icon>
                        Sync Complete
                      </span>
                    </div>
                  </div>
                </div>

                {/* View 2: CATEGORIZE */}
                <div className={`pipeline-visual absolute inset-0 p-8 flex flex-col transition-all duration-500 ${activePipeline === 1 ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 pointer-events-none z-0'}`}>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[color:var(--border)]">
                    <div className="flex items-center gap-2">
                      <iconify-icon icon="solar:pie-chart-2-bold" className="text-[color:var(--text)]"></iconify-icon>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text)]">
                        Analyzing Expenses
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[color:var(--text-subtle)]">
                      Step 02
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center relative my-2">
                    <div className="w-full bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-xl p-5 relative z-10 shadow-[var(--shadow)] flex flex-col gap-3 group">
                      <div className="absolute inset-0 bg-[color:var(--accent-soft)] rounded-xl pointer-events-none opacity-60"></div>
                      <div className="flex items-center justify-between border-b border-[color:var(--border)] pb-2 mb-1">
                        <span className="text-[9px] uppercase tracking-wider text-[color:var(--accent)]">
                          Transaction AI
                        </span>
                        <iconify-icon icon="solar:cpu-bold" className="text-[color:var(--accent)] text-xs"></iconify-icon>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[color:var(--text)]">
                        <div className="flex items-center gap-2">
                           <iconify-icon icon="solar:bag-3-linear" className="text-[color:var(--text-subtle)]"></iconify-icon>
                           Target Store
                        </div>
                        <span className="font-mono text-[color:var(--text-muted)]">-$45.20</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[color:var(--text)]">
                        <div className="flex items-center gap-2">
                           <iconify-icon icon="solar:bolt-linear" className="text-[color:var(--text-subtle)]"></iconify-icon>
                           ConEdison
                        </div>
                        <span className="font-mono text-[color:var(--text-muted)]">-$120.00</span>
                      </div>
                    </div>

                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full w-20 text-right pr-3">
                      <span className="text-[9px] uppercase tracking-widest text-[color:var(--text-subtle)] block mb-1">
                        Envelopes
                      </span>
                      <div className="text-[9px] text-[color:var(--text-muted)] leading-tight">
                        Groceries
                      </div>
                      <div className="text-[9px] text-[color:var(--text-muted)] leading-tight mt-1">
                        Utilities
                      </div>
                    </div>
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full w-20 text-left pl-3">
                      <span className="text-[9px] uppercase tracking-widest text-[color:var(--text-subtle)] block mb-1">
                        Rules
                      </span>
                      <div className="text-[9px] text-[color:var(--text-muted)] leading-tight">
                        Auto-Matched
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-[color:var(--border)] flex items-center justify-between">
                    <div className="flex gap-1">
                      <div className="h-1 w-6 rounded-full bg-[color:var(--accent)] opacity-70"></div>
                      <div className="h-1 w-6 rounded-full bg-[color:var(--accent)] opacity-70"></div>
                    </div>
                    <div className="text-[9px] font-mono text-[color:var(--accent)] uppercase tracking-wide flex items-center gap-2">
                      <span>Sorting Active</span>
                      <span className="w-1 h-1 rounded-full bg-[color:var(--accent)] shadow-[0_0_5px_var(--accent)]"></span>
                    </div>
                  </div>
                </div>

                {/* View 3: GOALS */}
                <div className={`pipeline-visual absolute inset-0 p-8 flex flex-col transition-all duration-500 ${activePipeline === 2 ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-8 pointer-events-none z-0'}`}>
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[color:var(--border)]">
                    <div className="flex items-center gap-2">
                      <iconify-icon icon="solar:target-bold" className="text-[color:var(--text)]"></iconify-icon>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text)]">
                        Progress Check
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[color:var(--text-subtle)]">
                      Step 03
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col gap-5">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-2 block">
                        Achievements
                      </span>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-[color:var(--accent-soft)] border border-[color:var(--border)] p-2.5 rounded text-center shadow-[var(--shadow)]">
                          <iconify-icon icon="solar:shield-check-linear" className="text-[color:var(--text)] text-sm mb-1"></iconify-icon>
                          <span className="text-[10px] text-[color:var(--text)] font-semibold block">
                            Goal Met
                          </span>
                        </div>
                        <div className="flex-1 bg-[color:var(--bg-card)] border border-[color:var(--border)] p-2.5 rounded text-center opacity-80">
                          <iconify-icon icon="solar:graph-up-linear" className="text-[color:var(--text-muted)] text-sm mb-1"></iconify-icon>
                          <span className="text-[10px] text-[color:var(--text-muted)] block">
                            Savings Up
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-2 block">
                        Summary
                      </span>
                      <div className="space-y-2.5 bg-[color:var(--bg-card)] p-3 rounded border border-[color:var(--border)]">
                        <div className="flex items-center gap-2 text-[10px] text-[color:var(--text-muted)]">
                          <iconify-icon icon="solar:check-square-bold" className="text-[color:var(--accent)]"></iconify-icon>
                          Stayed under Dining Budget
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[color:var(--text-muted)]">
                          <iconify-icon icon="solar:check-square-bold" className="text-[color:var(--accent)]"></iconify-icon>
                          $400 sent to Emergency Fund
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[color:var(--text-muted)]">
                          <iconify-icon icon="solar:check-square-bold" className="text-[color:var(--accent)]"></iconify-icon>
                          Zero Overdraft Fees
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-[color:var(--border)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-[color:var(--text)] uppercase tracking-wide">
                        Monthly Health
                      </span>
                      <span className="flex items-center gap-1 text-[9px] text-[color:var(--text)] bg-[#10b981]/10 px-1.5 py-0.5 rounded border border-[#10b981]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
                        Excellent
                      </span>
                    </div>
                    <div className="h-1 w-full bg-[color:var(--bg-surface)] rounded-full overflow-hidden border border-[color:var(--border)]">
                      <div className="h-full bg-[color:var(--accent)] w-11/12"></div>
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
                Core Capabilities
              </span>
              <div className="w-1 h-1 rounded-full bg-[color:var(--accent)]"></div>
            </div>
            <h2 className="text-4xl md:text-6xl font-display text-[color:var(--text)] uppercase tracking-tighter leading-[0.95] mb-6 font-medium">
              Tailored For Your
              <span className="text-[color:var(--accent)] font-semibold ml-2">
                → Lifestyle
              </span>
            </h2>
            <p className="text-base text-[color:var(--text-muted)] leading-relaxed font-light mb-8 max-w-2xl mx-auto">
              Budgetly isn't just an expense tracker; we are your strategic partner in wealth creation. 
              We handle complex finances with elegant simplicity.
            </p>
            <div className="flex flex-col items-center gap-6">
              <p className="text-xs text-[color:var(--text-subtle)] font-medium tracking-widest uppercase">
                Methodologies supported out of the box.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-2.5 py-1 rounded border border-[color:var(--border)] bg-[color:var(--bg-surface)] text-[10px] text-[color:var(--text-subtle)] font-mono uppercase tracking-wide">
                  Zero-Based Budgeting
                </span>
                <span className="px-2.5 py-1 rounded border border-[color:var(--border)] bg-[color:var(--bg-surface)] text-[10px] text-[color:var(--text-subtle)] font-mono uppercase tracking-wide">
                  50/30/20 Rule
                </span>
                <span className="px-2.5 py-1 rounded border border-[color:var(--border)] bg-[color:var(--bg-surface)] text-[10px] text-[color:var(--text-subtle)] font-mono uppercase tracking-wide">
                  Envelope System
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">
            <div className="group relative flex flex-col p-8 rounded-2xl bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-[var(--shadow)] hover:bg-[color:var(--bg-card-hover)] transition-all duration-300 h-full overflow-hidden animate-on-scroll transform hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[color:var(--accent)]/40 to-transparent opacity-60"></div>
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[color:var(--text)] border-b border-[color:var(--accent)]/30 pb-0.5">
                  Everyday Spending
                </span>
                <span className="text-[10px] font-mono text-[color:var(--text-subtle)]">
                  01
                </span>
              </div>
              <h3 className="text-xl text-[color:var(--text)] font-display uppercase tracking-tight mb-3">
                Expense Tracking
              </h3>
              <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8 flex-1">
                Secure, organized views of every coffee, bill, and transfer. 
                Searchable and categorizable nationwide.
              </p>
              <div className="mt-auto">
                <a href="#" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--accent)] hover:underline transition-colors">
                  View Demo
                  <iconify-icon icon="solar:arrow-right-linear" className="text-sm"></iconify-icon>
                </a>
              </div>
            </div>

            <div className="group relative flex flex-col p-8 rounded-2xl bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-[var(--shadow)] hover:bg-[color:var(--bg-card-hover)] transition-all duration-300 h-full overflow-hidden animate-on-scroll transform hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[color:var(--text-subtle)] group-hover:text-[color:var(--text)] transition-colors">
                  Future Planning
                </span>
                <span className="text-[10px] font-mono text-[color:var(--text-subtle)]">
                  02
                </span>
              </div>
              <h3 className="text-xl text-[color:var(--text)] font-display uppercase tracking-tight mb-3">
                Goal Setting
              </h3>
              <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8 flex-1">
                Specialized tools to model vacations, home down-payments, 
                and retirement. Expert tracking out-of-the-box.
              </p>
              <div className="mt-auto">
                <a href="#" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--accent)] hover:underline transition-colors">
                  Calculate Growth
                  <iconify-icon icon="solar:arrow-right-linear" className="text-sm"></iconify-icon>
                </a>
              </div>
            </div>

            <div className="group relative flex flex-col p-8 rounded-2xl bg-[color:var(--bg-card)] border border-[color:var(--border)] shadow-[var(--shadow)] hover:bg-[color:var(--bg-card-hover)] transition-all duration-300 h-full overflow-hidden animate-on-scroll transform hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[color:var(--text-subtle)] group-hover:text-[color:var(--text)] transition-colors">
                  Wealth Building
                </span>
                <span className="text-[10px] font-mono text-[color:var(--text-subtle)]">
                  03
                </span>
              </div>
              <h3 className="text-xl text-[color:var(--text)] font-display uppercase tracking-tight mb-3">
                Debt Payoff
              </h3>
              <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8 flex-1">
                Avalanche and Snowball methods baked in. Visualize when you will be completely debt-free.
              </p>
              <div className="mt-auto">
                <a href="#" className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--accent)] hover:underline transition-colors">
                  See Strategies
                  <iconify-icon icon="solar:arrow-right-linear" className="text-sm"></iconify-icon>
                </a>
              </div>
            </div>
          </div>

          <div className="border-y border-[color:var(--border)] bg-[color:var(--bg-surface)]/30 mb-20 animate-on-scroll">
            <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12">
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[10px] text-[color:var(--text-subtle)] border border-[color:var(--border)] bg-[color:var(--bg-card)] px-1.5 py-0.5 rounded">
                  01
                </span>
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text)] mb-1">
                    Automated Import
                  </h4>
                  <p className="text-[11px] text-[color:var(--text-muted)] font-light">
                    Minimize manual data entry
                  </p>
                </div>
              </div>
              <div className="hidden md:block w-px h-8 bg-[color:var(--border)]"></div>
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[10px] text-[color:var(--text-subtle)] border border-[color:var(--border)] bg-[color:var(--bg-card)] px-1.5 py-0.5 rounded">
                  02
                </span>
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text)] mb-1">
                    Data Security
                  </h4>
                  <p className="text-[11px] text-[color:var(--text-muted)] font-light">
                    Bank-level AES encryption
                  </p>
                </div>
              </div>
              <div className="hidden md:block w-px h-8 bg-[color:var(--border)]"></div>
              <div className="flex gap-4 items-start">
                <span className="font-mono text-[10px] text-[color:var(--text-subtle)] border border-[color:var(--border)] bg-[color:var(--bg-card)] px-1.5 py-0.5 rounded">
                  03
                </span>
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wide text-[color:var(--text)] mb-1">
                    Smart Alerts
                  </h4>
                  <p className="text-[11px] text-[color:var(--text-muted)] font-light">
                    Avoid overdrafts proactively
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <p className="text-xs font-mono text-[color:var(--text-subtle)] uppercase tracking-widest">
              Two perspectives: The Algorithm's Logic vs. Your Clean Dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-[color:var(--border)] rounded-2xl overflow-hidden bg-[color:var(--bg-card)] shadow-[var(--shadow)] animate-on-scroll">
            <div className="p-8 lg:p-12 relative flex flex-col justify-between group border-b lg:border-b-0 lg:border-r border-[color:var(--border)]">
              <div className="absolute top-6 left-6 z-10">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--accent)] border border-[color:var(--border)] px-2 py-1 rounded bg-[color:var(--accent-soft)]">
                  The Engine View
                </span>
              </div>
              <div className="mt-12 space-y-4 opacity-80 group-hover:opacity-100 transition-opacity duration-500 mb-16">
                <div className="font-mono text-xs text-[color:var(--text-subtle)] leading-loose">
                  <div className="flex gap-4">
                    <span className="text-[color:var(--accent)]">TransactionID</span>
                    <span className="text-[color:var(--text)]">#88219</span>
                    = {'{'}
                  </div>
                  <div className="flex gap-4 pl-4">
                    <span className="text-[color:var(--text)]">merchant</span>
                    :
                    <span className="text-[color:var(--text-subtle)]">
                      'Starbucks Corp'
                    </span>
                    ,
                  </div>
                  <div className="flex gap-4 pl-4">
                    <span className="text-[color:var(--text)]">amount</span>
                    :
                    <span className="text-[color:var(--accent)]">'$4.50'</span>
                    ,
                  </div>
                  <div className="flex gap-4 pl-4">
                    <span className="text-[color:var(--text)]">category</span>
                    :
                    <span className="text-[color:var(--text-subtle)]">
                      'Dining/Coffee'
                    </span>
                    ,
                  </div>
                  <div className="flex gap-4 pl-4">
                    <span className="text-[color:var(--text)]">auto_assigned</span>
                    :
                    <span className="text-[color:var(--accent)]">true</span>
                  </div>
                  <div className="flex gap-4">{'};'}</div>
                </div>
              </div>
              <div>
                <h3 className="text-xl text-[color:var(--text)] font-display uppercase tracking-tight mb-2">
                  Operational Control
                </h3>
                <p className="text-sm text-[color:var(--text-muted)] leading-relaxed max-w-sm">
                  We manage the data pulling, cleansing, and categorization 
                  so you don't have to build complex spreadsheets.
                </p>
              </div>
            </div>
            <div className="p-8 lg:p-12 relative bg-[color:var(--bg-surface)] flex flex-col justify-between group">
              <div className="absolute top-6 left-6 z-10">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-subtle)] border border-[color:var(--border)] px-2 py-1 rounded bg-[color:var(--bg-card)]">
                  User Dashboard
                </span>
              </div>
              <div className="mt-12 mb-16 relative flex justify-center items-center">
                <div className="bg-[color:var(--bg-card)] border border-[color:var(--border)] rounded-lg shadow-[var(--shadow)] transform group-hover:-translate-y-1 transition-transform duration-500 w-full max-w-xs overflow-hidden">
                  <div className="h-8 bg-[color:var(--bg-surface)] border-b border-[color:var(--border)] flex items-center px-3 justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--border)]"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-[color:var(--border)]"></div>
                    </div>
                    <div className="h-1 w-8 bg-[color:var(--border)] rounded-full"></div>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <iconify-icon icon="solar:pie-chart-2-bold" className="text-[color:var(--accent)] text-xl"></iconify-icon>
                      <div>
                          <div className="text-xs font-semibold text-[color:var(--text)]">Dining & Coffee</div>
                          <div className="text-[10px] text-[color:var(--text-subtle)]">$45.50 / $150.00</div>
                      </div>
                    </div>
                    <div className="w-full h-px bg-[color:var(--border)]"></div>
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="text-[color:var(--text-subtle)]">
                        Safe to spend
                      </span>
                      <span className="text-[#10b981] font-semibold">On Track</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl text-[color:var(--text)] font-display uppercase tracking-tight mb-2">
                  Simple Visibility
                </h3>
                <p className="text-sm text-[color:var(--text-muted)] leading-relaxed max-w-sm">
                  You get the information you need: How much is left? What can I spend today? 
                  Are my goals safe?
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-[10px] font-mono text-[color:var(--text-subtle)] uppercase tracking-[0.2em] opacity-90">
              One platform. End-to-end wealth management.
            </p>
          </div>
        </div>
        <div className="surface-seam" aria-hidden="true"></div>
      </section>

      {/* Outcomes / Benefits */}
      <section id="analytics" className="section section--surface py-24 md:py-32">
        <div className="spotlight"></div>
        <div className="section-content max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-3 block">
                // Why Choose Budgetly
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-[color:var(--text)] uppercase tracking-tighter leading-none mb-4">
                FEATURES
                <br />
                <span className="text-[color:var(--accent)] font-semibold">
                  → OUTCOMES
                </span>
              </h2>
              <p className="text-sm text-[color:var(--text-muted)] leading-relaxed font-light">
                Shift from uncertain spending to predictable wealth. 
                Budgetly transforms tracking into a competitive financial advantage.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-hidden bg-[color:var(--border)] border border-[color:var(--border)] rounded-[2rem] shadow-[var(--shadow)] gap-px">
            <div className="group bg-[color:var(--bg-card)] hover:bg-[color:var(--bg-card-hover)] transition-colors p-8 flex flex-col justify-between h-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--accent-soft)] to-transparent opacity-70 pointer-events-none"></div>
              <div className="absolute inset-0 border border-transparent group-hover:border-[color:var(--accent)]/15 transition-colors pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[color:var(--accent)]/45 to-transparent opacity-70"></div>
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)] mb-4 block">
                  // INTELLIGENCE
                </span>
                <h3 className="text-lg font-semibold text-[color:var(--text)] mb-2 tracking-tight">
                  Auto-Categorization
                </h3>
                <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8">
                  Say goodbye to manual entry. Our ML models categorize 98% of your transactions perfectly.
                </p>
              </div>
              <div className="text-[10px] font-mono text-[color:var(--text-subtle)] group-hover:text-[color:var(--accent)] transition-colors flex items-center gap-2 relative z-10">
                Manual → Automated
              </div>
            </div>

            <div className="group bg-[color:var(--bg-card)] hover:bg-[color:var(--bg-card-hover)] transition-colors p-8 flex flex-col justify-between h-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--accent-soft)] to-transparent opacity-70 pointer-events-none"></div>
              <div className="absolute inset-0 border border-transparent group-hover:border-[color:var(--accent)]/15 transition-colors pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[color:var(--accent)]/45 to-transparent opacity-70"></div>
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)] mb-4 block">
                  // GROWTH
                </span>
                <h3 className="text-lg font-semibold text-[color:var(--text)] mb-2 tracking-tight">
                  Wealth Building
                </h3>
                <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8">
                  Watch your net worth grow. We provide clear, visual insights to help forecast your savings trajectory.
                </p>
              </div>
              <div className="text-[10px] font-mono text-[color:var(--text-subtle)] group-hover:text-[color:var(--accent)] transition-colors flex items-center gap-2 relative z-10">
                Stagnant → Scaling
              </div>
            </div>

            <div className="group bg-[color:var(--bg-card)] hover:bg-[color:var(--bg-card-hover)] transition-colors p-8 flex flex-col justify-between h-full relative">
              <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--accent-soft)] to-transparent opacity-70 pointer-events-none"></div>
              <div className="absolute inset-0 border border-transparent group-hover:border-[color:var(--accent)]/15 transition-colors pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[color:var(--accent)]/45 to-transparent opacity-70"></div>
              <div className="relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)] mb-4 block">
                  // SECURITY
                </span>
                <h3 className="text-lg font-semibold text-[color:var(--text)] mb-2 tracking-tight">
                  Bank-Level Safety
                </h3>
                <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8">
                  Read-only connections. We use Plaid and 256-bit encryption. We never touch or move your money.
                </p>
              </div>
              <div className="text-[10px] font-mono text-[color:var(--text-subtle)] group-hover:text-[color:var(--accent)] transition-colors flex items-center gap-2 relative z-10">
                Vulnerable → Encrypted
              </div>
            </div>

            <div className="group bg-[color:var(--bg-card)] hover:bg-[color:var(--bg-card-hover)] transition-colors p-8 flex flex-col justify-between h-full relative">
              <div className="absolute inset-0 border border-transparent group-hover:border-[color:var(--accent)]/15 transition-colors pointer-events-none"></div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-4 block">
                  // SYNC
                </span>
                <h3 className="text-lg font-semibold text-[color:var(--text)] mb-2 tracking-tight">
                  Real-Time Updates
                </h3>
                <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8">
                  Know exactly where your budget is. Automated app and email notifications at key milestones.
                </p>
              </div>
              <div className="text-[10px] font-mono text-[color:var(--text-subtle)] transition-colors">
                Delayed → Instant
              </div>
            </div>

            <div className="group bg-[color:var(--bg-card)] hover:bg-[color:var(--bg-card-hover)] transition-colors p-8 flex flex-col justify-between h-full relative">
              <div className="absolute inset-0 border border-transparent group-hover:border-[color:var(--accent)]/15 transition-colors pointer-events-none"></div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-4 block">
                  // ALERTS
                </span>
                <h3 className="text-lg font-semibold text-[color:var(--text)] mb-2 tracking-tight">
                  Smart Recommendations
                </h3>
                <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8">
                  Get proactive nudges. If a subscription goes up in price, we'll let you know immediately.
                </p>
              </div>
              <div className="text-[10px] font-mono text-[color:var(--text-subtle)] transition-colors">
                Reactive → Proactive
              </div>
            </div>

            <div className="group bg-[color:var(--bg-card)] hover:bg-[color:var(--bg-card-hover)] transition-colors p-8 flex flex-col justify-between h-full relative">
              <div className="absolute inset-0 border border-transparent group-hover:border-[color:var(--accent)]/15 transition-colors pointer-events-none"></div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--text-subtle)] mb-4 block">
                  // ACCESS
                </span>
                <h3 className="text-lg font-semibold text-[color:var(--text)] mb-2 tracking-tight">
                  Cross-Platform
                </h3>
                <p className="text-sm text-[color:var(--text-muted)] font-light leading-relaxed mb-8">
                  Available on iOS, Android, and Web. Your budget follows you everywhere, beautifully.
                </p>
              </div>
              <div className="text-[10px] font-mono text-[color:var(--text-subtle)] transition-colors">
                Tethered → Everywhere
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-[11px] font-mono text-[color:var(--text-subtle)] tracking-widest uppercase opacity-90">
              Professional Tools. Personal Growth.
            </p>
          </div>
        </div>
        <div className="surface-seam" aria-hidden="true"></div>
      </section>

      {/* Core Values / Stats */}
      <section id="security" className="section section--main py-32">
        <div className="spotlight"></div>
        <div className="section-content max-w-7xl mx-auto px-6">
          <div className="mb-20 max-w-4xl mx-auto text-center">
            <div className="flex items-center gap-3 mb-6 justify-center animate-on-scroll">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)]">
                System :: Reliability
              </span>
              <div className="h-px w-8 bg-[color:var(--border)]"></div>
              <span className="text-[10px] font-mono text-[color:var(--text-subtle)]">
                Enterprise Grade
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-[color:var(--text)] uppercase tracking-tighter leading-[0.9] mb-6 animate-on-scroll">
              Modern Platform.
              <br />
              <span className="text-[color:var(--accent)] font-semibold">
                Proven Security.
              </span>
            </h2>

            <p className="text-base text-[color:var(--text-muted)] font-light leading-relaxed mb-10 max-w-2xl mx-auto animate-on-scroll">
              Trust isn't given, it's earned. Our infrastructure relies on the same encryption 
              standards used by major banks to ensure your data is always protected.
            </p>

            <div className="flex flex-wrap items-center gap-8 border-t border-[color:var(--border)] pt-6 justify-center animate-on-scroll">
              <div>
                <div className="text-lg font-semibold text-[color:var(--text)] tracking-tight">
                  256-bit
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)] mt-1">
                  AES Encryption
                </div>
              </div>
              <div className="w-px h-8 bg-[color:var(--border)]"></div>
              <div>
                <div className="text-lg font-semibold text-[color:var(--text)] tracking-tight">
                  24/7
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)] mt-1">
                  Active Sync
                </div>
              </div>
              <div className="w-px h-8 bg-[color:var(--border)]"></div>
              <div>
                <div className="text-lg font-semibold text-[color:var(--text)] tracking-tight">
                  11k+
                </div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)] mt-1">
                  Banks Supported
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-on-scroll">
            <div className="group bg-[color:var(--bg-card)] border border-[color:var(--border)] p-6 rounded-2xl relative overflow-hidden hover:bg-[color:var(--bg-card-hover)] transition-all duration-300 shadow-[var(--shadow)]">
              <div className="absolute top-0 right-0 p-5 opacity-20 group-hover:opacity-35 transition-opacity">
                <iconify-icon icon="solar:lock-keyhole-bold" className="text-3xl text-[color:var(--text-subtle)]"></iconify-icon>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)] block mb-4 border-b border-[color:var(--border)] pb-2 w-max">
                Focus: Protection
              </span>
              <h3 className="text-base font-semibold text-[color:var(--text)] mb-2">
                Read-Only Data
              </h3>
              <p className="text-xs text-[color:var(--text-muted)] leading-relaxed mb-8 font-light">
                We cannot move or touch your money. We only analyze the numbers to give you better insights.
              </p>
              <div className="mt-auto flex justify-between items-end">
                <span className="text-[9px] font-mono text-[color:var(--text-subtle)] bg-[color:var(--bg-surface)] px-1.5 py-0.5 rounded border border-[color:var(--border)]">
                  Secure → Private
                </span>
              </div>
            </div>

            <div className="group bg-[color:var(--bg-card)] border border-[color:var(--border)] p-6 rounded-2xl relative overflow-hidden shadow-[var(--shadow)] hover:bg-[color:var(--bg-card-hover)] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--accent-soft)] to-transparent opacity-70 pointer-events-none"></div>
              <div className="absolute top-0 right-0 p-5 opacity-100">
                <iconify-icon icon="solar:shield-check-bold" className="text-3xl text-[color:var(--accent)]"></iconify-icon>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[color:var(--accent)] block mb-4 border-b border-[color:var(--border)] pb-2 w-max relative z-10">
                Focus: Privacy
              </span>
              <h3 className="text-base font-semibold text-[color:var(--text)] mb-2 relative z-10">
                No Data Selling
              </h3>
              <p className="text-xs text-[color:var(--text-muted)] leading-relaxed mb-8 font-light relative z-10">
                Your financial data is yours. We will never sell your information to credit card companies or advertisers.
              </p>
              <div className="mt-auto flex justify-between items-end relative z-10">
                <span className="text-[9px] font-mono text-[color:var(--text-muted)] bg-[color:var(--bg-surface)] px-1.5 py-0.5 rounded border border-[color:var(--border)]">
                  Product → Customer
                </span>
              </div>
            </div>

            <div className="group bg-[color:var(--bg-card)] border border-[color:var(--border)] p-6 rounded-2xl relative overflow-hidden hover:bg-[color:var(--bg-card-hover)] transition-all duration-300 shadow-[var(--shadow)]">
              <div className="absolute top-0 right-0 p-5 opacity-20 group-hover:opacity-35 transition-opacity">
                <iconify-icon icon="solar:settings-bold" className="text-3xl text-[color:var(--text-subtle)]"></iconify-icon>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)] block mb-4 border-b border-[color:var(--border)] pb-2 w-max">
                Focus: Technology
              </span>
              <h3 className="text-base font-semibold text-[color:var(--text)] mb-2">
                Plaid Integration
              </h3>
              <p className="text-xs text-[color:var(--text-muted)] leading-relaxed mb-8 font-light">
                We partner with industry leaders for authentication, ensuring robust and stable API connections.
              </p>
              <div className="mt-auto flex justify-between items-end">
                <span className="text-[9px] font-mono text-[color:var(--text-subtle)] bg-[color:var(--bg-surface)] px-1.5 py-0.5 rounded border border-[color:var(--border)]">
                  Legacy → Modern API
                </span>
              </div>
            </div>

            <div className="group bg-[color:var(--bg-card)] border border-[color:var(--border)] p-6 rounded-2xl relative overflow-hidden shadow-[var(--shadow)] hover:bg-[color:var(--bg-card-hover)] transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--accent-soft)] to-transparent opacity-70 pointer-events-none"></div>
              <div className="absolute top-0 right-0 p-5 opacity-100">
                <iconify-icon icon="solar:users-group-rounded-bold" className="text-3xl text-[color:var(--accent)]"></iconify-icon>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[color:var(--accent)] block mb-4 border-b border-[color:var(--border)] pb-2 w-max relative z-10">
                Focus: Support
              </span>
              <h3 className="text-base font-semibold text-[color:var(--text)] mb-2 relative z-10">
                Human Help
              </h3>
              <p className="text-xs text-[color:var(--text-muted)] leading-relaxed mb-8 font-light relative z-10">
                Real financial support. If an account disconnects or a rule breaks, our team helps fix it fast.
              </p>
              <div className="mt-auto flex justify-between items-end relative z-10">
                <span className="text-[9px] font-mono text-[color:var(--text-muted)] bg-[color:var(--bg-surface)] px-1.5 py-0.5 rounded border border-[color:var(--border)]">
                  Bots → Humans
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="surface-seam" aria-hidden="true"></div>
      </section>


      {/* Footer */}
      <footer id="contact" className="bg-[color:var(--bg-card)] border-t border-[color:var(--border)] pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 mb-10 w-full">
            <div className="flex flex-col items-center md:items-start gap-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)] opacity-70">
                Connect
              </span>
              <div className="flex flex-col gap-2.5 text-center md:text-left">
                <a href="#" className="group flex items-center gap-2.5 text-xs text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors justify-center md:justify-start">
                  <iconify-icon icon="ri:twitter-x-line" className="text-sm text-[color:var(--text-subtle)] group-hover:text-[color:var(--accent)] transition-colors"></iconify-icon>
                  <span>Twitter / X</span>
                </a>
                <a href="#" className="group flex items-center gap-2.5 text-xs text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors justify-center md:justify-start">
                  <iconify-icon icon="ri:instagram-line" className="text-sm text-[color:var(--text-subtle)] group-hover:text-[color:var(--accent)] transition-colors"></iconify-icon>
                  <span>Instagram</span>
                </a>
                <a href="#" className="group flex items-center gap-2.5 text-xs text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors justify-center md:justify-start">
                  <iconify-icon icon="solar:letter-linear" className="text-sm text-[color:var(--text-subtle)] group-hover:text-[color:var(--accent)] transition-colors"></iconify-icon>
                  <span>support@budgetly.com</span>
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-2.5 mt-2 md:mt-0">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--accent)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[color:var(--accent)] shadow-[0_0_8px_var(--accent)]"></span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text)]">
                  Systems: All Operational
                </span>
              </div>
              <div className="flex gap-3 text-[9px] font-mono text-[color:var(--text-subtle)] uppercase tracking-widest opacity-80">
                <span>SSL SECURED</span>
                <span className="text-[color:var(--border)]">|</span>
                <span>AES-256</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text-subtle)] opacity-70">
                Product
              </span>
              <div className="flex flex-col gap-2.5 text-center md:text-right">
                <a href="#" className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                  Download App
                </a>
                <a href="#features" className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                  Features
                </a>
                <a href="#security" className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                  Security
                </a>
                <a href="#quote" className="text-xs text-[color:var(--text-muted)] hover:text-[color:var(--accent)] transition-colors">
                  Pricing
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[color:var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-[10px] font-mono text-[color:var(--text-subtle)] uppercase tracking-widest">
              © 2026 Budgetly Financial LLC
            </span>
            <div className="flex gap-6">
              <a href="#" className="text-[10px] font-mono text-[color:var(--text-subtle)] hover:text-[color:var(--text)] uppercase tracking-widest transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-[10px] font-mono text-[color:var(--text-subtle)] hover:text-[color:var(--text)] uppercase tracking-widest transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
