import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Settings() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [analysisData, setAnalysisData] = useState(null);
  const [settings, setSettings] = useState({
    name: 'Alex Johnson',
    email: 'alex.j@node.active',
    monthlyLimit: 10000,
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    try {
      const [userRes, analysisRes] = await Promise.all([
        fetch('https://budgetly-7s9d.onrender.com/api/user/me', { headers }),
        fetch('https://budgetly-7s9d.onrender.com/api/analysis', { headers }),
      ]);

      if (userRes.ok) setUserData(await userRes.json());
      if (analysisRes.ok) {
        const analysisJson = await analysisRes.json();
        setAnalysisData(analysisJson);
      }
    } catch (error) {
      console.error('Sync Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (analysisData) {
      setSettings({
        name: analysisData.user?.name || 'Alex Johnson',
        email: analysisData.user?.email || 'alex.j@node.active',
        monthlyLimit: analysisData.limit || 10000,
      });
    }
  }, [analysisData]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('https://budgetly-7s9d.onrender.com/api/update-budget', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: settings.name,
          email: settings.email,
          budgetLimit: Number(settings.monthlyLimit),
        }),
      });

      if (res.ok) {
        alert('PREFERENCES SAVED TO CLOUD NODE');
        await fetchData();
      }
    } catch (error) {
      console.error('Sync Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#050505] text-white overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <Header title="Settings" userData={userData} />
        <div className="flex-1 overflow-y-auto p-12">
          <div className="max-w-4xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                <Icon icon="solar:settings-bold-duotone" className="text-3xl text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-display font-bold uppercase tracking-widest text-white">Engine Preferences</h3>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">User_Node :: Configuration_Protocol</p>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Icon icon="solar:user-id-bold-duotone" className="text-orange-500 text-xl" />
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-300">Identity Matrix</h4>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase ml-2">Full Name</label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-mono focus:border-orange-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase ml-2">Network Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-white font-mono focus:border-orange-500/50 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <Icon icon="solar:banknote-bold-duotone" className="text-orange-500 text-xl" />
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-300">Global Thresholds</h4>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase ml-2">Monthly Budget Limit</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 font-mono">$</span>
                      <input
                        type="number"
                        value={settings.monthlyLimit}
                        onChange={(e) => setSettings({ ...settings, monthlyLimit: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-8 pr-4 text-white font-mono focus:border-orange-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                    <p className="text-[10px] leading-relaxed text-orange-500/70 font-mono">
                      NOTICE: Changing the budget limit will recalibrate the Algorithm Forecast and Risk Index across all analytics nodes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="group flex items-center gap-3 px-10 py-4 bg-orange-500 text-black rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Syncing...' : <><span>Save Configuration</span><Icon icon="solar:check-read-linear" className="text-lg group-hover:scale-125 transition-transform" /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
