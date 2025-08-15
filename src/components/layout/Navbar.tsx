import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const navbarHeight = useTransform(scrollY, [0, 100], [88, 72]);
  const navbarPadding = useTransform(scrollY, [0, 100], [32, 20]);
  const borderRadius = useTransform(scrollY, [0, 100], [0, 26]);
  const navbarScale = useTransform(scrollY, [0, 100], [1, 0.96]);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <motion.nav
      style={{
        height: navbarHeight,
        paddingLeft: navbarPadding,
        paddingRight: navbarPadding,
        borderRadius: borderRadius,
        scale: navbarScale,
      }}
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        backdrop-blur-3xl bg-black/10 border border-white/5
        shadow-2xl shadow-black/20
        ${isScrolled ? 'mx-6 mt-4' : 'mx-0 mt-0'}
      `}
    >
      <div className="h-full max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <FileText className="h-8 w-8 text-blue-400" />
          </motion.div>
          <span className="text-xl font-semibold text-white">Glasmrk</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated && location.pathname.includes('/admin') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg
                       backdrop-blur-lg bg-white/10 border border-white/20
                       text-white hover:bg-white/20 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </motion.button>
          )}
          
          {isAuthenticated ? (
            <Link
              to="/admin/dashboard"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg
                       backdrop-blur-lg bg-blue-500/20 border border-blue-400/30
                       text-blue-100 hover:bg-blue-500/30 transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="px-4 py-2 rounded-lg backdrop-blur-lg bg-white/10 
                       border border-white/20 text-white hover:bg-white/20 
                       transition-colors"
            >
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
};