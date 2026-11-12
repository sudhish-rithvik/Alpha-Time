import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import { Lock, Mail, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.register({
        email,
        password,
        full_name: fullName,
      });
      login(res.access_token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 font-sans">
      <div className="w-full max-w-md p-8 bg-card border border-subtleBorder rounded-xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <Logo size={36} />
          <h2 className="text-xl font-bold text-white mt-4 tracking-tight">Create AlphaTime Account</h2>
          <p className="text-xs text-brand-muted mt-1 font-mono">Real-time entry intelligence and personalized watchlists</p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded bg-rose-950/40 border border-rose-500/40 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">FULL NAME</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Rithu Trader"
                className="w-full bg-[#090B10] border border-subtleBorder rounded-md pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-accent-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="trader@alphatime.trade"
                className="w-full bg-[#090B10] border border-subtleBorder rounded-md pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-accent-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-zinc-300 mb-1">PASSWORD (MIN 6 CHARACTERS)</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#090B10] border border-subtleBorder rounded-md pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-accent-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-accent-blue hover:bg-accent-blueHover text-white text-xs font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(40,123,255,0.3)] disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-brand-muted">
          Already registered?{' '}
          <Link to="/login" className="text-accent-blue hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
