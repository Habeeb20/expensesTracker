/* eslint-disable no-unused-vars */
// src/components/Navbar.jsx
import React from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

const Navbar = ({ toggleSidebar }) => {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-40',
      'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md',
      'border-b border-gray-200 dark:border-gray-800',
      'shadow-sm'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className={cn(
              "text-xl font-bold",
              isDark ? "text-green" : "text-gray-900 dark:text-dark-text"
            )}>
              ExpenseTracker
            </h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {['Login', 'Sign-up'].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase().replace(' ', '')}`}
                className={cn(
                  "transition",
                  isDark
                    ? "text-green hover:text-green/80"
                    : "text-gray-700 dark:text-dark-muted hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={cn(
              'p-2.5 rounded-full transition-all duration-300',
              'bg-gray-100 dark:bg-dark-card',
              'hover:scale-110 hover:shadow-lg',
              'focus:outline-none focus:ring-4 focus:ring-blue-500/50',
              'border border-gray-300 dark:border-gray-700'
            )}
            aria-label="Toggle dark mode"
          >
            <motion.div
              initial={false}
              animate={{ rotate: isDark ? 0 : 180 }}
              transition={{ duration: 0.4 }}
            >
              {isDark ? (
                <Moon className="w-5 h-5 text-green" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-gray-200 dark:border-gray-800"
          >
            <div className="py-4 space-y-3">
              {['Login', 'Sign-up'].map((item) => (
                <a
                  key={item}
                  href={`/${item.toLowerCase().replace(' ', '')}`}
                  className={cn(
                    "block px-4 py-2 rounded-lg",
                    isDark
                      ? "text-green hover:bg-green/10"
                      : "text-gray-700 dark:text-dark-muted hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;