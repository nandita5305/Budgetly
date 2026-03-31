import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function Header({ title, userData }) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-black/40 backdrop-blur-xl z-50">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-tighter text-white">{title}</h1>
      </div>

      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-3 p-1 rounded-full bg-white/5 border border-white/10 pr-4 hover:border-orange-500/50 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg">
            {userData?.name ? userData.name[0].toUpperCase() : '?'}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold uppercase tracking-tight">{userData?.name || 'Loading...'}</p>
            <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">{userData?.email || 'Connect_Node'}</p>
          </div>
          <Icon icon="solar:alt-arrow-down-linear" className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-4 w-56 bg-[#0a0a0a] border border-white/10 rounded-3xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            <div className="px-4 py-3 border-b border-white/5 mb-1">
              <p className="text-[9px] font-mono text-gray-500 uppercase mb-1">Identity Path</p>
              <p className="text-xs font-bold truncate text-white">{userData?.email || 'N/A'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs text-red-500 font-bold hover:bg-red-500/10 transition-all"
            >
              <Icon icon="solar:logout-2-bold-duotone" className="text-lg" />
              Terminate Session
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
