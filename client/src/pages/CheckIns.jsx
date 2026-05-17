import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { getGoals } from '../store/slices/goalSlice';
import { Calendar, CheckCircle2, Clock, AlertTriangle, TrendingUp, Loader2, X } from 'lucide-react';
import { Card, Button } from '../components/ui';
import api from '../utils/api';

const CheckIns = () => {
  const dispatch = useDispatch();
  const { goals, isLoading } = useSelector((state) => state.goals);
  const [updateModal, setUpdateModal] = useState(null); // holds the goal being updated
  const [newProgress, setNewProgress] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedGoalId, setSavedGoalId] = useState(null);

  useEffect(() => {
    dispatch(getGoals());
  }, [dispatch]);

  // Only show approved/locked goals for check-in
  const activeGoals = goals.filter(g =>
    g.status === 'Approved' || g.status === 'Locked'
  );

  const getProgressPercent = (goal) => {
    const target = goal.target || 1;
    const progress = goal.progress || 0;
    return Math.min(Math.round((progress / target) * 100), 100);
  };

  const getStatusBadge = (goal) => {
    const pct = getProgressPercent(goal);
    if (pct >= 100) return { label: 'Completed', classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' };
    if (pct >= 70) return { label: 'On Track', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' };
    if (pct >= 30) return { label: 'At Risk', classes: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' };
    return { label: 'Behind', classes: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' };
  };

  const openUpdateModal = (goal) => {
    setUpdateModal(goal);
    setNewProgress(goal.progress ?? '');
  };

  const handleSaveProgress = async () => {
    if (!updateModal || newProgress === '') return;
    setSaving(true);
    try {
      await api.put(`/api/goals/${updateModal._id}/progress`, { progress: Number(newProgress) });
      setSavedGoalId(updateModal._id);
      dispatch(getGoals()); // refresh
      setUpdateModal(null);
      setTimeout(() => setSavedGoalId(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Quarterly Check-ins</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Update your actual progress against each approved goal.
          </p>
        </div>
        <div className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-500/30 rounded-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary-500">Active Goals</p>
          <p className="text-2xl font-black text-primary-600">{activeGoals.length}</p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary-500" size={40} />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && activeGoals.length === 0 && (
        <Card className="text-center py-16">
          <Clock className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={56} />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Active Goals Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Your goals need to be submitted and approved by your manager before they appear here for check-ins.
          </p>
        </Card>
      )}

      {/* Goals List */}
      {!isLoading && activeGoals.length > 0 && (
        <div className="grid gap-6">
          {activeGoals.map((goal, i) => {
            const pct = getProgressPercent(goal);
            const badge = getStatusBadge(goal);
            return (
              <motion.div
                key={goal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`glass-card rounded-3xl dark:bg-slate-900/40 border overflow-hidden transition-all ${
                  savedGoalId === goal._id
                    ? 'border-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600">
                        <TrendingUp size={22} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">{goal.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {goal.thrustArea} • {goal.quarter}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.classes}`}>
                        {badge.label}
                      </span>
                      {savedGoalId === goal._id && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle2 size={14} /> Saved!
                        </span>
                      )}
                      <Button onClick={() => openUpdateModal(goal)} className="px-5 py-2 text-sm">
                        Update Progress
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                      <span className="text-sm font-black text-slate-700 dark:text-white">
                        {goal.progress ?? 0} / {goal.target} {goal.uom} ({pct}%)
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          pct >= 100 ? 'bg-emerald-500' :
                          pct >= 70 ? 'bg-primary-500' :
                          pct >= 30 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Weightage Footer */}
                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Weightage</span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{goal.weightage}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Update Progress Modal */}
      <AnimatePresence>
        {updateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setUpdateModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8"
            >
              <button
                onClick={() => setUpdateModal(null)}
                className="absolute top-5 right-5 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <X size={18} />
              </button>

              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Update Progress</h3>
              <p className="text-sm text-slate-500 mb-6">{updateModal.title}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                    Actual Progress <span className="text-primary-500">({updateModal.uom})</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={updateModal.target}
                    value={newProgress}
                    onChange={(e) => setNewProgress(e.target.value)}
                    className="input-field w-full"
                    placeholder={`Enter value (max: ${updateModal.target})`}
                  />
                  <p className="text-xs text-slate-400 mt-1">Target: {updateModal.target} {updateModal.uom}</p>
                </div>

                {/* Live preview bar */}
                {newProgress !== '' && (
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>Preview</span>
                      <span>{Math.min(Math.round((Number(newProgress) / updateModal.target) * 100), 100)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(Math.round((Number(newProgress) / updateModal.target) * 100), 100)}%` }}
                        className="h-full bg-primary-500 rounded-full"
                      />
                    </div>
                  </div>
                )}

                <Button
                  className="w-full py-3"
                  onClick={handleSaveProgress}
                  disabled={saving || newProgress === ''}
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : 'Save Progress'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckIns;
