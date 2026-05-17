import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getGoals } from '../../store/slices/goalSlice';
import { MoreVertical, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from '../ui';

const StatCard = ({ stat, variants }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <motion.div variants={variants} className={isOpen ? 'z-50 relative' : 'z-0'}>
      <Card className="relative overflow-visible group">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            {stat.icon}
          </div>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <MoreVertical size={18} className="text-slate-400" />
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-fade-in origin-top-right">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/goals');
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 transition-colors flex items-center gap-2"
                >
                  View Full Details
                </button>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    dispatch(getGoals());
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-500/10 hover:text-primary-600 transition-colors flex items-center gap-2"
                >
                  Refresh Analytics
                </button>
                <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2"
                >
                  Reset Card
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
        <div className="flex items-end gap-3 mt-1">
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded-full mb-1 flex items-center gap-0.5 ${
            stat.positive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
          }`}>
            {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {stat.trend}
          </span>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;
