import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Sidebar from './Sidebar';
import Header from './Header';

const PIE_COLORS = ['#f97316', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#eab308'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [analysisData, setAnalysisData] = useState({ currentTotal: 0, predictedTotal: 0, dailyBurnRate: '0', breakdown: {} });
  const [transactionsData, setTransactionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      setIsLoading(true);
      try {
        const [userRes, analysisRes, transactionsRes] = await Promise.all([
          fetch('http://localhost:3001/api/user/me', { headers }),
          fetch('http://localhost:3001/api/analysis', { headers }),
          fetch('http://localhost:3001/api/expenses', { headers }),
        ]);

        if (userRes.ok) setUserData(await userRes.json());
        if (analysisRes.ok) setAnalysisData(await analysisRes.json());
        if (transactionsRes.ok) setTransactionsData(await transactionsRes.json());
      } catch (err) {
        console.error('Sync Error', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const areaChartData = useMemo(() => {
    if (!transactionsData?.length) {
      return [
        { day: 'Day 1', spend: 0 },
        { day: 'Today', spend: analysisData?.currentTotal || 0 },
      ];
    }

    const sorted = [...transactionsData].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    let runningTotal = 0;
    const points = sorted.map((t) => {
      runningTotal += parseFloat(t.amount || 0);
      return {
        day: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        spend: parseFloat(runningTotal.toFixed(2)),
      };
    });

    const predicted = parseFloat(analysisData?.predictedTotal);
    if (!isNaN(predicted) && predicted > runningTotal) {
      points.push({ day: 'EOM (Est)', spend: predicted });
    }
    return points;
  }, [analysisData, transactionsData]);

  const pieChartData = useMemo(() => {
    if (!analysisData?.breakdown) return [];
    return Object.entries(analysisData.breakdown)
      .map(([name, value]) => ({ name, value: parseFloat(value || 0) }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [analysisData]);

  const currentTotal = analysisData?.currentTotal || 0;
  const burnRate = isNaN(parseFloat(analysisData?.dailyBurnRate)) ? 0 : analysisData?.dailyBurnRate;
  const forecast = isNaN(parseFloat(analysisData?.predictedTotal)) ? currentTotal : analysisData?.predictedTotal;

  return (
    <div className="h-screen w-full flex bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header title="Dashboard" userData={userData} />
        <div className="flex-1 overflow-y-auto p-12">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-orange-500 font-mono animate-pulse tracking-widest text-sm uppercase">Loading Secure Node...</div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Current Spend', val: `$${currentTotal.toLocaleString()}`, trend: 'Actual', icon: 'solar:wallet-money-bold-duotone', col: 'text-emerald-500' },
                  { label: 'Daily Burn Rate', val: `$${burnRate}`, trend: 'Avg Velocity', icon: 'solar:fire-bold-duotone', col: 'text-orange-500' },
                  { label: 'Algorithm Forecast', val: `$${forecast.toLocaleString()}`, trend: analysisData?.isOver ? 'OVER BUDGET' : 'Optimal', icon: 'solar:magic-stick-3-bold-duotone', col: analysisData?.isOver ? 'text-red-500' : 'text-blue-500' },
                ].map((s, i) => (
                  <div key={i} className={`p-8 rounded-[2rem] bg-white/[0.03] border ${s.trend === 'OVER BUDGET' ? 'border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-white/10 hover:border-orange-500/30'} transition-all group relative overflow-hidden`}>
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
                <div className="col-span-12 lg:col-span-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-display uppercase tracking-widest text-white">Cash Flow Pulse</h3>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaChartData}>
                        <defs>
                          <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }} />
                        <Area type="monotone" dataKey="spend" stroke="#f97316" strokeWidth={4} fill="url(#colorSpend)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col">
                  <h3 className="text-lg font-display uppercase tracking-widest text-white mb-4">Distribution</h3>
                  <div className="flex-1 w-full min-h-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieChartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-mono text-gray-500 uppercase">Top</span>
                      <span className="text-white font-bold">{analysisData?.topExpense?.category || '--'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
