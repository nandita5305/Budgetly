import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function TransactionsPage() {
  const { transactionsData, getCategoryIcon } = useOutletContext();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center p-2 pl-6 bg-white/[0.03] border border-white/5 rounded-[2rem]">
        <div className="flex items-center gap-4 flex-1">
          <iconify-icon icon="solar:magnifer-linear" className="text-gray-500"></iconify-icon>
          <input type="text" placeholder="Filter Ledger..." className="bg-transparent border-none outline-none text-sm w-full font-mono py-4 text-white" />
        </div>
        <button className="h-12 px-8 bg-white text-black rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">Download .CSV</button>
      </div>

      <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-md">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/5">
            <tr>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Entity / Desc</th>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Classification</th>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Timestamp</th>
              <th className="px-10 py-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest text-right">Magnitude</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactionsData.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-sm text-gray-500 font-mono">No network ledger data found.</td></tr>
            ) : (
              transactionsData.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.03] transition-colors group cursor-pointer">
                  <td className="px-10 py-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <iconify-icon icon={getCategoryIcon(t.category)} className="text-xl text-gray-400 group-hover:text-orange-500 transition-colors"></iconify-icon>
                    </div>
                    <span className="text-sm font-medium group-hover:text-orange-500 transition-colors">{t.description || t.category}</span>
                  </td>
                  <td className="px-10 py-6"><span className="text-[10px] font-mono text-gray-500 border border-white/10 px-3 py-1 rounded-full uppercase">{t.category}</span></td>
                  <td className="px-10 py-6 text-xs text-gray-500 font-mono">{new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td className="px-10 py-6 text-sm font-mono text-right text-white font-bold">- ${parseFloat(t.amount).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
