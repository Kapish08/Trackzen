import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  User as UserIcon, 
  FileText,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data for display if API is not running
  const mockLogs = [
    { _id: '1', action: 'GOAL_APPROVED', userId: { name: 'Sarah Manager', email: 'manager@trackzen.com' }, entityType: 'Goal', timestamp: new Date().toISOString(), newValue: 'Approved', oldValue: 'Submitted' },
    { _id: '2', action: 'GOAL_SUBMITTED', userId: { name: 'John Employee', email: 'employee@trackzen.com' }, entityType: 'Goal', timestamp: new Date(Date.now() - 3600000).toISOString(), newValue: 'Submitted', oldValue: 'Draft' },
    { _id: '3', action: 'USER_LOGIN', userId: { name: 'Admin User', email: 'admin@trackzen.com' }, entityType: 'User', timestamp: new Date(Date.now() - 7200000).toISOString(), newValue: 'Login Success', oldValue: null },
    { _id: '4', action: 'SHARED_GOAL_CREATED', userId: { name: 'Admin User', email: 'admin@trackzen.com' }, entityType: 'SharedGoal', timestamp: new Date(Date.now() - 86400000).toISOString(), newValue: 'Q2 Revenue KPI', oldValue: null },
  ];

  useEffect(() => {
    // In a real app, we would fetch from API
    // const fetchLogs = async () => { ... }
    setLogs(mockLogs);
    setLoading(false);
  }, [page]);

  const getActionColor = (action) => {
    if (action.includes('APPROVED')) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
    if (action.includes('SUBMITTED')) return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
    if (action.includes('REJECTED') || action.includes('ERROR')) return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <History className="text-primary-600" />
            Audit Governance
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Complete trail of system activities and data changes.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
            <Calendar size={18} />
            Last 30 Days
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 hover:bg-primary-700 transition-all">
            Export Logs
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-2xl dark:bg-slate-900/40 flex flex-wrap gap-4 items-center border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by user, email or ID..." 
            className="input-field pl-10 dark:bg-slate-800/50 py-2 text-sm"
          />
        </div>
        <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none">
          <option>All Actions</option>
          <option>Goal Updates</option>
          <option>User Auth</option>
          <option>System Changes</option>
        </select>
        <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-primary-600 transition-colors">
          <Filter size={20} />
        </button>
      </div>

      {/* Logs Table */}
      <div className="glass-card rounded-3xl overflow-hidden dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">User</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Action</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Entity</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Changes</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {logs.map((log, i) => (
                <motion.tr 
                  key={log._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                        <UserIcon size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{log.userId?.name}</p>
                        <p className="text-[10px] text-slate-500">{log.userId?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <FileText size={14} />
                      {log.entityType}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="max-w-[200px] truncate text-xs">
                      {log.oldValue && (
                        <span className="text-red-500 line-through mr-2">{String(log.oldValue)}</span>
                      )}
                      <span className="text-emerald-500 font-bold">{String(log.newValue)}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <p className="text-sm text-slate-500 font-medium">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button 
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:bg-white dark:hover:bg-slate-800 transition-all disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
