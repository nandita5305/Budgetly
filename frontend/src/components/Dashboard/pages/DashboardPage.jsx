import React, { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Modern color palette for the Donut Chart
const PIE_COLORS = ['#f97316', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#eab308'];

export default function DashboardPage() {
  // Removed TypeScript <any> typing
  const { analysisData, transactionsData, isLoading } = useOutletContext();

  // --- 1. DYNAMIC AREA CHART DATA ---
  const areaChartData = useMemo(() => {
    if (!transactionsData || transactionsData.length === 0) {
      return [
        { day: 'Day 1', spend: 0 },
        { day: 'Today', spend: analysisData?.currentTotal || 0 },
        { day: 'EOM (Est)', spend: analysisData?.predictedTotal || 0 },
      ];
    }

    const sorted = [...transactionsData].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    let runningTotal = 0;
    const points = sorted.map((t) => {
      runningTotal += parseFloat(t.amount);
      return {
        day: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        spend: parseFloat(runningTotal.toFixed(2))
      };
    });

    if (analysisData?.predictedTotal) {
      points.push({
        day: 'EOM (Est)',
        spend: analysisData.predictedTotal
      });
    }
    return points;
  }, [transactionsData, analysisData]);

  // --- 2. DYNAMIC PIE CHART DATA ---
  const pieChartData = useMemo(() => {
    if (!analysisData?.breakdown) return [];
    
    // Convert {"Food": 1500, "Rent": 1000} into Recharts array format
    return Object.entries(analysisData.breakdown)
      .map(([name, value]) => ({
        name,
        value
      }))
      .sort((a, b) => b.value - a.value); // Sort largest to smallest
  }, [analysisData]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-orange-500 font-mono animate-pulse tracking-widest text-sm uppercase">Loading Secure Node...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* TOP STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Current Spend', val: `$${analysisData?.currentTotal?.toLocaleString() || 0}`, trend: 'Actual', icon: 'solar:wallet-money-bold-duotone', col: 'text-emerald-500' },
          { label: 'Daily Burn Rate', val: `$${analysisData?.dailyBurnRate || 0}`, trend: 'Avg Velocity', icon: 'solar:fire-bold-duotone', col: 'text-orange-500' },
          { label: 'Algorithm Forecast', val: `$${analysisData?.predictedTotal?.toLocaleString() || 0}`, trend: analysisData?.isOver ? 'OVER BUDGET' : 'Optimal', icon: 'solar:magic-stick-3-bold-duotone', col: analysisData?.isOver ? 'text-red-500' : 'text-blue-500' },
        ].map((s, i) => (
          <div key={i} className={`p-8 rounded-[2rem] bg-white/[0.03] border ${s.trend === 'OVER BUDGET' ? 'border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-white/10 hover:border-orange-500/30'} transition-all group relative overflow-hidden`}>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>
            <div className="flex justify-between mb-6">
              <iconify-icon icon={s.icon} className={`text-3xl ${s.col}`}></iconify-icon>
              <span className={`text-[10px] font-mono px-2 py-1 rounded-md ${s.trend === 'OVER BUDGET' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-gray-500'}`}>{s.trend}</span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500 mb-1">{s.label}</p>
            <h3 className="text-3xl font-display font-bold text-white">{s.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* AREA CHART (Left Side) */}
        <div className="col-span-12 lg:col-span-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-display uppercase tracking-widest text-white">Cash Flow Pulse</h3>
            <iconify-icon icon="solar:chart-square-bold-duotone" className="text-orange-500 text-2xl"></iconify-icon>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff' }}
                  itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="spend" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorSpend)" className="drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DONUT CHART (Right Side) */}
        <div className="col-span-12 lg:col-span-4 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-display uppercase tracking-widest text-white">Distribution</h3>
            <iconify-icon icon="solar:pie-chart-2-bold-duotone" className="text-orange-500 text-2xl"></iconify-icon>
          </div>
          
          <div className="flex-1 w-full min-h-[200px] relative">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Spent']}
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#fff' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono text-sm">
                No data to chart
              </div>
            )}
            
            {/* Center Text overlay for the Donut hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-2">Top</span>
               <span className="text-white font-bold">{analysisData?.topExpense?.category || '--'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}