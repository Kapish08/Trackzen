import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import {
  Plus,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

import GoalItem from '../components/goals/GoalItem';
import { Card, Button } from '../components/ui';

import {
  createGoals,
  getGoals,
  reset,
} from '../store/slices/goalSlice';

const Goals = () => {
  const dispatch = useDispatch();

  const {
    goals: savedGoals = [],
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state) => state.goals);

  const [goals, setGoals] = useState([
    {
      id: Date.now(),
      title: '',
      description: '',
      thrustArea: '',
      uom: 'Percentage',
      target: 100,
      weightage: 10,
      status: 'Draft',
      progress: 0,
    },
  ]);

  useEffect(() => {
    dispatch(getGoals());
  }, [dispatch]);

  // Load goals from backend
  useEffect(() => {
    if (savedGoals.length > 0) {
      setGoals(
        savedGoals.map((goal) => ({
          ...goal,
          id: goal._id,
        }))
      );
    }
  }, [savedGoals]);

  // Reset redux flags
  useEffect(() => {
    if (isSuccess) {
      alert('Goals submitted successfully!');
      dispatch(reset());
    }

    if (isError) {
      alert(message || 'Something went wrong');
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch]);

  const thrustAreas = [
    'Revenue Growth',
    'Customer Satisfaction',
    'Process Efficiency',
    'People Development',
    'Innovation',
    'Operational Excellence',
  ];

  const uoms = [
    'Numeric',
    'Percentage',
    'Timeline',
    'Zero-based',
  ];

  const addGoal = () => {
    if (goals.length >= 8) return;

    setGoals([
      ...goals,
      {
        id: Date.now(),
        title: '',
        description: '',
        thrustArea: '',
        uom: 'Percentage',
        target: 100,
        weightage: 10,
        status: 'Draft',
        progress: 0,
      },
    ]);
  };

  const removeGoal = (id) => {
    if (goals.length === 1) return;

    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const updateGoal = (id, field, value) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id
          ? { ...goal, [field]: value }
          : goal
      )
    );
  };

  // Total Weightage
  const totalWeightage = goals.reduce(
    (sum, goal) => sum + Number(goal.weightage || 0),
    0
  );

  // Validation
  const isValid =
    totalWeightage === 100 &&
    goals.every(
      (goal) =>
        goal.title.trim() !== '' &&
        goal.thrustArea.trim() !== '' &&
        Number(goal.weightage) >= 10
    );

  // Submit
  const handleSubmit = () => {
    if (!isValid) {
      alert(
        'Please ensure:\n- Weightage = 100%\n- Each goal has title & thrust area\n- Minimum 10% weightage per goal'
      );
      return;
    }

    // Remove temporary frontend id
    const cleanedGoals = goals.map(
      ({
        id,
        _id,
        createdAt,
        updatedAt,
        __v,
        ...rest
      }) => rest
    );

    dispatch(createGoals(cleanedGoals));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Goal Sheet
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Define your objectives and key results.
          </p>
        </div>

        <div className="flex items-center gap-6">

          {/* Weightage */}
          <div
            className={`px-4 py-2 rounded-xl border flex flex-col items-center ${
              totalWeightage === 100
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/50 dark:text-emerald-400'
                : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/50 dark:text-amber-400'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Total Weightage
            </span>

            <span className="text-xl font-black">
              {totalWeightage}%
            </span>
          </div>

          {/* Submit */}
          <Button
            disabled={!isValid || isLoading}
            onClick={handleSubmit}
            className="px-8"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Submit for Approval'
            )}
          </Button>

        </div>

      </div>

      {/* Goal Items */}
      <div className="space-y-6">

        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GoalItem
              goal={goal}
              index={index}
              updateGoal={updateGoal}
              removeGoal={removeGoal}
              thrustAreas={thrustAreas}
              uoms={uoms}
            />
          </motion.div>
        ))}

      </div>

      {/* Add Goal */}
      <div className="flex justify-center pb-12">

        <button
          onClick={addGoal}
          disabled={goals.length >= 8}
          className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl text-slate-500 hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-all group disabled:opacity-50"
        >

          <Plus
            size={24}
            className="group-hover:rotate-90 transition-transform"
          />

          <span className="text-lg font-bold">
            Add Another Goal
          </span>

          <span className="text-xs font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg ml-2">
            {goals.length}/8
          </span>

        </button>

      </div>

      {/* Validation */}
      <Card className="p-6 flex flex-wrap gap-8 items-center justify-center border-t-2 border-primary-500/20">

        <div className="flex items-center gap-2">
          <CheckCircle2
            size={18}
            className={
              totalWeightage === 100
                ? 'text-emerald-500'
                : 'text-slate-300'
            }
          />

          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Total weightage must be 100%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2
            size={18}
            className={
              goals.every(
                (g) => Number(g.weightage) >= 10
              )
                ? 'text-emerald-500'
                : 'text-slate-300'
            }
          />

          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Minimum 10% per goal
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2
            size={18}
            className={
              goals.length <= 8
                ? 'text-emerald-500'
                : 'text-slate-300'
            }
          />

          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Maximum 8 goals
          </span>
        </div>

      </Card>

    </div>
  );
};

export default Goals;