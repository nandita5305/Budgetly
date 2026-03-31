import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'solar:widget-5-bold-duotone', to: '/dashboard' },
  { id: 'expenses', label: 'Expenses', icon: 'solar:card-2-bold-duotone', to: '/dashboard/expenses' },
  { id: 'transactions', label: 'Transactions', icon: 'solar:reorder-bold-duotone', to: '/dashboard/transactions' },
  { id: 'analytics', label: 'AI Analytics', icon: 'solar:graph-up-bold-duotone', to: '/dashboard/analytics' },
  { id: 'settings', label: 'Settings', icon: 'solar:settings-bold-duotone', to: '/dashboard/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-full flex-shrink-0 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col z-50 overflow-hidden">
      <div className="h-20 flex items-center px-6 mt-4">
        <div className="flex items-center">
          <Icon icon="solar:wallet-bold" className="text-orange-500 text-3xl mr-3 shadow-[0_0_20px_rgba(249,115,22,0.6)]" />
          <span className="text-white font-display text-xl uppercase tracking-tighter cursor-default font-bold">Budgetly</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-600 px-4 block mb-4">Navigation</span>
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.id === 'dashboard'}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 border ${
                isActive
                  ? 'bg-orange-500/10 border-orange-500/20 text-orange-500 shadow-[inset_0_0_20px_rgba(249,115,22,0.05)]'
                  : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`
            }
          >
            <Icon icon={item.icon} className="text-2xl" />
            <span className="text-[12px] font-medium tracking-tight uppercase">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mb-4">
        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-400"></div>
          <p className="text-[10px] font-mono text-orange-500 uppercase tracking-widest mb-2">DB Sync: Optimal</p>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 w-full animate-pulse shadow-[0_0_10px_#f97316]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
