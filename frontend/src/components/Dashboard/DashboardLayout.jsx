import React, { useEffect, useState, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Icon } from '@iconify/react';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  // 1. IMPROVED INITIAL STATE: Use objects instead of null to prevent "cannot read property" errors
  const [userData, setUserData] = useState({ name: '', email: '' }); 
  const [analysisData, setAnalysisData] = useState({
    currentTotal: 0,
    predictedTotal: 0,
    limit: 10000,
    dailyBurnRate: "0.00",
    breakdown: {}
  });

  // 2. FORM STATE: Initialized immediately
  const [expenseForm, setExpenseForm] = useState({ 
    amount: '', 
    category: 'Food', 
    description: '', 
    createdAt: new Date().toISOString().split('T')[0] 
  });

  const [isLoading, setIsLoading] = useState(false); // Start as false for instant UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const fetchIdentityAndData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      // 3. PARALLEL FETCHING: Promise.all starts both requests at the same time
      const [userRes, analysisRes] = await Promise.all([
        fetch('https://budgetly-7s9d.onrender.com/api/user/me', { headers }),
        fetch('https://budgetly-7s9d.onrender.com/api/analysis', { headers })
      ]);

      if (userRes.ok) {
        const userJson = await userRes.json();
        setUserData(userJson);
      }

      if (analysisRes.ok) {
        const analysisJson = await analysisRes.json();
        setAnalysisData(analysisJson);
      }
    } catch (err) {
      console.error("Sync Error", err);
    }
  };

  useEffect(() => {
    fetchIdentityAndData();
    
    // Close profile dropdown on outside click
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
  
  // Prepare the payload carefully
  const payload = {
    amount: parseFloat(expenseForm.amount), // Force into a Number
    category: expenseForm.category,
    description: expenseForm.description || "No description",
    createdAt: expenseForm.createdAt // The backend should handle the string-to-date conversion
  };

  try {
    const res = await fetch('https://budgetly-7s9d.onrender.com/api/expenses', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Backend Validation Error:", errorData);
      alert(`Failed: ${errorData.error}`); // This will tell you what's wrong
      return;
    }

    // Success logic...
    setExpenseForm({ amount: '', category: 'Food', description: '', createdAt: new Date().toISOString().split('T')[0] });
    fetchIdentityAndData();
  } catch (error) {
    console.error("Network Error:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'solar:widget-5-bold-duotone', to: '/dashboard' },
    { id: 'expenses', label: 'Expenses', icon: 'solar:card-2-bold-duotone', to: '/dashboard/expenses' },
    { id: 'transactions', label: 'Transactions', icon: 'solar:reorder-bold-duotone', to: '/dashboard/transactions' },
    { id: 'analytics', label: 'AI Analytics', icon: 'solar:graph-up-bold-duotone', to: '/dashboard/analytics' },
    { id: 'settings', label: 'Settings', icon: 'solar:settings-bold-duotone', to: '/dashboard/settings' },
  ];

  // Dynamic Label for Header
  const currentSegment = location.pathname.split('/')[2] || 'dashboard';
  const activeNav = navItems.find((i) => i.id === currentSegment) || navItems[0];

  return (
    <div className="h-screen w-full flex bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar navItems={navItems} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/40 backdrop-blur-xl z-50">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">
              {activeNav.label}
            </h1>
          </div>

          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1 rounded-full bg-white/5 border border-white/10 pr-4 hover:border-orange-500/50 transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg">
                {userData.name ? userData.name[0].toUpperCase() : "?"}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold uppercase tracking-tight">
                  {userData.name || "Loading..."}
                </p>
                <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                  {userData.email || "Connect_Node"}
                </p>
              </div>
              <Icon icon="solar:alt-arrow-down-linear" className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-4 w-56 bg-[#0a0a0a] border border-white/10 rounded-3xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-4 py-3 border-b border-white/5 mb-1">
                   <p className="text-[9px] font-mono text-gray-500 uppercase mb-1">Identity Path</p>
                   <p className="text-xs font-bold truncate text-white">{userData.email}</p>
                </div>
                <button 
                  onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs text-red-500 font-bold hover:bg-red-500/10 transition-all"
                >
                  <Icon icon="solar:logout-2-bold-duotone" className="text-lg" />
                  Terminate Session
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12">
          {/* 4. NO MORE LOADING GUARD: Outlet renders immediately with default state */}
          <Outlet context={{ analysisData, userData, expenseForm, setExpenseForm, isSubmitting, handleAddExpense }} />
        </div>
      </main>
    </div>
  );
}