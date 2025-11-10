/* eslint-disable no-unused-vars */
// src/App.jsx
import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import SignupPage from './pages/SignupPage';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dasboard/Dasboard';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <ThemeProvider>
      <Router>
        <div
          className={`min-h-screen transition-colors duration-300 ${
            isDark ? 'bg-[#090909FF]' : 'bg-white'
          } text-gray-900 dark:text-gray-100`}
        >
          {/* Navbar is always visible */}
          <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          {/* Page content with padding to avoid overlap with fixed navbar */}
          <main className="pt-16">
            <Routes>
              {/* Home / Dashboard */}
              <Route
                path="/"
                element={
                  <LoginPage/>
                  // <motion.div
                  //   initial={{ opacity: 0, y: 20 }}
                  //   animate={{ opacity: 1, y: 0 }}
                  //   className="p-8 text-center"
                  // >
                  //   <h1 className="text-4xl font-bold text-green dark:text-green">
                  //     Welcome to ExpenseTracker
                  //   </h1>
                  //   <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                  //     Track your income, expenses, and financial goals.
                  //   </p>
                  // </motion.div>
                }
              />

              {/* Signup Page */}
              <Route path="/sign-up" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />

    
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;