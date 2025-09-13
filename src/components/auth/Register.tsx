import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock } from 'lucide-react';
import useAuth from '../../lib/hooks/useAuth';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = await register(username, email, password);
    if (token) {
      navigate('/app');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md p-8 bg-slate-800/70 backdrop-blur-md shadow-xl rounded-2xl border border-slate-700"
      >
        <h3 className="text-2xl font-bold text-center text-white mb-6">
          Register for an account
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm text-slate-300 mb-1" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Your username"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 text-white rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-300 mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 text-white rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-slate-300 mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 text-white rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-md transition-all"
          >
            {loading ? 'Registering...' : 'Register'}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-400 hover:underline">
            Login
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
