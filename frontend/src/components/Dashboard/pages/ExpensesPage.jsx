import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function ExpensesPage() {
  const { analysisData, expenseForm, setExpenseForm, isSubmitting, handleAddExpense } = useOutletContext();

  return (
    <div className="grid grid-cols-12 gap-8 animate-in zoom-in-95 duration-500">
      <div className="col-span-12 lg:col-span-4 space-y-8">
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
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-400"></div>
          <div className="flex items-center gap-3 mb-6">
            <iconify-icon icon="solar:add-circle-bold-duotone" className="text-orange-500 text-2xl"></iconify-icon>
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
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-8 pr-4 text-white font-mono placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>

            <div className="relative">
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-mono focus:outline-none focus:border-orange-500/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="Food" className="bg-black text-white">Food & Dining</option>
                <option value="Rent" className="bg-black text-white">Rent & Housing</option>
                <option value="Shopping" className="bg-black text-white">Shopping</option>
                <option value="Transport" className="bg-black text-white">Transport</option>
                <option value="Tech" className="bg-black text-white">Tech & Subs</option>
                <option value="Bills" className="bg-black text-white">Utilities & Bills</option>
              </select>
              <iconify-icon icon="solar:alt-arrow-down-linear" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></iconify-icon>
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
              {isSubmitting ? (
                <span className="animate-pulse">Processing Node...</span>
              ) : (
                <>
                  <iconify-icon icon="solar:add-square-bold" className="text-lg"></iconify-icon>
                  Commit Ledger Entry
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-8 p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative">
        <h3 className="text-lg font-display uppercase tracking-widest mb-10">Envelope Allocations</h3>
        <div className="space-y-10">
          {[
            { label: 'Housing', val: 2100, max: 2500, col: 'bg-blue-500' },
            { label: 'Food & Dining', val: analysisData?.breakdown?.Food || 840, max: 1000, col: 'bg-orange-500' },
            { label: 'Shopping', val: analysisData?.breakdown?.Shopping || 120, max: 500, col: 'bg-red-500' },
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="flex justify-between mb-3 items-end">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs font-mono text-gray-500">${item.val} / <span className="text-gray-700">${item.max}</span></span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full border border-white/5 overflow-hidden">
                <div
                  className={`h-full ${item.col} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                  style={{ width: `${Math.min((item.val / item.max) * 100, 100)}%` }}
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
}
