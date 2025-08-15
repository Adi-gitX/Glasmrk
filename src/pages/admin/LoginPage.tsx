import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { ADMIN_CREDENTIALS, generateToken, saveAuthToken } from '../../utils/storage';
import { useAuth } from '../../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const token = generateToken();
      saveAuthToken(token);
      window.location.href = '/admin/dashboard';
    } else {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black pt-28 pb-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Lock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              </motion.div>
              <h1 className="text-2xl font-bold text-white">Admin Login</h1>
              <p className="text-gray-400 mt-2">Access the admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 
                                 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600
                             rounded-lg text-white placeholder-gray-400
                             focus:border-blue-400 focus:outline-none transition-colors"
                    placeholder="admin@markdown.app"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-600
                           rounded-lg text-white placeholder-gray-400
                           focus:border-blue-400 focus:outline-none transition-colors"
                  placeholder="admin123"
                  required
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg"
                >
                  <p className="text-red-200 text-sm">{error}</p>
                </motion.div>
              )}

              <GlassButton
                type="submit"
                disabled={isLoading}
                className="w-full !py-3"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </GlassButton>
            </form>

            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
              <p className="text-blue-200 text-sm">
                <strong>Demo Credentials:</strong><br />
                Email: admin@markdown.app<br />
                Password: admin123
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};