/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu, X, Home, Receipt, PiggyBank, CheckSquare, Settings, LogOut, MoreVertical
} from 'lucide-react';
import Loading from '../../utils/Loading';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';
import TransactionsPage from './TransactionPage';
import CategoryForm from './CategoryForm';
import DashboardOverview from './DasboardOverview';
import BudgetList from './BudgetList';
import TodoManager from './TodoManager';

// Page Components
const DashboardContent = () => <DashboardOverview/>
const Transactions = () => <TransactionsPage/>
const Budgets = () => <BudgetList/>
const Todos = () =><TodoManager/>
const SettingsPage = () => <CategoryForm/>

const Dashboard = () => {
  const [content, setContent] = useState(<DashboardContent />);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const { isDark } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('userFullName', `${data.user.first_name} ${data.user.last_name}`);
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('userFullName');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userFullName');
    navigate('/login');
  };

  // Expense Tracker Menu Items
  const menuItems = [
    { name: 'Dashboard', icon: Home, component: <DashboardContent /> },
    { name: 'Transactions', icon: Receipt, component: <Transactions /> },
    { name: 'Budgets', icon: PiggyBank, component: <Budgets /> },
    { name: 'To-Do', icon: CheckSquare, component: <Todos /> },
    { name: 'Add Category', icon: Settings, component: <SettingsPage /> },
    { name: 'Logout', icon: LogOut, action: handleLogout },
  ];

  const bottomNavItems = menuItems.slice(0, 4); // Show 4 in bottom
  const moreItem = { name: 'More', icon: MoreVertical };

  const handleNavigation = (component, menuName, action) => {
    if (action) {
      action();
    } else {
      setContent(component);
      setActiveMenu(menuName);
    }
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  const baseClasses = 'block py-2.5 px-4 text-gray-700 hover:bg-gray-200 flex items-center';
  const activeClasses = 'block py-2.5 px-4 text-white bg-gray-300 rounded-l-lg flex items-center';
  const appBackground = isDark ? 'bg-[#090909FF]' : 'bg-white';
  const textColor = isDark ? 'text-green' : 'text-gray-800';
  const sidebarBg = isDark ? 'bg-gray-900' : 'bg-gradient-to-b from-yellow-50 to-white';

  if (loading) return <Loading />;

  return (
    <div className={`flex flex-col h-screen ${appBackground} ${textColor}`}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-green text-white p-4 flex justify-between items-center z-20 shadow-lg md:h-16">
        <div className="text-sm font-bold">
          {localStorage.getItem('userFullName') || 'User'}
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none z-30"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className={`md:hidden fixed bottom-0 left-0 w-full ${sidebarBg} ${textColor} p-1 flex justify-around items-center z-20 shadow-lg`}>
        {bottomNavItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.component, item.name, item.action)}
            className={`${activeMenu === item.name ? activeClasses : baseClasses} flex-col text-xs`}
          >
            <item.icon className="w-5 h-5 text-green" />
            <span className='text-green'>{item.name}</span>
          </button>
        ))}
        <button
          onClick={() => setIsMenuOpen(true)}
          className={`${isMenuOpen ? activeClasses : baseClasses} flex-col text-xs`}
        >
          <moreItem.icon className="w-5 h-5" />
          <span>{moreItem.name}</span>
        </button>
      </div>

      {/* Mobile Sidebar (Slide-in) */}
      <motion.div
        initial={false}
        animate={{ x: isMenuOpen ? 0 : -280 }}
        className={`fixed inset-y-16 left-0 w-56 h-[calc(100%-4rem)] ${sidebarBg} ${textColor} shadow-lg z-10 md:hidden`}
      >
        <nav className="mt-2 px-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.component, item.name, item.action)}
              className={cn(
                'w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition',
                activeMenu === item.name
                  ? 'bg-green text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-800'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Desktop Sidebar */}
      <div className={`hidden md:block fixed inset-y-16 left-0 w-56 h-[calc(100%-4rem)] ${sidebarBg} ${textColor} shadow-lg z-10`}>
        <nav className="mt-2 px-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.component, item.name, item.action)}
              className={cn(
                'w-full text-left py-2.5 px-3 rounded-lg flex items-center gap-3 text-sm font-medium transition',
                activeMenu === item.name
                  ? 'bg-green text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-800'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-56 p-4 pt-20 md:pt-20 overflow-y-auto">
        {content}
      </main>
    </div>
  );
};

export default Dashboard;