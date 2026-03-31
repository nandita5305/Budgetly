import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(''); 
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://budgetly-7s9d.onrender.com/api/auth/register`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Success for registration
      alert("Registration successful! Please log in.");
      navigate('/login'); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 antialiased selection:bg-orange-500 selection:text-white bg-[#050505] relative">
      
      {/* Background System */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-20 transform perspective-500 rotateX-12 scale-110"></div>
        <div className="absolute top-1/4 -left-1/4 w-[400px] h-[400px] bg-orange-500/10 blur-[100px] rounded-full mix-blend-screen"></div>
        <div className="noise-overlay absolute inset-0 opacity-50"></div>
      </div>

      <div className="w-full max-w-[800px] bg-[#0A0A0A]/95 backdrop-blur-2xl rounded-[1.5rem] border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col lg:flex-row overflow-hidden relative z-10 min-h-[500px] max-h-[85vh]">
        
        {/* LEFT PANE: Visuals */}
        <div className="hidden lg:flex w-[45%] relative flex-col items-center justify-center p-6 border-r border-white/5 bg-white/[0.02]">
          <Link to="/" className="absolute top-5 left-5 flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors group">
            <div className="w-6 h-6 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-orange-500 transition-colors">
              <iconify-icon icon="solar:arrow-left-linear" className="text-sm"></iconify-icon>
            </div>
            <span className="text-[8px] font-mono uppercase tracking-widest font-medium">Back</span>
          </Link>

          <div className="w-full max-w-[240px] relative mt-4">
            <div className="card-float relative h-40 w-full rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 p-4 border border-white/20 text-white flex flex-col justify-between">
              <div className="flex justify-between items-start">
                  <iconify-icon icon="solar:sim-card-minimalistic-bold" className="text-2xl text-orange-200"></iconify-icon>
                  <span className="font-display tracking-widest text-sm font-medium uppercase">Budgetly</span>
              </div>
              <div>
                  <div className="font-mono text-base tracking-[0.15em] mb-1">**** **** 8429</div>
                  <div className="flex justify-between font-mono text-[8px] uppercase opacity-90 tracking-widest">
                      <span>{formData.name || 'A. Johnson'}</span>
                      <span>12/28</span>
                  </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center max-w-[200px]">
            <h3 className="text-sm font-display text-white uppercase tracking-tight mb-1.5">Master Your Money</h3>
            <p className="text-[9px] font-light text-gray-500 leading-relaxed">Secure, encrypted personal finance insights.</p>
          </div>
        </div>

        {/* RIGHT PANE: Form */}
        <div className="w-full lg:w-[55%] flex items-center justify-center relative z-10 p-6 overflow-y-auto">
          <div className="w-full max-w-[280px] my-auto">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl font-display uppercase tracking-tighter leading-none text-white font-medium">
                Create <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-[#FFD580]">
                   Account
                </span>
              </h2>
              {error && <p className="text-red-400 text-[10px] mt-2 font-mono uppercase">{error}</p>}
            </div>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono uppercase tracking-wide text-gray-500 ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                      <iconify-icon icon="solar:user-linear" className="text-base"></iconify-icon>
                    </div>
                    <input 
                      name="name"
                      type="text" 
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alex Johnson"
                      className="w-full bg-white/5 border border-white/10 rounded py-2 pl-9 pr-3 text-[11px] text-white focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono uppercase tracking-wide text-gray-500 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                    <iconify-icon icon="solar:letter-linear" className="text-base"></iconify-icon>
                  </div>
                  <input 
                    name="email"
                    type="email" 
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="alex@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded py-2 pl-9 pr-3 text-[11px] text-white focus:outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[9px] font-mono uppercase tracking-wide text-gray-500">Password</label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                    <iconify-icon icon="solar:lock-keyhole-linear" className="text-base"></iconify-icon>
                  </div>
                  <input 
                    name="password"
                    type="password" 
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded py-2 pl-9 pr-3 text-[11px] text-white focus:outline-none focus:border-orange-500 transition-all font-mono"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="mt-2 w-full px-4 py-2.5 bg-orange-500 text-white text-[11px] font-semibold rounded tracking-tight transition-all hover:bg-orange-600 disabled:opacity-50 uppercase font-display"
              >
                {loading ? 'Processing...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-[10px] text-gray-500">
                Already have an account?
                <Link 
                  to="/login"
                  className="ml-1.5 font-medium text-white hover:text-orange-500 underline underline-offset-4 transition-colors"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}