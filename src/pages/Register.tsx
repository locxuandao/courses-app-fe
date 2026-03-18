import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../api/auth';
import { Lock, Mail, User, Loader2 } from 'lucide-react';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authService.register(email, password, name);
      login(data.accessToken, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(15%_0.02_250)] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[oklch(20%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent italic">
            CourseHub
          </h1>
          <p className="mt-2 text-[oklch(70%_0.02_250)]">Create your account to get started</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[oklch(80%_0.02_250)]">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(50%_0.02_250)]" />
              <input
                type="text"
                required
                className="w-full bg-[oklch(15%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[oklch(80%_0.02_250)]">Email address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(50%_0.02_250)]" />
              <input
                type="email"
                required
                className="w-full bg-[oklch(15%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[oklch(80%_0.02_250)]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[oklch(50%_0.02_250)]" />
              <input
                type="password"
                required
                className="w-full bg-[oklch(15%_0.02_250)] border border-[oklch(30%_0.02_250)] rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-[oklch(60%_0.02_250)]">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
