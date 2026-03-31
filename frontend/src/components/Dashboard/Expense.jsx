import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Expense() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '' });
  // Change this at the top of your component
const [analysisData, setAnalysisData] = useState({ 
  breakdown: {}, 
  limit: 10000 // Default fallback until API loads
});
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: 'Food',
    description: '',
    createdAt: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [userRes, analysisRes] = await Promise.all([
        fetch('http://localhost:3001/api/user/me', { headers }),
        fetch('http://localhost:3001/api/analysis', { headers }),
      ]);

      if (userRes.ok) setUserData(await userRes.json());
      if (analysisRes.ok) setAnalysisData(await analysisRes.json());
    } catch (err) {
      console.error('Sync Error', err);
    }
  };

  useEffect(() => {
    fetchData();
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
          amount: parseFloat(expenseForm.amount),
          category: expenseForm.category,
          description: expenseForm.description || 'No description',
          createdAt: expenseForm.createdAt,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Failed: ${errorData.error}`);
        return;
      }

      setExpenseForm({ amount: '', category: 'Food', description: '', createdAt: new Date().toISOString().split('T')[0] });
      await fetchData();
    } catch (error) {
      console.error('Network Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header title="Expenses" userData={userData} />
        <div className="flex-1 overflow-y-auto p-12">
          <div className="grid grid-cols-12 gap-8 animate-in zoom-in-95 duration-500">
            <div className="col-span-12 lg:col-span-4 space-y-8">
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-400"></div>
                <div className="flex items-center gap-3 mb-6">
                  <Icon icon="solar:add-circle-bold-duotone" className="text-orange-500 text-2xl" />
                  <h3 className="text-lg font-display uppercase tracking-widest">Log Expense</h3>
                </div>

                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">$</span>
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="0.00"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-8 pr-4 text-white font-mono focus:outline-none focus:border-orange-500/50 transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-mono focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
                    >
                      <option value="Food" className="bg-black">Food & Dining</option>
                      <option value="Rent" className="bg-black">Rent & Housing</option>
                      <option value="Shopping" className="bg-black">Shopping</option>
                      <option value="Transport" className="bg-black">Transport</option>
                      <option value="Tech" className="bg-black">Tech & Subs</option>
                      <option value="Bills" className="bg-black">Utilities & Bills</option>
                    </select>
                    <Icon icon="solar:alt-arrow-down-linear" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <Icon icon="solar:calendar-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={expenseForm.createdAt}
                      onChange={(e) => setExpenseForm({ ...expenseForm, createdAt: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white font-mono focus:outline-none focus:border-orange-500/50 transition-colors [color-scheme:dark]"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Description (e.g. Uber, Groceries)"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-4 bg-orange-500/10 border border-orange-500/50 text-orange-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <span className="animate-pulse tracking-widest">Syncing Node...</span> : <><Icon icon="solar:add-square-bold" className="text-lg" />Commit Ledger Entry</>}
                  </button>
                </form>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-y-auto max-h-[80vh] custom-scrollbar">
              <h3 className="text-lg font-display uppercase tracking-widest mb-10">Envelope Allocations</h3>
              <div className="space-y-10">
                {analysisData?.breakdown && Object.keys(analysisData.breakdown).length > 0 ? (
                  Object.entries(analysisData.breakdown).map(([category, value]) => {
                    const totalBudgetLimit = analysisData.limit || 10000; 
  
  // Calculate percentage based on the total budget
                    const percentage = Math.min((value / totalBudgetLimit) * 100, 100);
                    
                    return (
    <div key={category} className="relative">
      <div className="flex justify-between mb-3 items-end">
        <span className="text-sm font-medium uppercase">{category}</span>
        <span className="text-xs font-mono text-gray-500">
          ${value} / <span className="text-gray-700">${totalBudgetLimit}</span>
        </span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            value > totalBudgetLimit ? 'bg-red-500' : 'bg-orange-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[2rem]">
                    <Icon icon="solar:graph-new-broken" className="text-5xl text-gray-700 mb-4" />
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">No allocations detected for current cycle</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
