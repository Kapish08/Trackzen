import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Users,
  Plus,
  Layers,
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

import api from '../utils/api';
import { Modal, Button, Card } from '../components/ui';

const SharedGoals = () => {
  const [sharedGoals, setSharedGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    target: '',
    uom: 'Numeric',
    departmentId: '',
  });

  const uoms = [
    'Numeric',
    'Percentage',
    'Timeline',
    'Zero-based',
  ];

  useEffect(() => {
    fetchSharedGoals();
  }, []);

  // FIXED ROUTE
  const fetchSharedGoals = async () => {
    try {
      setIsLoading(true);

      const res = await api.get('/api/shared-goals');

      setSharedGoals(res.data || []);

    } catch (err) {
      console.error(
        'Shared goals fetch failed:',
        err.response?.data || err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  // CREATE
  const handleCreate = async () => {
    setError('');

    if (!form.title || !form.target || !form.uom) {
      setError('Title, Target and UOM are required.');
      return;
    }

    try {
      setCreating(true);

      // FIXED ROUTE
      await api.post('/api/shared-goals', {
        ...form,
        target: Number(form.target),
        departmentId:
          form.departmentId || undefined,
      });

      setSuccessMsg(
        `"${form.title}" has been cascaded successfully!`
      );

      setForm({
        title: '',
        description: '',
        target: '',
        uom: 'Numeric',
        departmentId: '',
      });

      setShowCreate(false);

      fetchSharedGoals();

      setTimeout(() => {
        setSuccessMsg('');
      }, 4000);

    } catch (err) {
      console.error(
        'Create shared goal failed:',
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.message ||
          'Failed to create shared goal.'
      );

    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Shared Goals & KPIs
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Cascade departmental objectives across teams.
          </p>
        </div>

        <Button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 shadow-lg shadow-primary-500/20"
        >
          <Plus size={18} />
          New Shared KPI
        </Button>

      </div>

      {/* Success */}
      <AnimatePresence>

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-emerald-700 dark:text-emerald-400"
          >

            <CheckCircle2 size={20} />

            <span className="font-medium">
              {successMsg}
            </span>

          </motion.div>
        )}

      </AnimatePresence>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2
            className="animate-spin text-primary-500"
            size={40}
          />
        </div>
      )}

      {/* Empty */}
      {!isLoading && sharedGoals.length === 0 && (
        <Card className="text-center py-16">

          <Layers
            className="mx-auto text-slate-300 dark:text-slate-700 mb-4"
            size={56}
          />

          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
            No Shared Goals Yet
          </h3>

          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Create a shared KPI to cascade goals
            across employees.
          </p>

          <Button onClick={() => setShowCreate(true)}>
            <Plus size={18} />
            Create First Shared Goal
          </Button>

        </Card>
      )}

      {/* Grid */}
      {!isLoading && sharedGoals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {sharedGoals.map((goal, i) => (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-6 rounded-3xl dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col"
            >

              <div className="flex justify-between items-start mb-6">

                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center text-primary-600">
                  <Layers size={24} />
                </div>

                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-500/20">
                  Active
                </span>

              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                {goal.title}
              </h3>

              {goal.description && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {goal.description}
                </p>
              )}

              <div className="space-y-3 mt-auto">

                <div className="flex justify-between text-sm">

                  <span className="text-slate-500">
                    Target
                  </span>

                  <span className="font-bold text-slate-800 dark:text-white">
                    {goal.target}
                    {goal.uom === 'Percentage'
                      ? '%'
                      : ` ${goal.uom}`}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-slate-500">
                    Assigned To
                  </span>

                  <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1">
                    <Users size={14} />
                    {goal.assignedCount || 0} Employees
                  </span>

                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">

                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    Created{' '}
                    {goal.createdAt
                      ? new Date(
                          goal.createdAt
                        ).toLocaleDateString()
                      : 'Recently'}
                  </p>

                </div>

              </div>

            </motion.div>
          ))}

          {/* Add More */}
          <button
            onClick={() => setShowCreate(true)}
            className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-all group min-h-[200px]"
          >

            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>

            <span className="font-bold">
              Create New Shared KPI
            </span>

          </button>

        </div>
      )}

      {/* Info */}
      <div className="p-6 bg-blue-50 dark:bg-primary-900/10 rounded-3xl border border-blue-100 dark:border-primary-500/20 flex gap-4 items-start">

        <div className="p-2 bg-blue-100 dark:bg-primary-500/20 rounded-xl text-blue-600 dark:text-primary-400 shrink-0">
          <Info size={20} />
        </div>

        <div>
          <h4 className="font-bold text-blue-900 dark:text-primary-200">
            How Shared Goals Work
          </h4>

          <p className="text-sm text-blue-700 dark:text-primary-400 mt-1 leading-relaxed">
            Shared goals are organizational KPIs
            cascaded to employees. Employees can
            update only progress while title and
            targets remain locked.
          </p>
        </div>

      </div>

      {/* Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => {
          setShowCreate(false);
          setError('');
        }}
        title="Create New Shared KPI"
      >

        <div className="space-y-5">

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm">

              <AlertCircle size={16} />

              {error}

            </div>
          )}

          {/* Title */}
          <div className="space-y-2">

            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
              Goal Title *
            </label>

            <input
              className="input-field w-full"
              placeholder="e.g. Q2 Customer Retention"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />

          </div>

          {/* Description */}
          <div className="space-y-2">

            <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
              Description
            </label>

            <textarea
              className="input-field w-full h-24 resize-none"
              placeholder="Describe the KPI..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />

          </div>

          {/* Target + UOM */}
          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">

              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Target Value *
              </label>

              <input
                type="number"
                className="input-field w-full"
                value={form.target}
                onChange={(e) =>
                  setForm({
                    ...form,
                    target: e.target.value,
                  })
                }
              />

            </div>

            <div className="space-y-2">

              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Unit of Measure *
              </label>

              <select
                className="input-field w-full"
                value={form.uom}
                onChange={(e) =>
                  setForm({
                    ...form,
                    uom: e.target.value,
                  })
                }
              >

                {uoms.map((uom) => (
                  <option
                    key={uom}
                    value={uom}
                  >
                    {uom}
                  </option>
                ))}

              </select>

            </div>

          </div>

          {/* Warning */}
          <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-100 dark:border-amber-500/20">

            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
              ⚡ This KPI will be cascaded to all
              employees.
            </p>

          </div>

          {/* Button */}
          <Button
            className="w-full py-3"
            onClick={handleCreate}
            disabled={creating}
          >

            {creating ? (
              <>
                <Loader2
                  className="animate-spin"
                  size={18}
                />
                Cascading...
              </>
            ) : (
              'Create & Cascade to Team'
            )}

          </Button>

        </div>

      </Modal>

    </div>
  );
};

export default SharedGoals;