import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import { SplashScreen } from './components/layout/SplashScreen';
import { HomePage } from './pages/HomePage';
import { ViewPage } from './pages/ViewPage';
import { LoginPage } from './pages/admin/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Import highlight.js CSS for code syntax highlighting
    import('prism-themes/themes/prism-material-dark.css');
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <Router>
      <div className="relative">
        <AnimatePresence>
          {showSplash && (
            <SplashScreen onComplete={handleSplashComplete} />
          )}
        </AnimatePresence>
        
        {!showSplash && (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/view/:id" element={<ViewPage />} />
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin/dashboard" element={<DashboardPage />} />
            </Routes>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;