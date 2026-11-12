import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.login({ email, password });
      login(res.access_token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = () => {
    demoLogin();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 font-sans">
      <div className="w-full max-w-md p-8 bg-card border border-subtleBorder rounded-xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <Logo size={36} />
          <h2 className="text-xl font-bold text-white mt-4 tracking-tight">Institutional Terminal Login</h2>
          <p className="text-xs text-brand-muted mt-1 font-mono">Sign in to access your AlphaTime workspace</p>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded bg-rose-950/40 border border-rose-500/40 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block text-xs font-mono text-zinc-300 mb-1">PASSWORD</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
              <input
                type="password"
                required
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
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-subtleBorder" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase">
            <span className="bg-card px-2 text-brand-muted">Or Instant Access</span>
          </div>
        </div>

        <button
          onClick={handleDemoAccess}
          className="w-full py-2 rounded-md bg-[#1B212D] hover:bg-[#242C3D] border border-subtleBorder text-white text-xs font-mono font-medium transition-all flex items-center justify-center gap-2"
        >
          Explore with Demo Mode <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <p className="mt-6 text-center text-xs text-brand-muted">
          Need an institutional account?{' '}
          <Link to="/register" className="text-accent-blue hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
