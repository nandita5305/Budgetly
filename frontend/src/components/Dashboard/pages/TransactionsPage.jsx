import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Icon } from '@iconify/react'; 

export default function TransactionsPage() {
  const { transactionsData } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (id) => {
    if (!window.confirm("Terminate this ledger entry?")) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://budgetly-7s9d.onrender.com/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) window.location.reload();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const filteredTransactions = transactionsData?.filter((t) => {
    const search = searchQuery.toLowerCase();
    return (
      t.description?.toLowerCase().includes(search) || 
      t.category?.toLowerCase().includes(search)
    );
  }) || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* SEARCH BAR */}
      <div className="flex justify-between items-center p-2 pl-6 bg-white/[0.03] border border-white/5 rounded-[2rem]">
        <div className="flex items-center gap-4 flex-1">
          <Icon icon="solar:magnifer-linear" className="text-gray-500 text-xl" />
          <input 
            type="text" 
            placeholder="Search Ledger..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full font-mono py-4 text-white placeholder:text-gray-600 focus:ring-0" 
          />
        </div>
        <button className="h-12 px-8 bg-white text-black rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
          Download .CSV
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Entity / Desc</th>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest text-center">Classification</th>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest text-center">Timestamp</th>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest text-right">Magnitude</th>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-sm text-gray-600 font-mono italic">
                  -- NO DATA FOUND --
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-10 py-6 flex items-center gap-4">
                    {/* STATIC ICON: Replaced all logic with one reliable icon */}
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:border-orange-500/30">
                      <Icon 
                        icon="solar:wad-of-money-bold-duotone" 
                        className="text-2xl text-orange-500/70 group-hover:text-orange-500 transition-all duration-300" 
                      />
                    </div>
                    <span className="text-sm font-medium group-hover:text-orange-500 transition-colors">
                      {t.description || t.category}
                    </span>
                  </td>
                  
                  <td className="px-10 py-6 text-center">
                    <span className="text-[10px] font-mono text-gray-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase">
                      {t.category}
                    </span>
                  </td>

                  <td className="px-10 py-6 text-xs text-gray-500 font-mono text-center">
                    {new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>

                  <td className="px-10 py-6 text-sm font-mono text-right text-white font-bold">
                    - ${parseFloat(t.amount).toFixed(2)}
                  </td>

                  <td className="px-10 py-6 text-right">
                    <button 
                      onClick={() => handleDelete(t.id)}
                      className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center ml-auto shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                    >
                      <Icon icon="solar:trash-bin-minimalistic-bold-duotone" className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}