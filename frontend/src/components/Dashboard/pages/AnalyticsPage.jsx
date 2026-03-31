import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function AnalyticsPage() {
  const { analysisData } = useOutletContext();

  const limit = analysisData?.limit || 10000;
  const current = analysisData?.currentTotal || 0;
  const predicted = analysisData?.predictedTotal || 0;
  const percentUsed = Math.min(100, Math.round((current / limit) * 100));
  const predictedPercent = Math.round((predicted / limit) * 100);
  const gaugeOffset = 210 - (210 * (percentUsed / 100));
  const gaugeColor = analysisData?.isOver ? '#ef4444' : '#f97316';

  const categoryBarData = analysisData?.breakdown
    ? Object.keys(analysisData.breakdown)
        .map((key) => ({
          category: key,
          spend: analysisData.breakdown[key],
        }))
        .sort((a, b) => b.spend - a.spend)
    : [];

  return (
    <div className="grid grid-cols-12 gap-8 animate-in slide-in-from-top-4 duration-500">
      <div className="col-span-12 p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-4 mb-10">
          <iconify-icon icon="solar:graph-up-bold-duotone" className="text-4xl text-orange-500"></iconify-icon>
          <div>
            <h3 className="text-xl font-display font-bold uppercase">Spending Velocity</h3>
            <p className="text-xs text-gray-500 font-mono tracking-widest uppercase">System::AI_Calculated_Efficiency</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={gaugeColor}
                strokeWidth="8"
                strokeDasharray="210"
                strokeDashoffset={gaugeOffset}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${analysisData?.isOver ? 'drop-shadow-[0_0_15px_#ef4444]' : 'drop-shadow-[0_0_10px_#f97316]'}`}
              />
            </svg>
            <div className="absolute text-center flex flex-col items-center">
              <h4 className="text-4xl font-display font-bold text-white">
                {percentUsed}<span className="text-lg opacity-50">%</span>
              </h4>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">Budget Used</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className={`p-6 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden ${analysisData?.isOver ? 'bg-red-500/5 border-red-500/20' : ''}`}>
              <div className={`absolute top-0 left-0 w-1 h-full ${analysisData?.isOver ? 'bg-red-500' : 'bg-orange-500'}`}></div>
              <h4 className={`text-xs font-mono uppercase tracking-widest mb-2 ${analysisData?.isOver ? 'text-red-500 animate-pulse' : 'text-orange-500'}`}>
                {analysisData?.isOver ? 'Critical Trend Detected' : 'Trend Detected'}
              </h4>
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                Your current run rate indicates an end-of-month projection of <span className="text-white font-bold">${predicted.toLocaleString()}</span> ({predictedPercent}% of budget).
                Focus on optimizing spending in your <span className="text-orange-400 font-bold">{analysisData?.topExpense?.category || 'primary'}</span> category to maintain liquidity.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
                <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Limit Threshold</p>
                <p className="text-xl font-bold text-white">${limit.toLocaleString()}</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/5">
                <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Risk Index</p>
                <p className={`text-xl font-bold ${analysisData?.isOver ? 'text-red-500' : 'text-emerald-500'}`}>
                  {analysisData?.isOver ? 'CRITICAL' : 'NOMINAL'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
        <h3 className="text-sm font-display uppercase tracking-widest text-gray-400 mb-8">Category Distribution Volume</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryBarData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#525252" fontSize={10} tickFormatter={(val) => `$${val}`} />
              <YAxis dataKey="category" type="category" stroke="#a3a3a3" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#fff' }}
                itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                formatter={(value) => [`$${value}`, 'Spent']}
              />
              <Bar
                dataKey="spend"
                fill="#f97316"
                radius={[0, 4, 4, 0]}
                barSize={24}
                className="drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
