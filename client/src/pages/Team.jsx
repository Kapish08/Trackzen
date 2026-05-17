import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight,
  User,
  MessageSquare,
  ChevronRight,
  Target,
  AlertCircle
} from 'lucide-react';
import api from '../utils/api';
import { Modal, Button, Card } from '../components/ui';

const Team = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberGoals, setMemberGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await api.get('/users/team');
      setTeamMembers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleReview = async (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    try {
      const res = await api.get(`/users/team/${member._id}/goals`);
      setMemberGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (goalId, status) => {
    try {
      await api.put(`/goals/${goalId}/status`, { status });
      // Refresh goals
      const res = await api.get(`/users/team/${selectedMember._id}/goals`);
      setMemberGoals(res.data);
      fetchTeam(); // Update main table too
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': case 'Locked': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200';
      case 'Submitted': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200';
      case 'Rework Requested': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200';
      case 'Draft': return 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': case 'Locked': return <CheckCircle2 size={14} />;
      case 'Submitted': return <Clock size={14} />;
      case 'Rework Requested': return <MessageSquare size={14} />;
      case 'Draft': return <Clock size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Team Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Review goal sheets and monitor performance across your team.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search members..." 
              className="input-field pl-10 dark:bg-slate-800/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Team Table */}
      <div className="glass-card rounded-3xl overflow-hidden dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Employee</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Goal Status</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Avg. Progress</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Last Activity</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {teamMembers.map((member, i) => (
                <motion.tr 
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600 font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{member.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(member.status)}`}>
                      {getStatusIcon(member.status)}
                      {member.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="w-full max-w-[120px] space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500">
                        <span>{member.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${member.progress}%` }}
                          className={`h-full rounded-full ${
                            member.progress > 80 ? 'bg-emerald-500' : member.progress > 40 ? 'bg-primary-500' : 'bg-amber-500'
                          }`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{member.lastActive}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleReview(member)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
                      >
                        <ArrowRight size={18} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <p className="text-sm text-slate-500 font-medium">Showing 5 of 12 team members</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-sm disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">Next</button>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Review Goals - ${selectedMember?.name}`}
      >
        <div className="space-y-6">
          {memberGoals.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto text-slate-300 mb-2" size={48} />
              <p className="text-slate-500 font-medium">No goals found for this employee.</p>
            </div>
          ) : (
            memberGoals.map((goal) => (
              <Card key={goal._id} className="border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">{goal.title}</h4>
                    <span className="text-xs font-bold text-primary-500 uppercase tracking-wider">{goal.thrustArea}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(goal.status)}`}>
                    {goal.status}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{goal.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Weightage</p>
                    <p className="text-lg font-black text-slate-800 dark:text-white">{goal.weightage}%</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Target</p>
                    <p className="text-lg font-black text-slate-800 dark:text-white">{goal.target} {goal.uom}</p>
                  </div>
                </div>
                {goal.status === 'Submitted' && (
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1"
                      onClick={() => handleStatusUpdate(goal._id, 'Approved')}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700"
                      onClick={() => handleStatusUpdate(goal._id, 'Rework Requested')}
                    >
                      Request Rework
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Team;
