import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { createGoals, getGoals, reset } from '../store/slices/goalSlice';
import { 
  Plus, 
  Trash2, 
  Info, 
  AlertTriangle, 
  CheckCircle2,
  ChevronRight,
  Target,
  Loader2
} from 'lucide-react';
import GoalItem from '../components/goals/GoalItem';
import { Card, Button } from '../components/ui';

const Goals = () => {
  const [goals, setGoals] = useState([
    { 
      id: 1, 
      title: '', 
      description: '', 
      thrustArea: '', 
      uom: 'Percentage', 
      target: 100, 
      weightage: 10,
      status: 'Draft'
    }
  ]);

  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message, goals: savedGoals } = useSelector((state) => state.goals);

  useEffect(() => {
    dispatch(getGoals());
  }, [dispatch]);

  useEffect(() => {
    if (savedGoals && savedGoals.length > 0) {
      setGoals(savedGoals.map(g => ({ ...g, id: g._id })));
    }
  }, [savedGoals]);

  const thrustAreas = [
    'Revenue Growth',
    'Customer Satisfaction',
    'Process Efficiency',
    'People Development',
    'Innovation',
    'Operational Excellence'
  ];

  const uoms = ['Numeric', 'Percentage', 'Timeline', 'Zero-based'];

  const addGoal = () => {
    if (goals.length >= 8) return;
    setGoals([...goals, { 
      id: Date.now(), 
      title: '', 
      description: '', 
      thrustArea: '', 
      uom: 'Percentage', 
      target: 100, 
      weightage: 10,
      status: 'Draft'
    }]);
  };

  const removeGoal = (id) => {
    if (goals.length === 1) return;
    setGoals(goals.filter(g => g.id !== id));
  };

  const updateGoal = (id, field, value) => {
    setGoals(goals.map(g => g.id === id ? { ...g, [field]: value } : g));
  };

  const totalWeightage = goals.reduce((sum, g) => sum + Number(g.weightage || 0), 0);
  const isValid = totalWeightage === 100 && goals.every(g => g.title && g.thrustArea && g.weightage >= 10);

  const handleSubmit = () => {
    if (!isValid) return;
    dispatch(createGoals(goals));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Goal Sheet</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Define your objectives and key results for Q2-2024.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className={`px-4 py-2 rounded-xl border flex flex-col items-center ${
            totalWeightage === 100 ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/50 dark:text-emerald-400' : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/50 dark:text-amber-400'
          }`}>
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Weightage</span>
            <span className="text-xl font-black">{totalWeightage}%</span>
          </div>
          <Button 
            disabled={!isValid || isLoading}
            onClick={handleSubmit}
            className="px-8"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Submit for Approval'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {goals.map((goal, index) => (
          <GoalItem 
            key={goal.id}
            goal={goal}
            index={index}
            updateGoal={updateGoal}
            removeGoal={removeGoal}
            thrustAreas={thrustAreas}
            uoms={uoms}
          />
        ))}
      </div>

      <div className="flex justify-center pb-12">
        <button 
          onClick={addGoal}
          disabled={goals.length >= 8}
          className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-slate-500 hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-all group"
        >
          <Plus size={24} className="group-hover:rotate-90 transition-transform" />
          <span className="text-lg font-bold">Add Another Goal</span>
          <span className="text-xs font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg ml-2">{goals.length}/8</span>
        </button>
      </div>

      {/* Validation Legend */}
      <Card className="p-6 flex flex-wrap gap-8 items-center justify-center border-t-2 border-primary-500/20">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className={totalWeightage === 100 ? 'text-emerald-500' : 'text-slate-300'} />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total weightage must be 100%</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className={goals.every(g => g.weightage >= 10) ? 'text-emerald-500' : 'text-slate-300'} />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Minimum 10% per goal</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className={goals.length <= 8 ? 'text-emerald-500' : 'text-slate-300'} />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Maximum 8 goals</span>
        </div>
      </Card>
    </div>
  );
};

export default Goals;
