import React from 'react';

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-4">
        <iconify-icon icon="solar:settings-bold-duotone" className="text-4xl text-orange-500"></iconify-icon>
        <h3 className="text-xl font-display font-bold uppercase tracking-widest">Engine Preferences</h3>
      </div>

      {[
        { title: 'Data Synchronization', desc: 'Manage remote database connections and frequency.', icon: 'solar:refresh-bold-duotone' },
        { title: 'Security & Privacy', desc: 'Enable 2FA and Biometric vault access.', icon: 'solar:lock-bold-duotone' },
        { title: 'AI Notifications', desc: 'Configure spending nudge sensitivity.', icon: 'solar:bell-bold-duotone' },
        { title: 'Export & Backup', desc: 'Automated weekly backups to cloud storage.', icon: 'solar:cloud-bold-duotone' },
      ].map((s, i) => (
        <div key={i} className="flex items-center justify-between p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl text-gray-400 group-hover:text-orange-500 transition-colors">
              <iconify-icon icon={s.icon}></iconify-icon>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-1">{s.title}</h4>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          </div>
          <iconify-icon icon="solar:alt-arrow-right-linear" className="text-gray-700 text-xl"></iconify-icon>
        </div>
      ))}
    </div>
  );
}
