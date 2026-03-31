import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'solar:widget-5-bold-duotone', to: '/dashboard' },
  { id: 'expenses', label: 'Expenses', icon: 'solar:card-2-bold-duotone', to: '/dashboard/expenses' },
  { id: 'transactions', label: 'Transactions', icon: 'solar:reorder-bold-duotone', to: '/dashboard/transactions' },
  { id: 'analytics', label: 'AI Analytics', icon: 'solar:graph-up-bold-duotone', to: '/dashboard/analytics' },
  { id: 'settings', label: 'Settings', icon: 'solar:settings-bold-duotone', to: '/dashboard/settings' },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const [analysisData, setAnalysisData] = useState(null);
  const [transactionsData, setTransactionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expenseForm, setExpenseForm] = useState({ amount: '', category: 'Food', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBackendData = async () => {
    setIsLoading(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      setIsLoading(false);
      navigate('/login');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const analysisRes = await fetch('http://localhost:3001/api/analysis', { headers });
      if (analysisRes.ok) {
        const analysisJson = await analysisRes.json();
        setAnalysisData(analysisJson);
      }

      const transRes = await fetch('http://localhost:3001/api/expenses', { headers });
      if (transRes.ok) {
        const transJson = await transRes.json();
        setTransactionsData(transJson);
      }
    } catch (error) {
      console.error('Failed to fetch from Express backend', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3001/api/expenses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(expenseForm.amount),
          category: expenseForm.category,
          description: expenseForm.description,
        }),
      });

      if (res.ok) {
        setExpenseForm({ amount: '', category: 'Food', description: '' });
        await fetchBackendData();
      }
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      Food: 'solar:cart-large-bold',
      Rent: 'solar:home-bold',
      Shopping: 'solar:bag-bold',
      Transport: 'solar:bus-bold',
      Tech: 'solar:laptop-minimalistic-bold',
      Bills: 'solar:document-text-bold',
    };
    return iconMap[category] || 'solar:bill-bold';
  };

  const currentSegment = location.pathname.split('/')[2] || 'dashboard';
  const activeNav = navItems.find((i) => i.id === currentSegment) || navItems[0];

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#050505] text-white font-sans antialiased selection:bg-orange-500">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <Sidebar navItems={navItems} />

      <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
        <header className="h-24 border-b border-white/5 bg-black/20 backdrop-blur-xl px-10 flex items-center justify-between z-40">
          <div>
            <h2 className="text-[9px] font-mono text-orange-500 uppercase tracking-[0.5em] mb-1 animate-pulse">Operational::Node_Active</h2>
            <h1 className="text-3xl font-display font-bold uppercase tracking-tighter text-white">{activeNav.label}</h1>
          </div>

          <div className="flex items-center gap-6 relative">
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 rounded-full border border-white/10 bg-white/5 hover:border-orange-500/40 transition-all pr-4 relative z-50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(249,115,22,0.3)] text-white">AJ</div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold leading-none mb-1 uppercase tracking-tighter text-white">Alex Johnson</p>
                  <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Admin Node</p>
                </div>
                <iconify-icon icon="solar:alt-arrow-down-linear" className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}></iconify-icon>
              </button>

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

                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs text-red-400 font-bold hover:bg-red-500/10 transition-all group"
                  >
                    <iconify-icon icon="solar:logout-2-bold-duotone" className="text-lg group-hover:-translate-x-1 transition-transform"></iconify-icon>
                    Terminate Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative z-30">
          <div className="max-w-7xl mx-auto pb-20">
            <Outlet
              context={{
                analysisData,
                transactionsData,
                isLoading,
                expenseForm,
                setExpenseForm,
                isSubmitting,
                handleAddExpense,
                getCategoryIcon,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
