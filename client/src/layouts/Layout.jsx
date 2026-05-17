import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { 
  LayoutDashboard, 
  Target, 
  CheckSquare, 
  Bell, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Search,
  User,
  History,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard', roles: ['Employee', 'Manager', 'Admin'] },
    { name: 'My Goals', icon: <Target size={20} />, path: '/goals', roles: ['Employee', 'Manager', 'Admin'] },
    { name: 'Check-ins', icon: <CheckSquare size={20} />, path: '/checkins', roles: ['Employee', 'Manager', 'Admin'] },
    { name: 'Team Management', icon: <Users size={20} />, path: '/team', roles: ['Manager', 'Admin'] },
    { name: 'Shared Goals', icon: <Layers size={20} />, path: '/shared-goals', roles: ['Manager', 'Admin'] },
    { name: 'Audit Log', icon: <History size={20} />, path: '/audit', roles: ['Admin'] },
  ];

  const activeItem = menuItems.find(item => item.path === location.pathname) || menuItems[0];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-slate-900 text-white flex flex-col relative z-20"
      >
        <div className="p-6 flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <div className="min-w-[40px] h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">T</div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold tracking-tight"
              >
                TrackZen
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {menuItems.filter(item => item.roles.includes(user?.role)).map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${
                location.pathname === item.path 
                ? 'bg-primary-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="min-w-[20px]">{item.icon}</span>
              {isSidebarOpen && (
                <span className="font-medium whitespace-nowrap">{item.name}</span>
              )}
              {isSidebarOpen && location.pathname === item.path && (
                <motion.div layoutId="active" className="ml-auto"><ChevronRight size={16} /></motion.div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="flex items-center gap-4 w-full p-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
          >
            <span className="min-w-[20px] group-hover:rotate-12 transition-transform"><LogOut size={20} /></span>
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-900/50 dark:backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu size={20} className="text-slate-500" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">
              {activeItem.name}
            </h2>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden lg:flex items-center relative">
              <Search className="absolute left-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search analytics, goals..." 
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-64 transition-all"
              />
            </div>

            <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
              </button>
              
              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h4 className="font-bold text-slate-800 dark:text-white">Notifications</h4>
                        {unreadCount > 0 && (
                          <span className="text-[10px] bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-bold uppercase">{unreadCount} New</span>
                        )}
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {notifications.map(n => (
                          <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800 cursor-pointer">
                            <h5 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{n.title}</h5>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-2 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                      <button className="w-full p-3 text-xs font-bold text-primary-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        View All Notifications
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
              
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{user?.role} • {user?.department}</p>
                </div>
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700">
                  <User size={20} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

const Building2 = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
  </svg>
);

export default Layout;
