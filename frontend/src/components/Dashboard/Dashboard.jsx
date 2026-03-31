import React, { useState, useEffect, useRef } from 'react';

// NOTE: Ensure you have this in your public/index.html:
// <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>

export default function BudgetlyPro() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'solar:widget-5-bold-duotone' },
    { id: 'expenses', label: 'Expenses', icon: 'solar:card-2-bold-duotone' },
    { id: 'transactions', label: 'Transactions', icon: 'solar:reorder-bold-duotone' },
    { id: 'analytics', label: 'AI Analytics', icon: 'solar:graph-up-bold-duotone' },
    { id: 'settings', label: 'Settings', icon: 'solar:settings-bold-duotone' },
  ];

  // --- MOCK DATA ---
  const transactions = [
    { id: 1, merchant: 'Apple Store', cat: 'Tech', amt: -1299.00, date: 'Mar 28', icon: 'logos:apple' },
    { id: 2, merchant: 'Whole Foods', cat: 'Food', amt: -84.20, date: 'Mar 27', icon: 'solar:cart-large-bold' },
    { id: 3, merchant: 'Netflix', cat: 'Ent.', amt: -15.99, date: 'Mar 26', icon: 'logos:netflix-icon' },
    { id: 4, merchant: 'Salary Inc', cat: 'Income', amt: 5500.00, date: 'Mar 25', icon: 'solar:wad-of-money-bold' },
  ];

  // --- VIEW RENDERERS ---

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Net Liquidity', val: '$12,450', trend: '+12%', icon: 'solar:wallet-money-bold-duotone', col: 'text-emerald-500' },
          { label: 'Monthly Burn', val: '$3,120', trend: '-2%', icon: 'solar:fire-bold-duotone', col: 'text-orange-500' },
          { label: 'AI Forecast', val: '$15,200', trend: 'Stable', icon: 'solar:magic-stick-3-bold-duotone', col: 'text-blue-500' },
        ].map((s, i) => (
          <div key={i} className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>
            <div className="flex justify-between mb-6">
              <iconify-icon icon={s.icon} className={`text-3xl ${s.col}`}></iconify-icon>
              <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-2 py-1 rounded-md">{s.trend}</span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-1">{s.label}</p>
            <h3 className="text-3xl font-display font-bold text-white">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-display uppercase tracking-widest text-white">Cash Flow Pulse</h3>
            <iconify-icon icon="solar:chart-square-bold-duotone" className="text-orange-500 text-2xl"></iconify-icon>
          </div>
          <svg viewBox="0 0 800 200" className="w-full h-48 overflow-visible">
            <path d="M0,150 Q100,100 200,140 T400,60 T600,100 T800,20" fill="none" stroke="#f97316" strokeWidth="4" className="drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
            <path d="M0,150 Q100,100 200,140 T400,60 T600,100 T800,20 V200 H0 Z" fill="url(#dashGrad)" />
            <defs>
              <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(249, 115, 22, 0.2)" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="col-span-12 lg:col-span-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-orange-600 to-amber-500 shadow-2xl relative overflow-hidden">
          <h3 className="text-xl font-display font-bold text-white mb-2 uppercase">Pro Forecast</h3>
          <p className="text-sm text-white/80 mb-6 font-light">Gemini AI suggests you can save an extra $450 this month by adjusting "Dining" targets.</p>
          <button className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform">Run Analysis</button>
          <iconify-icon icon="solar:stars-minimalistic-bold" className="absolute -bottom-6 -right-6 text-[12rem] opacity-10"></iconify-icon>
        </div>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="grid grid-cols-12 gap-8 animate-in zoom-in-95 duration-500">
      <div className="col-span-12 lg:col-span-4">
        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
          <div className="flex items-center gap-3 mb-4">
             <iconify-icon icon="solar:card-send-bold-duotone" className="text-orange-500 text-2xl"></iconify-icon>
             <h3 className="text-lg font-display uppercase tracking-widest">Active Method</h3>
          </div>
          <div className="w-full aspect-[1.58/1] rounded-3xl bg-gradient-to-br from-gray-800 to-black p-6 border border-white/10 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="flex justify-between items-start relative z-10">
              <iconify-icon icon="solar:chip-bold" className="text-4xl text-orange-500/50"></iconify-icon>
              <span className="font-display tracking-[0.3em] text-xs text-white/40">BUDGETLY</span>
            </div>
            <div className="relative z-10 mt-auto">
              <p className="font-mono text-lg tracking-[0.2em] text-white/90">**** **** **** 8829</p>
              <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-2 uppercase tracking-widest">
                <span>Alex Johnson</span>
                <span>12/28</span>
              </div>
            </div>
          </div>
          <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-mono uppercase tracking-widest hover:bg-orange-500 transition-colors">Generate Virtual Card</button>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-8 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative">
        <h3 className="text-lg font-display uppercase tracking-widest mb-10">Envelope Allocations</h3>
        <div className="space-y-10">
          {[
            { label: 'Housing', val: 2100, max: 2500, col: 'bg-blue-500' },
            { label: 'Food & Dining', val: 840, max: 1000, col: 'bg-orange-500' },
            { label: 'Cloud Services', val: 120, max: 100, col: 'bg-red-500' },
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="flex justify-between mb-3 items-end">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs font-mono text-gray-500">${item.val} / <span className="text-gray-700">${item.max}</span></span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden">
                <div 
                  className={`h-full ${item.col} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                  style={{ width: `${Math.min((item.val/item.max)*100, 100)}%` }}
                ></div>
              </div>
              {item.val > item.max && (
                <span className="absolute -bottom-6 right-0 text-[9px] font-mono text-red-500 uppercase tracking-tighter">Budget Exceeded // Over_Limit</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center p-2 pl-6 bg-white/[0.03] border border-white/5 rounded-[2rem]">
        <div className="flex items-center gap-4 flex-1">
          <iconify-icon icon="solar:magnifer-linear" className="text-gray-500"></iconify-icon>
          <input type="text" placeholder="Filter Ledger..." className="bg-transparent border-none outline-none text-sm w-full font-mono py-4" />
        </div>
        <button className="h-12 px-8 bg-white text-black rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">Download .CSV</button>
      </div>

      <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Entity</th>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Classification</th>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Timestamp</th>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest text-right">Magnitude</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-white/[0.03] transition-colors group cursor-pointer">
                <td className="px-10 py-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <iconify-icon icon={t.icon} className="text-xl"></iconify-icon>
                  </div>
                  <span className="text-sm font-medium group-hover:text-orange-500 transition-colors">{t.merchant}</span>
                </td>
                <td className="px-10 py-6"><span className="text-[10px] font-mono text-gray-500 border border-white/10 px-3 py-1 rounded-full uppercase">{t.cat}</span></td>
                <td className="px-10 py-6 text-xs text-gray-500 font-mono">{t.date}</td>
                <td className={`px-10 py-6 text-sm font-mono text-right ${t.amt > 0 ? 'text-emerald-500' : 'text-white'}`}>
                  {t.amt > 0 ? `+ $${t.amt}` : `- $${Math.abs(t.amt)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="grid grid-cols-12 gap-8 animate-in slide-in-from-top-4 duration-500">
      <div className="col-span-12 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
           <iconify-icon icon="solar:graph-up-bold-duotone" className="text-4xl text-orange-500"></iconify-icon>
           <div>
             <h3 className="text-xl font-display font-bold uppercase">Spending Efficiency</h3>
             <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">System::AI_Calculated_Efficiency</p>
           </div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Circular Gauge */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#f97316" strokeWidth="8" strokeDasharray="210" strokeDashoffset="50" strokeLinecap="round" className="drop-shadow-[0_0_10px_#f97316]" />
            </svg>
            <div className="absolute text-center">
              <h4 className="text-4xl font-display font-bold">84<span className="text-lg opacity-50">%</span></h4>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Efficiency</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <h4 className="text-xs font-mono text-orange-500 uppercase tracking-widest mb-2">Anomaly Detected</h4>
              <p className="text-sm text-gray-400 font-light leading-relaxed">Subscriptions rose by 14% this month. We recommend reviewing your "Cloud Storage" plans to save $22.50/mo.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
                <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Savings Potential</p>
                <p className="text-xl font-bold text-emerald-500">$1,240.00</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
                <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Debt Index</p>
                <p className="text-xl font-bold text-red-500">0.14</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-4">
         <iconify-icon icon="solar:settings-bold-duotone" className="text-4xl text-orange-500"></iconify-icon>
         <h3 className="text-xl font-display font-bold uppercase tracking-widest">Engine Preferences</h3>
      </div>
      
      {[
        { title: 'Data Synchronization', desc: 'Manage Pliad bank connections and frequency.', icon: 'solar:refresh-bold-duotone' },
        { title: 'Security & Privacy', desc: 'Enable 2FA and Biometric vault access.', icon: 'solar:lock-bold-duotone' },
        { title: 'AI Notifications', desc: 'Configure spending nudge sensitivity.', icon: 'solar:bell-bold-duotone' },
        { title: 'Export & Backup', desc: 'Automated weekly backups to cloud storage.', icon: 'solar:cloud-bold-duotone' },
      ].map((s, i) => (
        <div key={i} className="flex items-center justify-between p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl text-gray-400 group-hover:text-orange-500 transition-colors">
              <iconify-icon icon={s.icon}></iconify-icon>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1">{s.title}</h4>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          </div>
          <iconify-icon icon="solar:alt-arrow-right-linear" className="text-gray-700 text-xl"></iconify-icon>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#050505] text-white font-sans antialiased selection:bg-orange-500">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      {/* Sidebar Section - Compact Fixed Width */}
      <aside className="w-64 h-full flex-shrink-0 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col z-50 overflow-hidden">
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center">
            <iconify-icon icon="solar:wallet-bold" className="text-orange-500 text-2xl mr-2 shadow-[0_0_20px_rgba(249,115,22,0.6)]"></iconify-icon>
            <span className="text-white font-display text-xl uppercase tracking-tighter cursor-default font-bold">Budgetly</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-600 px-4 block mb-4">Navigation</span>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 border ${
                activeTab === item.id ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <iconify-icon icon={item.icon} className="text-2xl"></iconify-icon>
              <span className="text-[12px] font-medium tracking-tight uppercase">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 text-center">
             <p className="text-[10px] font-mono text-orange-500 uppercase tracking-widest mb-2">Sync: 100%</p>
             <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-full animate-pulse"></div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
        <header className="h-24 border-b border-white/5 bg-black/20 backdrop-blur-xl px-10 flex items-center justify-between z-40">
          <div>
            <h2 className="text-[9px] font-mono text-orange-500 uppercase tracking-[0.5em] mb-1 animate-pulse">Operational::System_OK</h2>
            <h1 className="text-3xl font-display font-bold uppercase tracking-tighter">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-6 relative">
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 rounded-full border border-white/10 bg-white/5 hover:border-orange-500/40 transition-all pr-4 relative z-50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center font-bold text-xs">AJ</div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold leading-none mb-1 uppercase tracking-tighter">Alex Johnson</p>
                  <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Premium Node</p>
                </div>
                <iconify-icon icon="solar:alt-arrow-down-linear" className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}></iconify-icon>
              </button>

              {/* DROPDOWN MENU */}
              {isProfileOpen && (
                <div className="absolute right-0 top-[120%] w-60 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-white/5 mb-1">
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Authenticated As</p>
                    <p className="text-sm font-bold text-white truncate">alex.j@budgetly.pro</p>
                  </div>
                  
                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all group">
                      <iconify-icon icon="solar:user-circle-bold-duotone" className="text-lg text-orange-500 group-hover:scale-110 transition-transform"></iconify-icon>
                      View Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all group">
                      <iconify-icon icon="solar:settings-minimalistic-bold-duotone" className="text-lg text-orange-500 group-hover:scale-110 transition-transform"></iconify-icon>
                      Security Settings
                    </button>
                  </div>

                  <div className="h-px bg-white/5 my-2"></div>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs text-red-400 font-bold hover:bg-red-500/10 transition-all group">
                    <iconify-icon icon="solar:logout-2-bold-duotone" className="text-lg group-hover:-translate-x-1 transition-transform"></iconify-icon>
                    Sign Out Terminal
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-20">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'expenses' && renderExpenses()}
            {activeTab === 'transactions' && renderTransactions()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </main>
    </div>
  );
}